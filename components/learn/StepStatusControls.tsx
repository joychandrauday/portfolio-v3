"use client";

import React from "react";
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useStepStatus, type StepStatus, type TrackedStep } from "@/components/learn/useStepStatus";

export function StatusIcon({
  status,
  className = "",
}: {
  status: StepStatus;
  className?: string;
}) {
  if (status === "done") {
    return <CheckCircle2 className={`h-4 w-4 text-emerald-400 ${className}`} />;
  }
  if (status === "doing") {
    return <PlayCircle className={`h-4 w-4 animate-pulse text-accent ${className}`} />;
  }
  return <Circle className={`h-4 w-4 text-text-muted/50 ${className}`} />;
}

/**
 * Click-to-cycle status dot. Shared by the roadmap tree and phase list.
 */
export function StepStatusButton({
  roadmapSlug,
  roadmapTitle,
  step,
  className = "",
}: {
  roadmapSlug: string;
  roadmapTitle: string;
  step: TrackedStep;
  className?: string;
}) {
  const { statusOf, cycleStatus, saving } = useStepStatus(roadmapSlug, roadmapTitle);
  const status = statusOf(step);

  return (
    <button
      type="button"
      title={`Current: ${status}. Click to cycle.`}
      aria-label={`Status: ${status}`}
      disabled={saving === step.slug}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void cycleStatus(step);
      }}
      className={`shrink-0 cursor-pointer rounded p-0.5 transition-colors hover:bg-bg-elevated disabled:opacity-50 ${className}`}
    >
      <StatusIcon status={status} />
    </button>
  );
}

/** Three-way status switch used on the step page. */
export function StepStatusToggle({
  roadmapSlug,
  roadmapTitle,
  step,
}: {
  roadmapSlug: string;
  roadmapTitle: string;
  step: TrackedStep;
}) {
  const { statusOf, updateStatus, saving } = useStepStatus(roadmapSlug, roadmapTitle);
  const current = statusOf(step);

  return (
    <div className="flex items-center gap-1">
      {(["todo", "doing", "done"] as const).map((status) => {
        const active = current === status;
        return (
          <button
            key={status}
            type="button"
            disabled={saving === step.slug}
            onClick={() => void updateStatus(step, status)}
            className={`cursor-pointer rounded border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
              active
                ? status === "done"
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                  : status === "doing"
                    ? "border-accent/40 bg-accent/20 text-accent"
                    : "border-border bg-bg-elevated text-text-primary"
                : "border-border/60 bg-bg text-text-muted hover:text-text-primary"
            }`}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}

/** Owner-only: log study time against a step. */
export function StudyLogButton({
  roadmapSlug,
  roadmapTitle,
  step,
  minutes = 30,
}: {
  roadmapSlug: string;
  roadmapTitle: string;
  step: TrackedStep;
  minutes?: number;
}) {
  const { isAuthed, logSession } = useStepStatus(roadmapSlug, roadmapTitle);
  const [state, setState] = React.useState<"idle" | "saving" | "ok" | "error">("idle");

  if (!isAuthed) return null;

  return (
    <div className="flex items-center justify-between border-t border-border pt-2">
      <span className="font-mono text-xs text-text-muted">Study logging</span>
      <button
        type="button"
        disabled={state === "saving"}
        onClick={async () => {
          setState("saving");
          const ok = await logSession(step, minutes);
          setState(ok ? "ok" : "error");
          window.setTimeout(() => setState("idle"), 2500);
        }}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent transition-colors hover:bg-accent/25 disabled:opacity-50"
      >
        <Clock className="h-3.5 w-3.5" />
        <span>
          {state === "saving"
            ? "Logging…"
            : state === "ok"
              ? "Logged ✓"
              : state === "error"
                ? "Failed"
                : `+${minutes}m Study Log`}
        </span>
      </button>
    </div>
  );
}

/** "OPS LOGGED IN · SYNCED" / "PUBLIC VIEW" badge. */
export function AuthBadge({ roadmapSlug, roadmapTitle }: { roadmapSlug: string; roadmapTitle: string }) {
  const { isAuthed } = useStepStatus(roadmapSlug, roadmapTitle);

  return isAuthed ? (
    <span className="inline-flex items-center gap-1.5 rounded border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-accent">
      <ShieldCheck className="h-3.5 w-3.5" />
      <span>OPS LOGGED IN · SYNCED</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded border border-border bg-bg-surface px-2 py-0.5 font-mono text-[10px] text-text-muted">
      <span>PUBLIC VIEW</span>
    </span>
  );
}

/** Completion meter for a set of steps. */
export function ProgressMeter({
  roadmapSlug,
  roadmapTitle,
  steps,
  showCount = true,
}: {
  roadmapSlug: string;
  roadmapTitle: string;
  steps: TrackedStep[];
  showCount?: boolean;
}) {
  const { statusOf } = useStepStatus(roadmapSlug, roadmapTitle);
  const done = steps.filter((step) => statusOf(step) === "done").length;
  const total = steps.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      {showCount && (
        <div className="font-mono text-[11px] text-text-muted">
          <span className="font-bold text-accent">{done}</span> / {total}
        </div>
      )}
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-elevated">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[11px] font-semibold text-text-primary">{pct}%</span>
    </div>
  );
}
