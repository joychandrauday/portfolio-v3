"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ArrowUpRight } from "lucide-react";

export default function Timeline() {
  const { isBn } = useLanguage();

  const experiences = [
    {
      company: "garirhat.com",
      url: "https://garirhat.com",
      role: "Software Engineer",
      roleBn: "সফটওয়্যার প্রকৌশলী",
      period: "2024 — Present",
      periodBn: "২০২৪ — বর্তমান",
      desc: "Engineering core automotive platform architectures, multi-tenant inventory systems, and sub-100ms vehicle search filters under high concurrency.",
      descBn: "উচ্চ কনকারেন্সির অধীনে অটোমোটিভ প্ল্যাটফর্মের কোর সার্ভিস, মাল্টি-টেন্যান্ট ইনভেন্টরি ও সাব-১০০ মিলিসেকেন্ড সার্চ সিস্টেম নির্মাণ।",
    },
    {
      company: "Grow With Owl",
      url: "https://growwithowl.com",
      role: "Founder & Lead Engineer",
      roleBn: "প্রতিষ্ঠাতা ও লিড প্রকৌশলী",
      period: "2024 — Present",
      periodBn: "২০২৪ — বর্তমান",
      desc: "Architected and shipped OwlPrep, a gamified exam prep platform with spaced repetition, 1-minute micro-capsules, and AI mentor integration.",
      descBn: "স্পেসড রিপিটেশন, ১-মিনিট মাইক্রো-ক্যাপসুল ও এআই মেন্টর সমৃদ্ধ আধুনিক শিক্ষা প্ল্যাটফর্ম OwlPrep-এর আর্কিটেকচার ও ডেভলপমেন্ট।",
    },
    {
      company: "G2G Digital",
      url: "https://g2gdigital.com",
      role: "Full-Stack Engineer",
      roleBn: "ফুল-স্ট্যাক প্রকৌশলী",
      period: "2024 — Present",
      periodBn: "২০২৪ — বর্তমান",
      desc: "Built the G2G Knowledge Graph editorial planning platform with React Flow visualization, 10-point G2G Test validation engine, and Cmd+K command palette.",
      descBn: "রিঅ্যাক্ট ফ্লো ভিজ্যুয়ালাইজেশন, ১০-পয়েন্ট জিটুজি টেস্ট ইঞ্জিন এবং কিবোর্ড কমান্ড প্যালেট সমৃদ্ধ এডিটোরিয়াল নলেজ গ্রাফ সিস্টেম নির্মাণ।",
    },
    {
      company: "Open Source Systems",
      url: "https://github.com/joychandrauday",
      role: "Systems Architect & Developer",
      roleBn: "সিস্টেমস আর্কিটেক্ট ও ডেভেলপার",
      period: "2023 — Present",
      periodBn: "২০২৩ — বর্তমান",
      desc: "Authored StockFlow (append-only ledger concurrency verification), FlowBridge (durable workflow engine), and DocuPilot (AI document extraction).",
      descBn: "স্টকফ্লো (অ্যাপেন্ড-অনলি লেজার কনকারেন্সি), ফ্লোব্রিজ (আইডেমপোটেন্ট ওয়ার্কফ্লো ইঞ্জিন) এবং ডকুপাইলট (এআই এক্সট্রাকশন পাইপলাইন) ওপেন সোর্স প্রজেক্টের রচয়িতা।",
    },
  ];

  return (
    <section className="space-y-6 pt-10 border-t border-border">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary font-mono">
        {isBn ? "কর্মজীবন ও অভিজ্ঞতা" : "Experience"}
      </h2>

      <div className="divide-y divide-border/60">
        {experiences.map((exp) => (
          <div
            key={exp.company}
            className="py-4 first:pt-1 last:pb-1 space-y-1.5 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm">
              <div className="flex items-center gap-1.5 flex-wrap">
                <a
                  href={exp.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-text-primary hover:underline transition-colors flex items-center gap-0.5"
                >
                  <span>{exp.company}</span>
                  <ArrowUpRight className="w-3 h-3 text-text-muted opacity-60" />
                </a>
                <span className="text-text-muted text-xs">/ {isBn ? exp.roleBn : exp.role}</span>
              </div>

              <div className="text-text-muted font-mono text-xs">
                <span>{isBn ? exp.periodBn : exp.period}</span>
              </div>
            </div>

            <p
              className={`text-xs sm:text-sm text-text-secondary leading-relaxed ${
                isBn ? "font-bengali text-sm text-text-primary/80" : "font-sans"
              }`}
            >
              {isBn ? exp.descBn : exp.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
