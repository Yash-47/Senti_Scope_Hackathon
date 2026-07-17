import React, { useState } from "react";
import { Search, Bolt, Bell, HelpCircle, Menu } from "lucide-react";

interface NavbarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  onToggleMenu: () => void;
}

export default function Navbar({ onSearch, isLoading, onToggleMenu }: NavbarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  return (
    <>
      {/* 1. Desktop NavBar header (Visible on screens >= md) */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-surface/75 backdrop-blur-xl border-b border-white/50 shadow-sm md:flex hidden justify-between items-center h-16 px-6 ml-64 transition-all">
        <form onSubmit={handleSubmit} className="flex items-center flex-1 max-w-xl gap-3">
          <div className="relative w-full focus-within:ring-1 focus-within:ring-primary rounded-lg transition-all">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-on-surface-variant/60" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:outline-none focus:ring-0 placeholder-on-surface-variant/50"
              placeholder="Search any topic, company, product or person..."
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-bold text-xs shadow-md hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none shrink-0"
          >
            <Bolt className="h-4 w-4" />
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        <div className="flex items-center gap-4">
          <div className="h-8 w-[1px] bg-outline/20"></div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant relative cursor-pointer">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer">
              <HelpCircle className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Mobile NavBar header (Visible on screens < md) */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6 border-b border-white/40 md:hidden shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMenu}
            className="p-2 hover:bg-primary/5 rounded-full text-primary cursor-pointer active:scale-95 transition-transform"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>
          <span className="font-headline-md text-lg font-black text-primary tracking-tight">SentiScope</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <Bell className="h-5 w-5 text-on-surface-variant" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] flex items-center justify-center rounded-full font-bold">
              3
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
