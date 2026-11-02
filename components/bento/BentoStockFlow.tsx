"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ArrowUpRight, Github, Cpu, CheckCircle2, Lock } from "lucide-react";

export default function BentoStockFlow() {
  const { isBn } = useLanguage();
  const [tab, setTab] = useState<"arch" | "proof" | "code">("arch");

  return (
    <div className="h-full flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-accent/10 text-accent">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              StockFlow
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-bg-surface border border-border text-text-muted">
              Featured System
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
            ? "উচ্চ-কনকারেন্সি ইনভেন্টরি ইঞ্জিন। এতে রয়েছে ইমিউটেবল অ্যাপেন্ড-অনলি লেজার (onHand = Σ movements), SELECT FOR UPDATE ট্রানজ্যাকশন লক এবং ডাবল-স্পেন্ডিং রোধের কঠোর গ্যারান্টি।"
            : "High-concurrency inventory & ledger engine. Proves zero race conditions under 20 parallel checkout workers via SELECT ... FOR UPDATE transaction locks."}
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 border-b border-border/60 pb-1.5 text-xs font-mono">
          <button
            onClick={() => setTab("arch")}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              tab === "arch"
                ? "bg-text-primary text-bg font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            // Architecture
          </button>
          <button
            onClick={() => setTab("proof")}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              tab === "proof"
                ? "bg-text-primary text-bg font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            // Concurrency Proof
          </button>
          <button
            onClick={() => setTab("code")}
            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
              tab === "code"
                ? "bg-text-primary text-bg font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            // SQL Pattern
          </button>
        </div>

        {/* Tab view */}
        <div className="p-3 rounded-xl bg-bg-surface border border-border font-mono text-xs leading-relaxed min-h-[90px] flex items-center">
          {tab === "arch" && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-accent font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Immutable Append-Only Ledger Pattern</span>
              </div>
              <p className="text-text-muted text-[11px]">
                No mutable `stock` columns. Available inventory is strictly derived as `onHand = SUM(movements)` inside an atomic transactional boundary.
              </p>
            </div>
          )}

          {tab === "proof" && (
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Vitest Parallel Load Harness: PASSED</span>
                </span>
                <span>20 parallel workers</span>
              </div>
              <p className="text-text-muted">
                Zero overselling, zero deadlock anomalies, and 100% deterministic ledger balance reconciliation verified under 50ms synthetic latency.
              </p>
            </div>
          )}

          {tab === "code" && (
            <div className="space-y-1 w-full text-[11px] overflow-x-auto text-text-secondary">
              <span className="text-accent font-semibold block">-- Transaction Lock:</span>
              <code>
                BEGIN;<br />
                SELECT * FROM inventory_items WHERE id = $1 FOR UPDATE;<br />
                INSERT INTO stock_movements (item_id, delta) VALUES ($1, -$2);<br />
                COMMIT;
              </code>
            </div>
          )}
        </div>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-text-muted">
        {["TypeScript", "PostgreSQL", "Prisma", "Vitest", "Docker"].map((t) => (
          <span key={t} className="px-2 py-0.5 rounded bg-bg-surface border border-border">
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}
