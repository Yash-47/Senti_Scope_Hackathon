import React from "react";
import { ArrowRight } from "lucide-react";
import BusinessInsightCard from "./BusinessInsightCard";
import { BackendInsight } from "../../types";

interface BusinessInsightsSectionProps {
  insights: BackendInsight[];
}

export default function BusinessInsightsSection({ insights }: BusinessInsightsSectionProps) {
  if (!insights || insights.length === 0) {
    return null;
  }

  // Filter out any risk insights since they are rendered separately in the Health Card
  const activeInsights = insights.filter(ins => ins.id !== "risk_insight");

  return (
    <div className="glass-card p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-base font-extrabold text-on-surface">AI Business Insights</h3>
        <button className="text-primary font-bold flex items-center gap-1 text-xs hover:underline cursor-pointer">
          View All Insights 
          <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeInsights.map((insight) => (
          <BusinessInsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}
