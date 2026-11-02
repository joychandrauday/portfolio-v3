"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { projects as rawProjects, Project } from "@/lib/data";
import { ArrowUpRight, Github, ArrowRight, Layers, Cpu, ShieldCheck } from "lucide-react";

export default function RetroExhibition() {
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

  // Show ONLY featured projects on landing page (Strict User Requirement)
  const featuredOnly = projectsList.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredOnly.length > 0 ? featuredOnly : projectsList.slice(0, 3);

  const getPlateNumber = (index: number) => {
    const numerals = ["I", "II", "III", "IV", "V"];
    return numerals[index] || `${index + 1}`;
  };

  return (
    <section id="works" className="py-12 sm:py-20 border-b border-border/70 scroll-mt-6">
      <div className="space-y-8">
        
        {/* Section Header with generous whitespace */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase tracking-widest">
              [ SECTION III // CURATED ARCHIVE ]
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal">
              {isBn ? "নির্বাচিত প্রকৌশল কাজ ও সিস্টেম প্রদর্শনী" : "Exhibition of Featured Engineering Works"}
            </h3>
          </div>
          <p className="font-mono text-xs text-text-muted">
            {isBn ? "ল্যান্ডিং পেজে শুধুমাত্র নির্বাচিত কাজসমূহ প্রদর্শিত" : "Showing 3 Selected Works"}
          </p>
        </div>

        {/* Exhibition Plates List */}
        <div className="space-y-8">
          {displayProjects.map((project, idx) => (
            <article
              key={project.title}
              className="p-6 sm:p-8 bg-bg-surface border border-border/80 hover:border-text-primary/70 transition-all rounded-sm space-y-4 group"
            >
              {/* Plate Header Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-accent">
                    [ PLATE {getPlateNumber(idx)} ]
                  </span>
                  <span className="opacity-30">•</span>
                  <span className="px-2 py-0.5 rounded bg-bg border border-border/70 text-[10px] uppercase tracking-wider text-text-muted">
                    {project.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 text-[11px]"
                      title="View Source Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>SOURCE</span>
                    </a>
                  )}

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 text-[11px]"
                      title="Inspect Live System"
                    >
                      <span>LIVE</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Title & Signature */}
              <div className="space-y-1">
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {project.title}
                </h4>
                {project.signature && (
                  <p className="font-mono text-xs text-text-muted tracking-wide">
                    // {project.signature}
                  </p>
                )}
              </div>

              {/* Detailed Description */}
              <p
                className={`text-sm sm:text-base text-text-secondary leading-relaxed font-serif ${
                  isBn ? "font-bengali text-base leading-relaxed" : ""
                }`}
              >
                {isBn && project.descriptionBn ? project.descriptionBn : project.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-[11px] text-text-muted">
                <span className="text-[10px] tracking-widest uppercase opacity-50 mr-1">
                  STACK:
                </span>
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-bg border border-border/60 text-text-secondary text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Dedicated "View All" Button Link (Strict User Requirement) */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs border-t border-border/60">
          <span className="text-text-muted text-[11px]">
            {isBn
              ? `সম্পূর্ণ সংগ্রহশালায় মোট ${projectsList.length}টি প্রকল্প রয়েছে`
              : `Complete archive contains ${projectsList.length} production platforms & primitives`}
          </span>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-3 rounded border border-border hover:border-text-primary bg-bg-surface hover:bg-bg text-text-primary font-semibold transition-all group self-start sm:self-auto"
          >
            <span>
              {isBn
                ? `সকল প্রকল্প দেখুন (${projectsList.length}টি প্রকল্প) →`
                : `Browse Complete Engineering Archive (${projectsList.length} Works)`}
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
