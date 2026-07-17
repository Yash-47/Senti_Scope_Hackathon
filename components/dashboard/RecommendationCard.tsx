import React from "react";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const isHigh = recommendation.priority.toLowerCase() === "high";

  return (
    <div className="p-4 rounded-xl bg-surface hover:bg-primary/5 transition-all duration-200 border border-outline/10 group cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
          campaign
        </span>
        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
          isHigh ? "bg-primary/15 text-primary" : "bg-secondary-container text-on-secondary-container"
        }`}>
          {recommendation.priority} Priority
        </span>
      </div>
      <h4 className="font-extrabold text-on-surface text-xs sm:text-sm mb-1">
        {recommendation.title}
      </h4>
      <p className="text-[11px] text-on-surface-variant/80 font-semibold leading-relaxed">
        {recommendation.description}
      </p>
    </div>
  );
}
