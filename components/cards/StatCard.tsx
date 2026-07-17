"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Smile, Frown, AlertCircle, ArrowUpRight, ArrowDownRight, Heart, User } from "lucide-react";
import { StatMetric } from "../../types";

const getIcon = (type: string) => {
  switch (type) {
    case "posts":
      return <MessageSquare className="h-5 w-5 text-indigo-400" />;
    case "positive":
      return <Smile className="h-5 w-5 text-emerald-400" />;
    case "negative":
      return <Frown className="h-5 w-5 text-rose-400" />;
    case "neutral":
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
    case "likes":
      return <Heart className="h-5 w-5 text-pink-400" />;
    case "author":
      return <User className="h-5 w-5 text-amber-400" />;
    default:
      return <MessageSquare className="h-5 w-5 text-gray-400" />;
  }
};

const getBadgeStyles = (type: string) => {
  switch (type) {
    case "posts":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    case "positive":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "negative":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    case "neutral":
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    case "likes":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    case "author":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const getGlowStyles = (type: string) => {
  switch (type) {
    case "posts":
      return "hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.07)]";
    case "positive":
      return "hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.07)]";
    case "negative":
      return "hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.07)]";
    case "neutral":
      return "hover:border-gray-500/40 hover:shadow-[0_0_15px_rgba(107,114,128,0.07)]";
    case "likes":
      return "hover:border-pink-500/40 hover:shadow-[0_0_15px_rgba(236,72,153,0.07)]";
    case "author":
      return "hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.07)]";
    default:
      return "hover:border-gray-500/40";
  }
};

export default function StatCard({ title, value, change, trend, type }: StatMetric) {
  const [displayValue, setDisplayValue] = useState(() => {
    const rawNumStr = typeof value === "number" ? String(value) : String(value || "").replace(/[^0-9]/g, "");
    const target = parseInt(rawNumStr, 10);
    return isNaN(target) ? String(value || "") : "0";
  });

  useEffect(() => {
    // Parse the value to get numerical count and format
    const isPercent = typeof value === "string" && value.includes("%");
    const rawNumStr = typeof value === "number" ? String(value) : value.replace(/[^0-9]/g, "");
    const target = parseInt(rawNumStr, 10);

    if (isNaN(target)) {
      return;
    }

    let start = 0;
    const duration = 1200; // 1.2s animation
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        // Set final display value
        if (isPercent) {
          setDisplayValue(`${target}%`);
        } else {
          setDisplayValue(target.toLocaleString());
        }
      } else {
        const rounded = Math.floor(start);
        if (isPercent) {
          setDisplayValue(`${rounded}%`);
        } else {
          setDisplayValue(rounded.toLocaleString());
        }
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <div
      className={`rounded-2xl border border-card-border bg-card p-5 shadow-lg shadow-black/10 transition-all duration-300 ${getGlowStyles(
        type
      )}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide text-gray-400">{title}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${getBadgeStyles(type)}`}>
          {getIcon(type)}
        </div>
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 className="font-display text-3xl font-bold tracking-tight text-white">
          {displayValue}
        </h3>
        
        <div className="flex items-center space-x-1.5 text-xs">
          {isUp && (
            <span className="flex items-center font-medium text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              {change.split(" ")[0]}
            </span>
          )}
          {isDown && (
            <span className="flex items-center font-medium text-rose-400 bg-rose-500/5 border border-rose-500/10 px-1.5 py-0.5 rounded">
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
              {change.split(" ")[0]}
            </span>
          )}
          {!isUp && !isDown && (
            <span className="font-medium text-gray-500 bg-gray-500/5 border border-gray-500/10 px-1.5 py-0.5 rounded">
              {change.split(" ")[0]}
            </span>
          )}
          <span className="text-gray-500 font-normal">
            {change.substring(change.indexOf(" ") + 1)}
          </span>
        </div>
      </div>
    </div>
  );
}
