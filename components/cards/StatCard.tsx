"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { StatMetric } from "../../types";

const getIconName = (type: string) => {
  switch (type) {
    case "posts": return "forum";
    case "positive": return "sentiment_very_satisfied";
    case "negative": return "sentiment_very_dissatisfied";
    case "neutral": return "sentiment_neutral";
    case "likes": return "thumb_up";
    case "author": return "person";
    default: return "forum";
  }
};

const getBorderLeftClass = (type: string) => {
  switch (type) {
    case "posts": return "border-l-4 border-l-primary";
    case "positive": return "border-l-4 border-l-tertiary";
    case "negative": return "border-l-4 border-l-error";
    case "neutral": return "border-l-4 border-l-secondary";
    case "likes": return "border-l-4 border-l-secondary";
    case "author": return "border-l-4 border-l-primary";
    default: return "border-l-4 border-l-primary";
  }
};

const getBadgeStyles = (type: string) => {
  switch (type) {
    case "posts": return "bg-primary/5 text-primary";
    case "positive": return "bg-tertiary/10 text-tertiary";
    case "negative": return "bg-primary-container/10 text-primary";
    case "neutral": return "bg-secondary-container/30 text-secondary";
    case "likes": return "bg-secondary-container text-on-secondary-container";
    case "author": return "bg-primary/5 text-primary";
    default: return "bg-primary/5 text-primary";
  }
};

export default function StatCard({ title, value, change, trend, type }: StatMetric) {
  const [displayValue, setDisplayValue] = useState(() => {
    const rawNumStr = typeof value === "number" ? String(value) : String(value || "").replace(/[^0-9.]/g, "");
    const target = parseFloat(rawNumStr);
    return isNaN(target) ? String(value || "") : "0";
  });

  useEffect(() => {
    const isPercent = typeof value === "string" && value.includes("%");
    const rawNumStr = typeof value === "number" ? String(value) : String(value || "").replace(/[^0-9.]/g, "");
    const target = parseFloat(rawNumStr);

    if (isNaN(target)) {
      setDisplayValue(String(value || ""));
      return;
    }

    let start = 0;
    const duration = 1000; // 1s animation
    const steps = 50;
    const stepTime = duration / steps;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        if (isPercent) {
          setDisplayValue(`${target.toFixed(1).replace(".0", "")}%`);
        } else {
          setDisplayValue(target >= 1000 ? target.toLocaleString() : String(Math.round(target)));
        }
      } else {
        const currentVal = start;
        if (isPercent) {
          setDisplayValue(`${currentVal.toFixed(1).replace(".0", "")}%`);
        } else {
          setDisplayValue(currentVal >= 1000 ? Math.round(currentVal).toLocaleString() : String(Math.round(currentVal)));
        }
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const isUp = trend === "up";
  const isDown = trend === "down";

  // Safeguard values for top authors that aren't numeric
  const isNumeric = !isNaN(parseFloat(String(value).replace(/[^0-9.]/g, "")));

  return (
    <div className={`glass-card p-5 flex flex-col justify-between ${getBorderLeftClass(type)}`}>
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBadgeStyles(type)}`}>
          <span 
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            {getIconName(type)}
          </span>
        </div>

        {/* Change Indicators */}
        {isNumeric && (
          <div className={`flex items-center font-bold text-xs uppercase tracking-wide gap-0.5 ${
            isUp ? "text-tertiary" : isDown ? "text-primary" : "text-on-surface-variant/70"
          }`}>
            <span className="material-symbols-outlined text-sm font-black">
              {isUp ? "trending_up" : isDown ? "trending_down" : "trending_flat"}
            </span> 
            {change.split(" ")[0]}
          </div>
        )}
      </div>

      <div className="mt-4.5">
        <h4 className="text-on-surface-variant text-[11px] font-extrabold uppercase tracking-widest truncate">
          {title}
        </h4>
        <p className={`font-black text-on-surface tracking-tight mt-1 truncate ${
          type === "author" ? "text-base font-bold" : "text-3xl font-extrabold"
        }`}>
          {type === "author" ? String(value) : displayValue}
        </p>
        <p className="text-[10px] text-on-surface-variant/60 font-semibold mt-0.5">
          {change.substring(change.indexOf(" ") + 1)}
        </p>
      </div>
    </div>
  );
}
