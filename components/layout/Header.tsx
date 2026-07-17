"use client";

import React, { useState } from "react";
import { Activity, Github, Sun, Moon } from "lucide-react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-md shadow-indigo-600/30">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            Senti<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Scope</span>
          </span>
        </div>

        {/* Center: Subtle Badge (optional placeholder for real-time status) */}
        <div className="hidden items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time streams online</span>
        </div>

        {/* Right Side: Options */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle (Visual Placeholder) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-card-border bg-card text-gray-400 hover:bg-card-hover hover:text-white transition-colors"
            title="Toggle theme (visual demo)"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Moon className="h-4.5 w-4.5 text-indigo-400" />
            ) : (
              <Sun className="h-4.5 w-4.5 text-amber-400" />
            )}
          </button>

          {/* GitHub Icon Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-card-border bg-card text-gray-400 hover:bg-card-hover hover:text-white transition-colors"
            title="SentiScope GitHub Repository"
            aria-label="GitHub Repository"
          >
            <Github className="h-4.5 w-4.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
