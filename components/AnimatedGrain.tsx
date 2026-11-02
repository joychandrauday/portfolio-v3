"use client";

import React from "react";

export default function AnimatedGrain() {
  return (
    <>
      {/* Ambient background soft light gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-500/[0.04] via-amber-500/[0.01] to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[700px] h-[700px] bg-amber-500/[0.02] rounded-full blur-[180px]" />
      </div>

      {/* SVG Animated Film Grain Overlay */}
      <div
        className="fixed inset-[-100%] z-50 pointer-events-none opacity-[0.038] mix-blend-overlay animated-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
