"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ArrowUpRight, Github, Layers, RefreshCw, GitCommit } from "lucide-react";

export default function BentoFlowBridge() {
  const { isBn } = useLanguage();
  const [tab, setTab] = useState<"fsm" | "idempotency" | "retry">("fsm");

  return (
    <div className="h-full flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-accent/10 text-accent">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              FlowBridge
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-bg-surface border border-border text-text-muted">
              Workflow Engine
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
            <a
              href="https://github.com/joychandrauday"
              target="_blank"
              rel="noreferrer"
              className="hover:text-text-primary transition-colors flex items-center gap-1"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">code</span>
            </a>
            <a
              href="https://github.com/joychandrauday"
              target="_blank"
              rel="noreferrer"
              className="hover:text-text-primary transition-colors flex items-center gap-0.5"
              title="Architecture Docs"
            >
              <span>live</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <p
          className={`text-xs sm:text-sm text-text-secondary leading-relaxed pt-2 ${
            isBn ? "font-bengali text-sm text-text-primary/85" : "font-sans"
          }`}
        >
          {isBn
            ? "লিড-টু-অ্যাকশন অটোমেশন ইঞ্জিন ও মিনি-সিআরএম। ট্রিগার গ্রাফ, এক্সপোনেনশিয়াল ব্যাকঅফ এবং সার্ভার রিস্টার্টের পরও নির্বিঘ্ন ডিউরেবল এক্সিকিউশন নিশ্চিত করে।"
            : "Lead-to-action workflow automation engine with durable state machines. Features ordered steps, exponential backoff retries, and server restart survival."}
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 border-b border-border/60 pb-1.5 text-xs font-mono">
          <button
            onClick={() => setTab("fsm")}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              tab === "fsm"
                ? "bg-text-primary text-bg font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            // State Machine
          </button>
          <button
            onClick={() => setTab("idempotency")}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              tab === "idempotency"
                ? "bg-text-primary text-bg font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            // Idempotency Tuple
          </button>
          <button
            onClick={() => setTab("retry")}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              tab === "retry"
                ? "bg-text-primary text-bg font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            // Durable Delays
          </button>
        </div>

        {/* Tab content */}
        <div className="p-3 rounded-xl bg-bg-surface border border-border font-mono text-xs leading-relaxed min-h-[90px] flex items-center">
          {tab === "fsm" && (
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-accent font-semibold">
                <GitCommit className="w-3.5 h-3.5" />
                <span>Deterministic Trigger Graph</span>
              </div>
              <p className="text-text-muted">
                Workflows transition across `PENDING ➔ IN_FLIGHT ➔ COMPLETED` state tuples without in-memory leaks.
              </p>
            </div>
          )}

          {tab === "idempotency" && (
            <div className="space-y-1 text-[11px]">
              <span className="text-accent font-semibold block">
                UNIQUE KEY (workflow_id, event_id, step_index)
              </span>
              <p className="text-text-muted">
                Guarantees zero duplicate webhook actions or double email transmissions even under network replay attacks.
              </p>
            </div>
          )}

          {tab === "retry" && (
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Exponential Jittered Backoff</span>
              </div>
              <p className="text-text-muted">
                Delay steps are persisted in Postgres with wake-up timestamps. If worker nodes crash, execution picks up instantly upon reboot.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-text-muted">
        {["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Zod"].map((t) => (
          <span key={t} className="px-2 py-0.5 rounded bg-bg-surface border border-border">
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}
