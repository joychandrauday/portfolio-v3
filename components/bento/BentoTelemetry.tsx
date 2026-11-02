"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import DhakaClock from "@/components/DhakaClock";
import { Activity, Database, Server, Terminal } from "lucide-react";

export default function BentoTelemetry() {
  const { language, setLanguage, isBn } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="h-full flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between font-mono text-xs text-text-muted">
        <span className="text-text-primary font-semibold flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>TELEMETRY</span>
        </span>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
          LIVE
        </span>
      </div>

      {/* Clock + Location */}
      <div className="space-y-2 p-3 rounded-xl bg-bg-surface border border-border">
        <DhakaClock />
        <div className="text-[11px] font-mono text-text-muted flex items-center justify-between">
          <span>LATENCY</span>
          <span className="text-text-primary font-semibold">&lt; 24ms</span>
        </div>
      </div>

      {/* Real-time system states */}
      <div className="space-y-1.5 text-xs font-mono text-text-secondary">
        <div className="flex items-center justify-between py-1 border-b border-border/50 text-[11px]">
          <span className="text-text-muted flex items-center gap-1">
            <Server className="w-3 h-3 text-accent" />
            <span>PRIMARY ROLE</span>
          </span>
          <span className="text-text-primary font-medium">garirhat.com</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/50 text-[11px]">
          <span className="text-text-muted flex items-center gap-1">
            <Database className="w-3 h-3 text-accent" />
            <span>STORAGE</span>
          </span>
          <span className="text-text-primary font-medium">PostgreSQL / LibSQL</span>
        </div>

        <div className="flex items-center justify-between py-1 text-[11px]">
          <span className="text-text-muted flex items-center gap-1">
            <Terminal className="w-3 h-3 text-accent" />
            <span>CONCURRENCY</span>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            SELECT FOR UPDATE
          </span>
        </div>
      </div>

      {/* Interactive Quick Hotkey Strip */}
      <div className="pt-2 border-t border-border/60">
        <div className="flex items-center justify-between text-[10px] font-mono text-text-muted pb-1.5">
          <span>INTERACTIVE HOTKEYS</span>
          <span>CLICK / PRESS</span>
        </div>
        <div className="grid grid-cols-6 gap-1 text-[11px] font-mono text-center">
          <button
            onClick={() => router.push("/projects")}
            className="p-1 rounded bg-bg-surface border border-border hover:border-text-primary hover:text-text-primary transition-colors cursor-pointer"
            title="Projects [P]"
          >
            P
          </button>
          <button
            onClick={() => router.push("/blog")}
            className="p-1 rounded bg-bg-surface border border-border hover:border-text-primary hover:text-text-primary transition-colors cursor-pointer"
            title="Writing [B]"
          >
            B
          </button>
          <button
            onClick={() => router.push("/resume")}
            className="p-1 rounded bg-bg-surface border border-border hover:border-text-primary hover:text-text-primary transition-colors cursor-pointer"
            title="Resume [R]"
          >
            R
          </button>
          <button
            onClick={toggleTheme}
            className="p-1 rounded bg-bg-surface border border-border hover:border-text-primary hover:text-text-primary transition-colors cursor-pointer"
            title="Theme [T]"
          >
            T
          </button>
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="p-1 rounded bg-bg-surface border border-border hover:border-text-primary hover:text-text-primary transition-colors cursor-pointer"
            title="Language [L]"
          >
            L
          </button>
          <button
            onClick={() => router.push("/ops")}
            className="p-1 rounded bg-bg-surface border border-border hover:border-text-primary text-accent transition-colors cursor-pointer font-semibold"
            title="Ops Command Center [O]"
          >
            O
          </button>
        </div>
      </div>
    </div>
  );
}
