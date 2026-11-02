"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function About() {
  const { t, isBn } = useLanguage();

  const principles = [
    {
      index: "01",
      titleEn: "Master Why Before How",
      titleBn: "কীভাবের আগেই কেন (Why) জানা",
      descEn:
        "Understanding database query planners, network protocols, connection pools, and operating system scheduling rather than memorizing volatile framework syntax.",
      descBn:
        "ফ্রেমওয়ার্কের সিনট্যাক্স মুখস্থ করার চেয়ে ডেটাবেস অপটিমাইজেশন, নেটওয়ার্ক প্রোটোকল ও অপারেটিং সিস্টেম শিডিউলিংয়ের মৌলিক জ্ঞান সবচেয়ে জরুরি।",
    },
    {
      index: "02",
      titleEn: "Correctness Under Concurrency",
      titleBn: "কনকারেন্সির অধীনে নির্ভুলতা",
      descEn:
        "Architecting immutable append-only ledgers, atomic SELECT FOR UPDATE transactions, and idempotent retry queues that survive real-world race conditions.",
      descBn:
        "ইমিউটেবল অ্যাপেন্ড-অনলি লেজার, অ্যাটমিক ট্রানজ্যাকশন এবং আইডেমপোটেন্ট রিট্রাই মেকানিজম দিয়ে ডেটাবেস রেস কন্ডিশন সম্পূর্ণ নির্মূল করা।",
    },
    {
      index: "03",
      titleEn: "See What Others Scroll Past",
      titleBn: "গভীর পর্যবেক্ষণ ও নিখুঁত কারিগরি",
      descEn:
        "Focusing on sub-50ms latency, deterministic error budgeting, clean developer ergonomics, and crafting open tools that remove developer friction.",
      descBn:
        "সাব-৫০ মিলিসেকেন্ড ল্যাটেন্সি, নিখুঁত এরর হ্যান্ডলিং এবং রিয়েল-ওয়ার্ল্ড সমস্যা সমাধানের জন্য দরকারি ওপেন-সোর্স টুলস তৈরি করা।",
    },
  ];

  return (
    <section id="about" className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto w-full space-y-16">
        {/* Section Label */}
        <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
          <span className="text-accent font-bold">[ 01 ]</span>
          <span className="tracking-widest uppercase text-text-primary">
            {t.about.title}
          </span>
          <span className="text-white/20">/</span>
          <span>DOSSIER & PHILOSOPHY</span>
        </div>

        {/* Big Editorial Subtitle */}
        <div className="max-w-3xl space-y-6">
          <h2
            className={`text-3xl sm:text-5xl font-bold tracking-tight text-[#f7f7f7] leading-tight ${
              isBn ? "font-bengali" : "font-sans"
            }`}
          >
            {t.about.subtitle}
          </h2>

          <div
            className={`space-y-4 text-base sm:text-lg text-text-secondary leading-relaxed ${
              isBn ? "font-bengaliSerif text-lg sm:text-xl text-text-primary/85 leading-loose" : "font-sans"
            }`}
          >
            <p>{t.about.bio1}</p>
            <p>{t.about.bio2}</p>
          </div>
        </div>

        {/* Minimal Principles (No boxes, pure typographic craft) */}
        <div className="pt-8 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-3 gap-10">
          {principles.map((p) => (
            <div key={p.index} className="space-y-3">
              <span className="font-mono text-xs text-accent font-bold tracking-wider">
                // {p.index}
              </span>
              <h3
                className={`text-lg font-bold text-text-primary ${
                  isBn ? "font-bengali text-lg" : "font-sans"
                }`}
              >
                {isBn ? p.titleBn : p.titleEn}
              </h3>
              <p
                className={`text-xs text-text-muted leading-relaxed ${
                  isBn ? "font-bengali text-sm text-text-muted leading-relaxed" : "font-sans"
                }`}
              >
                {isBn ? p.descBn : p.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* Telemetry Strip */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-6 font-mono text-xs text-text-muted">
          <div>
            <span className="text-white/40 block text-[10px] uppercase">Foundation</span>
            <span className="text-text-primary">{t.about.educationDegree}</span>
          </div>

          <div>
            <span className="text-white/40 block text-[10px] uppercase">Artifacts</span>
            <span className="text-text-primary">.ts · .sql · .prisma · .git · .sh</span>
          </div>

          <div>
            <span className="text-white/40 block text-[10px] uppercase">Location</span>
            <span className="text-text-primary">{siteConfig.location}</span>
          </div>

          <div>
            <span className="text-white/40 block text-[10px] uppercase">Availability</span>
            <span className="text-emerald-400 font-semibold">{t.about.statusValue}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
