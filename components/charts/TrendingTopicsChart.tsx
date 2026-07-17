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
        ? "text-emerald-600"
        : data.sentimentScore >= 40
        ? "text-on-surface-variant"
        : "text-rose-600";
    return (
      <div className="rounded-xl border border-card-border/10 bg-white/95 p-3 shadow-md">
        <p className="text-xs font-semibold text-on-surface-variant">Topic: {data.topic}</p>
        <p className="text-sm font-bold text-on-surface mt-1">
          Volume: <span className="text-primary">{data.count} posts</span>
        </p>
        <p className="text-xs font-medium mt-0.5">
          Sentiment Score: <span className={`${scoreColor} font-black`}>{data.sentimentScore}% Positive</span>
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
      <div className="flex h-[300px] w-full items-center justify-center bg-card rounded-2xl border border-card-border/10">
        <div className="h-10 w-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-headline-md text-base font-extrabold text-on-surface">
            Trending Sub-Topics & Keywords
          </h3>
          <p className="text-xs text-on-surface-variant/70 mt-0.5 font-semibold">
            Frequency count and associated public sentiment breakdown
          </p>
        </div>
      </div>
      <div className="h-[250px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-on-surface-variant/60 font-semibold">
            No trending sub-topics detected for this query.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" horizontal={false} />
              <XAxis
                type="number"
                stroke="#565e74"
                fontSize={11}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="topic"
                type="category"
                stroke="#0b1c30"
                fontSize={11}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.02)", radius: 6 }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
                {data.map((entry, index) => {
                  const color =
                    entry.sentimentScore >= 70
                      ? "rgba(0, 104, 71, 0.85)" // positive emerald
                      : entry.sentimentScore >= 40
                      ? "rgba(86, 94, 116, 0.85)" // neutral slate gray
                      : "rgba(185, 0, 20, 0.85)";  // negative brand red
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
