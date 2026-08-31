/**
 * SAR / EO Satellite Image Oil Spill Detection & Characterization Engine
 * Follows international standards (Bonn Agreement Oil Appearance Code - BAOAC)
 */

import { calculatePolygonAreaKm2, calculatePolygonPerimeterKm, calculateCentroid } from '../utils/geoUtils';

// Bonn Agreement Oil Appearance Codes (BAOAC) & Thickness Standards
export const BONN_OIL_TYPES = [
  { code: 1, name: 'Silvery Sheen', thicknessMicrons: 0.1, color: '#C0C0C0', minCoverage: 0.05 },
  { code: 2, name: 'Rainbow Sheen', thicknessMicrons: 0.3, color: '#FF7F00', minCoverage: 0.15 },
  { code: 3, name: 'Metallic Appearance', thicknessMicrons: 5.0, color: '#4B0082', minCoverage: 1.0 },
  { code: 4, name: 'Discontinuous True Color', thicknessMicrons: 50.0, color: '#8B4513', minCoverage: 10.0 },
  { code: 5, name: 'Continuous True Color (Heavy Crude)', thicknessMicrons: 200.0, color: '#1A1A1A', minCoverage: 50.0 }
];

/**
 * Characterizes an oil slick polygon and computes geometric, optical, and volumetric properties.
 */
export const characterizeOilSlick = (polygonCoords, opticCode = 3, acquisitionTime = Date.now()) => {
  const areaKm2 = calculatePolygonAreaKm2(polygonCoords);
  const perimeterKm = calculatePolygonPerimeterKm(polygonCoords);
  const centroid = calculateCentroid(polygonCoords);

  // Thickness from Bonn Agreement Code
  const oilTypeInfo = BONN_OIL_TYPES.find((t) => t.code === opticCode) || BONN_OIL_TYPES[2];
  const thicknessMicrons = oilTypeInfo.thicknessMicrons;

  // Volume Calculation: Area (m^2) * Thickness (meters)
  // 1 km^2 = 1,000,000 m^2; 1 Micron = 1e-6 meters
  // Therefore 1 km^2 * 1 micron = 1 m^3 of oil!
  const volumeM3 = parseFloat((areaKm2 * thicknessMicrons).toFixed(2));
  // 1 m^3 = 6.28981 US Barrels (bbl)
  const volumeBarrels = Math.round(volumeM3 * 6.28981);

  // Shape Compactness & Elongation
  // Isoperimetric quotient = 4 * PI * Area / (Perimeter^2)
  const compactness = perimeterKm > 0 ? (4 * Math.PI * areaKm2) / (perimeterKm * perimeterKm) : 0;
  const isElongated = compactness < 0.3; // Low compactness indicates linear drift shape

  // SAR Radar Backscatter Damping (dB)
  // Oil slicks dampen ocean capillary waves, causing dark patches in SAR VV images
  const sarBackscatterDampingDb = parseFloat((-(6.5 + (1 - compactness) * 4.2)).toFixed(1)); // e.g. -8.5 dB

  // Look-alike Discrimination (Mineral Crude vs Biogenic/Algae/Wind Floor)
  // Factors: Backscatter damping intensity, edge sharpness, shape elongation, contextual offshore distance
  const biogenicProbability = compactness > 0.6 ? 0.35 : 0.08;
  const mineralOilConfidence = parseFloat((1.0 - biogenicProbability).toFixed(2));

  // Slick Age Estimation based on weathering dispersion (Hours)
  // Typical area expansion rate: Area ~ A_0 * (1 + 0.15 * t^0.8)
  const estimatedAgeHours = Math.max(2, Math.round(Math.pow(areaKm2 / 2.5, 1 / 0.8) * 4));

  return {
    centroid,
    areaKm2,
    perimeterKm,
    thicknessMicrons,
    oilType: oilTypeInfo.name,
    oilTypeCode: oilTypeInfo.code,
    oilColor: oilTypeInfo.color,
    volumeM3,
    volumeBarrels,
    compactness: parseFloat(compactness.toFixed(3)),
    isElongated,
    sarBackscatterDampingDb,
    mineralOilConfidence,
    estimatedAgeHours,
    acquisitionTime,
    estimatedReleaseTime: acquisitionTime - estimatedAgeHours * 3600 * 1000
  };
};

/**
 * Returns mock SAR satellite metadata (Sentinel-1 VV/VH)
 */
export const getSatelliteMetadata = (scenarioName = 'Default Scenario') => {
  return {
    satellite: 'Sentinel-1B SAR C-Band',
    mode: 'Interferometric Wide (IW)',
    polarization: 'VV + VH Dual-Pol',
    pixelResolution: '10m x 10m',
    orbitPass: 'Descending (Orbit 142)',
    incidenceAngle: '34.2° - 38.9°',
    sensorVendor: 'ESA / Copernicus Open Access Hub',
    cloudCoverPct: '0.0% (Radar Penetrates Clouds)'
  };
};
