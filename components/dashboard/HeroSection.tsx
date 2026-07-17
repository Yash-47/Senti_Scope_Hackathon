import React, { useState } from "react";
import { Sparkles, Search, Rocket } from "lucide-react";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  activeQuery: string;
}

export default function HeroSection({ onSearch, isLoading, activeQuery }: HeroSectionProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  return (
    <>
      {/* 1. Desktop Hero Card (Visible on md and larger) */}
      <section className="glass-card relative overflow-hidden radial-gradient-hero group min-h-[280px] md:flex hidden items-center px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 w-full">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Generative Intelligence
            </div>
            <h2 className="text-4xl font-extrabold text-on-background leading-[1.15] tracking-tight">
              AI Social Media <span className="text-primary font-black">Intelligence</span>
            </h2>
            <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed font-semibold">
              Transform live social conversations into explainable business intelligence using proprietary semantic analysis.
            </p>
          </div>
          <div className="relative h-64 flex items-center justify-center">
            <div className="glass-card p-6 bg-white/40 border-white/60 shadow-2xl scale-90 md:scale-100 hover:scale-105 transition-transform duration-300 relative z-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mobile Hero Card (Visible on mobile/tablet) */}
      <section className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-white to-surface-container-low border border-white md:hidden space-y-6 shadow-sm">
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-black leading-tight text-on-background">
            AI Social Media <span className="text-primary">Intelligence</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-bold leading-normal">
            Transform live social conversations into explainable business intelligence.
          </p>
        </div>

        {/* 3D Brain/Network Illustration */}
        <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-white/50 border border-white/40 shadow-inner">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxHrbjwQN85KlTtu_fszcfuYDFFNvnpYrRxlnHY3XuWedbuK77MthhcI3U_5pc0Z9tckwpUofhmOrPHd3wGSu9E5JD4ykbk6PptjWmxmx1DXzh5cKEIGtwBTCCrVsYQsnXVNnT3p7MkwdBf5xOznmH7cXsyZifMKwIK9DMaWXfsO88aJA3n4627dluN9i7w9JI0Zv1cH3ezflVg8xygaKsRmJK_8ZYkjg-IA3Ry5ZhDfmXm55YHQo"
            alt="AI Neural Analytics Visualization"
          />
        </div>

        {/* Mobile search bar trigger */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative focus-within:ring-1 focus-within:ring-primary rounded-xl transition-all">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant/75" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-xl outline-none text-sm text-on-surface focus:ring-0"
              placeholder={`Search ${activeQuery || "NVIDIA"}...`}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
          >
            <Rocket className="h-4.5 w-4.5" />
            {isLoading ? "Analyzing..." : "Analyze Now"}
          </button>
        </form>
      </section>
    </>
  );
}
