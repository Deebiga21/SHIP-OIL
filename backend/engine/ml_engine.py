import os
import torch
import cv2
import numpy as np

# Try to load the model architecture if available
try:
    import sys
    sys.path.append(os.path.join(os.path.dirname(__file__), '../../ml_pipeline'))
    from model import create_unet_model
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False

MODEL_WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), '../../ml_pipeline/unet_sar_best.pt')

def extract_polygon_from_mask(mask_numpy):
    """
    Converts a binary numpy mask to a bounding polygon for the frontend.
    Returns list of [lat, lng] (dummy lat/lng offsets for simulation purposes based on pixel coords).
    """
    contours, _ = cv2.findContours((mask_numpy * 255).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return []
        
    # Get largest contour
    largest_contour = max(contours, key=cv2.contourArea)
    
    # Simplify contour to a polygon
    epsilon = 0.01 * cv2.arcLength(largest_contour, True)
    approx = cv2.approxPolyDP(largest_contour, epsilon, True)
    
    # Convert pixels to dummy lat/lng for demonstration (around Malacca Strait)
    BASE_LAT = 2.45
    BASE_LNG = 101.40
    
    polygon = []
    for pt in approx:
        x, y = pt[0]
        # Map 0-512 pixel space to roughly 0.1 degree geo space
        lat = BASE_LAT - (y / 512.0) * 0.1
        lng = BASE_LNG + (x / 512.0) * 0.1
        polygon.append([lat, lng])
        
    return polygon

def predict_sar_spill_mask(image_bytes):
    if not ML_AVAILABLE or not os.path.exists(MODEL_WEIGHTS_PATH):
        raise RuntimeError("ML model weights or dependencies not found. Please train the model first.")
        
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = create_unet_model().to(device)
    model.load_state_dict(torch.load(MODEL_WEIGHTS_PATH, map_location=device))
    model.eval()
    
    # Decode image bytes
    import io
    import tifffile
    
    try:
        img = tifffile.imread(io.BytesIO(image_bytes))
    except Exception:
        # fallback to cv2 if it's a standard format like PNG/JPG
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
        
    if img is None:
        raise ValueError("Invalid image file")
        
    # Preprocess
    if len(img.shape) == 2:
        img = np.stack((img,)*3, axis=-1)
    elif len(img.shape) == 3:
        if img.shape[2] == 1:
            img = np.concatenate([img]*3, axis=-1)
        elif img.shape[2] == 2:
            zeros = np.zeros((img.shape[0], img.shape[1], 1), dtype=img.dtype)
            img = np.concatenate([img, zeros], axis=-1)
        elif img.shape[2] == 4:
            img = img[:, :, :3]
        
    img = img.astype(np.float32)
    if img.max() > 0:
        img = img / img.max()
        
    img = cv2.resize(img, (512, 512))
    img_tensor = torch.from_numpy(img.transpose((2, 0, 1))).unsqueeze(0).to(device)
    
    # Inference
    with torch.no_grad():
        logits = model(img_tensor)
        prob = torch.sigmoid(logits).squeeze().cpu().numpy()
        
    # Binarize mask
    binary_mask = (prob > 0.5).astype(np.float32)
    
    # Extract polygon coordinates
    polygon_coords = extract_polygon_from_mask(binary_mask)
    
    return {
        "polygonCoords": polygon_coords,
        "maskAreaRatio": float(np.mean(binary_mask))
    }
