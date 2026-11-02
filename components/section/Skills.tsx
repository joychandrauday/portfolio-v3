"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { skills } from "@/lib/data";

export default function Skills() {
  const { isBn } = useLanguage();

  const renderCategory = (title: string, items: string[]) => (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((it) => (
          <li
            key={it}
            className="px-2 py-0.5 text-xs rounded bg-bg-surface text-text-secondary border border-border"
          >
            {it}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section id="skills" className="py-12 border-b border-border/60">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          {isBn ? "দক্ষতা" : "Skills"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderCategory(isBn ? "প্রোগ্রামিং ভাষা" : "Languages", skills.languages)}
          {renderCategory(isBn ? "ফ্রন্ট‑এন্ড" : "Frontend", skills.frontend)}
          {renderCategory(isBn ? "ব্যাক‑এন্ড" : "Backend", skills.backend)}
          {renderCategory(isBn ? "ডাটাবেস" : "Databases", skills.databases)}
          {renderCategory(isBn ? "ডেভঅপস" : "DevOps", skills.devops)}
          {renderCategory(isBn ? "শেখা‑ভিত্তিক" : "Learning", skills.learning)}
        </div>
      </div>
    </section>
  );
}
