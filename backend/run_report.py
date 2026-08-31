import json
import time
from engine.sar_engine import characterize_oil_slick
from engine.drift_engine import run_backward_hindcast, run_forward_forecast
from engine.attribution_engine import rank_suspect_vessels

def main():
    print("# Oil Spill Sentinel - Model Engine Report\n")
    
    print("## 1. SAR Engine (Characterize Oil Slick)")
    polygon = [[2.45, 101.40], [2.46, 101.40], [2.46, 101.41], [2.45, 101.41]]
    current_time = int(time.time() * 1000)
    sar_result = characterize_oil_slick(polygon, optic_code=4, acquisition_time=current_time)
    print("```json\n" + json.dumps(sar_result, indent=2) + "\n```\n")
    
    print("## 2. Drift Engine (Backward Hindcast)")
    hindcast_result = run_backward_hindcast(
        slick_centroid=sar_result['centroid'],
        estimated_age_hours=sar_result['estimatedAgeHours'],
        current_speed_knots=1.2,
        current_dir_deg=310,
        wind_speed_knots=12.0,
        wind_dir_deg=200
    )
    # truncating the particles for a cleaner report
    hindcast_result['particleTrail'] = f"[{len(hindcast_result['particleTrail'])} particles...]"
    hindcast_result['originHotspotParticles'] = f"[{len(hindcast_result['originHotspotParticles'])} particles...]"
    print("```json\n" + json.dumps(hindcast_result, indent=2) + "\n```\n")
    
    print("## 3. Drift Engine (Forward Forecast)")
    forecast_result = run_forward_forecast(
        slick_centroid=sar_result['centroid'],
        forecast_hours=24,
        current_speed_knots=1.2,
        current_dir_deg=310,
        wind_speed_knots=12.0,
        wind_dir_deg=200,
        initial_volume_m3=sar_result['volumeM3']
    )
    # truncating the forecast path for a cleaner report
    forecast_result['forecastPath'] = f"[{len(forecast_result['forecastPath'])} steps...]"
    print("```json\n" + json.dumps(forecast_result, indent=2) + "\n```\n")

    print("## 4. Attribution Engine (Rank Suspect Vessels)")
    vessel = {
        "id": "v1", "name": "Dark Ship 1", "mmsi": "123456789", 
        "trackHistory": [
            {"lat": 2.40, "lng": 101.35, "speed": 12.0, "course": 45.0, "timestamp": current_time - 12*3600*1000},
            {"lat": hindcast_result['originCentroid'][0], "lng": hindcast_result['originCentroid'][1], "speed": 4.0, "course": 45.0, "timestamp": hindcast_result['driftVector'].get('estimatedAgeHours', 12) * -3600*1000 + current_time}, # Close to origin
            {"lat": 2.50, "lng": 101.45, "speed": 14.0, "course": 45.0, "timestamp": current_time}
        ]
    }
    attribution_result = rank_suspect_vessels(
        vessels=[vessel],
        origin_centroid=hindcast_result['originCentroid'],
        origin_timestamp=current_time - sar_result['estimatedAgeHours'] * 3600 * 1000,
        drift_vector=hindcast_result['driftVector']
    )
    print("```json\n" + json.dumps(attribution_result, indent=2) + "\n```\n")

if __name__ == '__main__':
    main()
