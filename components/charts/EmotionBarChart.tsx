"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { EmotionDataPoint } from "../../types";

interface EmotionBarChartProps {
  data: EmotionDataPoint[] | null | undefined;
}

const EMOTION_COLORS: Record<string, string> = {
  Joy: "#fbbf24",      // amber-400
  Anger: "#ef4444",    // red-500
  Fear: "#8b5cf6",     // violet-500
  Sadness: "#3b82f6",  // blue-500
  Surprise: "#ec4899", // pink-500
  Disgust: "#10b981",  // emerald-500
  Neutral: "#6b7280"   // gray-500
};

interface TooltipPayloadItem {
  emotion: string;
  percentage: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TooltipPayloadItem }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = EMOTION_COLORS[data.emotion] || "#6366f1";
    return (
      <div className="rounded-xl border border-card-border bg-card p-3 shadow-md">
        <p className="text-xs font-semibold text-gray-400">Emotion: {data.emotion}</p>
        <p className="text-lg font-bold" style={{ color }}>
          {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

export default function EmotionBarChart({ data }: EmotionBarChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-card rounded-2xl border border-card-border">
        <div className="h-10 w-10 border-4 border-gray-800 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-card-border bg-card p-6 shadow-lg shadow-black/10 flex flex-col justify-between min-h-[340px]">
        <h3 className="font-display text-lg font-bold tracking-wide text-white mb-4">
          Emotion Analysis
        </h3>
        <div className="flex flex-grow items-center justify-center text-sm text-gray-500 py-12">
          Emotion distribution unavailable.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 shadow-lg shadow-black/10">
      <h3 className="font-display text-lg font-bold tracking-wide text-white mb-4">
        Emotion Analysis
      </h3>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="emotion"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(31, 41, 55, 0.4)", radius: 8 }} />
            <Bar dataKey="percentage" radius={[8, 8, 0, 0]} maxBarSize={45}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={EMOTION_COLORS[entry.emotion] || "#6366f1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
