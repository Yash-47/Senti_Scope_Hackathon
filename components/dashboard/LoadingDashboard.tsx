"use client";

import React, { useState, useEffect } from "react";
import { Radar } from "lucide-react";

export default function LoadingDashboard() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = [
    "Establishing connections to social streams...",
    "Scanning r/teslamotors, r/Android, r/openai...",
    "Sifting through r/popular discussions...",
    "Tokenizing raw social text & post titles...",
    "Calculating neural sentiment score vectors...",
    "Aggregating sub-topic frequency weights...",
    "Synthesizing final executive insights...",
  ];

  // Progress Bar effect
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    return () => clearInterval(progressInterval);
  }, []);

  // Text rotation effect
  useEffect(() => {
    const textInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 450);

    return () => clearInterval(textInterval);
  }, [loadingMessages.length]);

  return (
    <div className="w-full space-y-8 py-6">
      {/* Top Progress & Radar Scanner */}
      <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-indigo-500/10 bg-card/30 p-6 text-center backdrop-blur-sm">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <div className="absolute inset-0 rounded-full bg-indigo-500/5 border border-indigo-500/30 animate-radar-pulse" />
          <Radar className="h-6 w-6 text-indigo-400 animate-spin" style={{ animationDuration: "6s" }} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">Analyzing Social Media Stream...</p>
          <p className="text-xs text-gray-500 min-h-[1.25rem] font-mono transition-all duration-300">
            {loadingMessages[messageIndex]}
          </p>
        </div>
        <div className="w-full max-w-md bg-gray-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 4 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-card-border bg-card/40 p-5 space-y-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-gray-800" />
              <div className="h-6 w-6 rounded bg-gray-800" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-16 rounded bg-gray-800" />
              <div className="h-3.5 w-32 rounded bg-gray-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie Chart Card Skeleton */}
        <div className="rounded-2xl border border-card-border bg-card/40 p-6 space-y-6 animate-pulse">
          <div className="h-5 w-40 rounded bg-gray-800" />
          <div className="flex h-56 items-center justify-center">
            <div className="h-40 w-40 rounded-full border-[16px] border-gray-800/40" />
          </div>
          <div className="flex justify-center space-x-6">
            <div className="h-4 w-12 rounded bg-gray-800" />
            <div className="h-4 w-12 rounded bg-gray-800" />
            <div className="h-4 w-12 rounded bg-gray-800" />
          </div>
        </div>

        {/* Bar Chart Card Skeleton */}
        <div className="rounded-2xl border border-card-border bg-card/40 p-6 space-y-6 animate-pulse">
          <div className="h-5 w-36 rounded bg-gray-800" />
          <div className="flex h-56 items-end justify-between px-6 pt-4">
            <div className="h-44 w-10 rounded bg-gray-800" />
            <div className="h-20 w-10 rounded bg-gray-800" />
            <div className="h-12 w-10 rounded bg-gray-800" />
            <div className="h-28 w-10 rounded bg-gray-800" />
            <div className="h-36 w-10 rounded bg-gray-800" />
          </div>
          <div className="h-4 w-full rounded bg-gray-800" />
        </div>
      </div>

      {/* Trending Topics Skeleton */}
      <div className="rounded-2xl border border-card-border bg-card/40 p-6 space-y-6 animate-pulse">
        <div className="h-5 w-44 rounded bg-gray-800" />
        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 w-28 rounded bg-gray-800" />
              <div className="flex-grow h-4 rounded bg-gray-800/40" />
              <div className="h-4 w-12 rounded bg-gray-800" />
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights & Alerts Skeleton Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Insights Skeleton */}
        <div className="rounded-2xl border border-card-border bg-card/40 p-6 space-y-4 animate-pulse">
          <div className="h-5 w-44 rounded bg-gray-800" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-gray-800/60" />
            <div className="h-4 w-11/12 rounded bg-gray-800/60" />
            <div className="h-4 w-4/5 rounded bg-gray-800/60" />
          </div>
          <div className="h-0.5 w-full bg-gray-800 my-4" />
          <div className="space-y-2">
            <div className="h-4 w-48 rounded bg-gray-800" />
            <div className="h-4 w-full rounded bg-gray-800/60" />
          </div>
        </div>

        {/* Alerts Skeleton */}
        <div className="rounded-2xl border border-card-border bg-card/40 p-6 space-y-4 animate-pulse">
          <div className="h-5 w-36 rounded bg-gray-800" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center rounded-xl bg-gray-900/40 p-3">
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-gray-800" />
                  <div className="h-3 w-32 rounded bg-gray-800/45" />
                </div>
                <div className="h-5 w-12 rounded bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-card-border bg-card/40 p-6 space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-5 w-32 rounded bg-gray-800" />
          <div className="h-8 w-44 rounded bg-gray-800" />
        </div>
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-6 gap-4 py-3 border-b border-gray-900/40">
              <div className="h-4 w-14 rounded bg-gray-800" />
              <div className="h-4 w-12 rounded bg-gray-800" />
              <div className="h-4 w-16 rounded bg-gray-800" />
              <div className="col-span-2 h-4 rounded bg-gray-800" />
              <div className="h-4 w-16 rounded bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
