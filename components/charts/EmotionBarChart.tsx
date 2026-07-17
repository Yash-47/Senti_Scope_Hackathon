"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { EmotionDataPoint } from "../../types";

interface EmotionBarChartProps {
  data: EmotionDataPoint[] | null | undefined;
}

const EMOTION_COLORS: Record<string, string> = {
  Joy: "#006847",       // SentiScope Stitch emerald green
  Anger: "#b90014",     // SentiScope Stitch brand red
  Fear: "#e31b23",      // SentiScope Stitch primary container red
  Sadness: "#565e74",   // SentiScope Stitch slate gray
  Surprise: "#dae2fd",  // SentiScope Stitch secondary container
  Disgust: "#00845a",   // SentiScope Stitch tertiary container
  Neutral: "#bec6e0"    // SentiScope Stitch secondary fixed dim
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
    const color = EMOTION_COLORS[data.emotion] || "#b90014";
    return (
      <div className="rounded-xl border border-card-border/10 bg-white/95 p-3 shadow-md">
        <p className="text-xs font-semibold text-on-surface-variant">Emotion: {data.emotion}</p>
        <p className="text-lg font-black" style={{ color }}>
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
      <div className="flex h-64 w-full items-center justify-center bg-card rounded-2xl border border-card-border/10">
        <div className="h-10 w-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col justify-between min-h-[300px]">
        <h3 className="font-headline-md text-base font-extrabold text-on-surface mb-4">
          Emotion Analysis
        </h3>
        <div className="flex flex-grow items-center justify-center text-xs text-on-surface-variant/60 font-semibold py-12">
          Emotion distribution unavailable.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="font-headline-md text-base font-extrabold text-on-surface mb-4">
        Emotion Analysis
      </h3>
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
            <XAxis
              dataKey="emotion"
              stroke="#565e74"
              fontSize={11}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#565e74"
              fontSize={11}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.02)", radius: 8 }} />
            <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={EMOTION_COLORS[entry.emotion] || "#b90014"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
