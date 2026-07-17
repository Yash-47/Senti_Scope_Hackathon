import React from "react";
import { BackendAlert } from "../../types";

interface AlertCardProps {
  alerts: BackendAlert[];
}

const getAlertBannerStyle = (type: string) => {
  const t = type.toLowerCase();
  if (t === "danger" || t === "critical") {
    return "bg-primary/5 border-l-4 border-primary text-primary";
  } else if (t === "warning" || t === "high") {
    return "bg-amber-500/5 border-l-4 border-amber-500 text-amber-600";
  } else {
    return "bg-tertiary/5 border-l-4 border-tertiary text-tertiary";
  }
};

const getAlertIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t === "danger" || t === "critical") {
    return "error";
  } else if (t === "warning" || t === "high") {
    return "warning";
  } else {
    return "bolt";
  }
};

const getPriorityBadgeStyle = (priority: string) => {
  const p = priority.toLowerCase();
  if (p === "high" || p === "critical") {
    return "bg-primary/20 text-primary";
  } else if (p === "medium") {
    return "bg-amber-100 text-amber-700";
  } else {
    return "bg-tertiary/20 text-tertiary";
  }
};

export default function AlertCard({ alerts }: AlertCardProps) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-6 w-full flex flex-col min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-base font-extrabold text-on-surface">Active Alerts</h3>
        <button className="text-primary font-bold text-xs hover:underline cursor-pointer">
          View All Alerts
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[220px] no-scrollbar">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-lg flex items-center gap-4 border border-card-border/10 ${
              getAlertBannerStyle(alert.type || alert.priority)
            }`}
          >
            <span 
              className="material-symbols-outlined text-2xl shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {getAlertIcon(alert.type || alert.priority)}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-on-surface truncate">{alert.title}</h4>
              <p className="text-[10px] text-on-surface-variant/80 font-semibold mt-0.5 leading-normal">
                {alert.description}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase shrink-0 ${
              getPriorityBadgeStyle(alert.priority)
            }`}>
              {alert.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
