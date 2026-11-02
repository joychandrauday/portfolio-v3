"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Circle,
  PlayCircle,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  AlertTriangle,
  CalendarDays,
  Sparkles,
  ListChecks,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import TrackModal from "./_components/TrackModal";
import ModuleModal from "./_components/ModuleModal";
import SessionModal from "./_components/SessionModal";
import {
  fmtMinutes,
  fmtShortDate,
  dayKey,
  startOfLocalDay,
  startOfLocalWeek,
  daysUntil,
  TRACK_STATUS_LABEL,
  TRACK_STATUS_STYLE,
  type LearnModule,
  type LearnSession,
  type LearnTrack,
  type TrackStatus,
} from "./_components/types";

const CARD = "rounded-xl border border-border bg-bg-surface";
const CHIP = "px-1.5 py-0.5 rounded text-[10px] font-mono border";

/* ── Track card ─────────────────────────────────────────────────────── */

interface TrackCardProps {
  track: LearnTrack;
  minutesLogged: number;
  expanded: boolean;
  busyId: string | null;
  quickValue: string;
  onToggleExpand: () => void;
  onQuickValue: (v: string) => void;
  onQuickAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenModule: (m: LearnModule) => void;
  onCycleModule: (m: LearnModule) => void;
  onReorder: (m: LearnModule, direction: "up" | "down") => void;
  onLog: () => void;
}

function TrackCard({
  track,
  minutesLogged,
  expanded,
  busyId,
  quickValue,
  onToggleExpand,
  onQuickValue,
  onQuickAdd,
  onEdit,
  onDelete,
  onOpenModule,
  onCycleModule,
  onReorder,
  onLog,
}: TrackCardProps) {
  const done = track.modules.filter((m) => m.status === "done").length;
  const total = track.modules.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const visibleModules = expanded ? track.modules : track.modules.slice(0, 4);
  const targetDelta = track.targetDate ? daysUntil(track.targetDate) : null;

  return (
    <div className={`${CARD} flex flex-col`}>
      <div className="p-4 space-y-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: track.color }}
              />
              <h3 className="text-sm font-semibold text-text-primary truncate">{track.title}</h3>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className={`${CHIP} bg-bg-elevated border-border text-text-muted`}>
                {track.domain}
              </span>
              <span className={`${CHIP} ${TRACK_STATUS_STYLE[track.status]}`}>
                {TRACK_STATUS_LABEL[track.status]}
              </span>
              {track.targetDate && (
                <span
                  className={`${CHIP} ${
                    (targetDelta ?? 0) < 0
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-bg-elevated border-border text-text-muted"
                  }`}
                >
                  <CalendarDays className="inline w-2.5 h-2.5 mr-1" />
                  {targetDelta === 0
                    ? "today"
                    : targetDelta !== null && targetDelta > 0
                    ? `${targetDelta}d left`
                    : `${Math.abs(targetDelta ?? 0)}d over`}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={onLog}
              title="Log study time"
              aria-label="Log study time"
              className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-bg-elevated cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onEdit}
              title="Edit track"
              aria-label="Edit track"
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              title="Delete track"
              aria-label="Delete track"
              className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-950/20 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {track.goal && (
          <p className="text-[11px] font-mono text-text-muted leading-relaxed line-clamp-2">
            {track.goal}
          </p>
        )}

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
            <span>
              {done}/{total} modules
            </span>
            <span className="flex items-center gap-2">
              <span className="text-accent">{minutesLogged > 0 ? fmtMinutes(minutesLogged) : "0m"} logged</span>
              <span className="text-text-primary font-semibold">{pct}%</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: track.color }}
            />
          </div>
        </div>

        {/* Modules */}
        {total > 0 ? (
          <div className="space-y-0.5">
            {visibleModules.map((m) => {
              const isDone = m.status === "done";
              const isDoing = m.status === "doing";
              const isBusy = busyId === m.id;
              return (
                <div
                  key={m.id}
                  className={`group flex items-center gap-2 rounded-lg px-1.5 py-1.5 -mx-1.5 hover:bg-bg-elevated/50 ${
                    isBusy ? "opacity-50" : ""
                  }`}
                >
                  <button
                    onClick={() => onCycleModule(m)}
                    disabled={isBusy}
                    title="Cycle: todo → doing → done"
                    aria-label={`Set status for ${m.title}`}
                    className="shrink-0 cursor-pointer"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isDoing ? (
                      <PlayCircle className="w-4 h-4 text-accent" />
                    ) : (
                      <Circle className="w-4 h-4 text-text-muted/50 hover:text-accent" />
                    )}
                  </button>

                  <button
                    onClick={() => onOpenModule(m)}
                    className={`flex-1 min-w-0 text-left text-[11px] font-mono truncate cursor-pointer ${
                      isDone
                        ? "line-through text-text-muted"
                        : isDoing
                        ? "text-accent"
                        : "text-text-primary hover:text-accent"
                    }`}
                    title={m.title}
                  >
                    {m.title}
                  </button>

                  <span className="text-[10px] font-mono text-text-muted shrink-0">
                    {m.estimateMinutes}m
                  </span>

                  {m.resourceUrl && (
                    <a
                      href={m.resourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 text-text-muted hover:text-accent"
                      title="Open resource"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <div className="hidden sm:flex items-center shrink-0 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => onReorder(m, "up")}
                      className="p-0.5 text-text-muted hover:text-text-primary cursor-pointer"
                      title="Move up"
                      aria-label="Move module up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onReorder(m, "down")}
                      className="p-0.5 text-text-muted hover:text-text-primary cursor-pointer"
                      title="Move down"
                      aria-label="Move module down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {total > 4 && (
              <button
                onClick={onToggleExpand}
                className="flex items-center gap-1 pt-1 text-[10px] font-mono text-text-muted hover:text-accent cursor-pointer"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {expanded ? "Collapse" : `Show all ${total} modules`}
              </button>
            )}
          </div>
        ) : (
          <p className="text-[11px] font-mono text-text-muted border border-dashed border-border rounded-lg px-3 py-3 text-center">
            No modules yet — add the first step below.
          </p>
        )}

        {/* Quick add module */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onQuickAdd();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            value={quickValue}
            onChange={(e) => onQuickValue(e.target.value)}
            placeholder="Add a module, press Enter…"
            className="flex-1 min-w-0 bg-bg border border-border rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-text-primary focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={!quickValue.trim()}
            className="p-1.5 rounded-lg bg-bg-elevated border border-border text-text-muted hover:text-accent disabled:opacity-40 cursor-pointer"
            aria-label="Add module"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Flow panel ─────────────────────────────────────────────────────── */

export default function LearningFlow() {
  const [tracks, setTracks] = useState<LearnTrack[]>([]);
  const [sessions, setSessions] = useState<LearnSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TrackStatus>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [quickAdd, setQuickAdd] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showLog, setShowLog] = useState(false);

  const [trackModal, setTrackModal] = useState<{ open: boolean; track: LearnTrack | null }>({
    open: false,
    track: null,
  });
  const [moduleModal, setModuleModal] = useState<{
    open: boolean;
    module: LearnModule | null;
    trackTitle: string;
  }>({ open: false, module: null, trackTitle: "" });
  const [sessionModal, setSessionModal] = useState<{
    open: boolean;
    trackId: string | null;
    moduleId: string | null;
  }>({ open: false, trackId: null, moduleId: null });

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/ops/learn", { cache: "no-store" });
      if (res.status === 401) {
        setError("Session expired — reopen ops and sign in again.");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load your learning data");
      setTracks(Array.isArray(data.tracks) ? data.tracks : []);
      setSessions(Array.isArray(data.sessions) ? data.sessions : []);
      setError("");
    } catch (err: any) {
      setError(err?.message || "Could not load your learning data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const post = useCallback(
    async (payload: Record<string, unknown>) => {
      const res = await fetch("/api/ops/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    },
    []
  );

  const runInline = useCallback(
    async (key: string, payload: Record<string, unknown>) => {
      setBusyId(key);
      try {
        await post(payload);
        await load(true);
      } catch (err: any) {
        setError(err?.message || "Action failed");
      } finally {
        setBusyId(null);
      }
    },
    [post, load]
  );

  /* ── Derived stats (computed in local time) ─────────────────────── */

  const stats = useMemo(() => {
    const today = startOfLocalDay(new Date());
    const weekStart = startOfLocalWeek(new Date());

    let minutesToday = 0;
    let minutesWeek = 0;
    const byDay = new Map<string, number>();
    const byTrack = new Map<string, number>();

    for (const s of sessions) {
      const d = new Date(s.studiedAt);
      const mins = s.minutes || 0;
      if (d >= today) minutesToday += mins;
      if (d >= weekStart) minutesWeek += mins;
      const key = dayKey(d);
      byDay.set(key, (byDay.get(key) ?? 0) + mins);
      if (s.trackId) byTrack.set(s.trackId, (byTrack.get(s.trackId) ?? 0) + mins);
    }

    const cursor = new Date(today);
    if (!byDay.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (byDay.has(dayKey(cursor)) && streak < 3650) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const weekGoal = tracks
      .filter((t) => t.status === "active")
      .reduce((sum, t) => sum + (t.weeklyGoalMinutes || 0), 0);

    const modulesTotal = tracks.reduce((n, t) => n + t.modules.length, 0);
    const modulesDone = tracks.reduce(
      (n, t) => n + t.modules.filter((m) => m.status === "done").length,
      0
    );

    return {
      minutesToday,
      minutesWeek,
      weekGoal,
      streak,
      modulesDone,
      modulesTotal,
      activeTracks: tracks.filter((t) => t.status === "active").length,
      byTrack,
    };
  }, [sessions, tracks]);

  const nextUp = useMemo(() => {
    const ordered = [...tracks]
      .filter((t) => t.status !== "done" && t.status !== "paused")
      .sort((a, b) => a.sortOrder - b.sortOrder);
    for (const track of ordered) {
      const module =
        track.modules.find((m) => m.status === "doing") ??
        track.modules.find((m) => m.status === "todo");
      if (module) return { track, module };
    }
    return null;
  }, [tracks]);

  const visibleTracks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tracks.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q) ||
        t.goal.toLowerCase().includes(q) ||
        t.modules.some((m) => m.title.toLowerCase().includes(q))
      );
    });
  }, [tracks, query, statusFilter]);

  const recentSessions = showLog ? sessions.slice(0, 40) : sessions.slice(0, 6);

  /* ── Handlers ──────────────────────────────────────────────────── */

  const cycleModule = (track: LearnTrack, m: LearnModule) => {
    const next = m.status === "todo" ? "doing" : m.status === "doing" ? "done" : "todo";
    runInline(m.id, { action: "update_module", id: m.id, status: next });
    void track;
  };

  const reorder = (m: LearnModule, direction: "up" | "down") =>
    runInline(`reorder-${m.id}`, { action: "reorder_module", id: m.id, direction });

  const quickAddModule = async (trackId: string) => {
    const title = (quickAdd[trackId] ?? "").trim();
    if (!title) return;
    setQuickAdd((prev) => ({ ...prev, [trackId]: "" }));
    await runInline(`add-${trackId}`, { action: "add_module", trackId, title });
  };

  const deleteTrack = async (track: LearnTrack) => {
    if (!confirm(`Delete "${track.title}" with ${track.modules.length} modules and its session history?`))
      return;
    await runInline(`delete-${track.id}`, { action: "delete_track", id: track.id });
  };

  const completeNext = async () => {
    if (!nextUp) return;
    await runInline(nextUp.module.id, {
      action: "update_module",
      id: nextUp.module.id,
      status: "done",
    });
  };

  const startNext = async () => {
    if (!nextUp) return;
    await runInline(nextUp.module.id, {
      action: "update_module",
      id: nextUp.module.id,
      status: "doing",
    });
  };

  const deleteSession = async (id: string) => {
    await runInline(`session-${id}`, { action: "delete_session", id });
  };

  /* ── Render ────────────────────────────────────────────────────── */

  const weekPct = stats.weekGoal > 0 ? Math.min(100, Math.round((stats.minutesWeek / stats.weekGoal) * 100)) : 0;

  return (
    <div className="space-y-5">
      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`${CARD} p-3`}>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted font-mono">
            <Flame className="w-3 h-3 text-accent" /> Streak
          </span>
          <p className="mt-1 text-xl font-bold font-mono text-text-primary">
            {stats.streak}
            <span className="text-xs text-text-muted font-normal ml-1">day{stats.streak === 1 ? "" : "s"}</span>
          </p>
          <p className="text-[10px] font-mono text-text-muted">
            {stats.streak > 0 ? "Keep it alive today" : "Log a session to start"}
          </p>
        </div>

        <div className={`${CARD} p-3`}>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted font-mono">
            <Clock className="w-3 h-3 text-accent" /> Today
          </span>
          <p className="mt-1 text-xl font-bold font-mono text-text-primary">
            {fmtMinutes(stats.minutesToday)}
          </p>
          <p className="text-[10px] font-mono text-text-muted">across all tracks</p>
        </div>

        <div className={`${CARD} p-3`}>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted font-mono">
            <Target className="w-3 h-3 text-accent" /> This week
          </span>
          <p className="mt-1 text-xl font-bold font-mono text-text-primary">
            {fmtMinutes(stats.minutesWeek)}
            {stats.weekGoal > 0 && (
              <span className="text-xs text-text-muted font-normal ml-1">/ {fmtMinutes(stats.weekGoal)}</span>
            )}
          </p>
          <div className="mt-1 h-1 rounded-full bg-bg-elevated overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${weekPct}%` }} />
          </div>
        </div>

        <div className={`${CARD} p-3`}>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted font-mono">
            <ListChecks className="w-3 h-3 text-accent" /> Modules
          </span>
          <p className="mt-1 text-xl font-bold font-mono text-text-primary">
            {stats.modulesDone}
            <span className="text-xs text-text-muted font-normal ml-1">/ {stats.modulesTotal}</span>
          </p>
          <p className="text-[10px] font-mono text-text-muted">{stats.activeTracks} active track{stats.activeTracks === 1 ? "" : "s"}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-900/40 bg-red-950/25 px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="flex-1 text-[11px] font-mono text-red-300 leading-relaxed">{error}</p>
          <button
            onClick={() => load()}
            className="flex items-center gap-1 text-[10px] font-mono text-red-300 hover:text-red-200 shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Continue / next up */}
      {!loading && nextUp && (
        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-accent">
                <ArrowRight className="w-3 h-3" /> Continue where you left off
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: nextUp.track.color }}
                />
                <p className="text-[11px] font-mono text-text-muted truncate">{nextUp.track.title}</p>
              </div>
              <h2 className="text-sm sm:text-base font-semibold text-text-primary mt-0.5">
                {nextUp.module.title}
              </h2>
              <p className="text-[11px] font-mono text-text-muted mt-0.5">
                {nextUp.module.status === "doing" ? "In progress" : "Up next"} ·{" "}
                {nextUp.module.estimateMinutes}m estimate ·{" "}
                {nextUp.track.modules.filter((m) => m.status === "done").length}/
                {nextUp.track.modules.length} done
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() =>
                  setSessionModal({
                    open: true,
                    trackId: nextUp.track.id,
                    moduleId: nextUp.module.id,
                  })
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black text-[11px] font-mono font-semibold cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" /> Log time
              </button>
              {nextUp.module.status !== "doing" && (
                <button
                  onClick={startNext}
                  disabled={busyId === nextUp.module.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-primary text-[11px] font-mono hover:border-accent/50 disabled:opacity-50 cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-accent" /> Start
                </button>
              )}
              <button
                onClick={completeNext}
                disabled={busyId === nextUp.module.id}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono hover:bg-emerald-500/20 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Done
              </button>
              <button
                onClick={() => setModuleModal({ open: true, module: nextUp.module, trackTitle: nextUp.track.title })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-muted text-[11px] font-mono hover:text-text-primary cursor-pointer"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks or modules…"
            className="w-full pl-9 pr-3 py-2 bg-bg-surface border border-border rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {(["all", "active", "planned", "paused", "done"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-accent/15 border-accent/30 text-accent font-bold"
                  : "bg-bg-surface border-border text-text-muted hover:text-text-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={() => setTrackModal({ open: true, track: null })}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black text-[11px] font-mono font-semibold shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> New track
        </button>
      </div>

      {/* Track grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div key={i} className={`${CARD} p-4 space-y-3 animate-pulse`}>
              <div className="h-3 w-1/2 rounded bg-bg-elevated" />
              <div className="h-2 w-full rounded bg-bg-elevated" />
              <div className="h-2 w-5/6 rounded bg-bg-elevated" />
              <div className="h-2 w-2/3 rounded bg-bg-elevated" />
            </div>
          ))}
        </div>
      ) : visibleTracks.length === 0 ? (
        <div className={`${CARD} p-8 text-center space-y-3`}>
          <div className="mx-auto h-11 w-11 rounded-xl border border-accent/30 bg-accent/10 flex items-center justify-center text-accent">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {tracks.length === 0 ? "Start your first learning track" : "Nothing matches that filter"}
            </h3>
            <p className="text-[11px] font-mono text-text-muted mt-1 max-w-sm mx-auto leading-relaxed">
              {tracks.length === 0
                ? "Pick DSA, Docker, System Design or start blank. You get an ordered module plan, progress tracking and a study log."
                : "Try a different status filter or clear the search."}
            </p>
          </div>
          {tracks.length === 0 && (
            <button
              onClick={() => setTrackModal({ open: true, track: null })}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black text-[11px] font-mono font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Create a track
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {visibleTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              minutesLogged={stats.byTrack.get(track.id) ?? 0}
              expanded={Boolean(expanded[track.id])}
              busyId={busyId}
              quickValue={quickAdd[track.id] ?? ""}
              onToggleExpand={() =>
                setExpanded((prev) => ({ ...prev, [track.id]: !prev[track.id] }))
              }
              onQuickValue={(v) => setQuickAdd((prev) => ({ ...prev, [track.id]: v }))}
              onQuickAdd={() => quickAddModule(track.id)}
              onEdit={() => setTrackModal({ open: true, track })}
              onDelete={() => deleteTrack(track)}
              onOpenModule={(m) => setModuleModal({ open: true, module: m, trackTitle: track.title })}
              onCycleModule={(m) => cycleModule(track, m)}
              onReorder={reorder}
              onLog={() => setSessionModal({ open: true, trackId: track.id, moduleId: null })}
            />
          ))}
        </div>
      )}

      {/* Study log */}
      {!loading && sessions.length > 0 && (
        <div className={CARD}>
          <button
            onClick={() => setShowLog((v) => !v)}
            className="w-full flex items-center justify-between gap-2 p-4 cursor-pointer"
          >
            <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-text-primary">
              <Clock className="w-3.5 h-3.5 text-accent" /> Study log
              <span className="text-text-muted normal-case tracking-normal">
                · {sessions.length} session{sessions.length === 1 ? "" : "s"} ·{" "}
                {fmtMinutes(sessions.reduce((n, s) => n + s.minutes, 0))} total
              </span>
            </span>
            {showLog ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>

          <div className="border-t border-border-subtle divide-y divide-border-subtle">
            {recentSessions.map((s) => (
              <div key={s.id} className="flex items-start gap-2 px-4 py-2.5 group">
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.trackColor ?? "#71717a" }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-mono text-text-primary truncate">
                    {s.trackTitle ?? "General practice"}
                    {s.moduleTitle && <span className="text-text-muted"> · {s.moduleTitle}</span>}
                  </p>
                  {s.note && (
                    <p className="text-[10px] font-mono text-text-muted truncate">{s.note}</p>
                  )}
                </div>
                <span className="text-[10px] font-mono text-text-muted shrink-0">
                  {fmtShortDate(s.studiedAt)}
                </span>
                <span className="text-[10px] font-mono text-accent shrink-0 w-12 text-right">
                  {fmtMinutes(s.minutes)}
                </span>
                <button
                  onClick={() => deleteSession(s.id)}
                  className="p-1 text-text-muted hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                  aria-label="Delete session"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {sessions.length > 6 && (
            <button
              onClick={() => setShowLog((v) => !v)}
              className="w-full px-4 py-2 text-[10px] font-mono text-text-muted hover:text-accent border-t border-border-subtle cursor-pointer"
            >
              {showLog ? "Show less" : `Show all ${sessions.length} sessions`}
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <TrackModal
        open={trackModal.open}
        track={trackModal.track}
        onClose={() => setTrackModal({ open: false, track: null })}
        onSaved={() => load(true)}
      />
      <ModuleModal
        open={moduleModal.open}
        module={moduleModal.module}
        trackTitle={moduleModal.trackTitle}
        onClose={() => setModuleModal({ open: false, module: null, trackTitle: "" })}
        onSaved={() => load(true)}
      />
      <SessionModal
        open={sessionModal.open}
        tracks={tracks}
        presetTrackId={sessionModal.trackId}
        presetModuleId={sessionModal.moduleId}
        onClose={() => setSessionModal({ open: false, trackId: null, moduleId: null })}
        onSaved={() => load(true)}
      />
    </div>
  );
}
