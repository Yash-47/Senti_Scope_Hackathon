import React from "react";
import { Info } from "lucide-react";
import { RiskAssessment } from "../../types";

interface DiscussionHealthCardProps {
  riskAssessment: RiskAssessment;
}

export default function DiscussionHealthCard({ riskAssessment }: DiscussionHealthCardProps) {
  const riskScore = riskAssessment.riskScore;
  const healthScore = Math.max(0, 100 - riskScore);
  const riskLevel = riskAssessment.riskLevel.toLowerCase();

  // Map health classes
  const getHealthBadge = (score: number) => {
    if (score >= 75) {
      return { label: "Healthy", bg: "bg-emerald-500", text: "text-white" };
    } else if (score >= 50) {
      return { label: "Mixed", bg: "bg-amber-500", text: "text-white" };
    } else if (score >= 25) {
      return { label: "Weak", bg: "bg-indigo-500", text: "text-white" };
    } else {
      return { label: "Critical", bg: "bg-primary", text: "text-white" };
    }
  };

  const badge = getHealthBadge(healthScore);

  // SVG calculations for circular progress (desktop)
  const radius = 110;
  const circumference = 2 * Math.PI * radius; // ~691.15
  const strokeOffset = circumference - (circumference * healthScore) / 100;

  // SVG calculations for semi-circle path (mobile)
  // Standard semi-circle stroke-dasharray is ~125
  const semiCircumference = 125;
  const semiStrokeOffset = semiCircumference - (semiCircumference * healthScore) / 100;

  return (
    <>
      {/* 1. Desktop Discussion Health Gauge (Visible on md and larger) */}
      <div className="lg:col-span-4 glass-card p-6 md:flex hidden flex-col items-center justify-between min-h-[380px]">
        <div className="w-full flex justify-between items-center">
          <h3 className="font-headline-md text-base font-extrabold text-on-surface">Overall Discussion Health</h3>
          <Info className="h-4.5 w-4.5 text-on-surface-variant/60 cursor-help" />
        </div>

        {/* Circular Gauge */}
        <div className="relative w-56 h-56 flex items-center justify-center my-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-surface-container-highest/60"
              cx="112"
              cy="112"
              fill="transparent"
              r={radius}
              stroke="currentColor"
              strokeWidth="14"
            />
            <circle
              className="transition-all duration-1000 ease-out"
              cx="112"
              cy="112"
              fill="transparent"
              r={radius}
              stroke="url(#health-gradient)"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="health-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#b90014" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-5xl font-black text-primary">{healthScore}</span>
            <span className="text-on-surface-variant/50 font-bold text-xs">/100</span>
            <div className={`mt-3 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${badge.bg} ${badge.text}`}>
              {badge.label}
            </div>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant text-center max-w-[280px] leading-relaxed font-semibold">
          {riskAssessment.reason}
        </p>
      </div>

      {/* 2. Mobile Discussion Health Gauge (Visible on mobile/tablet) */}
      <section className="glass-card p-6 rounded-3xl md:hidden flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline-md text-base font-extrabold text-on-surface">Discussion Health</h3>
          <Info className="h-4.5 w-4.5 text-on-surface-variant/60" />
        </div>

        {/* Semi-circular Gauge */}
        <div className="relative w-48 h-24 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#e5eeff"
              strokeLinecap="round"
              strokeWidth="10"
            />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#gauge-gradient)"
              strokeDasharray={semiCircumference}
              strokeDashoffset={semiStrokeOffset}
              strokeLinecap="round"
              strokeWidth="10"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b90014" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-x-0 bottom-0 text-center flex flex-col items-center">
            <p className="font-display text-2xl font-black leading-none text-on-surface">
              {healthScore}
              <span className="text-[11px] font-bold text-on-surface-variant/60">/100</span>
            </p>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant text-center px-4 font-semibold leading-relaxed">
          {riskAssessment.reason}
        </p>
      </section>
    </>
  );
}
