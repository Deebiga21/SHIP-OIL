"""
OILTRACE AI: Marine Monitoring System Architecture
Smart India Hackathon 2026 - Technical Implementation & Pipeline
"""

import torch
import torch.nn as nn
import numpy as np
from typing import List, Dict, Tuple
from datetime import datetime, timedelta

# ==========================================
# 1. DATA PIPELINE
# ==========================================

class SARDataPipeline:
    def __init__(self):
        self.speckle_filter_window = 5
        
    def ingest_sentinel1_data(self, file_path: str) -> np.ndarray:
        """Mock ingestion of Sentinel-1 SAR backscatter data."""
        # Returns raw amplitude data
        return np.random.rand(1024, 1024)
        
    def apply_speckle_filter(self, img: np.ndarray) -> np.ndarray:
        """Apply a Refined Lee filter (pseudo-code representation)."""
        # Noise reduction step
        filtered_img = img # ... filtering logic ...
        return filtered_img
        
    def normalize_intensities(self, img: np.ndarray) -> torch.Tensor:
        """Normalize backscatter to [0, 1] for network ingestion."""
        img_min = np.min(img)
        img_max = np.max(img)
        normalized = (img - img_min) / (img_max - img_min + 1e-8)
        
        # Convert to standard PyTorch tensor shape (C, H, W)
        tensor_img = torch.tensor(normalized, dtype=torch.float32).unsqueeze(0)
        return tensor_img

    def process(self, file_path: str) -> torch.Tensor:
        raw_data = self.ingest_sentinel1_data(file_path)
        filtered = self.apply_speckle_filter(raw_data)
        normalized_tensor = self.normalize_intensities(filtered)
        return normalized_tensor

# ==========================================
# 2. DEEP LEARNING MODEL (U-Net)
# ==========================================

class DoubleConv(nn.Module):
    """(convolution => [BN] => ReLU) * 2"""
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.double_conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.double_conv(x)

class UNetSegmenter(nn.Module):
    """
    Standard U-Net Backbone for Pixel-Level Binary Classification
    (Oil Spill = 1 vs. Sea Surface Lookalikes = 0)
    """
    def __init__(self, n_channels=1, n_classes=1):
        super(UNetSegmenter, self).__init__()
        self.n_channels = n_channels
        self.n_classes = n_classes

        # Encoder
        self.inc = DoubleConv(n_channels, 64)
        self.down1 = nn.Sequential(nn.MaxPool2d(2), DoubleConv(64, 128))
        self.down2 = nn.Sequential(nn.MaxPool2d(2), DoubleConv(128, 256))
        
        # Decoder (Simplified for pseudo-code)
        self.up1 = nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2)
        self.conv_up1 = DoubleConv(256, 128)
        self.up2 = nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2)
        self.conv_up2 = DoubleConv(128, 64)
        
        # Output classification
        self.outc = nn.Conv2d(64, n_classes, kernel_size=1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x1 = self.inc(x)
        x2 = self.down1(x1)
        x3 = self.down2(x2)
        
        x = self.up1(x3)
        # Skip connection: concat x2 and x
        x = torch.cat([x2, x], dim=1) 
        x = self.conv_up1(x)
        
        x = self.up2(x)
        # Skip connection: concat x1 and x
        x = torch.cat([x1, x], dim=1)
        x = self.conv_up2(x)
        
        logits = self.outc(x)
        mask_probs = self.sigmoid(logits)
        return mask_probs

# ==========================================
# 3. SPATIAL-TEMPORAL HINDCASTING ENGINE
# ==========================================

class HindcastingEngine:
    def __init__(self, wind_factor=0.03):
        # Oil typically drifts at ~3% of wind speed plus 100% of surface current
        self.wind_factor = wind_factor
        
    def get_ocean_data(self, lat: float, lon: float, time: datetime) -> Tuple[np.ndarray, np.ndarray]:
        """Fetch oceanographic models for given space-time."""
        # Returns [u, v] vectors for water and wind
        v_water = np.array([-0.5, 0.2]) # Current vector (m/s)
        v_wind = np.array([5.0, -2.0])  # Wind drift vector (m/s)
        return v_water, v_wind

    def compute_origin(self, center_lat: float, center_lon: float, 
                      detection_time: datetime, drift_duration_hrs: float) -> Tuple[float, float, datetime]:
        """
        Project backwards using current vector field (v_water) 
        and wind drift vector (v_wind).
        """
        v_water, v_wind = self.get_ocean_data(center_lat, center_lon, detection_time)
        
        # Total drift velocity vector
        v_total = v_water + (self.wind_factor * v_wind)
        
        # Reverse drift displacement (meters)
        drift_seconds = drift_duration_hrs * 3600
        displacement_x = -v_total[0] * drift_seconds
        displacement_y = -v_total[1] * drift_seconds
        
        # Approximate coordinate delta (1 deg lat ~= 111km)
        origin_lon = center_lon + (displacement_x / 111320.0)
        origin_lat = center_lat + (displacement_y / 111320.0)
        origin_time = detection_time - timedelta(hours=drift_duration_hrs)
        
        return origin_lat, origin_lon, origin_time

# ==========================================
# 4. AIS TRACK MATCHING & ATTRIBUTION
# ==========================================

class VesselAttribution:
    def __init__(self, search_radius_km: float = 10.0, time_window_hrs: float = 2.0):
        self.search_radius_km = search_radius_km
        self.time_window_hrs = time_window_hrs
        
    def fetch_historical_ais(self, bbox: Dict, time_window: Tuple[datetime, datetime]) -> List[Dict]:
        """Query historical AIS database."""
        # Returns mocked ship trajectories
        return [
            {"mmsi": "123456789", "name": "OilTanker_A", "distance_to_origin": 2.5, "speed": 12},
            {"mmsi": "987654321", "name": "CargoShip_B", "distance_to_origin": 8.0, "speed": 18}
        ]

    def rank_candidates(self, origin_lat: float, origin_lon: float, origin_time: datetime) -> List[Dict]:
        """
        Intersect computed origin bounding box with historical AIS ship 
        coordinates to rank candidate vessels.
        """
        # Define search space
        bbox = {"lat": origin_lat, "lon": origin_lon, "radius": self.search_radius_km}
        t_start = origin_time - timedelta(hours=self.time_window_hrs)
        t_end = origin_time + timedelta(hours=self.time_window_hrs)
        
        candidates = self.fetch_historical_ais(bbox, (t_start, t_end))
        
        # Score vessels based on proximity to the hindcasted origin point
        for ship in candidates:
            # Simple attribution score: closer to origin = higher score
            base_score = max(0, 100 - (ship['distance_to_origin'] * 10))
            ship['attribution_score'] = round(base_score, 2)
            
        # Rank by highest score
        ranked_suspects = sorted(candidates, key=lambda x: x['attribution_score'], reverse=True)
        return ranked_suspects

# ==========================================
# FULL PIPELINE EXECUTION
# ==========================================

def run_oiltrace_pipeline(image_path: str, detection_time: datetime):
    print("--- Starting OILTRACE AI Pipeline ---")
    
    # 1. Data Prep
    pipeline = SARDataPipeline()
    tensor_input = pipeline.process(image_path)
    
    # 2. Segmentation
    model = UNetSegmenter()
    # model.load_state_dict(torch.load("weights.pth"))
    # model.eval()
    mask_probs = model(tensor_input)
    
    # Simulated Feature Extraction (Center of slick)
    center_lat, center_lon = 19.0760, 72.8777 # E.g., near Mumbai coast
    
    # 3. Hindcasting
    hindcaster = HindcastingEngine()
    origin_lat, origin_lon, origin_time = hindcaster.compute_origin(
        center_lat, center_lon, detection_time, drift_duration_hrs=12.0
    )
    
    # 4. AIS Attribution
    attribution = VesselAttribution()
    ranked_suspects = attribution.rank_candidates(origin_lat, origin_lon, origin_time)
    
    print("\n[Output] Top Suspect Vessels:")
    for rank, ship in enumerate(ranked_suspects, 1):
        print(f"{rank}. {ship['name']} (MMSI: {ship['mmsi']}) - Confidence Score: {ship['attribution_score']}%")

if __name__ == "__main__":
    current_time = datetime.now()
    run_oiltrace_pipeline("sentinel1_pass_001.zip", current_time)
