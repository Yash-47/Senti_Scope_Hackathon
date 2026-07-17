import React from "react";
import SentimentPieChart from "../charts/SentimentPieChart";
import EmotionBarChart from "../charts/EmotionBarChart";
import TrendingTopicsChart from "../charts/TrendingTopicsChart";
import { SentimentDataPoint, EmotionDataPoint, TrendingTopicPoint } from "../../types";

interface AnalyticsChartsProps {
  sentimentData: SentimentDataPoint[];
  emotionData: EmotionDataPoint[];
  trendingTopics: TrendingTopicPoint[];
}

export default function AnalyticsCharts({
  sentimentData,
  emotionData,
  trendingTopics,
}: AnalyticsChartsProps) {
  return (
    <div className="space-y-6">
      {/* Grid of Sentiment Pie & Emotion Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SentimentPieChart data={sentimentData} />
        </div>
        <div className="lg:col-span-2">
          <EmotionBarChart data={emotionData} />
        </div>
      </div>

      {/* Horizontal Trending Subtopics bar chart */}
      <TrendingTopicsChart data={trendingTopics} />
    </div>
  );
}
