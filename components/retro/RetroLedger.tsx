"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ArrowUpRight, Building2, Briefcase, Calendar, Tag, ShieldCheck } from "lucide-react";

export default function RetroLedger() {
  const { isBn } = useLanguage();

  const entries = [
    {
      period: "2024 — PRESENT",
      organization: "garirhat.com",
      role: "Software Engineer",
      roleBn: "সফটওয়্যার প্রকৌশলী",
      type: "Primary Role",
      url: "https://garirhat.com",
      summary:
        "Engineering core automotive platform architectures, multi-tenant inventory systems, high-speed vehicle search indexing, scalable service boundaries, and commercial transaction engines.",
      summaryBn:
        "অটোমোটিভ প্ল্যাটফর্মের কোর সার্ভিসেস, মাল্টি-টেন্যান্ট ইনভেন্টরি, দ্রুতগতির সার্চ ইনডেক্সিং এবং কমার্শিয়াল ট্রানজ্যাকশন ইঞ্জিন আর্কিটেকচার।",
      tags: ["Platform Architecture", "Search Infrastructure", "Multi-Tenant Systems", "High Availability"],
      icon: Building2,
    },
    {
      period: "2023 — 2024",
      organization: "G2G Digital",
      role: "Full-Stack Engineer",
      roleBn: "ফুল-স্ট্যাক ইঞ্জিনিয়ার",
      type: "Platform Engineering",
      url: "https://g2gdigital.com",
      summary:
        "Architected G2G Knowledge Graph editorial system for mental model planning, featuring interactive concept network graphs, automated content validation gates, and keyboard-driven productivity workflows.",
      summaryBn:
        "কনসেপ্ট নেটওয়ার্ক গ্রাফ, স্বয়ংক্রিয় কন্টেন্ট ভ্যালিডেশন এবং কিবোর্ড-চালিত এডিটোরিয়াল ওয়ার্কফ্লো সিস্টেম নির্মাণ।",
      tags: ["Knowledge Graph", "Interactive Systems", "Concept Clustering", "Editorial Tooling"],
      icon: Briefcase,
    },
    {
      period: "2023 — PRESENT",
      organization: "OwlPrep (Grow With Owl)",
      role: "Founder & Lead Engineer",
      roleBn: "প্রতিষ্ঠাতা ও লিড ইঞ্জিনিয়ার",
      type: "Venture",
      url: "https://growwithowl.com",
      summary:
        "Founded education technology initiative; architected and shipped OwlPrep—a gamified cognitive training platform featuring adaptive spaced repetition, focused micro-capsules, question banks, and AI mentor guidance.",
      summaryBn:
        "এডুটেক উদ্যোগের প্রতিষ্ঠা; গড়ে তুলেছি OwlPrep—স্পেসড রিপিটেশন অ্যালগরিদম, ফোকাসড মাইক্রো-ক্যাপসুল ও এআই মেন্টরিং প্ল্যাটফর্ম।",
      tags: ["Cognitive Systems", "Spaced Repetition", "Product Engineering", "Interactive Learning"],
      icon: Briefcase,
    },
  ];

  return (
    <section id="chronicle" className="py-12 sm:py-20 border-b border-border/70 scroll-mt-6">
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>[ SECTION IV // CAREER CHRONICLE ]</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal">
              {isBn ? "পেশাগত ইতিহাস ও প্রাতিষ্ঠানিক রেকর্ড" : "Chronicle of Appointments & Ventures"}
            </h3>
          </div>
          <span className="font-mono text-xs text-text-muted">
            {isBn ? "লেজার রেকর্ডস" : "Verified Career Ledger"}
          </span>
        </div>

        {/* Ledger Rows */}
        <div className="border border-border/80 divide-y divide-border/60 bg-bg-surface rounded-sm">
          {entries.map((entry) => {
            const EntryIcon = entry.icon;
            return (
              <div
                key={entry.organization + entry.period}
                className="p-6 sm:p-7 hover:bg-bg/40 transition-colors space-y-3 font-mono text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-accent px-2 py-0.5 rounded bg-bg border border-border/70 shrink-0 flex items-center gap-1">
                      <EntryIcon className="w-3 h-3 opacity-70" />
                      <span>{entry.period}</span>
                    </span>
                    
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-serif text-lg font-semibold text-text-primary hover:text-accent flex items-center gap-1 transition-colors"
                      >
                        <span>{entry.organization}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                      </a>
                    ) : (
                      <span className="font-serif text-lg font-semibold text-text-primary">
                        {entry.organization}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-text-secondary text-xs">
                    <span className="font-medium text-text-primary">
                      {isBn ? entry.roleBn : entry.role}
                    </span>
                    <span className="opacity-40">•</span>
                    <span className="text-[11px] text-text-muted">{entry.type}</span>
                  </div>
                </div>

                <p
                  className={`text-sm text-text-secondary leading-relaxed font-serif pt-1 ${
                    isBn ? "font-bengali text-base" : ""
                  }`}
                >
                  {isBn ? entry.summaryBn : entry.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-text-muted">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-bg border border-border/50 text-[10px] text-text-secondary">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
