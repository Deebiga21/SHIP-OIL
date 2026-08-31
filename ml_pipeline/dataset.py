import os
import cv2
import numpy as np
from torch.utils.data import Dataset
import torch
import torchvision.transforms.functional as TF
import random

import tifffile

class SARSpillDataset(Dataset):
    def __init__(self, images_dir, masks_dir, transform=True):
        self.images_dir = images_dir
        self.masks_dir = masks_dir
        self.transform = transform
        
        # Get all valid tif files
        self.image_files = sorted([f for f in os.listdir(images_dir) if f.endswith('.tif')])
        
    def __len__(self):
        return len(self.image_files)

    def __getitem__(self, idx):
        img_name = self.image_files[idx]
        img_path = os.path.join(self.images_dir, img_name)
        mask_path = os.path.join(self.masks_dir, img_name)
        
        try:
            image = tifffile.imread(img_path)
        except Exception as e:
            raise FileNotFoundError(f"Could not load image: {img_path}, error: {e}")
            
        # Ensure it has 3 channels for ResNet
        if len(image.shape) == 2:
            image = np.stack((image,)*3, axis=-1)
        elif len(image.shape) == 3:
            if image.shape[2] == 1:
                image = np.concatenate([image]*3, axis=-1)
            elif image.shape[2] == 2:
                zeros = np.zeros((image.shape[0], image.shape[1], 1), dtype=image.dtype)
                image = np.concatenate([image, zeros], axis=-1)
            elif image.shape[2] == 4:
                image = image[:, :, :3]
            
        # Ensure it's float32 and normalized 0-1
        image = image.astype(np.float32)
        # Some SAR images have extreme outliers, clip or normalize safely
        if image.max() > 0:
            image = image / image.max()
            
        # Load mask
        try:
            mask = tifffile.imread(mask_path)
        except Exception as e:
            raise FileNotFoundError(f"Could not load mask: {mask_path}, error: {e}")
            
        # Binarize mask
        mask = mask.astype(np.float32)
        mask = np.where(mask > 0, 1.0, 0.0)

        
        # Resize to standard size (e.g. 512x512) to fit in memory
        image = cv2.resize(image, (512, 512), interpolation=cv2.INTER_LINEAR)
        mask = cv2.resize(mask, (512, 512), interpolation=cv2.INTER_NEAREST)
        
        # Convert to tensors (Channels, Height, Width)
        image = torch.from_numpy(image.transpose((2, 0, 1)))
        mask = torch.from_numpy(mask).unsqueeze(0)
        
        # Basic Augmentation
        if self.transform:
            if random.random() > 0.5:
                image = TF.hflip(image)
                mask = TF.hflip(mask)
            if random.random() > 0.5:
                image = TF.vflip(image)
                mask = TF.vflip(mask)
                
        return image, mask
