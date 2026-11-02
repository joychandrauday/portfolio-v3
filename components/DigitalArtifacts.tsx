"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { projects as rawProjects } from "@/lib/data";
import { ExternalLink, Github, ArrowUpRight, Terminal, Star, Layers } from "lucide-react";

export default function DigitalArtifacts() {
  const { isBn } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [projectsList, setProjectsList] = useState(rawProjects);

  useEffect(() => {
    async function loadFromDb() {
      try {
        const res = await fetch("/api/ops/projects");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d) => ({
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

  const categories = ["all", "Distributed Systems & DB", "Workflow & Backend", "AI & Systems", "Full Stack"];

  const filtered =
    activeTab === "all"
      ? projectsList
      : projectsList.filter((p) =>
          p.category.toLowerCase().includes(activeTab.toLowerCase())
        );

  return (
    <section id="projects" className="relative min-h-screen flex flex-col justify-center py-28 px-6 sm:px-12 bg-neutral-950 text-white overflow-hidden border-b border-white/[0.06]">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/[0.02] blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-16">
        {/* Header Block from Production */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-white/[0.06]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-mono text-xs uppercase tracking-widest font-semibold">
                {isBn ? "নির্বাচিত প্রজেক্টসমূহ" : "Selected Works"}
              </span>
            </div>

            <h2
              className={`text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none ${
                isBn ? "font-bengali" : "font-sans"
              }`}
            >
              Digital{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                Artifacts
              </span>
            </h2>

            <p
              className={`max-w-xl text-text-secondary border-l-2 border-white/20 pl-4 text-sm sm:text-base leading-relaxed ${
                isBn ? "font-bengaliSerif text-base text-text-primary/80" : "font-sans"
              }`}
            >
              {isBn
                ? "বাস্তব ব্যবহারের জন্য নির্মিত সিস্টেম, আর্কিটেকচারাল স্টাডি ও উদ্ভাবনী প্রোডাক্ট।"
                : "Crafting high-performance web applications with a focus on motion, aesthetics, and scalable architecture."}
            </p>
          </div>

          <div className="text-right font-mono text-xs space-y-1">
            <div className="text-text-muted uppercase tracking-widest text-[10px]">
              OPERATIONAL STATUS
            </div>
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for High-Impact Roles</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveTab(c)}
              className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeTab === c
                  ? "bg-accent text-black font-bold shadow-md shadow-accent/20"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white border border-white/[0.06]"
              }`}
            >
              {c === "all" ? (isBn ? "সবগুলো কাজ" : "All Artifacts") : c}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((p, idx) => (
            <div
              key={p.title}
              className="group relative p-8 sm:p-10 rounded-3xl bg-[#0c0c0c] border border-white/[0.08] hover:border-accent/40 transition-all duration-300 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-accent uppercase tracking-wider text-[11px] font-bold">
                    // 0{idx + 1} · {p.category}
                  </span>
                  {p.featured && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>Flagship</span>
                    </span>
                  )}
                </div>

                <h3
                  className={`text-2xl sm:text-3xl font-bold text-white group-hover:text-accent transition-colors ${
                    isBn ? "font-bengali" : "font-sans"
                  }`}
                >
                  {p.title}
                </h3>

                <p
                  className={`text-sm sm:text-base text-text-secondary leading-relaxed ${
                    isBn ? "font-bengaliSerif text-base text-text-primary/80" : "font-sans"
                  }`}
                >
                  {isBn && p.descriptionBn ? p.descriptionBn : p.description}
                </p>

                {p.signature && (
                  <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-xs text-text-muted flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="text-text-primary font-medium">{p.signature}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded bg-white/[0.04] text-[11px] text-text-muted border border-white/[0.04]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 font-mono text-xs">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-text-muted hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source Repository</span>
                    </a>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent hover:underline font-semibold ml-auto"
                    >
                      <span>Live Demonstration</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
