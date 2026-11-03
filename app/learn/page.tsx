"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { Search, BookOpen, Clock, ArrowRight, ArrowLeft, Layers, Compass, Flame } from "lucide-react";
import { ROADMAPS, toRoadmapSummary, type RoadmapSummary } from "@/lib/roadmaps-data";

export default function LearnIndex() {
  const { isBn } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>(ROADMAPS.map(toRoadmapSummary));
  const [activeDifficulty, setActiveDifficulty] = useState<string>("all");

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const res = await fetch("/api/ops/learn/roadmaps", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.roadmaps) && data.roadmaps.length > 0) {
            setRoadmaps(data.roadmaps);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic roadmaps, using pre-indexed:", err);
      }
    }
    loadRoadmaps();
  }, []);

  const filtered = roadmaps.filter((r) => {
    const q = searchQuery.toLowerCase();
    const titleMatch =
      r.title[isBn ? "bn" : "en"].toLowerCase().includes(q) ||
      r.description[isBn ? "bn" : "en"].toLowerCase().includes(q);
    const difficultyMatch = activeDifficulty === "all" || r.difficulty === activeDifficulty;
    return titleMatch && difficultyMatch;
  });

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/15 selection:text-text-primary font-sans">
      <main className="max-w-4xl mx-auto px-6 py-10 sm:py-14 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? "মূল পোর্টফোলিওতে ফিরুন" : "return to home"}</span>
          </Link>
          <div className="text-[11px] font-mono text-text-muted flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span>ROADMAPS &amp; CURATED TRACKS</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase">
            // Roadmap.sh Style Learning Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary">
            {isBn ? "ইঞ্জিনিয়ারিং রোডম্যাপ ও সংকলিত রিসোর্স" : "Public Engineering Roadmaps"}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-serif max-w-2xl">
            {isBn
              ? "ধাপে ধাপে সাজানো শেখার পরিধি — প্রতিটি পর্বে কমান্ড, আর্কিটেকচার নোট এবং যাচাইকৃত রিসোর্স এক সাথে।"
              : "Structured phase, module, and step-wise engineering roadmaps with command cheatsheets, system notes, and curated primary documentation all in one place."}
          </p>
        </div>

        {/* Search & Difficulty Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "রোডম্যাপ বা বিষয় খুঁজুন..." : "Filter roadmaps by skill or keyword..."}
              className="w-full bg-bg-surface border border-border focus:border-text-primary rounded-lg pl-8 pr-4 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {["all", "beginner", "intermediate", "advanced"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveDifficulty(lvl)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[11px] font-semibold transition-colors cursor-pointer border ${
                  activeDifficulty === lvl
                    ? "bg-accent/15 border-accent text-accent font-bold"
                    : "bg-bg-surface border-border text-text-muted hover:text-text-primary"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Roadmaps Grid */}
        <div className="space-y-4 pt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl text-text-muted text-xs font-mono">
              No roadmaps match your criteria.
            </div>
          ) : (
            filtered.map((rm) => (
              <Link
                key={rm.slug}
                href={`/learn/${rm.slug}`}
                className="group block p-6 bg-bg-surface border border-border/80 hover:border-accent rounded-xl transition-all space-y-4 shadow-sm hover:shadow-accent/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent font-semibold uppercase text-[10px]">
                      {rm.difficulty}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 opacity-60" />
                      <span>{rm.estimatedHours} hrs</span>
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors flex items-center gap-1">
                    <span>{isBn ? "রোডম্যাপ দেখুন" : "Explore Roadmap"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-text-primary group-hover:text-accent transition-colors">
                    {rm.title[isBn ? "bn" : "en"]}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-serif">
                    {rm.description[isBn ? "bn" : "en"]}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs font-mono text-text-muted">
                  <div className="flex items-center gap-3">
                    <span>{rm.totalPhases} {isBn ? "পর্ব" : "Phases"}</span>
                    <span>•</span>
                    <span>{rm.totalSteps} {isBn ? "ধাপ" : "Steps"}</span>
                  </div>

                  {rm.tags && rm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {rm.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-bg text-text-muted">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
