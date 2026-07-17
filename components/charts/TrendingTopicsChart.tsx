"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingTopicPoint } from "../../types";

interface TrendingTopicsChartProps {
  data: TrendingTopicPoint[];
}

interface TooltipPayloadItem {
  topic: string;
  count: number;
  sentimentScore: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TooltipPayloadItem }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const scoreColor =
      data.sentimentScore >= 70
        ? "text-emerald-400"
        : data.sentimentScore >= 40
        ? "text-gray-400"
        : "text-rose-400";
    return (
      <div className="rounded-xl border border-card-border bg-card p-3 shadow-md">
        <p className="text-xs font-semibold text-gray-400">Topic: {data.topic}</p>
        <p className="text-sm font-bold text-white mt-1">
          Volume: <span className="text-indigo-400">{data.count} posts</span>
        </p>
        <p className="text-xs font-medium mt-0.5">
          Sentiment Score: <span className={`${scoreColor} font-bold`}>{data.sentimentScore}% Positive</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function TrendingTopicsChart({ data }: TrendingTopicsChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-[320px] w-full items-center justify-center bg-card rounded-2xl border border-card-border">
        <div className="h-10 w-10 border-4 border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 shadow-lg shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold tracking-wide text-white">
            Trending Sub-Topics & Keywords
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Frequency count and associated public sentiment breakdown
          </p>
        </div>
      </div>
      <div className="h-[280px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No trending sub-topics detected for this query.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis
                type="number"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="topic"
                type="category"
                stroke="#d1d5db"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(31, 41, 55, 0.4)", radius: 6 }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {data.map((entry, index) => {
                  // Color bar based on subtopic sentiment score
                  const color =
                    entry.sentimentScore >= 70
                      ? "rgba(16, 185, 129, 0.85)" // positive emerald
                      : entry.sentimentScore >= 40
                      ? "rgba(99, 102, 241, 0.85)" // neutral indigo/blue
                      : "rgba(244, 63, 94, 0.85)";  // negative rose
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
