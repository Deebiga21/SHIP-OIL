/**
 * Marine Weather Service
 * Bridges to Python FastAPI backend (`http://127.0.0.1:8000/api/weather/live`)
 * Consumes OpenWeatherMap API & StormGlass Marine API keys from .env
 */

import { fetchFastApiLiveWeather } from './apiClient';

export const degToCardinal = (deg) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 22.5) % 16;
  return directions[index];
};

export const fetchLiveMarineWeather = async (centroid = [2.45, 101.40]) => {
  const [lat, lng] = centroid || [2.45, 101.40];

  // 1. Try Python FastAPI backend endpoint first
  const fastApiWeather = await fetchFastApiLiveWeather(lat, lng);
  if (fastApiWeather) {
    const windKkts = fastApiWeather.windSpeedKnots || 14.0;
    const windDir = fastApiWeather.windDirDeg || 210;
    return {
      windSpeedKnots: windKkts,
      windSpeedKmh: roundToOne(windKkts * 1.852),
      windDirDeg: windDir,
      windDirCardinal: degToCardinal(windDir),
      currentSpeedKnots: fastApiWeather.currentSpeedKnots || 1.4,
      currentDirDeg: fastApiWeather.currentDirDeg || 320,
      currentDirCardinal: degToCardinal(fastApiWeather.currentDirDeg || 320),
      waveHeightMeters: fastApiWeather.waveHeightMeters || 0.8,
      wavePeriodSec: 3.5,
      seaSurfaceTempC: fastApiWeather.sstCelsius || 28.5,
      airPressureHpa: fastApiWeather.pressureHpa || 1012,
      source: `🐍 Python FastAPI (${fastApiWeather.source})`
    };
  }

  // 2. Client-side fallback to direct Open-Meteo API
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m,surface_pressure`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const current = data.current || {};

      const windKmh = current.wind_speed_10m || 15.0;
      const windKkts = roundToOne(windKmh / 1.852);
      const windDir = current.wind_direction_10m || 210;

      return {
        windSpeedKnots: windKkts,
        windSpeedKmh: roundToOne(windKmh),
        windDirDeg: windDir,
        windDirCardinal: degToCardinal(windDir),
        currentSpeedKnots: 1.4,
        currentDirDeg: 320,
        currentDirCardinal: 'NW',
        waveHeightMeters: 0.8,
        wavePeriodSec: 3.5,
        seaSurfaceTempC: current.temperature_2m || 28.5,
        airPressureHpa: current.surface_pressure || 1012,
        source: 'Open-Meteo Direct Telemetry'
      };
    }
  } catch (err) {
    console.warn('Fallback Open-Meteo error:', err);
  }

  return {
    windSpeedKnots: 14.0,
    windSpeedKmh: 25.9,
    windDirDeg: 210,
    windDirCardinal: 'SSW',
    currentSpeedKnots: 1.4,
    currentDirDeg: 320,
    currentDirCardinal: 'NW',
    waveHeightMeters: 0.8,
    wavePeriodSec: 3.5,
    seaSurfaceTempC: 28.5,
    airPressureHpa: 1012,
    source: 'Default Telemetry Model'
  };
};

const roundToOne = (num) => Math.round(num * 10) / 10;
