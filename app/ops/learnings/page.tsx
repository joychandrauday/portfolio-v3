"use client";

import React, { useState } from "react";
import { BrainCircuit, Route, BookOpen } from "lucide-react";
import LearningFlow from "./LearningFlow";
import NotesPanel from "./NotesPanel";

type Tab = "flow" | "notes";

export default function OpsLearningsPage() {
  const [tab, setTab] = useState<Tab>("flow");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-accent" />
          <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-text-primary">
            LEARNING FLOW
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent">
            Personal study system
          </span>
        </div>
        <p className="text-xs font-mono text-text-muted mt-1">
          Pick a track — DSA, Docker, system design, anything — and work through ordered modules with a
          study log, streaks and progress you can trust.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setTab("flow")}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            tab === "flow"
              ? "bg-accent/15 text-accent border border-accent/30 font-bold"
              : "text-text-muted hover:text-text-primary hover:bg-bg-elevated border border-transparent"
          }`}
        >
          <Route className="w-4 h-4" />
          <span>Flow</span>
        </button>

        <button
          onClick={() => setTab("notes")}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            tab === "notes"
              ? "bg-accent/15 text-accent border border-accent/30 font-bold"
              : "text-text-muted hover:text-text-primary hover:bg-bg-elevated border border-transparent"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Notes &amp; TIL</span>
        </button>
      </div>

      {tab === "flow" ? <LearningFlow /> : <NotesPanel />}
    </div>
  );
}
