"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Briefcase, ArrowUpRight } from "lucide-react";

export default function BentoTimeline() {
  const { isBn } = useLanguage();

  const milestones = [
    {
      company: "garirhat.com",
      url: "https://garirhat.com",
      role: "Software Engineer",
      roleBn: "সফটওয়্যার প্রকৌশলী",
      period: "2024 — Present",
      periodBn: "২০২৪ — বর্তমান",
      badge: "Current Primary",
      desc: "Core automotive platform services, multi-tenant inventory architecture, and sub-100ms vehicle search engines.",
      descBn: "কোর অটোমোটিভ প্ল্যাটফর্ম সার্ভিস, মাল্টি-টেন্যান্ট ইনভেন্টরি ও সাব-১০০ মিলিসেকেন্ড ভেহিকেল সার্চ ইঞ্জিন।",
    },
    {
      company: "Grow With Owl",
      url: "https://growwithowl.com",
      role: "Founder & Lead Engineer",
      roleBn: "প্রতিষ্ঠাতা ও লিড প্রকৌশলী",
      period: "2024 — Present",
      periodBn: "২০২৪ — বর্তমান",
      badge: "Venture",
      desc: "Architected and shipped OwlPrep, a gamified exam prep platform with spaced repetition and AI mentor integration.",
      descBn: "স্পেসড রিপিটেশন, ১-মিনিট মাইক্রো-ক্যাপসুল ও এআই মেন্টর সমৃদ্ধ আধুনিক শিক্ষা প্ল্যাটফর্ম OwlPrep।",
    },
    {
      company: "G2G Digital",
      url: "https://g2gdigital.com",
      role: "Full-Stack Engineer",
      roleBn: "ফুল-স্ট্যাক প্রকৌশলী",
      period: "2024 — Present",
      periodBn: "২০২৪ — বর্তমান",
      badge: "Production",
      desc: "Built the G2G Knowledge Graph editorial dashboard with interactive React Flow visualizations and 10-point G2G Test validation.",
      descBn: "রিঅ্যাক্ট ফ্লো ভিজ্যুয়ালাইজেশন ও ১০-পয়েন্ট জিটুজি টেস্ট ইঞ্জিন সমৃদ্ধ নলেজ গ্রাফ সিস্টেম।",
    },
    {
      company: "Open Source Systems",
      url: "https://github.com/joychandrauday",
      role: "Systems Architect",
      roleBn: "সিস্টেমস আর্কিটেক্ট",
      period: "2023 — Present",
      periodBn: "২০২৩ — বর্তমান",
      badge: "Independent",
      desc: "Authored StockFlow (immutable ledger proof), FlowBridge (durable workflow engine), and DocuPilot (AI evaluation harness).",
      descBn: "স্টকফ্লো (লেজার কনকারেন্সি), ফ্লোব্রিজ (আইডেমপোটেন্ট ওয়ার্কফ্লো) ও ডকুপাইলট (এআই এক্সট্রাকশন)।",
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between font-mono text-xs text-text-muted">
        <span className="text-text-primary font-semibold flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-accent" />
          <span>CAREER TIMELINE</span>
        </span>
        <span className="text-[11px] text-text-muted">2023 — PRESENT</span>
      </div>

      {/* Milestones list */}
      <div className="divide-y divide-border/60">
        {milestones.map((m) => (
          <div key={m.company} className="py-3 first:pt-1 last:pb-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div className="flex items-center gap-2 flex-wrap text-sm">
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-text-primary hover:underline transition-colors flex items-center gap-0.5"
                >
                  <span>{m.company}</span>
                  <ArrowUpRight className="w-3 h-3 text-text-muted opacity-60" />
                </a>
                <span className="text-text-muted text-xs">/ {isBn ? m.roleBn : m.role}</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-text-muted">
                <span>{isBn ? m.periodBn : m.period}</span>
              </div>
            </div>

            <p
              className={`text-xs text-text-secondary leading-relaxed ${
                isBn ? "font-bengali text-xs text-text-primary/80" : "font-sans"
              }`}
            >
              {isBn ? m.descBn : m.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer link to printable resume */}
      <div className="pt-1 flex items-center justify-between text-xs font-mono text-text-muted border-t border-border/60">
        <span>Verified Engineering Dossier</span>
        <a
          href="/resume"
          className="text-text-primary hover:text-accent font-semibold transition-colors flex items-center gap-1"
        >
          <span>Full Resume [R]</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
