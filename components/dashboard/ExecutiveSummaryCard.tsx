import React from "react";
import { Sparkles, History, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { AIInsights } from "../../types";

interface ExecutiveSummaryCardProps {
  insights: AIInsights;
  topic: string;
}

export default function ExecutiveSummaryCard({ insights, topic }: ExecutiveSummaryCardProps) {
  if (!insights || !insights.summary) {
    return null;
  }

  return (
    <div className="glass-card p-6 flex flex-col justify-between min-h-[300px]">
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>
              auto_awesome
            </span>
            <h3 className="font-headline-md text-base font-extrabold text-on-surface">Executive Summary</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-extrabold tracking-wider uppercase">
            AI Generated
          </span>
        </div>

        {/* Summary text */}
        <div className="prose prose-slate max-w-none text-on-surface-variant font-medium text-xs leading-relaxed">
          {/* Inject keyword context dynamically */}
          {insights.summary.toLowerCase().includes(topic.toLowerCase()) ? (
            <p>{insights.summary}</p>
          ) : (
            <p>
              The conversation around <strong className="text-on-surface">"{topic}"</strong> is summarized below.{" "}
              {insights.summary}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-5 border-t border-outline/10 mt-6 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/60 font-semibold">
          <span className="material-symbols-outlined text-sm font-bold">cycle</span>
          Last updated: Just now
        </div>
        <div className="flex gap-1.5">
          <button className="w-8 h-8 rounded flex items-center justify-center bg-surface-container-high/40 hover:bg-surface-container-high text-on-surface-variant cursor-pointer transition-colors border border-card-border/30">
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button className="w-8 h-8 rounded flex items-center justify-center bg-surface-container-high/40 hover:bg-surface-container-high text-on-surface-variant cursor-pointer transition-colors border border-card-border/30">
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
          <button className="w-8 h-8 rounded flex items-center justify-center bg-surface-container-high/40 hover:bg-surface-container-high text-on-surface-variant cursor-pointer transition-colors border border-card-border/30">
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
