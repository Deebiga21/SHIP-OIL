import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from tqdm import tqdm

from dataset import SARSpillDataset
from model import create_unet_model

def evaluate():
    IMAGES_DIR = r"Y:\SIH\Oil"
    MASKS_DIR = r"Y:\SIH\Mask_oil"
    MODEL_WEIGHTS = "unet_sar_best.pt"
    DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
    
    full_dataset = SARSpillDataset(IMAGES_DIR, MASKS_DIR, transform=False)
    
    # We will evaluate on a 20% validation split (random, since seed wasn't fixed in training)
    torch.manual_seed(42) # Just to be consistent for this run
    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    _, val_dataset = random_split(full_dataset, [train_size, val_size])
    
    val_loader = DataLoader(val_dataset, batch_size=8, shuffle=False, num_workers=2)
    
    model = create_unet_model().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_WEIGHTS, map_location=DEVICE))
    model.eval()
    
    criterion = nn.BCEWithLogitsLoss()
    
    val_loss = 0.0
    iou_score = 0.0
    
    with torch.no_grad():
        val_bar = tqdm(val_loader, desc="Evaluating")
        for images, masks in val_bar:
            images = images.to(DEVICE)
            masks = masks.to(DEVICE)
            
            logits = model(images)
            loss = criterion(logits, masks)
            val_loss += loss.item()
            
            # Calculate IoU
            probs = torch.sigmoid(logits)
            preds = (probs > 0.5).float()
            
            intersection = (preds * masks).sum((1, 2, 3))
            union = (preds + masks).sum((1, 2, 3)) - intersection
            
            # Add small epsilon to avoid divide by zero if both are completely empty
            batch_iou = (intersection + 1e-6) / (union + 1e-6)
            iou_score += batch_iou.mean().item()
            
    avg_loss = val_loss / len(val_loader)
    avg_iou = iou_score / len(val_loader)
    
    print(f"\n==== EVALUATION RESULTS ====")
    print(f"BCE Loss: {avg_loss:.4f}")
    print(f"IoU Score (Accuracy): {avg_iou * 100:.2f}%")
    print(f"============================")

if __name__ == "__main__":
    evaluate()
