import React from 'react';
import { Sliders, Wind, Compass, Droplets, RefreshCw, X } from 'lucide-react';
import { BONN_OIL_TYPES } from '../engine/sarSegmentation';

export default function SimulationPanel({
  isOpen,
  onClose,
  windSpeed,
  setWindSpeed,
  windDir,
  setWindDir,
  currentSpeed,
  setCurrentSpeed,
  currentDir,
  setCurrentDir,
  oilOpticCode,
  setOilOpticCode,
  onResetSimulation
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 bg-white/95 border-l border-slate-200 p-5 backdrop-blur-xl shadow-2xl overflow-y-auto text-xs font-sans text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-sky-600" />
          <h3 className="font-bold text-slate-900 uppercase tracking-wider font-mono">
            Physics Forcing Controls
          </h3>
        </div>
        <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-5">
        {/* Surface Wind Vectors */}
        <div className="space-y-2">
          <label className="font-semibold text-slate-800 flex items-center justify-between font-mono">
            <span className="flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-sky-600" />
              <span>Surface Wind Speed</span>
            </span>
            <span className="text-sky-700 font-bold">{windSpeed} kts</span>
          </label>
          <input
            type="range"
            min={0}
            max={45}
            step={1}
            value={windSpeed}
            onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />

          <label className="font-semibold text-slate-800 flex items-center justify-between font-mono mt-3">
            <span className="flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>Wind Direction</span>
            </span>
            <span className="text-sky-700 font-bold">{windDir}°</span>
          </label>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={windDir}
            onChange={(e) => setWindDir(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
        </div>

        {/* Ocean Current Vectors */}
        <div className="space-y-2 border-t border-slate-200 pt-4">
          <label className="font-semibold text-slate-800 flex items-center justify-between font-mono">
            <span className="flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ocean Current Speed</span>
            </span>
            <span className="text-emerald-700 font-bold">{currentSpeed} kts</span>
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={currentSpeed}
            onChange={(e) => setCurrentSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <label className="font-semibold text-slate-800 flex items-center justify-between font-mono mt-3">
            <span className="flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Current Direction</span>
            </span>
            <span className="text-emerald-700 font-bold">{currentDir}°</span>
          </label>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={currentDir}
            onChange={(e) => setCurrentDir(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Oil Standard Code */}
        <div className="space-y-2 border-t border-slate-200 pt-4 font-mono">
          <label className="font-semibold text-slate-800 flex items-center space-x-1.5">
            <Droplets className="w-3.5 h-3.5 text-amber-600" />
            <span>Oil Type (Bonn Standard Code)</span>
          </label>
          <select
            value={oilOpticCode}
            onChange={(e) => setOilOpticCode(parseInt(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2 text-xs font-sans"
          >
            {BONN_OIL_TYPES.map((t) => (
              <option key={t.code} value={t.code}>
                Code {t.code}: {t.name} ({t.thicknessMicrons} μm)
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={onResetSimulation}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg border border-slate-300 transition-colors flex items-center justify-center space-x-2 font-mono shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
          <span>Reset Default Vectors</span>
        </button>
      </div>
    </div>
  );
}
