import math
import time

BONN_OIL_TYPES = [
    {"code": 1, "name": "Silvery Sheen", "thicknessMicrons": 0.1, "color": "#C0C0C0"},
    {"code": 2, "name": "Rainbow Sheen", "thicknessMicrons": 0.3, "color": "#FF7F00"},
    {"code": 3, "name": "Metallic Appearance", "thicknessMicrons": 5.0, "color": "#4B0082"},
    {"code": 4, "name": "Discontinuous True Color", "thicknessMicrons": 50.0, "color": "#8B4513"},
    {"code": 5, "name": "Continuous True Color (Heavy Crude)", "thicknessMicrons": 200.0, "color": "#1A1A1A"}
]

def to_rad(deg):
    return deg * math.pi / 180.0

def haversine_distance(p1, p2):
    R = 6371.0 # km
    d_lat = to_rad(p2[0] - p1[0])
    d_lon = to_rad(p2[1] - p1[1])
    a = (math.sin(d_lat / 2.0) ** 2 +
         math.cos(to_rad(p1[0])) * math.cos(to_rad(p2[0])) * (math.sin(d_lon / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def calculate_polygon_area_km2(coords):
    if not coords or len(coords) < 3:
        return 0.0
    R = 6371.0
    area = 0.0
    for i in range(len(coords)):
        j = (i + 1) % len(coords)
        p1 = coords[i]
        p2 = coords[j]
        area += to_rad(p2[1] - p1[1]) * (2.0 + math.sin(to_rad(p1[0])) + math.sin(to_rad(p2[0])))
    area = abs((area * R * R) / 2.0)
    return round(area, 3)

def calculate_polygon_perimeter_km(coords):
    if not coords or len(coords) < 2:
        return 0.0
    perim = 0.0
    for i in range(len(coords)):
        j = (i + 1) % len(coords)
        perim += haversine_distance(coords[i], coords[j])
    return round(perim, 2)

def calculate_centroid(coords):
    if not coords:
        return [0.0, 0.0]
    sum_lat = sum(p[0] for p in coords)
    sum_lng = sum(p[1] for p in coords)
    return [round(sum_lat / len(coords), 5), round(sum_lng / len(coords), 5)]

def characterize_oil_slick(polygon_coords, optic_code=4, acquisition_time=None):
    if acquisition_time is None:
        acquisition_time = int(time.time() * 1000)

    area_km2 = calculate_polygon_area_km2(polygon_coords)
    perimeter_km = calculate_polygon_perimeter_km(polygon_coords)
    centroid = calculate_centroid(polygon_coords)

    oil_type_info = next((t for t in BONN_OIL_TYPES if t["code"] == optic_code), BONN_OIL_TYPES[3])
    thickness_microns = oil_type_info["thicknessMicrons"]

    # Volume (m^3) = Area (km^2) * thickness (microns)
    volume_m3 = round(area_km2 * thickness_microns, 2)
    volume_barrels = int(round(volume_m3 * 6.28981))

    compactness = (4.0 * math.pi * area_km2) / (perimeter_km ** 2) if perimeter_km > 0 else 0.0
    sar_damping_db = round(-(6.5 + (1.0 - min(1.0, compactness)) * 4.2), 1)

    mineral_confidence = 0.92 if compactness < 0.4 else 0.75
    estimated_age_hours = max(2, int(round((area_km2 / 2.5) ** (1.0 / 0.8) * 4)))

    return {
        "centroid": centroid,
        "areaKm2": area_km2,
        "perimeterKm": perimeter_km,
        "thicknessMicrons": thickness_microns,
        "oilType": oil_type_info["name"],
        "oilTypeCode": oil_type_info["code"],
        "oilColor": oil_type_info["color"],
        "volumeM3": volume_m3,
        "volumeBarrels": volume_barrels,
        "compactness": round(compactness, 3),
        "sarBackscatterDampingDb": sar_damping_db,
        "mineralOilConfidence": mineral_confidence,
        "estimatedAgeHours": estimated_age_hours,
        "acquisitionTime": acquisition_time,
        "estimatedReleaseTime": acquisition_time - (estimated_age_hours * 3600 * 1000)
    }
