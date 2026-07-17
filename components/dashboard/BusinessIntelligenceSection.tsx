import React, { useState } from "react";
import { 
  ShieldAlert, 
  ChevronDown, 
  ExternalLink, 
  Zap, 
  TrendingUp, 
  Smile, 
  MessageSquare, 
  Award,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BusinessIntelligence, TopicIntelligence, BackendInsight } from "../../types";

interface BusinessIntelligenceSectionProps {
  topicIntelligence?: TopicIntelligence[];
  businessIntelligence?: BusinessIntelligence;
}

export default function BusinessIntelligenceSection({
  topicIntelligence,
  businessIntelligence
}: BusinessIntelligenceSectionProps) {
  const [expandedInsights, setExpandedInsights] = useState<Record<string, boolean>>({});

  const toggleInsight = (id: string) => {
    setExpandedInsights((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!businessIntelligence || !businessIntelligence.riskAssessment) {
    return null;
  }

  const { riskAssessment, insights } = businessIntelligence;

  // Helpers for styling
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical": return "text-rose-400 border-rose-500/20 bg-rose-500/10";
      case "high": return "text-amber-400 border-amber-500/20 bg-amber-500/10";
      case "medium": return "text-indigo-400 border-indigo-500/20 bg-indigo-500/10";
      case "low":
      default:
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical": return "text-rose-400 border-rose-500/25 bg-rose-500/10";
      case "high": return "text-amber-400 border-amber-500/25 bg-amber-500/10";
      case "medium": return "text-indigo-400 border-indigo-500/25 bg-indigo-500/10";
      case "low":
      default:
        return "text-gray-400 border-gray-500/25 bg-gray-500/10";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "sentiment": return <Smile className="h-4 w-4 text-emerald-400" />;
      case "emotion": return <Zap className="h-4 w-4 text-indigo-400" />;
      case "volume": return <MessageSquare className="h-4 w-4 text-sky-400" />;
      case "engagement": return <TrendingUp className="h-4 w-4 text-pink-400" />;
      case "risk": return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      default: return <Award className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-card-border pb-4">
        <h2 className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Award className="h-5.5 w-5.5 text-indigo-400" />
          Business Intelligence Suite
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Structured deterministic observations and risk assessments computed directly from live analytics streams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Risk Assessment Premium Card */}
        <div className="lg:col-span-1 rounded-2xl border border-card-border bg-card p-6 shadow-lg shadow-black/10 flex flex-col justify-between hover:border-indigo-500/25 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Risk Profile</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getRiskColor(riskAssessment.riskLevel)}`}>
                {riskAssessment.riskLevel} Risk
              </span>
            </div>

            {/* Premium Circular Gauge */}
            <div className="flex justify-center items-center py-4 relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  className="stroke-gray-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  className={`transition-all duration-1000 ${
                    riskAssessment.riskScore >= 75 ? "stroke-rose-500" :
                    riskAssessment.riskScore >= 50 ? "stroke-amber-500" :
                    riskAssessment.riskScore >= 25 ? "stroke-indigo-500" : "stroke-emerald-500"
                  }`}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={402}
                  strokeDashoffset={402 - (402 * riskAssessment.riskScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">{riskAssessment.riskScore}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Risk Score</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-indigo-400" />
                Assessment Reason
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {riskAssessment.reason}
              </p>
            </div>
          </div>

          {/* Risk Supporting Metrics */}
          <div className="border-t border-card-border/60 pt-4 mt-4 grid grid-cols-3 gap-2 text-center">
            {Object.entries(riskAssessment.supportingMetrics).map(([key, val]) => (
              <div key={key} className="bg-gray-900/40 border border-card-border/50 rounded-xl p-2.5">
                <span className="block text-[10px] text-gray-500 uppercase font-semibold tracking-wide truncate">
                  {key.replace("Percent", "").replace("posts", "Vol")}
                </span>
                <span className="block text-sm font-bold text-white mt-0.5">
                  {val}{key.includes("Percent") ? "%" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Business Insights Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Top Structured Insights</span>
            <span className="text-xs text-gray-400">Sorted by importance score</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div 
                key={insight.id}
                className="rounded-xl border border-card-border bg-card/90 p-4.5 flex flex-col justify-between hover:border-gray-800 transition-all shadow-md shadow-black/5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {getCategoryIcon(insight.category)}
                      {insight.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-gray-500">Imp: {insight.importanceScore}</span>
                      <span className={`px-2 py-0.25 rounded text-[9px] font-extrabold uppercase border ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{insight.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-normal font-medium">{insight.description}</p>
                  </div>
                </div>

                {/* Supporting metrics & Collapsible evidence */}
                <div className="mt-4 border-t border-card-border/40 pt-3.5 space-y-3">
                  {/* Supporting Metrics Pills */}
                  {insight.supportingMetrics && insight.supportingMetrics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {insight.supportingMetrics.map((sm, smIdx) => (
                        <div key={smIdx} className="rounded bg-gray-900 border border-card-border/50 px-2 py-1 flex items-center gap-1">
                          <span className="text-[9px] font-bold text-gray-500">{sm.label}:</span>
                          <span className="text-[10px] font-extrabold text-white">
                            {sm.value}{sm.unit || ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Collapsible Evidence */}
                  {insight.evidence && insight.evidence.length > 0 && (
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleInsight(insight.id)}
                        className="flex items-center text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
                      >
                        {expandedInsights[insight.id] ? "Hide Evidence" : `Supporting Evidence (${insight.evidence.length})`}
                        <ChevronDown className={`ml-0.5 h-3.5 w-3.5 transform transition-transform duration-200 ${expandedInsights[insight.id] ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {expandedInsights[insight.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2 pt-1 border-l-2 border-indigo-500/20 pl-2">
                              {insight.evidence.map((ev, evIdx) => (
                                <div key={evIdx} className="bg-gray-900/60 rounded border border-card-border p-2 space-y-1">
                                  <div className="flex items-center justify-between text-[9px] text-gray-500">
                                    <span className="font-semibold text-gray-400">{ev.author}</span>
                                    <span>{Math.round(ev.confidence * 100)}% conf</span>
                                  </div>
                                  <p className="text-[11px] text-gray-300 italic leading-snug font-medium">"{ev.text}"</p>
                                  {ev.url && (
                                    <div className="flex justify-end">
                                      <a
                                        href={ev.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-[9px] text-indigo-400 hover:underline gap-0.5"
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
            ))}
          </div>
        </div>
      </div>

      {/* 3. Topic Intelligence Section */}
      {topicIntelligence && topicIntelligence.length > 0 && (
        <div className="space-y-4 pt-2">
          <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block">Topic Intelligence Dashboard</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicIntelligence.map((ti, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-card-border bg-card/85 p-4.5 hover:border-gray-800 transition-colors shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-white bg-indigo-500/5 px-2.5 py-0.5 rounded border border-indigo-500/15">
                      #{ti.topic.toLowerCase()}
                    </span>
                    <span className={`px-2 py-0.25 rounded text-[9px] font-extrabold uppercase border ${getPriorityColor(ti.priority)}`}>
                      {ti.priority} Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-b border-card-border/40 pb-3">
                    <div>
                      <span className="text-gray-500 block">Mentions</span>
                      <strong className="text-white text-sm font-extrabold mt-0.5 block">{ti.mentions} posts</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Engagement</span>
                      <strong className="text-white text-sm font-extrabold mt-0.5 block">{ti.engagementScore}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[10px]">
                  <div className="bg-gray-900/40 rounded p-1.5 border border-card-border/40">
                    <span className="text-gray-500 block truncate">Sentiment</span>
                    <span className={`block font-bold mt-0.5 capitalize ${
                      ti.averageSentiment.toLowerCase() === "positive" ? "text-emerald-400" :
                      ti.averageSentiment.toLowerCase() === "negative" ? "text-rose-400" : "text-gray-400"
                    }`}>
                      {ti.averageSentiment}
                    </span>
                  </div>
                  <div className="bg-gray-900/40 rounded p-1.5 border border-card-border/40">
                    <span className="text-gray-500 block truncate">Emotion</span>
                    <span className="text-indigo-400 font-bold block mt-0.5 truncate">{ti.dominantEmotion}</span>
                  </div>
                  <div className="bg-gray-900/40 rounded p-1.5 border border-card-border/40">
                    <span className="text-gray-500 block truncate">Accuracy</span>
                    <span className="text-white font-bold block mt-0.5">{Math.round(ti.averageConfidence * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
