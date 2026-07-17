"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { SentimentDataPoint } from "../../types";

interface SentimentPieChartProps {
  data: SentimentDataPoint[];
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  payload: SentimentDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-card-border/10 bg-white/95 p-3 shadow-md">
        <p className="text-xs font-semibold text-on-surface-variant">{data.name}</p>
        <p className="text-lg font-black" style={{ color: data.color || "#0b1c30" }}>
          {data.value}%
        </p>
      </div>
    );
  }
  return null;
};

interface LegendPayloadItem {
  value: string;
  color: string;
  payload: {
    value: number;
  };
}

interface CustomLegendProps {
  payload?: LegendPayloadItem[];
}

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;
  return (
    <div className="flex justify-center space-x-6 pt-4">
      {payload.map((entry, index) => {
        const { value, color, payload: rawPayload } = entry;
        return (
          <div key={`item-${index}`} className="flex items-center space-x-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-bold text-on-surface">{value}</span>
            <span className="text-xs text-on-surface-variant/70">({rawPayload.value}%)</span>
          </div>
        );
      })}
    </div>
  );
};

export default function SentimentPieChart({ data }: SentimentPieChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-10 w-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Adjust cell colors to match SentiScope-Stitch themes
  const adjustedData = data.map((item) => {
    const nameLower = item.name.toLowerCase();
    if (nameLower === "positive") {
      return { ...item, color: "#006847" }; // SentiScope Stitch emerald green
    } else if (nameLower === "negative") {
      return { ...item, color: "#b90014" }; // SentiScope Stitch brand red
    } else {
      return { ...item, color: "#565e74" }; // SentiScope Stitch slate gray
    }
  });

  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <h3 className="font-headline-md text-base font-extrabold text-on-surface mb-4">
        Sentiment Distribution
      </h3>
      <div className="h-[230px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={adjustedData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {adjustedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
