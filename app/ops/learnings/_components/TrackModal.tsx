"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, Save } from "lucide-react";
import {
  LEARN_TEMPLATES,
  LEARN_TEMPLATE_BY_KEY,
  LEARN_DOMAINS,
  TRACK_COLORS,
} from "@/lib/learn-templates";
import type { LearnTrack } from "./types";

interface TrackModalProps {
  open: boolean;
  track?: LearnTrack | null;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm = {
  title: "",
  domain: "General",
  goal: "",
  level: "beginner",
  status: "active",
  color: "#f59e0b",
  weeklyGoalMinutes: 300,
  targetDate: "",
};

export default function TrackModal({ open, track, onClose, onSaved }: TrackModalProps) {
  const isEdit = Boolean(track);
  const [form, setForm] = useState(emptyForm);
  const [templateKey, setTemplateKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setTemplateKey("");
    if (track) {
      setForm({
        title: track.title,
        domain: track.domain,
        goal: track.goal,
        level: track.level,
        status: track.status,
        color: track.color,
        weeklyGoalMinutes: track.weeklyGoalMinutes,
        targetDate: track.targetDate ? track.targetDate.slice(0, 10) : "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, track]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const template = templateKey ? LEARN_TEMPLATE_BY_KEY[templateKey] : null;

  const pickTemplate = (key: string) => {
    const t = LEARN_TEMPLATE_BY_KEY[key];
    if (!t) return;
    setTemplateKey(key);
    setForm((f) => ({
      ...f,
      title: t.title,
      domain: t.domain,
      goal: t.goal,
      level: t.level,
      color: t.color,
      weeklyGoalMinutes: t.weeklyGoalMinutes,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Give the track a title first.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/ops/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit
            ? { action: "update_track", id: track!.id, ...form }
            : {
                action: "create_track",
                ...form,
                modules: template ? template.modules : [],
              }
        ),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not save the track");
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Could not save the track");
    } finally {
      setSaving(false);
    }
  };

  const label = "block text-[10px] uppercase tracking-wider text-text-muted mb-1 font-mono";
  const field =
    "w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text-primary font-mono focus:outline-none focus:border-accent";

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-4 sm:my-0 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-border bg-bg-surface p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border-subtle">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-text-primary">
              {isEdit ? "Edit learning track" : "Start a learning track"}
            </h2>
            <p className="text-[11px] font-mono text-text-muted mt-0.5">
              {isEdit
                ? "Adjust the goal, pace or status. Modules are edited on the card."
                : "Pick a template to get a full module plan, or start blank and add your own steps."}
            </p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isEdit && (
          <div>
            <label className={label}>Start from a template</label>
            <div className="flex flex-wrap gap-1.5">
              {LEARN_TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => pickTemplate(t.key)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                    templateKey === t.key
                      ? "bg-accent/15 border-accent text-accent font-bold"
                      : "bg-bg border-border text-text-muted hover:text-text-primary hover:border-accent/40"
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTemplateKey("")}
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                  templateKey === ""
                    ? "bg-accent/15 border-accent text-accent font-bold"
                    : "bg-bg border-border text-text-muted hover:text-text-primary hover:border-accent/40"
                }`}
              >
                Blank
              </button>
            </div>
            {template && (
              <p className="mt-2 text-[11px] font-mono text-accent flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Adds {template.modules.length} modules ·{" "}
                {Math.round(
                  template.modules.reduce((sum, m) => sum + m.estimateMinutes, 0) / 60
                )}
                h of planned work
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={label}>Track title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Docker & Containers"
              className={field}
              autoFocus
            />
          </div>

          <div>
            <label className={label}>Why are you learning this?</label>
            <input
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              placeholder="e.g. Ship any service as a reproducible container"
              className={field}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className={label}>Domain</label>
              <input
                list="learn-domains"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className={field}
              />
              <datalist id="learn-domains">
                {LEARN_DOMAINS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            <div>
              <label className={label}>Level</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className={field}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className={label}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={field}
              >
                <option value="active">Active</option>
                <option value="planned">Planned</option>
                <option value="paused">Paused</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className={label}>Weekly goal</label>
              <select
                value={form.weeklyGoalMinutes}
                onChange={(e) => setForm({ ...form, weeklyGoalMinutes: Number(e.target.value) })}
                className={field}
              >
                <option value={90}>1.5 h / week</option>
                <option value={180}>3 h / week</option>
                <option value={240}>4 h / week</option>
                <option value={300}>5 h / week</option>
                <option value={420}>7 h / week</option>
                <option value={600}>10 h / week</option>
                <option value={840}>14 h / week</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={label}>Target date (optional)</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className={field}
              />
            </div>

            <div>
              <label className={label}>Accent</label>
              <div className="flex items-center gap-2 pt-1.5">
                {TRACK_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, color: c })}
                    aria-label={`Use colour ${c}`}
                    className={`h-6 w-6 rounded-full border-2 transition-transform cursor-pointer ${
                      form.color === c ? "border-text-primary scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-[11px] font-mono text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-border-subtle">
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
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create track"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
