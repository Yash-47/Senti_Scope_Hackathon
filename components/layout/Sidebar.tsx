import React from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "analytics", label: "Analytics", icon: "analytics" },
    { id: "insights", label: "Business Insights", icon: "insights" },
    { id: "alerts", label: "Alerts", icon: "notifications" },
    { id: "summary", label: "Executive Summary", icon: "summarize" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-white/50 bg-surface/80 backdrop-blur-xl shadow-md z-50 flex flex-col py-4 md:block hidden">
      {/* SentiScope Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-container flex items-center justify-center rounded-lg shadow-sm">
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            analytics
          </span>
        </div>
        <div>
          <h1 className="font-headline-md text-xl font-black text-primary tracking-tight">SentiScope</h1>
          <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-extrabold">AI Intelligence</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group focus:outline-none ${
              activeTab === item.id
                ? "sidebar-active"
                : "text-on-surface-variant font-semibold hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="font-body-md text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Pro Callout Box */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-gradient-to-br from-primary-container to-primary text-white overflow-hidden relative group shadow-lg shadow-primary/25">
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold tracking-widest opacity-80 uppercase">AI PRO ACTIVE</p>
          <p className="text-xs font-bold mt-1 leading-snug">Unlock real-time global monitoring</p>
          <button className="mt-3 bg-white text-primary px-3 py-1.5 rounded-lg text-[10px] font-extrabold shadow-md hover:scale-105 transition-transform cursor-pointer">
            Upgrade Now
          </button>
        </div>
        <span 
          className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-8xl rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          rocket_launch
        </span>
      </div>
    </aside>
  );
}
