"use client";
import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertOctagon, Radio, Gauge, MapPin, Compass, FileCheck } from 'lucide-react';

export default function VesselDetailsModal({ vesselInfo, onClose, originTimestamp }) {
  if (!vesselInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="glass-panel-cyan w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-y-auto border border-sky-400 shadow-2xl flex flex-col text-slate-800 bg-white">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold font-mono tracking-wide text-slate-900 uppercase">
                  {vesselInfo.vesselName}
                </h2>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  CONFIDENCE SCORE: {vesselInfo.masterScore}%
                </span>
              </div>
              <p className="text-xs text-slate-600 font-mono">
                IMO: {vesselInfo.imo} â€¢ MMSI: {vesselInfo.mmsi} â€¢ Flag: {vesselInfo.flag}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-200 rounded-lg border border-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Top Section: Vessel Profile & High Level Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative">
              <img
                src={vesselInfo.image || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80'}
                alt={vesselInfo.vesselName}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 font-mono text-xs space-y-1 bg-white">
                <div className="text-slate-600">Class: <span className="text-slate-900 font-semibold">{vesselInfo.vesselType}</span></div>
                <div className="text-slate-600">DWT: <span className="text-slate-900 font-semibold">{vesselInfo.dwt ? vesselInfo.dwt.toLocaleString() + ' MT' : 'N/A'}</span></div>
              </div>
            </div>

            {/* Evidence Breakdown Grid */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Forensic Attribution Evidence Scorecard
              </h3>

              <div className="space-y-2">
                {vesselInfo.scoringBreakdown.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-xs flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                        <span className="text-sky-700">[{item.weight}]</span>
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">{item.detail}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${item.score >= 70 ? 'text-rose-600' : 'text-sky-700'}`}>
                        {item.score} / 100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Anomaly Alerts Box */}
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-3">
            <h4 className="text-xs font-bold uppercase font-mono text-rose-800 flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>Attribution Anomalies Detected</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-white p-3 rounded-lg border border-rose-200 flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-sky-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Origin CPA Proximity</div>
                  <div className="text-slate-600 mt-0.5">{vesselInfo.cpaNm} nm from slick release centroid at estimated spill timestamp.</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-rose-200 flex items-start space-x-2">
                <Radio className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">AIS Transponder Signal</div>
                  <div className="text-slate-600 mt-0.5">
                    {vesselInfo.gapNearOrigin
                      ? `âš ï¸ Blackout gap of ${vesselInfo.gapDurationMinutes} mins detected around release window.`
                      : 'Normal AIS transmission broadcast recorded.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamp Chain of Custody */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 text-[11px] font-mono text-slate-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted Forensic Hash: <code className="text-sky-800 font-bold">0x8f4b29a1c...e71b</code></span>
            </div>
            <div className="text-slate-500 font-semibold">Legal Audit Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
}
