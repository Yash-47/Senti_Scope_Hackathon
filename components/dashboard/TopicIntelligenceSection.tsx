import React from "react";
import TopicIntelligenceCard from "./TopicIntelligenceCard";
import { TopicIntelligence } from "../../types";

interface TopicIntelligenceSectionProps {
  topicIntelligence?: TopicIntelligence[];
}

export default function TopicIntelligenceSection({ topicIntelligence }: TopicIntelligenceSectionProps) {
  if (!topicIntelligence || topicIntelligence.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <span className="text-xs text-on-surface-variant uppercase font-extrabold tracking-widest block opacity-70">
        Topic Intelligence Dashboard
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topicIntelligence.map((ti, idx) => (
          <TopicIntelligenceCard key={idx} data={ti} />
        ))}
      </div>
    </div>
  );
}
