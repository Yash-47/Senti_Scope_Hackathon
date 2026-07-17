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
      <div className="rounded-xl border border-card-border bg-card p-3 shadow-md">
        <p className="text-xs font-semibold text-gray-400">{data.name}</p>
        <p className="text-lg font-bold" style={{ color: data.color || "#fff" }}>
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
    <div className="flex justify-center space-x-6 pt-2">
      {payload.map((entry, index) => {
        const { value, color, payload: rawPayload } = entry;
        return (
          <div key={`item-${index}`} className="flex items-center space-x-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-semibold text-gray-300">{value}</span>
            <span className="text-xs text-gray-500">({rawPayload.value}%)</span>
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
        <div className="h-32 w-32 rounded-full border-8 border-gray-800 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 shadow-lg shadow-black/10">
      <h3 className="font-display text-lg font-bold tracking-wide text-white mb-4">
        Sentiment Distribution
      </h3>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0b0f19" strokeWidth={2} />
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
