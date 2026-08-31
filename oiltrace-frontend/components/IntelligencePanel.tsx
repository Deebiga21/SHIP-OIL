"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Map, Crosshair, Anchor, ShieldCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntelligencePanelProps {
  demoState: number;
}

export function IntelligencePanel({ demoState }: IntelligencePanelProps) {
  return (
    <div className="w-[400px] h-full glass-panel flex flex-col border-l border-l-[var(--panel-border)] shrink-0 z-10 overflow-y-auto">
      <div className="p-4 border-b border-b-[var(--panel-border)] bg-primary/5">
        <h2 className="font-bold tracking-widest text-sm flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-primary" />
          INTELLIGENCE FEED
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <AnimatePresence>
          {demoState >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border border-primary/20 rounded bg-primary/5 space-y-2"
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-primary font-bold">SAR DETECTION</span>
                <span className="text-foreground/60">08:30 UTC</span>
              </div>
              <p className="text-sm">Sentinel-1 image processed. <span className="text-danger font-bold">Oil-like region detected.</span></p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-2 text-foreground/80">
                <div>Model: U-Net + ResNet</div>
                <div>Conf: 94.2%</div>
                <div>Area: 4.8 km²</div>
                <div>Lat: 13.245° N</div>
              </div>
            </motion.div>
          )}

          {demoState >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border border-accent/20 rounded bg-accent/5 space-y-2"
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-accent font-bold">DRIFT HINDCAST</span>
                <span className="text-foreground/60">08:41 UTC</span>
              </div>
              <p className="text-sm">Backward simulation via OpenDrift complete. Origin probability zone established.</p>
              <div className="text-xs font-mono text-foreground/80">
                <div>Release Window: 07:42–08:18 UTC</div>
                <div>Center: 13.201° N, 80.121° E</div>
              </div>
            </motion.div>
          )}

          {demoState >= 7 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border border-warning/20 rounded bg-warning/5 space-y-2"
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-warning font-bold flex items-center gap-1">
                  <Anchor className="w-3 h-3" /> AIS CORRELATION
                </span>
                <span className="text-foreground/60">08:44 UTC</span>
              </div>
              <p className="text-sm">27 vessels analyzed. 4 candidates intersect origin zone.</p>
              
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-xs p-1 bg-white/5 rounded border border-warning/30">
                  <span>VESSEL ALPHA</span>
                  <span className="text-warning">91/100</span>
                </div>
                <div className="flex justify-between text-xs p-1 bg-white/5 rounded opacity-60">
                  <span>VESSEL BRAVO</span>
                  <span>64/100</span>
                </div>
              </div>
            </motion.div>
          )}

          {demoState >= 8 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border border-success/20 rounded bg-success/5 space-y-2"
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-success font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> EVIDENCE FUSION
                </span>
                <span className="text-foreground/60">08:50 UTC</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span>Spatial proximity</span>
                  <span className="text-success">92</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-success h-full w-[92%]" />
                </div>
                
                <div className="flex justify-between pt-1">
                  <span>Counterfactual similarity</span>
                  <span className="text-success">87</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-success h-full w-[87%]" />
                </div>
                
                <div className="flex justify-between pt-1">
                  <span className="text-warning">AIS anomaly (GAP)</span>
                  <span className="text-warning">70</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-warning h-full w-[70%]" />
                </div>
              </div>
            </motion.div>
          )}

          {demoState >= 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 border-l-4 border-danger rounded bg-danger/10 space-y-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <div className="flex justify-between items-center text-xs font-mono text-danger font-bold">
                <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> HIGH-PRIORITY ALERT</span>
              </div>
              <p className="text-sm font-medium">Incident OIL-2026-024</p>
              <p className="text-xs text-foreground/80">Vessel Alpha identified as primary investigation candidate. Evidence score: 91/100.</p>
              <button className="w-full py-1.5 mt-2 bg-danger/20 hover:bg-danger/30 text-danger border border-danger/40 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2">
                <FileText className="w-3 h-3" />
                GENERATE AI REPORT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {demoState === 0 && (
          <div className="h-48 flex items-center justify-center text-foreground/40 text-xs font-mono text-center border border-dashed border-white/10 rounded">
            WAITING FOR INVESTIGATION<br/>INITIALIZATION...
          </div>
        )}
      </div>
    </div>
  );
}
