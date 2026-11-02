"use client";

export type ModuleStatus = "todo" | "doing" | "done";
export type TrackStatus = "planned" | "active" | "paused" | "done";

export interface LearnModule {
  id: string;
  trackId: string;
  title: string;
  notes: string;
  status: ModuleStatus;
  position: number;
  estimateMinutes: number;
  resourceUrl: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LearnTrack {
  id: string;
  title: string;
  domain: string;
  goal: string;
  level: string;
  status: TrackStatus;
  color: string;
  targetDate: string | null;
  weeklyGoalMinutes: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  modules: LearnModule[];
}

export interface LearnSession {
  id: string;
  trackId: string | null;
  moduleId: string | null;
  minutes: number;
  note: string;
  studiedAt: string;
  trackTitle: string | null;
  trackColor: string | null;
  moduleTitle: string | null;
}

export const TRACK_STATUS_LABEL: Record<TrackStatus, string> = {
  planned: "Planned",
  active: "Active",
  paused: "Paused",
  done: "Done",
};

export const TRACK_STATUS_STYLE: Record<TrackStatus, string> = {
  planned: "bg-bg-elevated text-text-muted border-border",
  active: "bg-accent/15 text-accent border-accent/30",
  paused: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  done: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

/** 95 -> "1h 35m", 45 -> "45m" */
export function fmtMinutes(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h ${rest}m` : `${h}h`;
}

/** Local calendar key (YYYY-MM-DD) — streaks should follow the browser's day. */
export function dayKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Monday-based week start, in local time. */
export function startOfLocalWeek(d: Date): Date {
  const x = startOfLocalDay(d);
  const offset = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - offset);
  return x;
}

export function fmtShortDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function daysUntil(dateIso: string): number {
  const target = startOfLocalDay(new Date(dateIso));
  const today = startOfLocalDay(new Date());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
