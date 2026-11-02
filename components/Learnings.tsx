"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface LearningItem {
  id: string;
  title: string;
  category: string;
  status: "learning" | "completed" | "queued";
  content: string;
  takeaways: string[];
  resources: string[];
}

export default function Learnings() {
  const { t, isBn } = useLanguage();
  const [learnings, setLearnings] = useState<LearningItem[]>([]);

  useEffect(() => {
    async function loadLearnings() {
      try {
        const res = await fetch("/api/ops/learnings?public=true");
        const data = await res.json();
        if (Array.isArray(data)) setLearnings(data);
      } catch (err) {
        console.error("Failed to load learnings", err);
      }
    }
    loadLearnings();
  }, []);

  if (learnings.length === 0) return null;

  return (
    <section id="learnings" className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
          <span className="text-accent font-bold">[ 05 ]</span>
          <span className="tracking-widest uppercase text-text-primary">
            {t.learnings.title}
          </span>
          <span className="text-white/20">/</span>
          <span>SECOND BRAIN RESEARCH</span>
        </div>

        {/* Big Heading */}
        <div className="max-w-3xl">
          <h2
            className={`text-3xl sm:text-5xl font-bold tracking-tight text-[#f7f7f7] ${
              isBn ? "font-bengali" : "font-sans"
            }`}
          >
            {t.learnings.subtitle}
          </h2>
        </div>

        {/* Minimal Research Rows (No boxes) */}
        <div className="divide-y divide-white/[0.06]">
          {learnings.map((item) => (
            <div key={item.id} className="py-10 first:pt-4 last:pb-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <span className="text-accent uppercase tracking-wider font-bold">
                  // {item.category}
                </span>
                <span className="text-text-muted uppercase text-[11px]">
                  {item.status === "completed"
                    ? t.learnings.statusCompleted
                    : item.status === "learning"
                    ? t.learnings.statusLearning
                    : t.learnings.statusQueued}
                </span>
              </div>

              <h3
                className={`text-2xl sm:text-3xl font-bold text-text-primary ${
                  isBn ? "font-bengali" : "font-sans"
                }`}
              >
                {item.title}
              </h3>

              <p
                className={`max-w-3xl text-sm sm:text-base text-text-secondary leading-relaxed ${
                  isBn ? "font-bengaliSerif text-base sm:text-lg text-text-primary/80 leading-loose" : "font-sans"
                }`}
              >
                {item.content}
              </p>

              {item.takeaways && item.takeaways.length > 0 && (
                <div className="pt-2 space-y-2 font-mono text-xs text-text-muted">
                  <span className="text-white/40 uppercase text-[10px] tracking-wider block">
                    {t.learnings.keyTakeaways}:
                  </span>
                  {item.takeaways.map((take, i) => (
                    <div key={i} className="text-text-primary/90 flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{take}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
