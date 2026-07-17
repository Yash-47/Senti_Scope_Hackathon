"use client";

import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleQuickTagClick = (tag: string) => {
    if (!isLoading) {
      setQuery(tag);
      onSearch(tag);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any topic (Tesla, ChatGPT, Samsung...)"
            disabled={isLoading}
            className="w-full rounded-2xl border border-card-border bg-card/60 py-4 pl-12 pr-32 text-base text-white placeholder-gray-500 shadow-lg shadow-black/20 backdrop-blur-md outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1.5"
        >
          <Sparkles className="h-4 w-4" />
          <span>Analyze</span>
        </button>
      </form>

      {/* Quick Links / Tags */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 text-sm text-gray-400">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Try searching:</span>
        {["Tesla", "ChatGPT", "Samsung", "Apple", "Nvidia"].map((tag) => (
          <button
            key={tag}
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickTagClick(tag)}
            className="rounded-full border border-card-border bg-card/40 px-3.5 py-1 text-xs text-gray-350 font-medium hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            #{tag.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
