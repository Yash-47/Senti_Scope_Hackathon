import React from "react";
import { ThumbsUp, ThumbsDown, ArrowUpRight, MessageSquare } from "lucide-react";
import { RootCauseAnalysis } from "../../types";

interface RootCauseCardProps {
  rootCause: RootCauseAnalysis;
}

export default function RootCauseCard({ rootCause }: RootCauseCardProps) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 shadow-lg shadow-black/10">
      {/* Header */}
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <ThumbsUp className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold tracking-wide text-white">
            Root Cause Analysis
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Key positive and negative drivers identified in user discussions
          </p>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Praises Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-emerald-500/10 pb-2">
            <ThumbsUp className="h-4 w-4 text-emerald-400" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Top Praises
            </h4>
          </div>

          <div className="space-y-3.5">
            {rootCause.praises.map((praise, index) => (
              <div
                key={`praise-${index}`}
                className="rounded-xl border border-card-border bg-card-hover/20 p-4 space-y-3 hover:border-emerald-500/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white flex items-center">
                      {praise.aspect}
                      <ArrowUpRight className="ml-1 h-3.5 w-3.5 text-emerald-400" />
                    </span>
                    <p className="text-xs text-gray-400 leading-normal">{praise.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs font-semibold text-emerald-400">{praise.percentage}%</span>
                    <span className="text-[10px] text-gray-500 flex items-center">
                      <MessageSquare className="mr-1 h-2.5 w-2.5" />
                      {praise.votes}
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-900 rounded-full h-1">
                  <div
                    className="bg-emerald-500 h-1 rounded-full"
                    style={{ width: `${praise.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Complaints Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-rose-500/10 pb-2">
            <ThumbsDown className="h-4 w-4 text-rose-400" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-rose-400">
              Top Complaints
            </h4>
          </div>

          <div className="space-y-3.5">
            {rootCause.complaints.map((complaint, index) => (
              <div
                key={`complaint-${index}`}
                className="rounded-xl border border-card-border bg-card-hover/20 p-4 space-y-3 hover:border-rose-500/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white flex items-center">
                      {complaint.aspect}
                      <ArrowUpRight className="ml-1 h-3.5 w-3.5 text-rose-400 transform rotate-90" />
                    </span>
                    <p className="text-xs text-gray-400 leading-normal">{complaint.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs font-semibold text-rose-400">{complaint.percentage}%</span>
                    <span className="text-[10px] text-gray-500 flex items-center">
                      <MessageSquare className="mr-1 h-2.5 w-2.5" />
                      {complaint.votes}
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-900 rounded-full h-1">
                  <div
                    className="bg-rose-500 h-1 rounded-full"
                    style={{ width: `${complaint.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
