import React from "react";
import { TopicIntelligence } from "../../types";

interface TopicIntelligenceCardProps {
  data: TopicIntelligence;
}

const getPriorityBadgeStyle = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "critical": return "text-rose-600 border-rose-500/25 bg-rose-500/10";
    case "high": return "text-amber-600 border-amber-500/25 bg-amber-500/10";
    case "medium": return "text-indigo-600 border-indigo-500/25 bg-indigo-500/10";
    case "low":
    default:
      return "text-gray-500 border-gray-500/25 bg-gray-500/10";
  }
};

export default function TopicIntelligenceCard({ data }: TopicIntelligenceCardProps) {
  const { topic, mentions, averageSentiment, dominantEmotion, averageConfidence, engagementScore, priority } = data;

  return (
    <div className="rounded-xl border border-card-border bg-card/85 p-4.5 hover:border-gray-800 hover:scale-[1.01] transition-all shadow-sm flex flex-col justify-between">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-primary bg-primary/5 px-2.5 py-0.5 rounded border border-primary/15">
            #{topic.toLowerCase()}
          </span>
          <span className={`px-2 py-0.25 rounded text-[9px] font-extrabold uppercase border ${getPriorityBadgeStyle(priority)}`}>
            {priority} Priority
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs border-b border-card-border/40 pb-3 font-semibold text-on-surface-variant">
          <div>
            <span className="text-on-surface-variant/50 text-[10px] uppercase font-bold tracking-wider block">Mentions</span>
            <strong className="text-on-surface text-sm font-black mt-0.5 block">{mentions} posts</strong>
          </div>
          <div>
            <span className="text-on-surface-variant/50 text-[10px] uppercase font-bold tracking-wider block">Engagement</span>
            <strong className="text-on-surface text-sm font-black mt-0.5 block">{engagementScore}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3.5 text-center text-[10px]">
        <div className="bg-gray-100/40 rounded p-1.5 border border-card-border/40">
          <span className="text-on-surface-variant/50 block font-bold truncate">Sentiment</span>
          <span className={`block font-black mt-0.5 capitalize ${
            averageSentiment.toLowerCase() === "positive" ? "text-emerald-600" :
            averageSentiment.toLowerCase() === "negative" ? "text-rose-600" : "text-gray-500"
          }`}>
            {averageSentiment}
          </span>
        </div>
        <div className="bg-gray-100/40 rounded p-1.5 border border-card-border/40">
          <span className="text-on-surface-variant/50 block font-bold truncate">Emotion</span>
          <span className="text-indigo-600 font-black block mt-0.5 truncate">{dominantEmotion}</span>
        </div>
        <div className="bg-gray-100/40 rounded p-1.5 border border-card-border/40">
          <span className="text-on-surface-variant/50 block font-bold truncate">Accuracy</span>
          <span className="text-on-surface font-black block mt-0.5">{Math.round(averageConfidence * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
