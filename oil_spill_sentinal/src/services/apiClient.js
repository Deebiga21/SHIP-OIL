/**
 * Python FastAPI Backend API Client (`http://127.0.0.1:8000`)
 * Bridges React UI controls to the Python backend engines & live API services
 */

const FASTAPI_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Checks health of Python FastAPI server and status of configured API keys
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/health`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('FastAPI backend health check failed, falling back to local client processing.');
  }
  return null;
}

/**
 * Fetches live marine weather telemetry from Python FastAPI backend (OpenWeatherMap + StormGlass Marine)
 */
export async function fetchFastApiLiveWeather(lat = 2.45, lng = 101.40) {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/weather/live?lat=${lat}&lng=${lng}`);
    if (res.ok) {
      const body = await res.json();
      return body.weather;
    }
  } catch (err) {
    console.warn('FastAPI weather query error:', err);
  }
  return null;
}

/**
 * Executes Python SAR oil slick characterization
 */
export async function runFastApiSarCharacterization(polygonCoords, opticCode = 4, acquisitionTime = null) {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/sar/characterize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ polygonCoords, opticCode, acquisitionTime })
    });
    if (res.ok) {
      const body = await res.json();
      return body.data;
    }
  } catch (err) {
    console.warn('FastAPI SAR characterization error:', err);
  }
  return null;
}

/**
 * Executes Python 2D Lagrangian Ocean Reverse Drift Hindcast
 */
export async function runFastApiDriftHindcast(params) {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/drift/hindcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      const body = await res.json();
      return body.data;
    }
  } catch (err) {
    console.warn('FastAPI drift hindcast error:', err);
  }
  return null;
}

/**
 * Executes Python 2D Lagrangian Forward Drift Forecast
 */
export async function runFastApiDriftForecast(params) {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/drift/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      const body = await res.json();
      return body.data;
    }
  } catch (err) {
    console.warn('FastAPI drift forecast error:', err);
  }
  return null;
}

/**
 * Executes Python Multi-Factor AIS Suspect Vessel Attribution Ranking
 */
export async function runFastApiVesselAttribution(vessels, originCentroid, originTimestamp, driftVector) {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/api/vessel/attribution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vessels, originCentroid, originTimestamp, driftVector })
    });
    if (res.ok) {
      const body = await res.json();
      return body.rankedVessels;
    }
  } catch (err) {
    console.warn('FastAPI vessel attribution error:', err);
  }
  return null;
}
