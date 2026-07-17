import React, { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BackendInsight } from "../../types";

interface BusinessInsightCardProps {
  insight: BackendInsight;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "sentiment": return "trending_down";
    case "emotion": return "mood_bad";
    case "volume": return "query_stats";
    case "engagement": return "recommend";
    default: return "award";
  }
};

const getInsightStyle = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "critical":
    case "high":
      return "border-primary/20 bg-primary/5 text-primary";
    case "medium":
      return "border-tertiary/20 bg-tertiary/5 text-tertiary";
    case "low":
    default:
      return "border-outline/20 bg-surface text-on-surface-variant";
  }
};

const getPriorityBadgeStyle = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "critical":
    case "high":
      return "bg-primary/10 text-primary";
    case "medium":
      return "bg-secondary-container text-on-secondary-container";
    case "low":
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function BusinessInsightCard({ insight }: BusinessInsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`p-4.5 rounded-xl border flex gap-4 items-start hover:shadow-md transition-shadow duration-200 ${
      getInsightStyle(insight.priority)
    }`}>
      {/* Icon Badge */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
        insight.priority.toLowerCase() === "high" || insight.priority.toLowerCase() === "critical"
          ? "bg-primary text-white shadow-sm"
          : insight.priority.toLowerCase() === "medium"
            ? "bg-tertiary text-white shadow-sm"
            : "bg-on-surface-variant/10 text-on-surface-variant"
      }`}>
        <span 
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          {getCategoryIcon(insight.category)}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1.5 gap-2">
          <h4 className="font-extrabold text-on-surface text-sm truncate">{insight.title}</h4>
          <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase shrink-0 tracking-wider ${
            getPriorityBadgeStyle(insight.priority)
          }`}>
            {insight.priority} Priority
          </span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-3.5 font-semibold">
          {insight.description}
        </p>

        {/* Supporting metrics */}
        {insight.supportingMetrics && insight.supportingMetrics.length > 0 && (
          <div className="flex flex-wrap gap-4 border-t border-outline/10 pt-3.5">
            {insight.supportingMetrics.map((sm, idx) => (
              <div key={idx}>
                <p className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider opacity-60">
                  {sm.label}
                </p>
                <p className="font-black text-on-surface text-sm mt-0.5">
                  {sm.value}{sm.unit || ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Expandable Evidence posts */}
        {insight.evidence && insight.evidence.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-[10px] font-black uppercase text-primary hover:underline focus:outline-none cursor-pointer"
            >
              {isExpanded ? "Hide evidence" : `Show evidence (${insight.evidence.length})`}
              <ChevronDown className={`ml-0.5 h-3.5 w-3.5 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mt-2.5 pt-2 border-l-2 border-primary/20 pl-2.5">
                    {insight.evidence.map((ev, idx) => (
                      <div key={idx} className="bg-gray-100/60 rounded border border-card-border/40 p-2 space-y-1">
                        <div className="flex items-center justify-between text-[9px] text-on-surface-variant/70">
                          <span className="font-extrabold text-on-surface-variant">{ev.author}</span>
                          <span className="font-bold">{Math.round(ev.confidence * 100)}% accuracy</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant/90 italic leading-snug font-semibold">
                          "{ev.text}"
                        </p>
                        {ev.url && (
                          <div className="flex justify-end">
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-[9px] text-primary hover:underline gap-0.5"
                            >
                              View on Bluesky
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
