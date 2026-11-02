"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, Clock, CheckCircle2 } from "lucide-react";
import { fmtMinutes, type LearnTrack } from "./types";

interface SessionModalProps {
  open: boolean;
  tracks: LearnTrack[];
  presetTrackId?: string | null;
  presetModuleId?: string | null;
  onClose: () => void;
  onSaved: () => void;
}

const PRESETS = [15, 25, 45, 60, 90];

export default function SessionModal({
  open,
  tracks,
  presetTrackId,
  presetModuleId,
  onClose,
  onSaved,
}: SessionModalProps) {
  const [trackId, setTrackId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [note, setNote] = useState("");
  const [markDone, setMarkDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const initialModule = presetModuleId ?? "";
    const initialTrack =
      presetTrackId ??
      tracks.find((t) => t.modules.some((m) => m.id === initialModule))?.id ??
      tracks.find((t) => t.status === "active")?.id ??
      tracks[0]?.id ??
      "";

    setTrackId(initialTrack);
    setModuleId(initialModule);
    setMinutes(25);
    setNote("");
    setMarkDone(false);
    setError("");
  }, [open, presetTrackId, presetModuleId, tracks]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const selectedTrack = useMemo(() => tracks.find((t) => t.id === trackId) ?? null, [tracks, trackId]);
  const pendingModules = useMemo(
    () => (selectedTrack ? selectedTrack.modules.filter((m) => m.status !== "done") : []),
    [selectedTrack]
  );

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minutes < 1) {
      setError("Log at least 1 minute.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/ops/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "log_session",
          trackId: moduleId ? undefined : trackId || null,
          moduleId: moduleId || null,
          minutes,
          note,
          markDone: Boolean(moduleId) && markDone,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not log the session");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Could not log the session");
    } finally {
      setSaving(false);
    }
  };

  const label = "block text-[10px] uppercase tracking-wider text-text-muted mb-1 font-mono";
  const field =
    "w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text-primary font-mono focus:outline-none focus:border-accent";

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg my-4 sm:my-0 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-border bg-bg-surface p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border-subtle">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> Log study time
            </h2>
            <p className="text-[11px] font-mono text-text-muted mt-0.5">
              Feeds your streak, weekly goal and per-track progress.
            </p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {tracks.length === 0 ? (
          <p className="text-[11px] font-mono text-text-muted">
            Create a learning track first, then log time against it.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={label}>Track</label>
                <select
                  value={trackId}
                  onChange={(e) => {
                    setTrackId(e.target.value);
                    setModuleId("");
                  }}
                  className={field}
                >
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={label}>Module (optional)</label>
                <select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  className={field}
                >
                  <option value="">General practice</option>
                  {pendingModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={label}>Duration</label>
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setMinutes(p)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                      minutes === p
                        ? "bg-accent/15 border-accent text-accent font-bold"
                        : "bg-bg border-border text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {p}m
                  </button>
                ))}
                <div className="flex items-center gap-1.5 ml-auto">
                  <input
                    type="number"
                    min={1}
                    max={1440}
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-20 bg-bg border border-border rounded-lg px-2 py-1.5 text-xs text-text-primary font-mono text-right focus:outline-none focus:border-accent"
                  />
                  <span className="text-[11px] font-mono text-text-muted">min</span>
                </div>
              </div>
              <p className="mt-1 text-[10px] font-mono text-text-muted">= {fmtMinutes(minutes)}</p>
            </div>

            {moduleId && (
              <label className="flex items-center gap-2 text-[11px] font-mono text-text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={markDone}
                  onChange={(e) => setMarkDone(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Mark this module as done too
              </label>
            )}

            <div>
              <label className={label}>What did you do? (optional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Solved 4 sliding-window problems, reviewed the intuition"
                className={field}
              />
            </div>

            {error && (
              <p className="text-[11px] font-mono text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg border border-border text-xs font-mono text-text-muted hover:text-text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold text-xs font-mono disabled:opacity-50 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                {saving ? "Logging..." : "Log session"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
