"use client";
import React, { useState, useEffect } from 'react';
import { Wind, Compass, Waves, Thermometer, Gauge, Eye, RefreshCw, Key, CheckCircle2, Zap } from 'lucide-react';
import { fetchLiveMarineWeather } from '../services/marineWeatherService';

export default function MarineWeatherCard({ slickCentroid, onSyncToPhysics }) {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadWeather = async () => {
    if (!slickCentroid) return;
    setIsLoading(true);
    try {
      const data = await fetchLiveMarineWeather(slickCentroid);
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to load marine weather:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [slickCentroid]);

  if (!weatherData) return null;

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-200 text-xs shadow-md bg-white text-slate-800 flex flex-col space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-sky-600 animate-pulse" />
          <h3 className="font-bold text-slate-900 uppercase tracking-wider font-mono">
            Marine Ocean Weather Telemetry
          </h3>
        </div>
        <button
          onClick={loadWeather}
          disabled={isLoading}
          className="p-1 text-slate-500 hover:text-sky-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
          title="Refresh Live Weather Telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* API Source & .env Key Status */}
      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[10px] font-mono flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-slate-700">
          <Key className="w-3 h-3 text-amber-600" />
          <span className="truncate">{weatherData.source}</span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
          LIVE TELEMETRY
        </span>
      </div>

      {/* Weather Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        {/* Wind Vector */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
          <div className="text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Wind className="w-3 h-3 text-sky-600" />
              <span>Surface Wind</span>
            </span>
            <span className="text-sky-700 font-bold">{weatherData.windDirCardinal}</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {weatherData.windSpeedKnots} <span className="text-xs font-normal text-slate-500">kts</span>
          </div>
          <div className="text-[10px] text-slate-500">Dir: {weatherData.windDirDeg}Â° ({weatherData.windSpeedKmh} km/h)</div>
        </div>

        {/* Ocean Current Vector */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
          <div className="text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Compass className="w-3 h-3 text-emerald-600" />
              <span>Ocean Current</span>
            </span>
            <span className="text-emerald-700 font-bold">{weatherData.currentDirCardinal || 'NW'}</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {weatherData.currentSpeedKnots} <span className="text-xs font-normal text-slate-500">kts</span>
          </div>
          <div className="text-[10px] text-slate-500">Dir: {weatherData.currentDirDeg}Â°</div>
        </div>

        {/* Waves & Swell */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
          <div className="text-[10px] text-slate-500 flex items-center space-x-1">
            <Waves className="w-3 h-3 text-cyan-600" />
            <span>Significant Waves</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {weatherData.waveHeightMeters} <span className="text-xs font-normal text-slate-500">m</span>
          </div>
          <div className="text-[10px] text-slate-500">Period: {weatherData.wavePeriodSec}s</div>
        </div>

        {/* Sea Surface Temp & Atmosphere */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
          <div className="text-[10px] text-slate-500 flex items-center space-x-1">
            <Thermometer className="w-3 h-3 text-rose-600" />
            <span>Sea Temp & Pressure</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {weatherData.seaSurfaceTempC}Â°C
          </div>
          <div className="text-[10px] text-slate-500">{weatherData.airPressureHpa} hPa</div>
        </div>
      </div>

      {/* Sync Weather Button */}
      <button
        onClick={() => {
          if (onSyncToPhysics && weatherData) {
            onSyncToPhysics({
              windSpeed: weatherData.windSpeedKnots,
              windDir: weatherData.windDirDeg,
              currentSpeed: weatherData.currentSpeedKnots,
              currentDir: weatherData.currentDirDeg
            });
          }
        }}
        className="w-full py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5 font-mono"
      >
        <Zap className="w-3.5 h-3.5" />
        <span>Sync Telemetry to Drift Model</span>
      </button>
    </div>
  );
}
