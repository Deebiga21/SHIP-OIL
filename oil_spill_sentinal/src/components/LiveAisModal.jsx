import React, { useState, useEffect, useRef } from 'react';
import { X, Radio, Ship, CheckCircle2, Code, Zap, Play, Square, RefreshCw, AlertCircle, Wifi, Globe } from 'lucide-react';
import { parseAisApiResponse, RealtimeAisStream } from '../services/liveAisService';

const SAMPLE_PAYLOAD = `{"MetaData":{"MMSI":419001504,"MMSI_String":419001504,"ShipName":"CG39","latitude":13.1527,"longitude":80.3795,"time_utc":"2026-08-27 05:40:41.991050178 +0000 UTC"},"MessageType":"PositionReport","Message":{"PositionReport":{"MessageID":1,"RepeatIndicator":0,"UserID":419001504,"Valid":true,"NavigationalStatus":0,"RateOfTurn":0,"Sog":7,"PositionAccuracy":false,"Longitude":80.3795,"Latitude":13.1527,"Cog":181.3,"TrueHeading":176,"Timestamp":39,"SpecialManoeuvreIndicator":0,"Spare":0,"Raim":false,"CommunicationState":34338}}}`;

export default function LiveAisModal({ isOpen, onClose, onImportVessels, isStreaming, onToggleStreaming, liveVesselCount }) {
  if (!isOpen) return null;

  const [jsonText, setJsonText] = useState(SAMPLE_PAYLOAD);
  const [parsedVessels, setParsedVessels] = useState([]);
  const [apiKeyInput, setApiKeyInput] = useState('46c21d2214962a440af47a06e6e0205040552897');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleParseJson = () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const vessels = parseAisApiResponse(jsonText);
      if (vessels.length === 0) {
        setErrorMsg('No valid ship positions found in the input JSON payload.');
        setParsedVessels([]);
      } else {
        setParsedVessels(vessels);
        setSuccessMsg(`Successfully extracted ${vessels.length} vessel(s) from payload!`);
      }
    } catch (err) {
      setErrorMsg('Invalid JSON format. Please check syntax.');
      setParsedVessels([]);
    }
  };

  const handleApplyToMap = () => {
    if (parsedVessels.length > 0) {
      onImportVessels(parsedVessels);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans text-xs">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl overflow-y-auto border border-sky-400 shadow-2xl flex flex-col text-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center">
              <Radio className="w-5 h-5 text-sky-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold font-mono tracking-wide text-slate-900 uppercase">
                  Real-Time AISStream WebSocket & Multivessel Parser
                </h2>
                {isStreaming && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                    🟢 STREAMING LIVE ({liveVesselCount} SHIPS)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-mono">
                Stream hundreds of live ships in real-time from AISStream API key: <code className="text-sky-700 font-bold">46c21d22...2897</code>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 bg-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Section 1: Real-Time WebSocket Streaming */}
          <div className="bg-gradient-to-r from-sky-50 to-teal-50 p-4 rounded-xl border border-sky-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="font-bold text-slate-900 font-mono text-xs uppercase">
                    1. Real-Time AISStream WebSocket Connection
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Connects directly to <code className="text-sky-800 font-mono font-bold">wss://stream.aisstream.io/v0/stream</code> with BoundingBox <code className="text-sky-800 font-mono font-bold">[[[-40, 20], [30, 120]]]</code>
                  </p>
                </div>
              </div>

              <button
                onClick={onToggleStreaming}
                className={`px-4 py-2 font-mono font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 ${
                  isStreaming
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isStreaming ? (
                  <>
                    <Square className="w-4 h-4" />
                    <span>Disconnect Live Stream</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 animate-pulse" />
                    <span>Connect & Stream All Ships Live</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="bg-white p-2 rounded border border-sky-200 flex justify-between">
                <span className="text-slate-600">WebSocket Endpoint:</span>
                <span className="text-sky-800 font-bold">wss://stream.aisstream.io/v0/stream</span>
              </div>
              <div className="bg-white p-2 rounded border border-sky-200 flex justify-between">
                <span className="text-slate-600">Active API Key:</span>
                <span className="text-emerald-700 font-bold truncate max-w-[150px]">{apiKeyInput}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Manual JSON Payload / Stream Log Import */}
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <h3 className="font-bold uppercase font-mono text-slate-900 text-xs flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Code className="w-4 h-4 text-sky-600" />
                <span>2. Manual JSON Response Payload / Stream Log Parser</span>
              </span>
              <button
                onClick={() => {
                  setJsonText(SAMPLE_PAYLOAD);
                  handleParseJson();
                }}
                className="text-sky-700 hover:underline text-[10px] font-semibold font-mono"
              >
                Load Sample Payload
              </button>
            </h3>

            <textarea
              rows={5}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste raw AIS API JSON payload response here..."
              className="w-full p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 font-mono text-[11px] focus:outline-none focus:border-sky-500"
            />

            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={handleParseJson}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1.5 font-mono transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Parse Payload JSON</span>
              </button>
            </div>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 bg-rose-100 text-rose-800 rounded-lg border border-rose-300 font-mono text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300 font-mono text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Parsed Ships Preview Table */}
          {parsedVessels.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h3 className="font-bold uppercase font-mono text-slate-900 text-xs flex items-center space-x-1.5">
                <Ship className="w-4 h-4 text-sky-600" />
                <span>Extracted Vessels ({parsedVessels.length})</span>
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">MMSI</th>
                      <th className="p-2.5">Ship Name</th>
                      <th className="p-2.5">Latitude</th>
                      <th className="p-2.5">Longitude</th>
                      <th className="p-2.5">Speed (Sog)</th>
                      <th className="p-2.5">Course (Cog)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {parsedVessels.map((v) => {
                      const pos = v.trackHistory[0] || {};
                      return (
                        <tr key={v.mmsi} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-sky-700">{v.mmsi}</td>
                          <td className="p-2.5 font-bold text-slate-900">{v.name}</td>
                          <td className="p-2.5 text-slate-700">{pos.lat}° N</td>
                          <td className="p-2.5 text-slate-700">{pos.lng}° E</td>
                          <td className="p-2.5 font-semibold text-emerald-700">{pos.speed} knots</td>
                          <td className="p-2.5 text-slate-700">{pos.course}°</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleApplyToMap}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md font-mono flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Plot All {parsedVessels.length} Ships On GIS Map & Run Attribution</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
