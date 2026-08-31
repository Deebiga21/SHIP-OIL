import React from 'react';
import { ShieldAlert, AlertTriangle, Ship, ChevronRight, Eye, Radio, Gauge } from 'lucide-react';

export default function SuspectVesselsList({ rankedVessels, selectedVesselId, onSelectVessel, onInspectVessel }) {
  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-200 text-xs shadow-md bg-white text-slate-800 flex flex-col space-y-3 max-h-[420px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
          <h3 className="font-bold text-slate-900 uppercase tracking-wider font-mono">
            Attribution Suspect Leaderboard
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-200 font-bold">
          {rankedVessels.length} TARGETS EVALUATED
        </span>
      </div>

      {/* Vessels List */}
      <div className="space-y-2.5">
        {rankedVessels.map((vessel, index) => {
          const isSelected = vessel.vesselId === selectedVesselId;
          const isTop = index === 0 && vessel.masterScore >= 75;
          const isMedium = vessel.masterScore >= 50 && vessel.masterScore < 75;

          return (
            <div
              key={vessel.vesselId}
              onClick={() => onSelectVessel(vessel.vesselId)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                  : isTop
                  ? 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/80'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                      isTop
                        ? 'bg-rose-600 text-white shadow-sm'
                        : isMedium
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-mono tracking-tight flex items-center space-x-1.5">
                      <span>{vessel.vesselName}</span>
                    </h4>
                    <p className="text-[10px] text-slate-600 font-mono">
                      {vessel.vesselType} • {vessel.flag}
                    </p>
                  </div>
                </div>

                {/* Score Pill */}
                <div className="text-right">
                  <div
                    className={`text-sm font-bold font-mono px-2 py-0.5 rounded border inline-block ${
                      isTop
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isMedium
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-sky-800 border-slate-300'
                    }`}
                  >
                    {vessel.masterScore}%
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5 font-medium">{vessel.confidenceTier}</div>
                </div>
              </div>

              {/* Warning Badges */}
              <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                {vessel.darkShipGapFound && (
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono flex items-center space-x-1">
                    <Radio className="w-3 h-3 text-amber-700 animate-pulse" />
                    <span>Dark Ship AIS Gap ({vessel.gapDurationMinutes}m)</span>
                  </span>
                )}
                {vessel.speedDropDetected && (
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 font-mono flex items-center space-x-1">
                    <Gauge className="w-3 h-3 text-rose-700" />
                    <span>Speed Drop ({vessel.minSpeedNearOrigin} kts)</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-mono">
                  CPA: {vessel.cpaNm} nm
                </span>
              </div>

              {/* Score Progress Bar */}
              <div className="mt-2.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden border border-slate-300">
                <div
                  className={`h-full transition-all duration-500 ${
                    isTop ? 'bg-gradient-to-r from-rose-600 to-amber-500' : 'bg-sky-600'
                  }`}
                  style={{ width: `${vessel.masterScore}%` }}
                />
              </div>

              {/* Action Link */}
              <div className="mt-2 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspectVessel(vessel);
                  }}
                  className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-sky-700 border border-slate-300 text-[11px] font-medium flex items-center space-x-1 transition-colors shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-600" />
                  <span>Inspect Forensic Evidence</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
