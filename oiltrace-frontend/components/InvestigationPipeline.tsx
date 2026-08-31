"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type PipelineStage = {
  id: string;
  name: string;
  status: "pending" | "processing" | "complete";
  details: string[];
};

interface InvestigationPipelineProps {
  stages: PipelineStage[];
}

export function InvestigationPipeline({ stages }: InvestigationPipelineProps) {
  return (
    <div className="flex gap-2 overflow-x-auto p-2 scrollbar-hide">
      {stages.map((stage, index) => {
        const isComplete = stage.status === "complete";
        const isProcessing = stage.status === "processing";
        const isPending = stage.status === "pending";

        return (
          <div
            key={stage.id}
            className={cn(
              "flex-shrink-0 w-64 glass-panel p-3 border-t-2 relative flex flex-col gap-2 transition-all duration-300",
              isComplete ? "border-t-success opacity-100" : isProcessing ? "border-t-primary opacity-100 bg-primary/5" : "border-t-white/10 opacity-50"
            )}
          >
            {isProcessing && (
              <motion.div
                layoutId="active-stage"
                className="absolute inset-0 bg-primary/5 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-mono opacity-60">0{index + 1}</span>
              {isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : isProcessing ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <CircleDashed className="w-4 h-4 text-foreground/30" />
              )}
            </div>
            
            <h3 className={cn("text-xs font-bold uppercase tracking-wider", isProcessing && "text-primary")}>
              {stage.name}
            </h3>
            
            <div className="mt-auto pt-2 space-y-1">
              {stage.status !== "pending" && stage.details.map((detail, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-[10px] font-mono text-foreground/80 leading-tight"
                >
                  {detail}
                </motion.p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
