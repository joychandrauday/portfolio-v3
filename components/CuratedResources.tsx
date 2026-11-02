"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { BookOpen } from "lucide-react";

export default function CuratedResources() {
  const { isBn } = useLanguage();

  const books = [
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      domain: "Distributed Systems",
    },
    {
      title: "A Philosophy of Software Design",
      author: "John Ousterhout",
      domain: "Architecture & Complexity",
    },
    {
      title: "PostgreSQL Internals",
      author: "Egor Rogov",
      domain: "Storage & Concurrency",
    },
    {
      title: "Systems Performance: Enterprise and the Cloud",
      author: "Brendan Gregg",
      domain: "Kernel & Telemetry",
    },
    {
      title: "The Elements of Typographic Style",
      author: "Robert Bringhurst",
      domain: "Design & Craft",
    },
  ];

  return (
    <section className="space-y-6 pt-10 border-t border-border">
      <div className="flex items-center justify-between font-mono text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span className="text-accent font-semibold">// READING DESK</span>
          <span>•</span>
          <h2 className="text-text-primary uppercase tracking-wider font-semibold">
            {isBn ? "প্রভাবক গ্রন্থ ও সম্পদ" : "Influential Books & Primitives"}
          </h2>
        </div>
        <span className="text-text-muted/60 text-[11px]">[ 05 ]</span>
      </div>

      <div className="divide-y divide-border font-mono text-xs">
        {books.map((b) => (
          <div
            key={b.title}
            className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-text-muted hover:text-text-primary transition-colors"
          >
            <div className="space-x-2">
              <span className="text-text-primary font-sans text-xs font-medium">{b.title}</span>
              <span className="text-text-muted text-[11px]">/ {b.author}</span>
            </div>
            <span className="text-[10px] text-accent font-mono self-start sm:self-auto px-2 py-0.5 rounded bg-bg-card border border-border">
              {b.domain}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
