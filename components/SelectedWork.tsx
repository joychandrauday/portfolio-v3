"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { projects as rawProjects, Project } from "@/lib/data";
import { ArrowUpRight, Github, ArrowRight } from "lucide-react";

export default function SelectedWork() {
  const { isBn } = useLanguage();
  const [projectsList, setProjectsList] = useState<Project[]>(rawProjects);

  useEffect(() => {
    async function loadFromDb() {
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
    loadFromDb();
  }, []);

  // Filter to show ONLY featured projects on landing page
  const featuredProjects = projectsList.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projectsList.slice(0, 3);

  return (
    <section id="work" className="space-y-6 pt-10 border-t border-border">
      <div className="flex items-center justify-between font-mono text-xs">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
          {isBn ? "নির্বাচিত প্রকল্পসমূহ" : "Featured Projects"}
        </h2>
        <span className="text-text-muted text-[11px]">[ 01 ]</span>
      </div>

      <div className="divide-y divide-border/60">
        {displayProjects.map((project) => (
          <div
            key={project.title}
            className="py-5 first:pt-1 last:pb-1 space-y-2 group"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-center gap-2">
                <h3
                  className={`text-base font-semibold text-text-primary group-hover:text-accent transition-colors ${
                    isBn ? "font-bengali text-lg" : "font-sans"
                  }`}
                >
                  {project.title}
                </h3>
                <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded-full bg-bg-surface border border-border">
                  {project.category}
                </span>
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
                    title="Live Preview"
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

            <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[11px] text-text-muted">
              {project.tech.map((t) => (
                <span key={t} className="text-text-muted/80">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* View All Projects Button */}
      <div className="pt-2">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors py-1.5"
        >
          <span>
            {isBn
              ? `সকল প্রকল্প দেখুন (${projectsList.length}) →`
              : `View all projects & primitives (${projectsList.length}) →`}
          </span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
