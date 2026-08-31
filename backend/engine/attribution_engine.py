import math

def to_rad(deg):
    return deg * math.pi / 180.0

def haversine_distance_km(p1, p2):
    R = 6371.0
    d_lat = to_rad(p2[0] - p1[0])
    d_lon = to_rad(p2[1] - p1[1])
    a = (math.sin(d_lat / 2.0) ** 2 +
         math.cos(to_rad(p1[0])) * math.cos(to_rad(p2[0])) * (math.sin(d_lon / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def interpolate_vessel_position(track_history, target_time):
    if not track_history:
        return None
    sorted_track = sorted(track_history, key=lambda x: x["timestamp"])
    if target_time <= sorted_track[0]["timestamp"]:
        return sorted_track[0]
    if target_time >= sorted_track[-1]["timestamp"]:
        return sorted_track[-1]

    for i in range(len(sorted_track) - 1):
        p1 = sorted_track[i]
        p2 = sorted_track[i + 1]
        if p1["timestamp"] <= target_time <= p2["timestamp"]:
            ratio = (target_time - p1["timestamp"]) / float(p2["timestamp"] - p1["timestamp"]) if p2["timestamp"] > p1["timestamp"] else 0.0
            return {
                "lat": round(p1["lat"] + ratio * (p2["lat"] - p1["lat"]), 5),
                "lng": round(p1["lng"] + ratio * (p2["lng"] - p1["lng"]), 5),
                "speed": round(p1["speed"] + ratio * (p2["speed"] - p1["speed"]), 1),
                "course": round(p1["course"] + ratio * (p2["course"] - p1["course"]), 1),
                "timestamp": target_time
            }

    return sorted_track[-1]

def rank_suspect_vessels(vessels, origin_centroid, origin_timestamp, drift_vector):
    ranked = []

    for vessel in vessels:
        track_history = vessel.get("trackHistory", [])
        if not track_history:
            continue

        sorted_track = sorted(track_history, key=lambda x: x["timestamp"])
        pos_at_origin = interpolate_vessel_position(sorted_track, origin_timestamp)

        min_dist_km = float("inf")
        cpa_timestamp = origin_timestamp
        for pt in sorted_track:
            d = haversine_distance_km([pt["lat"], pt["lng"]], origin_centroid)
            if d < min_dist_km:
                min_dist_km = d
                cpa_timestamp = pt["timestamp"]

        cpa_nm = round(min_dist_km / 1.852, 2)
        spatial_proximity_score = max(0, int(round((1.0 - min(1.0, cpa_nm / 15.0)) * 40)))

        dark_ship_gap_found = False
        gap_duration_minutes = 0
        gap_near_origin = False
        for i in range(len(sorted_track) - 1):
            gap_ms = sorted_track[i + 1]["timestamp"] - sorted_track[i]["timestamp"]
            gap_mins = gap_ms / (60 * 1000)
            if gap_mins >= 30:
                dark_ship_gap_found = True
                gap_duration_minutes = max(gap_duration_minutes, int(gap_mins))
                if abs(sorted_track[i]["timestamp"] - origin_timestamp) <= 3 * 3600 * 1000:
                    gap_near_origin = True

        ais_gap_score = 30 if (dark_ship_gap_found and gap_near_origin) else (15 if dark_ship_gap_found else 0)

        speeds = [pt["speed"] for pt in sorted_track]
        avg_speed = sum(speeds) / len(speeds) if speeds else 0.0
        min_speed = min(speeds) if speeds else 0.0
        speed_drop_detected = (avg_speed - min_speed) >= 5.0 and min_speed < 5.0
        speed_anomaly_score = 15 if speed_drop_detected else 0

        co_alignment_score = 0
        if pos_at_origin:
            heading_diff = abs(pos_at_origin["course"] - drift_vector["netDirDeg"])
            heading_diff = min(heading_diff, 360 - heading_diff)
            if heading_diff <= 35:
                co_alignment_score = 10

        master_score = min(99, spatial_proximity_score + ais_gap_score + speed_anomaly_score + co_alignment_score)

        risk_level = "CRITICAL HIGH SUSPECT" if master_score >= 80 else ("MODERATE SUSPECT" if master_score >= 55 else "LOW PROBABILITY")

        ranked.append({
            "vesselId": vessel.get("id"),
            "name": vessel.get("name"),
            "mmsi": vessel.get("mmsi"),
            "imo": vessel.get("imo", "N/A"),
            "flag": vessel.get("flag", "International"),
            "type": vessel.get("type", "Tanker"),
            "dwt": vessel.get("dwt", 0),
            "owner": vessel.get("owner", "N/A"),
            "masterScore": master_score,
            "riskLevel": risk_level,
            "cpaNm": cpa_nm,
            "cpaTimestamp": cpa_timestamp,
            "spatialProximityScore": spatial_proximity_score,
            "darkShipGapFound": dark_ship_gap_found,
            "gapDurationMinutes": gap_duration_minutes,
            "gapNearOrigin": gap_near_origin,
            "aisGapScore": ais_gap_score,
            "speedDropDetected": speed_drop_detected,
            "speedAnomalyScore": speed_anomaly_score,
            "coAlignmentScore": co_alignment_score,
            "posAtOrigin": pos_at_origin,
            "trackHistory": sorted_track
        })

    ranked.sort(key=lambda x: x["masterScore"], reverse=True)
    return ranked
