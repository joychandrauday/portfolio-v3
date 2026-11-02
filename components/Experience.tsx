"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ExternalLink } from "lucide-react";

export default function Experience() {
  const { t, isBn } = useLanguage();

  const experiences = [
    {
      company: "Grow With Owl",
      url: "https://growwithowl.com",
      roleEn: "Co-Founder & Lead Software Engineer",
      roleBn: "কো-ফাউন্ডার ও লিড সফটওয়্যার প্রকৌশলী",
      periodEn: "2024 — Present",
      periodBn: "২০২৪ — বর্তমান",
      locationEn: "Dhaka, Bangladesh · Remote",
      locationBn: "ঢাকা, বাংলাদেশ · রিমোট",
      summaryEn:
        "Co-founded and engineered OwlPrep: an AI-enhanced competitive exam preparation platform featuring gamified spaced repetition, 1-minute micro-capsules, interactive question banks, and automated flashcards. Scaled backend architecture using Next.js App Router, NextAuth credentials, and MongoDB.",
      summaryBn:
        "OwlPrep প্ল্যাটফর্মের কো-ফাউন্ডার ও মূল আর্কিটেক্ট। এতে রয়েছে গেমিফাইড স্পেসড রিপিটেশন, ১-মিনিট মাইক্রো-ক্যাপসুল, স্মার্ট প্রশ্নব্যাংক এবং এআই মেন্টরিং সিস্টেম। Next.js অ্যাপ রাউটার ও MongoDB দিয়ে উচ্চ পারফরম্যান্স নিশ্চিত করা হয়েছে।",
      tags: ["Next.js", "TypeScript", "NextAuth", "MongoDB", "AI Integration", "Spaced Repetition"],
    },
    {
      company: "G2G Digital",
      url: "https://g2gdigital.com",
      roleEn: "Full-Stack Software Engineer",
      roleBn: "ফুল-স্ট্যাক সফটওয়্যার প্রকৌশলী",
      periodEn: "2024 — Present",
      periodBn: "২০২৪ — বর্তমান",
      locationEn: "Remote",
      locationBn: "রিমোট",
      summaryEn:
        "Architected the G2G Knowledge Graph editorial planning system. Built interactive concept relationship visualization using React Flow and Dagre, implemented the 10-point G2G Test editorial quality gate, cluster management, and keyboard-first command palette with PostgreSQL and Prisma.",
      summaryBn:
        "G2G ডিজিটাল নলেজ গ্রাফ সিস্টেমের আর্কিটেকচার তৈরি। React Flow দিয়ে কনসেপ্ট ভিজুয়ালাইজেশন, ১০-পয়েন্ট কোয়ালিটি গেট এবং কিবোর্ড-ফার্স্ট কমান্ড প্যালেট সম্বলিত ড্যাশবোর্ড নির্মাণ।",
      tags: ["Next.js 15", "TypeScript", "React Flow", "Prisma", "PostgreSQL", "Tailwind CSS"],
    },
    {
      company: "Open Source & Systems Engineering",
      url: "https://github.com/joychandrauday",
      roleEn: "Independent Systems Builder",
      roleBn: "সিস্টেমস প্রকৌশলী ও মুক্তমনা বিল্ডার",
      periodEn: "2023 — Present",
      periodBn: "২০২৩ — বর্তমান",
      locationEn: "Independent",
      locationBn: "উন্মুক্ত প্ল্যাটফর্ম",
      summaryEn:
        "Authoring high-concurrency production systems: StockFlow (immutable append-only ledger with SELECT FOR UPDATE concurrency tests), FlowBridge (durable workflow automation with idempotent retries), DocuPilot (AI document extraction evaluation harness), and Quick-Peek (developer CLI utility).",
      summaryBn:
        "উচ্চ-কনকারেন্সি প্রোডাকশন সিস্টেম নির্মাণ: StockFlow (ইমিউটেবল লেজার ও কনকারেন্সি টেস্ট), FlowBridge (আইডেমপোটেন্ট ওয়ার্কফ্লো অটোমেশন), DocuPilot (এআই ডকুমেন্ট এক্সট্রাকশন) এবং Quick-Peek ডেভেলপার সিএলআই।",
      tags: ["PostgreSQL", "Concurrency", "Docker", "Drizzle", "Vitest", "CLI Tools"],
    },
  ];

  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
          <span className="text-accent font-bold">[ 02 ]</span>
          <span className="tracking-widest uppercase text-text-primary">
            {isBn ? "কর্মঅভিজ্ঞতা ও ভূমিকা" : "EXPERIENCE & VENTURES"}
          </span>
          <span className="text-white/20">/</span>
          <span>CHRONOLOGY</span>
        </div>

        {/* Big Editorial Subtitle */}
        <div className="max-w-3xl space-y-4">
          <h2
            className={`text-3xl sm:text-5xl font-bold tracking-tight text-[#f7f7f7] ${
              isBn ? "font-bengali" : "font-sans"
            }`}
          >
            {isBn
              ? "বাস্তব উদ্যোগ, স্টার্টআপ ও প্রকৌশল নেতৃত্ব"
              : "Engineering Leadership, Ventures & Systems"}
          </h2>
          <p
            className={`text-base sm:text-lg text-text-secondary leading-relaxed ${
              isBn ? "font-bengaliSerif text-lg text-text-primary/80" : "font-sans"
            }`}
          >
            {isBn
              ? "স্কেলেবল এডটেক স্টার্টআপ থেকে শুরু করে জটিল এন্টারপ্রাইজ নলেজ গ্রাফ সিস্টেম পর্যন্ত আমার বাস্তব কাজের অভিজ্ঞতা।"
              : "From co-founding scalable EdTech platforms to engineering enterprise editorial knowledge systems and open concurrency primitives."}
          </p>
        </div>

        {/* Minimal Chronological Rows (No boxes) */}
        <div className="divide-y divide-white/[0.06]">
          {experiences.map((exp) => (
            <div key={exp.company} className="py-12 first:pt-4 last:pb-4 space-y-4 group">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-accent transition-colors flex items-center gap-2 font-sans"
                  >
                    <span>{exp.company}</span>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                  </a>
                </div>

                <div className="text-text-muted text-[11px]">
                  <span>{isBn ? exp.periodBn : exp.periodEn}</span>
                  <span className="mx-2">•</span>
                  <span>{isBn ? exp.locationBn : exp.locationEn}</span>
                </div>
              </div>

              <div className="font-mono text-xs text-accent font-semibold tracking-wide">
                // {isBn ? exp.roleBn : exp.roleEn}
              </div>

              <p
                className={`max-w-4xl text-sm sm:text-base text-text-secondary leading-relaxed ${
                  isBn ? "font-bengaliSerif text-base sm:text-lg text-text-primary/80 leading-loose" : "font-sans"
                }`}
              >
                {isBn ? exp.summaryBn : exp.summaryEn}
              </p>

              <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs text-text-muted">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[11px] text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
