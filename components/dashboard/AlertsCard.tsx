import React from "react";
import { AlertTriangle, Bell, CheckCircle, Flame, AlertCircle } from "lucide-react";
import { BackendAlert } from "../../types";

interface AlertsCardProps {
  alerts: BackendAlert[];
}

const getPriorityStyles = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    case "medium":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "low":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "danger":
      return <Flame className="h-4 w-4 text-rose-400" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    case "success":
      return <CheckCircle className="h-4 w-4 text-emerald-400" />;
    case "info":
    default:
      return <AlertCircle className="h-4 w-4 text-indigo-400" />;
  }
};

export default function AlertsCard({ alerts }: AlertsCardProps) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 shadow-lg shadow-black/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Bell className="h-4.5 w-4.5" />
          </div>
          <h3 className="font-display text-lg font-bold tracking-wide text-white">
            Detected Alerts
          </h3>
        </div>
        <span className="rounded-full bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 text-xs font-semibold text-rose-400 animate-pulse">
          Live stream active
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3.5">
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No critical alerts detected in this period.</p>
        ) : (
          alerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-card-border bg-card-hover/45 p-4 hover:border-gray-800 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 rounded-lg bg-gray-900 border border-card-border p-1.5 flex items-center justify-center">
                  {getIcon(alert.type)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-normal">{alert.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:self-center">
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityStyles(
                    alert.priority
                  )}`}
                >
                  {alert.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
