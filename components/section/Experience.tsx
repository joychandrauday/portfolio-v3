"use client";

import React from "react";
import Timeline from "@/components/Timeline";
import { useLanguage } from "@/components/LanguageProvider";

export default function Experience() {
  const { isBn } = useLanguage();
  return (
    <section id="experience" className="py-12 border-b border-border/60">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          {isBn ? "পেশাগত অভিজ্ঞতা" : "Experience"}
        </h2>
        <Timeline />
      </div>
    </section>
  );
}
