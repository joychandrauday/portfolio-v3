"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";
import { projects as fallbackProjects, Project } from "@/lib/data";
import { ArrowLeft, ArrowUpRight, Github, Search } from "lucide-react";

export default function ProjectsPage() {
  const { isBn } = useLanguage();
  const [projectsList, setProjectsList] = useState<Project[]>(fallbackProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/ops/projects");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Project[] = data.map((d: any) => ({
            title: d.title,
            description: d.summaryEn,
            descriptionBn: d.summaryBn,
            tech: d.techStack || [],
            category: d.category,
            link: d.liveUrl || undefined,
            github: d.repoUrl || undefined,
            signature: d.category,
            featured: Boolean(d.featured),
          }));
          setProjectsList(mapped);
        }
      } catch {}
    }
    loadProjects();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(projectsList.map((p) => p.category))),
  ];

  const filtered = projectsList.filter((project) => {
    const matchesCat =
      selectedCategory === "All" || project.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    return (
      matchesCat &&
      (project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        (project.descriptionBn && project.descriptionBn.toLowerCase().includes(q)) ||
        project.tech.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/15 selection:text-text-primary">
      <main className="max-w-2xl mx-auto px-6 py-10 sm:py-14 space-y-8">
        <Header />

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? "মূল পাতায় ফিরুন" : "return"}</span>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {isBn ? "প্রকল্প ও ইঞ্জিনিয়ারিং সিস্টেমসমূহ" : "Projects & Engineering Primitives"}
          </h1>
          <p className="text-sm text-text-secondary">
            {isBn
              ? "উচ্চ-কনকারেন্সি ব্যাকএন্ড, ইমিউটেবল লেজার, ডিস্ট্রিবিউটেড স্টেট মেশিন ও ডেভলপার টুলসের সম্পূর্ণ আর্কাইভ।"
              : "A catalog of resilient backends, append-only ledgers, idempotent workflows, and developer tooling."}
          </p>
        </div>

        {/* Filter controls */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, stack, or keyword..."
              className="w-full bg-bg-surface border border-border focus:border-text-primary rounded-lg pl-8 pr-3 py-1.5 text-xs font-sans text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-text-primary text-bg font-medium"
                    : "bg-bg-surface text-text-muted hover:text-text-primary border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects list */}
        <div className="divide-y divide-border/60 border-t border-border/60 pt-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs font-mono text-text-muted">
              {isBn ? "কোনো প্রজেক্ট পাওয়া যায়নি।" : "No projects match your filter."}
            </div>
          ) : (
            filtered.map((project) => (
              <div
                key={project.title}
                className="py-5 first:pt-2 last:pb-2 space-y-2 group"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {project.title}
                    </h2>
                    <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded-full bg-bg-surface border border-border">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-text-primary font-medium">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs shrink-0 text-text-muted">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-text-primary transition-colors flex items-center gap-1"
                        title="Source Code"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">code</span>
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-text-primary transition-colors flex items-center gap-0.5"
                        title="Live Demo"
                      >
                        <span>live</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <p
                  className={`text-xs sm:text-sm text-text-secondary leading-relaxed ${
                    isBn ? "font-bengali text-sm text-text-primary/80" : "font-sans"
                  }`}
                >
                  {isBn && project.descriptionBn ? project.descriptionBn : project.description}
                </p>

                {project.signature && (
                  <div className="font-mono text-[11px] text-text-muted flex items-center gap-1.5">
                    <span>//</span>
                    <span>{project.signature}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-0.5 font-mono text-[10px] text-text-muted">
                  {project.tech.map((t) => (
                    <span key={t} className="text-text-muted/80">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
