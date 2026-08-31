import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torch.optim import AdamW
from tqdm import tqdm

from dataset import SARSpillDataset
from model import create_unet_model

def train():
    # Setup Paths
    IMAGES_DIR = r"Y:\SIH\Oil"
    MASKS_DIR = r"Y:\SIH\Mask_oil"
    
    # Hyperparameters
    BATCH_SIZE = 4
    EPOCHS = 10
    LEARNING_RATE = 1e-4
    DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
    
    print(f"Using device: {DEVICE}")
    
    # Load Dataset
    full_dataset = SARSpillDataset(IMAGES_DIR, MASKS_DIR, transform=True)
    
    # Split 80/20
    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])
    
    # Disable transforms for validation set (a bit hacky but works for this pipeline)
    val_dataset.dataset.transform = False
    
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=2)
    
    # Initialize Model, Loss, Optimizer
    model = create_unet_model().to(DEVICE)
    
    # Check for existing weights to resume training
    WEIGHTS_FILE = 'unet_sar_best.pt'
    best_val_loss = float('inf')
    if os.path.exists(WEIGHTS_FILE):
        print(f"Loading existing weights from {WEIGHTS_FILE} to resume training...")
        model.load_state_dict(torch.load(WEIGHTS_FILE, map_location=DEVICE))
        best_val_loss = 0.0139  # Hardcoded from previous run to prevent overwriting with worse weights
    
    # Use BCEWithLogitsLoss since our model outputs raw logits
    criterion = nn.BCEWithLogitsLoss()
    optimizer = AdamW(model.parameters(), lr=LEARNING_RATE)
    
    # Add a learning rate scheduler to lower LR when validation loss plateaus
    from torch.optim.lr_scheduler import ReduceLROnPlateau
    scheduler = ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=3, verbose=True)
    
    for epoch in range(EPOCHS):
        model.train()
        train_loss = 0.0
        
        print(f"\\nEpoch {epoch+1}/{EPOCHS}")
        train_bar = tqdm(train_loader, desc="Training")
        for images, masks in train_bar:
            images = images.to(DEVICE)
            masks = masks.to(DEVICE)
            
            optimizer.zero_grad()
            outputs = model(images)
            
            loss = criterion(outputs, masks)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
            train_bar.set_postfix(loss=loss.item())
            
        avg_train_loss = train_loss / len(train_loader)
        
        # Validation Loop
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            val_bar = tqdm(val_loader, desc="Validation")
            for images, masks in val_bar:
                images = images.to(DEVICE)
                masks = masks.to(DEVICE)
                
                outputs = model(images)
                loss = criterion(outputs, masks)
                val_loss += loss.item()
                val_bar.set_postfix(loss=loss.item())
                
        avg_val_loss = val_loss / len(val_loader)
        
        print(f"Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f}")
        
        # Step the scheduler based on validation loss
        scheduler.step(avg_val_loss)
        
        # Save Best Model
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            torch.save(model.state_dict(), 'unet_sar_best.pt')
            print("=> Saved new best model!")

if __name__ == '__main__':
    train()
