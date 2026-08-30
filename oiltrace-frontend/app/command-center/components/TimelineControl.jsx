"use client";
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, FastForward } from 'lucide-react';

export default function TimelineControl({
  slickAcquisitionTime,
  currentTimeOffsetHours,
  onChangeTimeOffset,
  minOffsetHours = -36,
  maxOffsetHours = 48
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 3x, 10x

  // Animation Loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onChangeTimeOffset((prev) => {
          if (prev >= maxOffsetHours) {
            setIsPlaying(false);
            return minOffsetHours;
          }
          return parseFloat((prev + 0.5 * playbackSpeed).toFixed(1));
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, maxOffsetHours, minOffsetHours, onChangeTimeOffset]);

  const currentEpoch = slickAcquisitionTime + currentTimeOffsetHours * 3600 * 1000;
  const currentFormatted = new Date(currentEpoch).toUTCString().replace('GMT', 'UTC');

  return (
    <div className="glass-panel p-3 rounded-xl border border-slate-200 shadow-lg bg-white/95 flex flex-col md:flex-row items-center justify-between gap-3 text-xs z-20 text-slate-800">
      {/* Time Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            onChangeTimeOffset(0);
          }}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300"
          title="Reset to Satellite Image Pass Time (t=0)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            const speeds = [1, 3, 10];
            const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
            setPlaybackSpeed(speeds[nextIdx]);
          }}
          className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-sky-700 font-mono text-[11px] rounded-lg border border-slate-300 flex items-center space-x-1 font-semibold"
        >
          <FastForward className="w-3 h-3" />
          <span>{playbackSpeed}x</span>
        </button>
      </div>

      {/* Scrubber Bar */}
      <div className="flex-1 w-full flex flex-col space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span className="text-rose-600 font-semibold">t = {minOffsetHours}h (Hindcast Origin)</span>
          <span className="text-sky-800 font-semibold flex items-center space-x-1">
            <Clock className="w-3 h-3 text-sky-600" />
            <span>{currentFormatted}</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-sky-50 text-sky-700 border border-sky-300 rounded font-mono">
              {currentTimeOffsetHours === 0 ? 't = SAR Pass' : `t = ${currentTimeOffsetHours > 0 ? '+' : ''}${currentTimeOffsetHours}h`}
            </span>
          </span>
          <span className="text-emerald-700 font-semibold">t = +{maxOffsetHours}h (Forecast)</span>
        </div>

        <input
          type="range"
          min={minOffsetHours}
          max={maxOffsetHours}
          step={0.5}
          value={currentTimeOffsetHours}
          onChange={(e) => onChangeTimeOffset(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 border border-slate-300"
        />
      </div>
    </div>
  );
}
