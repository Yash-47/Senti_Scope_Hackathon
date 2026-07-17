import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-card-border bg-background py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">
          SentiScope &copy; {new Date().getFullYear()} &middot; Built with{" "}
          <span className="font-semibold text-gray-400">Next.js 15</span>,{" "}
          <span className="font-semibold text-gray-400">React 19</span>,{" "}
          <span className="font-semibold text-gray-400">Tailwind CSS v4</span>, and{" "}
          <span className="font-semibold text-gray-400">Recharts</span>.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Designed for high-performance sentiment monitoring & social media intelligence.
        </p>
      </div>
    </footer>
  );
}
