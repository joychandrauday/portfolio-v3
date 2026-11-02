"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { skills } from "@/lib/data";

export default function Skills() {
  const { t, isBn } = useLanguage();

  const groups = [
    {
      domain: "Languages & Runtimes",
      domainBn: "প্রোগ্রামিং ল্যাঙ্গুয়েজ ও রানটাইম",
      items: skills.languages,
    },
    {
      domain: "Backend & Systems",
      domainBn: "ব্যাকএন্ড ও সিস্টেমস আর্কিটেকচার",
      items: skills.backend,
    },
    {
      domain: "Storage & Persistence",
      domainBn: "ডেটাবেস ও স্টোরেজ ইঞ্জিন",
      items: skills.databases,
    },
    {
      domain: "Frontend & Craft",
      domainBn: "ফ্রন্টএন্ড ও ইউআই ক্রাফট",
      items: skills.frontend,
    },
    {
      domain: "DevOps & Telemetry",
      domainBn: "ইনফ্রাস্ট্রাকচার ও ডেভঅপ্স",
      items: skills.devops,
    },
  ];

  return (
    <section id="skills" className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
          <span className="text-accent font-bold">[ 03 ]</span>
          <span className="tracking-widest uppercase text-text-primary">
            {t.skills.title}
          </span>
          <span className="text-white/20">/</span>
          <span>TECHNICAL PRIMITIVES</span>
        </div>

        {/* Big Heading */}
        <div className="max-w-3xl">
          <h2
            className={`text-3xl sm:text-5xl font-bold tracking-tight text-[#f7f7f7] ${
              isBn ? "font-bengali" : "font-sans"
            }`}
          >
            {t.skills.subtitle}
          </h2>
        </div>

        {/* Minimal Typographic Directory (No boxes) */}
        <div className="divide-y divide-white/[0.06]">
          {groups.map((g) => (
            <div
              key={g.domain}
              className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline"
            >
              <div className="md:col-span-4 font-mono text-xs text-accent uppercase tracking-wider">
                // {isBn ? g.domainBn : g.domain}
              </div>

              <div className="md:col-span-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm sm:text-base text-text-primary">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="hover:text-accent transition-colors cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Active Research Focus */}
        <div className="pt-8 border-t border-white/[0.06] space-y-4">
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider block">
            {t.skills.currentLearning}:
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs sm:text-sm text-text-secondary">
            {skills.learning.map((l) => (
              <span key={l} className="text-accent/90">
                • {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
