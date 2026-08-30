/**
 * AIS Vessel Traffic Attribution & Anomaly Scoring Engine
 * Analyzes spatio-temporal correlation between vessel AIS tracks and hindcasted slick origin
 */

import { calculateCPA, calculateBearing, interpolateVesselPosition } from '../utils/geoUtils';

/**
 * Vessel Type Risk Multipliers
 */
export const VESSEL_RISK_WEIGHTS = {
  'Crude Oil Tanker': 1.0,
  'Chemical / Product Tanker': 0.95,
  'Oil Tanker': 0.95,
  'Container Ship': 0.55,
  'Bulk Carrier': 0.50,
  'General Cargo': 0.45,
  'Tug / Offshore Support': 0.35,
  'Fishing Vessel': 0.20,
  'Passenger Ship': 0.10
};

/**
 * Calculates attribution score & suspect evidence breakdown for a vessel given its track history
 * and the hindcasted slick origin parameters.
 */
export const scoreVesselAttribution = (vessel, originCentroid, originTimestamp, driftVector) => {
  const track = vessel.trackHistory || [];
  
  // 1. Closest Point of Approach (CPA)
  const cpaResult = calculateCPA(track, originCentroid, originTimestamp);
  const cpaNm = cpaResult.distanceNm;

  // CPA Score: exponential decay (100% if < 0.5 nm, decays to 0% at > 8.0 nm)
  let cpaScore = 0;
  if (cpaNm <= 0.5) {
    cpaScore = 100;
  } else if (cpaNm <= 8.0) {
    cpaScore = Math.max(0, 100 * Math.exp(-0.45 * (cpaNm - 0.5)));
  }

  // 2. AIS "Dark Ship" Transponder Gap Analysis
  let darkShipGapFound = false;
  let gapDurationMinutes = 0;
  let gapNearOrigin = false;

  const sortedTrack = [...track].sort((a, b) => a.timestamp - b.timestamp);
  for (let i = 0; i < sortedTrack.length - 1; i++) {
    const t1 = sortedTrack[i].timestamp;
    const t2 = sortedTrack[i + 1].timestamp;
    const gapMs = t2 - t1;
    // AIS transmission interval in open sea is 2-10 seconds for moving vessels.
    // A gap > 30 minutes is highly suspicious
    if (gapMs > 30 * 60 * 1000) {
      darkShipGapFound = true;
      gapDurationMinutes = Math.round(gapMs / (60 * 1000));
      // Check if gap encompasses origin timestamp (with +- 1.5 hr margin)
      if (originTimestamp >= t1 - 90 * 60 * 1000 && originTimestamp <= t2 + 90 * 60 * 1000) {
        gapNearOrigin = true;
      }
    }
  }

  let darkShipScore = 0;
  if (gapNearOrigin) {
    darkShipScore = 100;
  } else if (darkShipGapFound) {
    darkShipScore = 50;
  }

  // 3. Speed & Behavioral Anomaly Detection
  let minSpeedNearOrigin = 99;
  let maxSpeedNearOrigin = 0;
  let speedDropDetected = false;

  sortedTrack.forEach((pt) => {
    const timeDiffMs = Math.abs(pt.timestamp - originTimestamp);
    if (timeDiffMs <= 3 * 3600 * 1000) { // within 3 hours of origin time
      if (pt.speed < minSpeedNearOrigin) minSpeedNearOrigin = pt.speed;
      if (pt.speed > maxSpeedNearOrigin) maxSpeedNearOrigin = pt.speed;
    }
  });

  // If vessel speed dropped from normal transit (> 12 knots) to low speed (< 4 knots) near origin
  if (maxSpeedNearOrigin > 10 && minSpeedNearOrigin < 4) {
    speedDropDetected = true;
  }

  let speedAnomalyScore = 0;
  if (speedDropDetected) {
    speedAnomalyScore = 100;
  } else if (minSpeedNearOrigin < 6) {
    speedAnomalyScore = 60;
  } else {
    speedAnomalyScore = 20;
  }

  // 4. Trajectory Co-alignment Score
  // Compares vessel course around origin window with the drift trajectory vector
  const posNearOrigin = interpolateVesselPosition(track, originTimestamp);
  let courseScore = 50;
  if (posNearOrigin) {
    const vesselCourse = posNearOrigin.course;
    const reverseDriftDir = (driftVector.netDirDeg + 180) % 360;
    let angleDiff = Math.abs(vesselCourse - reverseDriftDir);
    if (angleDiff > 180) angleDiff = 360 - angleDiff;

    // Parallel or anti-parallel co-alignment with slick drift axis
    const alignment = Math.cos((angleDiff * Math.PI) / 180);
    courseScore = Math.round(Math.abs(alignment) * 100);
  }

  // 5. Vessel Risk Profile Score
  const typeRiskMultiplier = VESSEL_RISK_WEIGHTS[vessel.type] || 0.4;
  const vesselRiskScore = Math.round(typeRiskMultiplier * 100);

  // --- Weighted Master Attribution Score (0 - 100%) ---
  // Weights: CPA (35%), Dark Ship Gap (25%), Speed Anomaly (20%), Course Co-alignment (10%), Vessel Risk (10%)
  const masterScore = Math.round(
    cpaScore * 0.35 +
    darkShipScore * 0.25 +
    speedAnomalyScore * 0.20 +
    courseScore * 0.10 +
    vesselRiskScore * 0.10
  );

  // Confidence Tier & Primary Reason
  let confidenceTier = 'LOW';
  if (masterScore >= 80) confidenceTier = 'HIGH CRITICAL';
  else if (masterScore >= 55) confidenceTier = 'MEDIUM SUSPECT';

  return {
    vesselId: vessel.id,
    vesselName: vessel.name,
    mmsi: vessel.mmsi,
    imo: vessel.imo,
    flag: vessel.flag,
    vesselType: vessel.type,
    dwt: vessel.dwt,
    masterScore,
    confidenceTier,
    cpaNm,
    cpaTimeOffsetHours: cpaResult.timeOffsetHours,
    cpaScore: Math.round(cpaScore),
    darkShipGapFound,
    gapDurationMinutes,
    gapNearOrigin,
    darkShipScore,
    speedDropDetected,
    minSpeedNearOrigin: minSpeedNearOrigin === 99 ? 0 : minSpeedNearOrigin,
    maxSpeedNearOrigin,
    speedAnomalyScore,
    courseScore,
    vesselRiskScore,
    posAtOriginTime: posNearOrigin,
    scoringBreakdown: [
      { name: 'Spatio-Temporal CPA Proximity', score: Math.round(cpaScore), weight: '35%', detail: `${cpaNm} nm from origin centroid` },
      { name: 'AIS Transponder Signal (Dark Ship)', score: Math.round(darkShipScore), weight: '25%', detail: gapNearOrigin ? `Dark AIS Gap (${gapDurationMinutes} mins)` : 'Normal AIS Transmission' },
      { name: 'Behavioral Speed Anomaly', score: Math.round(speedAnomalyScore), weight: '20%', detail: speedDropDetected ? `Abrupt speed drop to ${minSpeedNearOrigin} kts` : 'Steady Transit Speed' },
      { name: 'Trajectory Axis Alignment', score: Math.round(courseScore), weight: '10%', detail: `Course co-aligned with drift axis` },
      { name: 'Vessel Hazard Classification', score: Math.round(vesselRiskScore), weight: '10%', detail: `${vessel.type} (${vessel.dwt ? vessel.dwt.toLocaleString() + ' DWT' : 'N/A'})` }
    ]
  };
};

/**
 * Filters and ranks all vessels in dataset according to attribution score
 */
export const rankSuspectVessels = (vesselsList, originCentroid, originTimestamp, driftVector) => {
  const scored = vesselsList.map((vessel) => scoreVesselAttribution(vessel, originCentroid, originTimestamp, driftVector));
  return scored.sort((a, b) => b.masterScore - a.masterScore);
};
