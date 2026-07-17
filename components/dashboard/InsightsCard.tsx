import React from "react";
import { Sparkles, Lightbulb } from "lucide-react";
import { AIInsights } from "../../types";

interface InsightsCardProps {
  insights: AIInsights;
}

export default function InsightsCard({ insights }: InsightsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-card p-6 shadow-lg shadow-black/10">
      {/* Absolute glow element */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display text-lg font-bold tracking-wide text-white">
          AI Executive Summary
        </h3>
      </div>

      {/* Summary Content */}
      <div className="mt-5 text-gray-350 text-sm leading-relaxed">
        <p>{insights.summary}</p>
      </div>

      <div className="my-5 h-px bg-card-border" />

      {/* Actionable recommendation */}
      <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-4.5 flex items-start space-x-3">
        <div className="mt-0.5 text-indigo-400">
          <Lightbulb className="h-4.5 w-4.5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Business Recommendation
          </span>
          <p className="text-sm text-gray-300 leading-normal">
            {insights.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
