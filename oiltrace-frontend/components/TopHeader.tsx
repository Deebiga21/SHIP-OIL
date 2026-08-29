"use client";

import { useEffect, useState } from "react";
import { Globe, Satellite, Waves, RadioTower } from "lucide-react";

export function TopHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 glass-panel border-b border-b-[var(--panel-border)] flex items-center justify-between px-6 shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <h2 className="font-mono text-lg font-bold tracking-widest text-foreground">
          MARITIME INTELLIGENCE SYSTEM
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded text-xs font-mono text-success">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          SYSTEM OPERATIONAL
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs font-mono text-foreground/80">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-primary" />
          <span>S1-SAR: ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <RadioTower className="w-4 h-4 text-primary" />
          <span>AIS: LIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-primary" />
          <span>METOCEAN: SYNCED</span>
        </div>
        <div className="flex items-center gap-2 pl-4 border-l border-white/10 text-primary">
          <Globe className="w-4 h-4" />
          {time}
        </div>
      </div>
    </header>
  );
}
