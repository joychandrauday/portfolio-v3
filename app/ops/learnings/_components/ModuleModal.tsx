"use client";

import React, { useEffect, useState } from "react";
import { X, Save, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import MarkdownPreview from "@/components/MarkdownPreview";
import type { LearnModule } from "./types";

interface ModuleModalProps {
  open: boolean;
  module: LearnModule | null;
  trackTitle: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function ModuleModal({ open, module, trackTitle, onClose, onSaved }: ModuleModalProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [estimateMinutes, setEstimateMinutes] = useState(30);
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !module) return;
    setTitle(module.title);
    setNotes(module.notes);
    setResourceUrl(module.resourceUrl ?? "");
    setEstimateMinutes(module.estimateMinutes);
    setStatus(module.status);
    setShowPreview(false);
    setError("");
  }, [open, module]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !module) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("A module needs a title.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/ops/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_module",
          id: module.id,
          title,
          notes,
          resourceUrl,
          estimateMinutes,
          status,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not save the module");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Could not save the module");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${module.title}" from ${trackTitle}?`)) return;
    try {
      await fetch("/api/ops/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_module", id: module.id }),
      });
      onSaved();
      onClose();
    } catch {
      setError("Could not delete the module");
    }
  };

  const label = "block text-[10px] uppercase tracking-wider text-text-muted mb-1 font-mono";
  const field =
    "w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text-primary font-mono focus:outline-none focus:border-accent";

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-4 sm:my-0 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-border bg-bg-surface p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border-subtle">
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-wider text-accent truncate">
              {trackTitle}
            </p>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-text-primary mt-0.5">
              Module detail
            </h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className={label}>Module title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} autoFocus />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className={label}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className={field}
              >
                <option value="todo">To do</option>
                <option value="doing">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className={label}>Estimate (min)</label>
              <input
                type="number"
                min={5}
                step={5}
                value={estimateMinutes}
                onChange={(e) => setEstimateMinutes(Number(e.target.value))}
                className={field}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={label}>Resource URL</label>
              <div className="flex items-center gap-1.5">
                <input
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder="https://..."
                  className={field}
                />
                {resourceUrl.trim() && (
                  <a
                    href={resourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-2 rounded-lg border border-border text-text-muted hover:text-accent shrink-0"
                    title="Open resource"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`${label} mb-0`}>Notes · what I learned (.md)</label>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-accent cursor-pointer"
              >
                {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>

            {showPreview ? (
              <div className="rounded-lg border border-border bg-bg p-3">
                <MarkdownPreview
                  content={notes || "*(No notes yet)*"}
                  title={title || "Module notes"}
                  filename={`${(title || "module").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`}
                  defaultMode="preview"
                />
              </div>
            ) : (
              <textarea
                rows={7}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={"## Key idea\n\n- ...\n\n## Gotchas\n\n- ...\n\n## Code\n\n```bash\ndocker build -t app .\n```"}
                className={`${field} leading-relaxed`}
              />
            )}
          </div>

          {error && (
            <p className="text-[11px] font-mono text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-[11px] font-mono text-text-muted hover:text-red-400 hover:border-red-900/50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete module
            </button>

            <div className="flex items-center gap-2">
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
                {saving ? "Saving..." : "Save module"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
