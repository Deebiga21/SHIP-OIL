/**
 * Oceanographic Drift Hindcasting & Forecasting Physics Engine
 * Implements 2D Lagrangian Particle Tracking with Wind, Current, and Stokes Drift
 */

import { projectPoint, calculateBearing, haversineDistance } from '../utils/geoUtils';

/**
 * Calculates net drift velocity vector from ocean current and wind
 * Wind Drift Factor: ~3.5% of 10m wind speed with Coriolis deflection
 */
export const calculateNetDriftVector = (currentSpeedKnots, currentDirDeg, windSpeedKnots, windDirDeg) => {
  // Convert knots to km/h (1 knot = 1.852 km/h)
  const currentSpeedKmh = currentSpeedKnots * 1.852;
  const windSpeedKmh = windSpeedKnots * 1.852;

  // Wind drift factor (3.5%)
  const windDriftKmh = windSpeedKmh * 0.035;
  // Coriolis deflection angle (~15 deg to the right of wind direction in Northern Hemisphere)
  const windDriftDirDeg = (windDirDeg + 15) % 360;

  // Vector addition of Current and Wind Drift
  const currRad = (currentDirDeg * Math.PI) / 180;
  const windRad = (windDriftDirDeg * Math.PI) / 180;

  const uCurr = currentSpeedKmh * Math.sin(currRad);
  const vCurr = currentSpeedKmh * Math.cos(currRad);

  const uWind = windDriftKmh * Math.sin(windRad);
  const vWind = windDriftKmh * Math.cos(windRad);

  const uTotal = uCurr + uWind;
  const vTotal = vCurr + vWind;

  const netSpeedKmh = Math.sqrt(uTotal * uTotal + vTotal * vTotal);
  let netDirDeg = (Math.atan2(uTotal, vTotal) * 180) / Math.PI;
  if (netDirDeg < 0) netDirDeg += 360;

  return {
    netSpeedKmh: parseFloat(netSpeedKmh.toFixed(2)),
    netSpeedKnots: parseFloat((netSpeedKmh / 1.852).toFixed(2)),
    netDirDeg: Math.round(netDirDeg),
    currentSpeedKnots,
    currentDirDeg,
    windSpeedKnots,
    windDirDeg
  };
};

/**
 * Performs Backward Lagrangian Particle Hindcasting
 * Traces slick backwards from observation centroid to find origin release point & time window
 */
export const runBackwardHindcast = ({
  slickCentroid,
  estimatedAgeHours = 12,
  currentSpeedKnots = 1.2,
  currentDirDeg = 45,
  windSpeedKnots = 15,
  windDirDeg = 120,
  numParticles = 40
}) => {
  const driftVector = calculateNetDriftVector(currentSpeedKnots, currentDirDeg, windSpeedKnots, windDirDeg);
  
  // Reverse direction for backward tracking
  const reverseDirDeg = (driftVector.netDirDeg + 180) % 360;

  // Total backward distance in km = net speed (km/h) * age (hours)
  const totalDistanceKm = driftVector.netSpeedKmh * estimatedAgeHours;
  
  // Estimated origin centroid
  const originCentroid = projectPoint(slickCentroid, totalDistanceKm, reverseDirDeg);

  // Generate particle cloud representing origin uncertainty hotspot
  const particleTrail = [];
  const originHotspotParticles = [];

  // Generate main trajectory backbone (hour by hour)
  for (let h = 0; h <= estimatedAgeHours; h++) {
    const stepDist = driftVector.netSpeedKmh * h;
    const pos = projectPoint(slickCentroid, stepDist, reverseDirDeg);
    particleTrail.push({
      hourOffset: -h,
      lat: pos[0],
      lng: pos[1],
      timestampOffsetMs: -h * 3600 * 1000
    });
  }

  // Generate stochastic particle spread around origin centroid for diffusion representation
  for (let i = 0; i < numParticles; i++) {
    // Random turbulent diffusion offset (up to 1.5 km spread)
    const angle = Math.random() * 360;
    const r = Math.random() * (0.2 + estimatedAgeHours * 0.1); // dispersion grows with age
    const p = projectPoint(originCentroid, r, angle);
    originHotspotParticles.push({
      id: `origin_p_${i}`,
      lat: p[0],
      lng: p[1],
      confidence: parseFloat((1 - r / 3.0).toFixed(2))
    });
  }

  return {
    originCentroid,
    estimatedAgeHours,
    totalDistanceKm: parseFloat(totalDistanceKm.toFixed(2)),
    driftVector,
    particleTrail,
    originHotspotParticles,
    spatialUncertaintyRadiusKm: parseFloat((0.5 + estimatedAgeHours * 0.12).toFixed(2))
  };
};

/**
 * Performs Forward Lagrangian Particle Forecasting
 * Predicts slick drift path into future (+72 hours) with weathering loss
 */
export const runForwardForecast = ({
  slickCentroid,
  forecastHours = 72,
  currentSpeedKnots = 1.2,
  currentDirDeg = 45,
  windSpeedKnots = 15,
  windDirDeg = 120,
  initialVolumeM3 = 120
}) => {
  const driftVector = calculateNetDriftVector(currentSpeedKnots, currentDirDeg, windSpeedKnots, windDirDeg);
  const forecastPath = [];

  for (let h = 0; h <= forecastHours; h += 3) {
    const stepDist = driftVector.netSpeedKmh * h;
    const pos = projectPoint(slickCentroid, stepDist, driftVector.netDirDeg);
    
    // Evaporation loss curve: E(t) = 12 * ln(t + 1) %
    const evaporationLossPct = Math.min(65, Math.round(12 * Math.log(h + 1)));
    const remainingVolumeM3 = parseFloat((initialVolumeM3 * (1 - evaporationLossPct / 100)).toFixed(1));
    
    // Fay's Spreading Radius (km) ~ 0.05 * t^0.75
    const spreadRadiusKm = parseFloat((0.2 + 0.04 * Math.pow(h, 0.75)).toFixed(2));

    forecastPath.push({
      hourOffset: h,
      lat: pos[0],
      lng: pos[1],
      evaporationLossPct,
      remainingVolumeM3,
      spreadRadiusKm,
      emulsificationPct: Math.min(75, Math.round(h * 0.9))
    });
  }

  return {
    forecastPath,
    driftVector,
    forecastHours,
    finalDistanceKm: parseFloat((driftVector.netSpeedKmh * forecastHours).toFixed(2))
  };
};
