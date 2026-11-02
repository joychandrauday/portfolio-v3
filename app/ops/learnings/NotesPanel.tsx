"use client";

import React, { useEffect, useState } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";
import {
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Save,
  Globe,
  Lock,
  Zap,
  X,
  BookOpen,
} from "lucide-react";

interface LearningItem {
  id: string;
  title: string;
  category: string;
  status: "learning" | "completed" | "queued";
  content: string;
  takeaways: string[];
  resources: string[];
  isPublic: boolean;
  progress?: number | null;
}

/** Long-form research notes (the original Second Brain / TIL surface). */
export default function NotesPanel() {
  const [learnings, setLearnings] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [takeawayInput, setTakeawayInput] = useState("");
  const [resourceInput, setResourceInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [rawIngestInput, setRawIngestInput] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestStatusMsg, setIngestStatusMsg] = useState("");

  const [current, setCurrent] = useState<LearningItem>({
    id: "",
    title: "",
    category: "System Design",
    status: "learning",
    content: "",
    takeaways: [],
    resources: [],
    isPublic: true,
  });

  const fetchLearnings = async () => {
    try {
      const res = await fetch("/api/ops/learnings");
      const data = await res.json();
      if (Array.isArray(data)) setLearnings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearnings();
  }, []);

  const handleNew = () => {
    setCurrent({
      id: `learn-${Date.now()}`,
      title: "",
      category: "System Design",
      status: "learning",
      content: "",
      takeaways: [],
      resources: [],
      isPublic: true,
    });
    setRawIngestInput("");
    setIngestStatusMsg("");
    setIsEditing(true);
  };

  const handleEdit = (item: LearningItem) => {
    setCurrent(item);
    setRawIngestInput("");
    setIngestStatusMsg("");
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this research topic?")) return;
    try {
      await fetch("/api/ops/learnings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchLearnings();
      if (current.id === id) setIsEditing(false);
    } catch {
      alert("Delete failed");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current.title) {
      alert("Title is required");
      return;
    }
    try {
      const res = await fetch("/api/ops/learnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
      if (res.ok) {
        await fetchLearnings();
        setIsEditing(false);
      }
    } catch {
      alert("Save failed");
    }
  };

  const handleAutoIngest = async () => {
    if (!rawIngestInput.trim()) {
      alert("Please paste research notes, paper abstract, or GitHub topic first.");
      return;
    }

    setIsIngesting(true);
    setIngestStatusMsg("Analyzing technical concepts with Groq Qwen 3.8...");

    try {
      const res = await fetch("/api/ops/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ingest_research",
          input: rawIngestInput,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setIngestStatusMsg(`Ingestion error: ${data.error}`);
        return;
      }

      setCurrent((prev) => ({
        ...prev,
        title: data.title || prev.title,
        category: data.category || prev.category,
        content: data.content || prev.content,
        takeaways: data.takeaways?.length ? data.takeaways : prev.takeaways,
        resources: data.resources?.length ? data.resources : prev.resources,
      }));

      setIngestStatusMsg(`✓ Extracted "${data.title}" into Second Brain! Form auto-populated.`);
    } catch {
      setIngestStatusMsg("Failed to auto-ingest. Check connection.");
    } finally {
      setIsIngesting(false);
    }
  };

  const addTakeaway = () => {
    if (!takeawayInput.trim()) return;
    setCurrent({
      ...current,
      takeaways: [...current.takeaways, takeawayInput.trim()],
    });
    setTakeawayInput("");
  };

  const removeTakeaway = (idx: number) => {
    setCurrent({
      ...current,
      takeaways: current.takeaways.filter((_, i) => i !== idx),
    });
  };

  const addResource = () => {
    if (!resourceInput.trim()) return;
    setCurrent({
      ...current,
      resources: [...current.resources, resourceInput.trim()],
    });
    setResourceInput("");
  };

  const removeResource = (idx: number) => {
    setCurrent({
      ...current,
      resources: current.resources.filter((_, i) => i !== idx),
    });
  };

  const field =
    "w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-mono text-text-muted flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-accent" />
          {learnings.length} note{learnings.length === 1 ? "" : "s"} · long-form research, papers and mental models
        </p>
        {!isEditing && (
          <button
            onClick={handleNew}
            className="flex items-center gap-1.5 px-3 py-2 bg-accent hover:bg-accent-hover text-black font-semibold text-[11px] font-mono rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add topic / note
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-bg-surface border border-border rounded-xl p-4 sm:p-6 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <span className="font-bold uppercase text-accent">
              {current.id ? "Edit research note" : "New second brain entry"}
            </span>
            <button
              onClick={() => setIsEditing(false)}
              className="text-text-muted hover:text-text-primary cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* 1-Click Research Ingestion Box */}
          <div className="p-3 bg-accent/5 border border-accent/30 rounded-lg space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-xs font-mono font-bold text-accent flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> 1-Click Research Ingestion (Groq Qwen 3.8)
              </span>
              <span className="text-[10px] font-mono text-text-muted">Extracts title, summary & takeaways</span>
            </div>
            <textarea
              rows={3}
              value={rawIngestInput}
              onChange={(e) => setRawIngestInput(e.target.value)}
              placeholder="Paste raw paper notes, GitHub README excerpt, or engineering observations here to auto-structure..."
              className="w-full bg-bg border border-border rounded-lg p-2 text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-text-muted">
                {ingestStatusMsg || "Sub-400ms synthesis powered by Groq Qwen 3.8."}
              </span>
              <button
                type="button"
                onClick={handleAutoIngest}
                disabled={isIngesting || !rawIngestInput.trim()}
                className="px-3 py-1 bg-accent hover:bg-accent-hover text-black font-semibold text-xs font-mono rounded transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isIngesting ? "Synthesizing..." : "Auto-Ingest"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-text-muted mb-1">Topic title *</label>
              <input
                type="text"
                value={current.title}
                onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                placeholder="e.g. Distributed Consensus Protocols (Raft & Paxos)"
                required
                className={field}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-text-muted mb-1">Category</label>
                <select
                  value={current.category}
                  onChange={(e) => setCurrent({ ...current, category: e.target.value })}
                  className={field}
                >
                  <option value="System Design">System Design</option>
                  <option value="Backend">Backend & APIs</option>
                  <option value="Frontend">Frontend Craft</option>
                  <option value="DevOps & Systems">DevOps & Systems</option>
                  <option value="Databases">Databases & Storage</option>
                  <option value="AI & ML">AI & Automation</option>
                  <option value="DSA">DSA</option>
                </select>
              </div>

              <div>
                <label className="block text-text-muted mb-1">Status</label>
                <select
                  value={current.status}
                  onChange={(e) => setCurrent({ ...current, status: e.target.value as any })}
                  className={field}
                >
                  <option value="learning">In progress (active study)</option>
                  <option value="completed">Mastered / completed</option>
                  <option value="queued">Queued for next</option>
                </select>
              </div>

              <div className="flex items-center sm:pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={current.isPublic}
                    onChange={(e) => setCurrent({ ...current, isPublic: e.target.checked })}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className={current.isPublic ? "text-emerald-400 font-bold" : "text-text-muted"}>
                    {current.isPublic ? "Public on portfolio" : "Private (ops only)"}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-text-muted">Research notes / deep dive (.md)</label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-[11px] text-text-primary hover:text-accent cursor-pointer"
                >
                  <span>{showPreview ? "Hide preview" : "Preview .md"}</span>
                </button>
              </div>
              <textarea
                rows={6}
                value={current.content}
                onChange={(e) => setCurrent({ ...current, content: e.target.value })}
                placeholder="Write observations, trade-offs, architecture decisions..."
                className={`${field} font-mono text-xs`}
              />
              {showPreview && (
                <div className="mt-3">
                  <MarkdownPreview
                    content={current.content || "*(No research content entered yet)*"}
                    title={`Notes: ${current.title || "Research Topic"}`}
                    filename={`${
                      current.title ? current.title.toLowerCase().replace(/[^a-z0-9]/g, "-") : "note"
                    }.md`}
                    defaultMode="split"
                  />
                </div>
              )}
            </div>

            {/* Takeaways */}
            <div>
              <label className="block text-text-muted mb-1">Key takeaways (bullet points)</label>
              <div className="space-y-1.5 mb-2">
                {current.takeaways.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-bg border border-border-subtle rounded flex items-center justify-between gap-2 text-text-primary"
                  >
                    <span className="min-w-0 truncate">• {t}</span>
                    <button
                      type="button"
                      onClick={() => removeTakeaway(idx)}
                      className="text-text-muted hover:text-red-400 shrink-0 cursor-pointer"
                      aria-label="Remove takeaway"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={takeawayInput}
                  onChange={(e) => setTakeawayInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTakeaway())}
                  placeholder="Add core concept and press Enter..."
                  className={field}
                />
                <button
                  type="button"
                  onClick={addTakeaway}
                  className="px-3 py-1 bg-bg-elevated hover:bg-border rounded text-text-primary shrink-0 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Resources */}
            <div>
              <label className="block text-text-muted mb-1">Resources & citations</label>
              <div className="space-y-1 mb-2">
                {current.resources.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 bg-bg border border-border-subtle rounded flex items-center justify-between gap-2 text-[11px] text-text-muted"
                  >
                    <span className="min-w-0 truncate">{r}</span>
                    <button
                      type="button"
                      onClick={() => removeResource(idx)}
                      className="text-text-muted hover:text-red-400 shrink-0 cursor-pointer"
                      aria-label="Remove resource"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={resourceInput}
                  onChange={(e) => setResourceInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addResource())}
                  placeholder="e.g. Raft paper (Ongaro & Ousterhout) or URL..."
                  className={field}
                />
                <button
                  type="button"
                  onClick={addResource}
                  className="px-3 py-1 bg-bg-elevated hover:bg-border rounded text-text-primary shrink-0 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-black font-semibold rounded-lg cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save topic
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && (
            <p className="text-[11px] font-mono text-text-muted">Loading research notes…</p>
          )}
          {!loading && learnings.length === 0 && (
            <div className="md:col-span-2 rounded-xl border border-dashed border-border p-8 text-center space-y-2">
              <BookOpen className="w-5 h-5 text-accent mx-auto" />
              <p className="text-[11px] font-mono text-text-muted">
                No research notes yet. Add a deep-dive or paste raw notes into the AI ingester.
              </p>
            </div>
          )}

          {learnings.map((item) => (
            <div
              key={item.id}
              className="bg-bg-surface border border-border rounded-xl p-5 space-y-3 font-mono text-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-bg-elevated text-text-muted">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.isPublic ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Public
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-text-primary text-sm font-sans">{item.title}</h3>
                <p className="text-text-muted text-[11px] leading-relaxed line-clamp-3">
                  {item.content}
                </p>

                {item.takeaways && item.takeaways.length > 0 && (
                  <div className="pt-2 border-t border-border-subtle space-y-1">
                    <span className="text-[10px] text-accent uppercase font-bold">Key takeaways</span>
                    {item.takeaways.slice(0, 2).map((take, i) => (
                      <div key={i} className="text-[11px] text-text-primary">
                        • {take}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    item.status === "completed"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : item.status === "learning"
                      ? "bg-accent/20 text-accent"
                      : "bg-bg-elevated text-text-muted"
                  }`}
                >
                  {item.status}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    aria-label="Edit note"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
