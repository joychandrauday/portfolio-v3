"use client";

import React from "react";

export default function MarqueeTicker() {
  const items = [
    "PERFORMANCE ENGINEERING",
    "SCALABLE SOLUTIONS",
    "IMMUTABLE LEDGERS",
    "DISTRIBUTED SYSTEMS",
    "HIGH-CONVERSION UX",
    "GROW WITH OWL",
    "G2G DIGITAL",
  ];

  return (
    <div className="relative py-12 bg-[#050505] overflow-hidden border-y border-white/[0.06] select-none">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex w-max animate-marquee font-mono">
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 mx-4">
            <span className="text-4xl md:text-6xl font-black tracking-tighter text-white/10 uppercase hover:text-white/30 transition-colors whitespace-nowrap">
              {text}
            </span>
            <span className="text-accent/40 text-2xl">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
