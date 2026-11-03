"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Plus,
  Search,
  Terminal,
  Sparkles,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  Trash2,
  Edit3,
  ExternalLink,
  Heart,
  Eye,
  Check,
  X,
  Palette,
} from "lucide-react";

interface InsightItem {
  id: string;
  slug: string;
  title: string;
  topic: string;
  category: string;
  summary?: string | null;
  content: string;
  codeSnippet?: string | null;
  commandSnippet?: string | null;
  bgTheme: string;
  tags: string[];
  isPublished: boolean;
  likesCount: number;
  sortOrder: number;
  createdAt: string;
}

const THEMES = [
  { id: "cyber-mesh", label: "Cyber Mesh", color: "#6366f1" },
  { id: "obsidian-terminal", label: "Obsidian Terminal", color: "#f59e0b" },
  { id: "emerald-matrix", label: "Emerald Matrix", color: "#10b981" },
  { id: "solar-flare", label: "Solar Flare", color: "#f43f5e" },
  { id: "indigo-nebula", label: "Indigo Nebula", color: "#3b82f6" },
  { id: "amber-vintage", label: "Amber Vintage", color: "#FFB44B" },
];

export default function OpsFeedPage() {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Partial<InsightItem>>({
    title: "",
    topic: "dev-hacks",
    category: "DEV HACKS",
    summary: "",
    content: "",
    codeSnippet: "",
    commandSnippet: "",
    bgTheme: "cyber-mesh",
    tags: ["hacks"],
    isPublished: true,
  });
  const [tagInput, setTagInput] = useState("hacks");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ops/feed");
      const data = await res.json();
      if (Array.isArray(data.items)) setInsights(data.items);
    } catch (err) {
      console.error("Failed to load feed items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const filtered = insights.filter((i) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      i.title.toLowerCase().includes(q) ||
      i.content.toLowerCase().includes(q) ||
      i.tags.some((t) => t.toLowerCase().includes(q));
    const matchTopic = selectedTopic === "all" || i.topic === selectedTopic;
    return matchSearch && matchTopic;
  });

  const handleOpenModal = (item?: InsightItem) => {
    if (item) {
      setForm(item);
      setTagInput(item.tags.join(", "));
    } else {
      setForm({
        title: "",
        topic: selectedTopic !== "all" ? selectedTopic : "dev-hacks",
        category: "ENGINEERING",
        summary: "",
        content: "",
        codeSnippet: "",
        commandSnippet: "",
        bgTheme: "cyber-mesh",
        tags: ["engineering"],
        isPublished: true,
      });
      setTagInput("engineering");
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        action: form.id ? "update_insight" : "create_insight",
        ...form,
        tags,
      };

      const res = await fetch("/api/ops/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      await fetchInsights();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete micro-insight "${title}"?`)) return;
    try {
      const res = await fetch("/api/ops/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_insight", id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchInsights();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" />
            <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-text-primary">
              MICRO-INSIGHTS FEED CURATOR
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent font-semibold">
              Reels Style
            </span>
          </div>
          <p className="text-xs font-mono text-text-muted mt-1">
            Curate snap-scroll micro-tutorials, terminal hacks, AI recipes, and wealth principles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/feed"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg-surface text-text-secondary hover:text-text-primary text-xs font-mono transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-accent" />
            <span>Open Live Feed</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-black font-semibold text-xs font-mono hover:bg-accent/90 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Insight</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-bg-surface border border-border rounded-xl p-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search insights by title, content, or tag..."
            className="w-full bg-bg border border-border focus:border-accent rounded-lg pl-8 pr-4 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {["all", "linux", "ai", "system-design", "dev-hacks", "money", "security"].map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-2.5 py-1 rounded text-[10px] uppercase font-semibold transition-colors cursor-pointer border ${
                selectedTopic === topic
                  ? "bg-accent/20 border-accent/40 text-accent font-bold"
                  : "bg-bg border-border text-text-muted hover:text-text-primary"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-text-muted">Loading insights...</div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl py-16 text-center text-xs font-mono text-text-muted space-y-3">
          <Flame className="w-8 h-8 mx-auto text-accent/50" />
          <p>No micro-insights found for this criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-bg-surface border border-border hover:border-text-primary/40 rounded-xl space-y-3 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent font-semibold uppercase text-[10px]">
                    // {item.category || item.topic}
                  </span>

                  <div className="flex items-center gap-2 text-text-muted text-[11px]">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>{item.likesCount}</span>
                    </span>
                    <span>•</span>
                    <span className={item.isPublished ? "text-emerald-400 font-bold" : "text-text-muted"}>
                      {item.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold font-serif text-text-primary group-hover:text-accent transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-text-secondary font-serif line-clamp-3 leading-relaxed">
                  {item.content}
                </p>

                {item.codeSnippet && (
                  <pre className="p-2.5 bg-bg rounded-lg border border-border/80 text-[11px] font-mono text-accent truncate">
                    <code>{item.codeSnippet}</code>
                  </pre>
                )}

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((t) => (
                    <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg text-text-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted text-[11px]">Theme: {item.bgTheme}</span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/feed#${item.slug}`}
                    target="_blank"
                    className="p-1 text-text-muted hover:text-accent transition-colors"
                    title="View in Feed"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    title="Edit Insight"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1 text-text-muted hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Insight"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ─────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-bg-surface border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-base font-bold font-mono text-text-primary flex items-center gap-2">
                <Flame className="w-4 h-4 text-accent" />
                <span>{form.id ? "EDIT MICRO-INSIGHT" : "NEW MICRO-INSIGHT"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 5x Faster File Batching in Linux with find + instead of \;"
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-text-muted uppercase tracking-wider block">Topic Channel</label>
                  <select
                    value={form.topic || "dev-hacks"}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                  >
                    <option value="linux">Linux</option>
                    <option value="ai">AI & LLMs</option>
                    <option value="system-design">System Design</option>
                    <option value="dev-hacks">Dev Hacks</option>
                    <option value="money">Money & Wealth</option>
                    <option value="security">Security</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-text-muted uppercase tracking-wider block">Category Tag</label>
                  <input
                    type="text"
                    value={form.category || ""}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. TERMINAL HACK"
                    className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Core Content / Micro-Tutorial *</label>
                <textarea
                  rows={4}
                  required
                  value={form.content || ""}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Bite-sized insight, explanation, or trick..."
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Code / Command Snippet (Optional)</label>
                <textarea
                  rows={3}
                  value={form.codeSnippet || ""}
                  onChange={(e) => setForm({ ...form, codeSnippet: e.target.value })}
                  placeholder="# Example command or code..."
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-accent focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Background Aesthetic Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setForm({ ...form, bgTheme: th.id })}
                      className={`p-2 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        form.bgTheme === th.id
                          ? "border-accent bg-accent/10 text-accent font-bold"
                          : "border-border bg-bg text-text-muted hover:text-text-primary"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.color }} />
                      <span className="text-[10px] truncate">{th.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-text-muted uppercase tracking-wider block">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. linux, bash, performance"
                  className="w-full bg-bg border border-border focus:border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-bg rounded-lg border border-border">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished ?? true}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <label htmlFor="isPublished" className="text-text-primary cursor-pointer">
                  Publish to Public Snap Feed (/feed)
                </label>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-border text-text-muted hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-accent text-black font-semibold hover:bg-accent/90 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Insight"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
