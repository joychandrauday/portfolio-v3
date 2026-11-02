"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { projects as fallbackProjects } from "@/lib/data";
import { ArrowUpRight, Github, Star } from "lucide-react";

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
}

export default function Projects() {
  const { t, isBn } = useLanguage();
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/ops/projects");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          return;
        }
      } catch {}

      const mapped = fallbackProjects.map((p, idx) => ({
        id: `fb-${idx}`,
        slug: p.title.toLowerCase().replace(/\s+/g, "-"),
        title: p.title,
        summaryEn: p.description,
        summaryBn: p.descriptionBn,
        category: p.category,
        techStack: p.tech,
        liveUrl: p.link || null,
        repoUrl: p.github || null,
        featured: Boolean(p.featured),
      }));
      setItems(mapped);
    }

    loadProjects();
  }, []);

  const categories = [
    { key: "all", label: t.projects.all },
    { key: "Distributed", label: "Distributed & DB" },
    { key: "Workflow", label: "Workflows" },
    { key: "AI", label: "AI Systems" },
    { key: "Full Stack", label: t.projects.fullstack },
  ];

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((p) =>
          p.category.toLowerCase().includes(activeFilter.toLowerCase())
        );

  return (
    <section id="projects" className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto w-full space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06] font-mono text-xs text-text-muted">
          <div className="flex items-center gap-3">
            <span className="text-accent font-bold">[ 02 ]</span>
            <span className="tracking-widest uppercase text-text-primary">
              {t.projects.title}
            </span>
            <span className="text-white/20">/</span>
            <span>SYSTEMS PORTFOLIO</span>
          </div>

          {/* Minimal Filter Navigation */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveFilter(c.key)}
                className={`transition-colors cursor-pointer ${
                  activeFilter === c.key
                    ? "text-accent font-bold underline underline-offset-4"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Big Editorial Subtitle */}
        <div>
          <h2
            className={`text-3xl sm:text-5xl font-bold tracking-tight text-[#f7f7f7] ${
              isBn ? "font-bengali" : "font-sans"
            }`}
          >
            {t.projects.subtitle}
          </h2>
        </div>

        {/* Minimal Editorial Rows (No box design, airy hairlines) */}
        <div className="divide-y divide-white/[0.06]">
          {filteredItems.map((p, idx) => {
            const summary = isBn && p.summaryBn ? p.summaryBn : p.summaryEn;

            return (
              <div
                key={p.id}
                className="py-10 first:pt-4 last:pb-4 group transition-all"
              >
                <div className="space-y-4">
                  {/* Top metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-text-muted">
                    <div className="flex items-center gap-3">
                      <span className="text-accent font-bold">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-white/20">/</span>
                      <span className="uppercase tracking-wider text-text-muted">
                        {p.category}
                      </span>
                      {p.featured && (
                        <span className="text-amber-400/90 flex items-center gap-1 text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>Flagship</span>
                        </span>
                      )}
                    </div>

                    {/* Action links */}
                    <div className="flex items-center gap-4 text-xs">
                      {p.repoUrl && (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-text-muted hover:text-white transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
                        >
                          <span>Live View</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Large Project Title */}
                  <h3
                    className={`text-2xl sm:text-4xl font-bold text-text-primary group-hover:text-accent transition-colors ${
                      isBn ? "font-bengali" : "font-sans"
                    }`}
                  >
                    {p.title}
                  </h3>

                  {/* Narrative summary */}
                  <p
                    className={`max-w-3xl text-sm sm:text-base text-text-secondary leading-relaxed ${
                      isBn ? "font-bengaliSerif text-base text-text-primary/80 leading-loose" : "font-sans"
                    }`}
                  >
                    {summary}
                  </p>

                  {/* Minimalist Tech Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs text-text-muted">
                    <span className="text-white/30 text-[11px]">STACK:</span>
                    {p.techStack?.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-text-secondary text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
