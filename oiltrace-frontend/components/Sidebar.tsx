"use client";

import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  Map,
  Wind,
  RadioTower,
  Ship,
  AlertTriangle,
  FileText,
  Activity,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { id: "command", label: "Command Center", icon: ShieldAlert },
  { id: "detection", label: "Spill Detection", icon: Map },
  { id: "drift", label: "Drift Analysis", icon: Wind },
  { id: "ais", label: "AIS Intelligence", icon: RadioTower },
  { id: "attribution", label: "Vessel Attribution", icon: Ship },
  { id: "incidents", label: "Incidents", icon: AlertTriangle },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "system", label: "System Status", icon: Activity },
];

export function Sidebar() {
  const [active, setActive] = useState("command");

  return (
    <aside className="w-64 h-full glass-panel flex flex-col border-r border-r-[var(--panel-border)] shrink-0 z-20">
      <div className="p-4 border-b border-b-[var(--panel-border)] flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
          <ShieldAlert className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-bold tracking-wider text-sm leading-tight">OILTRACE AI</h1>
          <p className="text-[10px] text-primary/70 uppercase tracking-widest">Command Center</p>
        </div>
      </div>
      
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-colors text-sm font-medium",
              active === item.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-4 h-4", active === item.id ? "text-primary" : "opacity-70")} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-t-[var(--panel-border)]">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-foreground/70">SECURE CONNECTION</span>
        </div>
      </div>
    </aside>
  );
}
