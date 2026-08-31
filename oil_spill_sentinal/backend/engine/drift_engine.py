import math
import random

def to_rad(deg):
    return deg * math.pi / 180.0

def to_deg(rad):
    return rad * 180.0 / math.pi

def project_point(point, distance_km, bearing_deg):
    R = 6371.0
    delta = distance_km / R
    theta = to_rad(bearing_deg)
    phi1 = to_rad(point[0])
    lambda1 = to_rad(point[1])

    phi2 = math.asin(math.sin(phi1) * math.cos(delta) + math.cos(phi1) * math.sin(delta) * math.cos(theta))
    lambda2 = lambda1 + math.atan2(math.sin(theta) * math.sin(delta) * math.cos(phi1),
                                   math.cos(delta) - math.sin(phi1) * math.sin(phi2))

    return [round(to_deg(phi2), 5), round((to_deg(lambda2) + 540.0) % 360.0 - 180.0, 5)]

def calculate_net_drift_vector(current_speed_knots, current_dir_deg, wind_speed_knots, wind_dir_deg):
    current_speed_kmh = current_speed_knots * 1.852
    wind_speed_kmh = wind_speed_knots * 1.852
    wind_drift_kmh = wind_speed_kmh * 0.035
    wind_drift_dir_deg = (wind_dir_deg + 15) % 360

    curr_rad = to_rad(current_dir_deg)
    wind_rad = to_rad(wind_drift_dir_deg)

    u_curr = current_speed_kmh * math.sin(curr_rad)
    v_curr = current_speed_kmh * math.cos(curr_rad)

    u_wind = wind_drift_kmh * math.sin(wind_rad)
    v_wind = wind_drift_kmh * math.cos(wind_rad)

    u_total = u_curr + u_wind
    v_total = v_curr + v_wind

    net_speed_kmh = math.sqrt(u_total ** 2 + v_total ** 2)
    net_dir_deg = to_deg(math.atan2(u_total, v_total))
    if net_dir_deg < 0:
        net_dir_deg += 360

    return {
        "netSpeedKmh": round(net_speed_kmh, 2),
        "netSpeedKnots": round(net_speed_kmh / 1.852, 2),
        "netDirDeg": int(round(net_dir_deg)),
        "currentSpeedKnots": current_speed_knots,
        "currentDirDeg": current_dir_deg,
        "windSpeedKnots": wind_speed_knots,
        "windDirDeg": wind_dir_deg
    }

def run_backward_hindcast(slick_centroid, estimated_age_hours=12, current_speed_knots=1.4,
                          current_dir_deg=320, wind_speed_knots=14.0, wind_dir_deg=210, num_particles=40):
    drift_vector = calculate_net_drift_vector(current_speed_knots, current_dir_deg, wind_speed_knots, wind_dir_deg)
    reverse_dir_deg = (drift_vector["netDirDeg"] + 180) % 360
    total_distance_km = drift_vector["netSpeedKmh"] * estimated_age_hours

    origin_centroid = project_point(slick_centroid, total_distance_km, reverse_dir_deg)

    particle_trail = []
    for h in range(estimated_age_hours + 1):
        step_dist = drift_vector["netSpeedKmh"] * h
        pos = project_point(slick_centroid, step_dist, reverse_dir_deg)
        particle_trail.append({
            "hourOffset": -h,
            "lat": pos[0],
            "lng": pos[1],
            "timestampOffsetMs": -h * 3600 * 1000
        })

    origin_hotspot_particles = []
    random.seed(42) # Consistent reproducible particle cloud
    for i in range(num_particles):
        angle = random.uniform(0, 360)
        r = random.uniform(0.1, 0.2 + estimated_age_hours * 0.08)
        p = project_point(origin_centroid, r, angle)
        origin_hotspot_particles.append({
            "id": f"origin_p_{i}",
            "lat": p[0],
            "lng": p[1],
            "confidence": round(max(0.1, 1.0 - r / 3.0), 2)
        })

    return {
        "originCentroid": origin_centroid,
        "estimatedAgeHours": estimated_age_hours,
        "totalDistanceKm": round(total_distance_km, 2),
        "driftVector": drift_vector,
        "particleTrail": particle_trail,
        "originHotspotParticles": origin_hotspot_particles,
        "spatialUncertaintyRadiusKm": round(0.5 + estimated_age_hours * 0.12, 2)
    }

def run_forward_forecast(slick_centroid, forecast_hours=48, current_speed_knots=1.4,
                         current_dir_deg=320, wind_speed_knots=14.0, wind_dir_deg=210, initial_volume_m3=120):
    drift_vector = calculate_net_drift_vector(current_speed_knots, current_dir_deg, wind_speed_knots, wind_dir_deg)
    forecast_path = []

    for h in range(0, forecast_hours + 1, 3):
        step_dist = drift_vector["netSpeedKmh"] * h
        pos = project_point(slick_centroid, step_dist, drift_vector["netDirDeg"])
        evap_loss_pct = min(65, int(round(12 * math.log(h + 1))))
        remaining_vol = round(initial_volume_m3 * (1.0 - evap_loss_pct / 100.0), 1)

        forecast_path.append({
            "hourOffset": h,
            "lat": pos[0],
            "lng": pos[1],
            "evaporationLossPct": evap_loss_pct,
            "remainingVolumeM3": remaining_vol,
            "emulsificationPct": min(75, int(round(h * 0.9)))
        })

    return {
        "forecastPath": forecast_path,
        "driftVector": drift_vector,
        "forecastHours": forecast_hours,
        "finalDistanceKm": round(drift_vector["netSpeedKmh"] * forecast_hours, 2)
    }
