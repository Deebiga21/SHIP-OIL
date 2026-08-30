/**
 * Geographic and Spatial Utilities for AquaSentinel AI
 */

// Convert degrees to radians
export const toRad = (deg) => (deg * Math.PI) / 180;

// Convert radians to degrees
export const toDeg = (rad) => (rad * 180) / Math.PI;

// Haversine distance in Kilometers between two [lat, lng] points
export const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in KM
};

// Haversine distance in Nautical Miles
export const haversineNauticalMiles = (p1, p2) => {
  return haversineDistance(p1, p2) * 0.539957;
};

// Calculate initial bearing in degrees (0..360) from p1 to p2
export const calculateBearing = ([lat1, lon1], [lat2, lon2]) => {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
};

// Project a point given origin [lat, lon], distance (km), and bearing (deg)
export const projectPoint = ([lat, lon], distanceKm, bearingDeg) => {
  const R = 6371; // Earth radius km
  const δ = distanceKm / R;
  const θ = toRad(bearingDeg);
  const φ1 = toRad(lat);
  const λ1 = toRad(lon);

  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
  const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));

  return [toDeg(φ2), (toDeg(λ2) + 540) % 360 - 180];
};

// Calculate centroid of an array of [lat, lng] points
export const calculateCentroid = (points) => {
  if (!points || points.length === 0) return [0, 0];
  let sumLat = 0;
  let sumLng = 0;
  points.forEach(([lat, lng]) => {
    sumLat += lat;
    sumLng += lng;
  });
  return [sumLat / points.length, sumLng / points.length];
};

// Calculate polygon area in Sq Kilometers using spherical trapezoid formula
export const calculatePolygonAreaKm2 = (coords) => {
  if (!coords || coords.length < 3) return 0;
  const R = 6371; // Earth radius in km
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const p1 = coords[i];
    const p2 = coords[j];
    area += toRad(p2[1] - p1[1]) * (2 + Math.sin(toRad(p1[0])) + Math.sin(toRad(p2[0])));
  }
  area = Math.abs((area * R * R) / 2);
  return parseFloat(area.toFixed(3));
};

// Calculate polygon perimeter in Kilometers
export const calculatePolygonPerimeterKm = (coords) => {
  if (!coords || coords.length < 2) return 0;
  let perim = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    perim += haversineDistance(coords[i], coords[j]);
  }
  return parseFloat(perim.toFixed(2));
};

// Interpolate vessel position at exact target time (Epoch ms) from track points [{lat, lng, timestamp, speed, course}]
export const interpolateVesselPosition = (track, targetTime) => {
  if (!track || track.length === 0) return null;
  
  // Sort track by timestamp ascending
  const sorted = [...track].sort((a, b) => a.timestamp - b.timestamp);
  
  if (targetTime <= sorted[0].timestamp) {
    return { ...sorted[0], isExtrapolated: targetTime < sorted[0].timestamp - 3600000 };
  }
  if (targetTime >= sorted[sorted.length - 1].timestamp) {
    return { ...sorted[sorted.length - 1], isExtrapolated: targetTime > sorted[sorted.length - 1].timestamp + 3600000 };
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const p1 = sorted[i];
    const p2 = sorted[i + 1];
    if (targetTime >= p1.timestamp && targetTime <= p2.timestamp) {
      const dt = p2.timestamp - p1.timestamp;
      if (dt === 0) return p1;
      const ratio = (targetTime - p1.timestamp) / dt;
      const lat = p1.lat + (p2.lat - p1.lat) * ratio;
      const lng = p1.lng + (p2.lng - p1.lng) * ratio;
      const speed = p1.speed + (p2.speed - p1.speed) * ratio;
      
      // Angle interpolation
      let diff = p2.course - p1.course;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const course = (p1.course + diff * ratio + 360) % 360;

      return {
        lat: parseFloat(lat.toFixed(5)),
        lng: parseFloat(lng.toFixed(5)),
        timestamp: targetTime,
        speed: parseFloat(speed.toFixed(1)),
        course: parseFloat(course.toFixed(1)),
        isInterpolated: true
      };
    }
  }
  return sorted[0];
};

// Calculate Closest Point of Approach (CPA) in Nautical Miles between a vessel track and a target point [lat, lng]
export const calculateCPA = (vesselTrack, targetPoint, originTimestamp) => {
  if (!vesselTrack || vesselTrack.length === 0) return { distanceNm: 999, timeAtCPA: null };
  
  let minDistanceNm = Infinity;
  let timeAtCPA = null;
  let posAtCPA = null;

  // Evaluate distance across all track points + window around originTimestamp
  const sorted = [...vesselTrack].sort((a, b) => a.timestamp - b.timestamp);
  
  sorted.forEach((pt) => {
    const dist = haversineNauticalMiles([pt.lat, pt.lng], targetPoint);
    if (dist < minDistanceNm) {
      minDistanceNm = dist;
      timeAtCPA = pt.timestamp;
      posAtCPA = [pt.lat, pt.lng];
    }
  });

  // Also check exact origin timestamp position
  const exactPos = interpolateVesselPosition(vesselTrack, originTimestamp);
  if (exactPos) {
    const distExact = haversineNauticalMiles([exactPos.lat, exactPos.lng], targetPoint);
    if (distExact < minDistanceNm) {
      minDistanceNm = distExact;
      timeAtCPA = originTimestamp;
      posAtCPA = [exactPos.lat, exactPos.lng];
    }
  }

  return {
    distanceNm: parseFloat(minDistanceNm.toFixed(2)),
    timeAtCPA,
    posAtCPA,
    timeOffsetHours: timeAtCPA ? parseFloat(((timeAtCPA - originTimestamp) / 3600000).toFixed(1)) : 0
  };
};
