"use client";

import React, { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Github,
  Star,
  Sparkles,
  Save,
} from "lucide-react";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  summaryEn: string;
  summaryBn: string;
  category: string;
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  sortOrder: number;
}

export default function OpsProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [translating, setTranslating] = useState(false);

  const [current, setCurrent] = useState<ProjectItem>({
    id: "",
    slug: "",
    title: "",
    summaryEn: "",
    summaryBn: "",
    category: "Full Stack",
    techStack: ["React", "Node.js", "TypeScript"],
    liveUrl: "",
    repoUrl: "",
    featured: false,
    sortOrder: 1,
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/ops/projects");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleNew = () => {
    setCurrent({
      id: `proj-${Date.now()}`,
      slug: "",
      title: "",
      summaryEn: "",
      summaryBn: "",
      category: "Full Stack",
      techStack: ["Next.js", "TypeScript"],
      liveUrl: "",
      repoUrl: "",
      featured: false,
      sortOrder: projects.length + 1,
    });
    setIsEditing(true);
  };

  const handleEdit = (p: ProjectItem) => {
    setCurrent(p);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this project from portfolio?")) return;
    try {
      await fetch("/api/ops/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchProjects();
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
      const res = await fetch("/api/ops/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
      if (res.ok) {
        await fetchProjects();
        setIsEditing(false);
      }
    } catch {
      alert("Failed to save project");
    }
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    if (!current.techStack.includes(techInput.trim())) {
      setCurrent({
        ...current,
        techStack: [...current.techStack, techInput.trim()],
      });
    }
    setTechInput("");
  };

  const removeTech = (item: string) => {
    setCurrent({
      ...current,
      techStack: current.techStack.filter((t) => t !== item),
    });
  };

  const handleTranslateAI = async () => {
    if (!current.summaryEn) {
      alert("Please enter English summary first.");
      return;
    }
    setTranslating(true);
    try {
      const res = await fetch("/api/ops/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "translate",
          text: current.summaryEn,
          targetLang: "bn",
        }),
      });
      const data = await res.json();
      if (data.result) {
        setCurrent((prev) => ({ ...prev, summaryBn: data.result }));
      }
    } catch {
      alert("Translation failed");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-text-primary flex flex-wrap items-center gap-2">
            <Layers className="w-5 h-5 text-accent" />
            PROJECT PORTFOLIO MANAGER
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            Curate showcase engineering projects with bilingual descriptions and tech badges.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-3 py-2 bg-accent hover:bg-accent-hover text-black font-semibold text-xs font-mono rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-bg-surface border border-border rounded-xl p-6 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <span className="font-bold uppercase text-accent">
              {current.id ? "Edit Project" : "New Showcase Project"}
            </span>
            <button
              onClick={() => setIsEditing(false)}
              className="text-text-muted hover:text-text-primary"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-text-muted mb-1">Project Name *</label>
                <input
                  type="text"
                  value={current.title}
                  onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                  placeholder="e.g. DigiCash"
                  required
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1">Category</label>
                <select
                  value={current.category}
                  onChange={(e) => setCurrent({ ...current, category: e.target.value })}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Frontend & AI">Frontend & AI</option>
                  <option value="Backend">Backend & Systems</option>
                  <option value="Mobile">Mobile & PWA</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={current.featured}
                    onChange={(e) => setCurrent({ ...current, featured: e.target.checked })}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className={current.featured ? "text-accent font-bold" : "text-text-muted"}>
                    ★ Featured Showcase
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-text-muted mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={current.liveUrl || ""}
                  onChange={(e) => setCurrent({ ...current, liveUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  value={current.repoUrl || ""}
                  onChange={(e) => setCurrent({ ...current, repoUrl: e.target.value })}
                  placeholder="https://github.com/joychandrauday/..."
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-text-muted">Summary (English)</label>
                <button
                  type="button"
                  onClick={handleTranslateAI}
                  disabled={translating}
                  className="flex items-center gap-1 text-[11px] text-accent hover:underline disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{translating ? "Translating..." : "AI Auto-Translate to Bengali"}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={current.summaryEn}
                onChange={(e) => setCurrent({ ...current, summaryEn: e.target.value })}
                placeholder="High impact overview in English..."
                className="w-full bg-bg border border-border rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-text-muted mb-1 font-bengali">সারাংশ (বাংলা)</label>
              <textarea
                rows={3}
                value={current.summaryBn}
                onChange={(e) => setCurrent({ ...current, summaryBn: e.target.value })}
                placeholder="বাংলায় প্রজেক্টের সংক্ষিপ্ত বিবরণ..."
                className="w-full bg-bg border border-border rounded-lg p-2.5 font-bengali text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            {/* Tech stack tags */}
            <div>
              <label className="block text-text-muted mb-1">Tech Stack</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {current.techStack.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg border border-border rounded text-[11px] text-text-primary"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTech(t)}
                      className="text-text-muted hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                  placeholder="e.g. Docker, Redis, Socket.io and hit Enter..."
                  className="bg-bg border border-border rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-3 py-1 bg-bg-elevated hover:bg-border rounded text-text-primary"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-black font-semibold rounded-lg"
              >
                <Save className="w-4 h-4" /> Save Project
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-bg-surface border border-border rounded-xl p-5 space-y-3 font-mono text-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-accent">
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span className="text-[10px] text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> Featured
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-text-primary font-sans">{proj.title}</h3>
                <p className="text-text-muted text-[11px] leading-relaxed line-clamp-3">
                  {proj.summaryEn}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.techStack?.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 bg-bg border border-border-subtle rounded text-[10px] text-text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-muted hover:text-accent transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-muted hover:text-accent transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
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
