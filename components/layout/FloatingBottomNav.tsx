import React from "react";
import { Home, BarChart2, Lightbulb, Bell } from "lucide-react";

interface FloatingBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function FloatingBottomNav({ activeTab, onTabChange }: FloatingBottomNavProps) {
  const navItems = [
    { id: "dashboard", icon: <Home className="h-5 w-5" /> },
    { id: "analytics", icon: <BarChart2 className="h-5 w-5" /> },
    { id: "insights", icon: <Lightbulb className="h-5 w-5" /> },
    { id: "alerts", icon: <Bell className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-card rounded-full p-1.5 flex justify-around items-center z-40 border border-white/65 shadow-xl md:hidden">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            activeTab === item.id
              ? "text-primary bg-primary/10 shadow-sm scale-110 font-bold"
              : "text-on-surface-variant/80 hover:text-primary active:scale-95"
          }`}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  );
}
