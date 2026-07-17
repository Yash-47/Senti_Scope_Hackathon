import React from "react";
import { X, Layout, BarChart2, Lightbulb, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileDrawer({ isOpen, onClose, activeTab, onTabChange }: MobileDrawerProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Layout className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 className="h-5 w-5" /> },
    { id: "insights", label: "Business Insights", icon: <Lightbulb className="h-5 w-5" /> },
    { id: "alerts", label: "Alerts", icon: <Bell className="h-5 w-5" /> },
  ];

  const handleNavClick = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-on-background/25 backdrop-blur-md"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-surface z-50 shadow-2xl flex flex-col border-r border-card-border/30"
          >
            {/* Header section */}
            <div className="p-6 border-b border-outline/10 flex justify-between items-center bg-white/20">
              <div>
                <h1 className="font-headline-md text-lg font-black text-primary tracking-tight">SentiScope</h1>
                <p className="text-[10px] text-on-surface-variant font-extrabold uppercase opacity-70">AI Intelligence</p>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-primary/5 rounded-full text-on-surface-variant cursor-pointer active:scale-90 transition-transform"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 py-4 px-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all focus:outline-none ${
                    activeTab === item.id
                      ? "bg-primary/5 border-r-2 border-primary text-primary font-bold shadow-sm"
                      : "text-on-surface-variant font-semibold hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
