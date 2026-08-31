import os
import torch
import numpy as np
import matplotlib.pyplot as plt
import random

from dataset import SARSpillDataset
from model import create_unet_model

def visualize_predictions(num_images=5):
    # Setup Paths
    IMAGES_DIR = r"Y:\SIH\Oil"
    MASKS_DIR = r"Y:\SIH\Mask_oil"
    MODEL_WEIGHTS = "unet_sar_best.pt"
    
    DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
    
    # Check if model exists
    if not os.path.exists(MODEL_WEIGHTS):
        print(f"Error: Could not find {MODEL_WEIGHTS}. Did the training finish?")
        return
        
    print("Loading model and dataset...")
    
    # Load model
    model = create_unet_model().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_WEIGHTS, map_location=DEVICE))
    model.eval()
    
    # Load dataset
    dataset = SARSpillDataset(IMAGES_DIR, MASKS_DIR, transform=False)
    
    # Pick random indices
    indices = random.sample(range(len(dataset)), num_images)
    
    fig, axes = plt.subplots(num_images, 3, figsize=(12, 4 * num_images))
    fig.suptitle("Visual Inference Test: Input vs Ground Truth vs Prediction", fontsize=16)
    
    for i, idx in enumerate(indices):
        image_tensor, mask_tensor = dataset[idx]
        
        # Add batch dimension and move to device
        img_input = image_tensor.unsqueeze(0).to(DEVICE)
        
        # Predict
        with torch.no_grad():
            logits = model(img_input)
            prob = torch.sigmoid(logits).squeeze().cpu().numpy()
            
        pred_mask = (prob > 0.5).astype(np.float32)
        
        # Format images for matplotlib
        # image_tensor is (C, H, W). We take the first channel for visualization
        vis_img = image_tensor[0].numpy()
        vis_gt = mask_tensor[0].numpy()
        
        # Plot Input
        ax = axes[i, 0] if num_images > 1 else axes[0]
        ax.imshow(vis_img, cmap='gray')
        ax.set_title(f"SAR Input {idx}")
        ax.axis('off')
        
        # Plot Ground Truth
        ax = axes[i, 1] if num_images > 1 else axes[1]
        ax.imshow(vis_gt, cmap='gray')
        ax.set_title("Ground Truth Mask")
        ax.axis('off')
        
        # Plot Prediction
        ax = axes[i, 2] if num_images > 1 else axes[2]
        ax.imshow(pred_mask, cmap='magma')
        ax.set_title("Model Prediction")
        ax.axis('off')
        
    plt.tight_layout()
    output_path = "inference_test_results.png"
    plt.savefig(output_path)
    print(f"\n✅ Visual test complete! Saved side-by-side comparison to '{output_path}'.")
    print("Please open this image file to inspect your model's pixel accuracy!")

if __name__ == "__main__":
    visualize_predictions()
