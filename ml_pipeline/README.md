# SAR UNet ML Pipeline

This folder contains the complete PyTorch training pipeline and dataset loaders for training a UNet model on your SAR dataset.

## Setup
1. Ensure your dataset is correctly located at:
   - Images: `Y:\SIH\Oil`
   - Masks: `Y:\SIH\Mask_oil`
2. Install the machine learning dependencies. We recommend doing this in a virtual environment:
   ```bash
   pip install -r requirements.txt
   ```

## Training
To begin training the model on your dataset, run:
```bash
python train.py
```
This script will:
- Load the `.tif` images and masks
- Handle data augmentation (flips)
- Train the UNet model (using a ResNet34 backbone) for 10 epochs
- Automatically save the best weights to `unet_sar_best.pt`

## Integration
Once the training is complete, the FastAPI backend will automatically detect `unet_sar_best.pt`. A new endpoint is already exposed at `POST /api/sar/predict-image` which allows you to upload a SAR `.tif` image and it will return the predicted oil spill polygon coordinates and area!
