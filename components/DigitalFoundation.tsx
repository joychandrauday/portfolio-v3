"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Zap, ShieldCheck, TrendingUp, Sparkles, Activity, Layers } from "lucide-react";

export default function DigitalFoundation() {
  const { isBn } = useLanguage();

  const pillars = [
    {
      icon: Zap,
      titleEn: "Speed as a Service",
      titleBn: "গতিই মুখ্য সেবা (Speed as a Service)",
      descEn:
        "In an era where latency is abandonment, I engineer systems optimized for sub-second delivery. By leveraging edge computing and efficient caching, I ensure your users stay engaged and conversions stay high.",
      descBn:
        "যে যুগে সামান্য ল্যাটেন্সির কারণে ব্যবহারকারী সাইট ছেড়ে চলে যায়, সেখানে আমি সাব-সেকেন্ড ডেলিভারির আর্কিটেকচার তৈরি করি। এজ কম্পিউটিং ও ক্যাশিংয়ের মাধ্যমে ব্যবহারকারীর সেরা অভিজ্ঞতা নিশ্চিত করি।",
      highlight: "< 100ms Target",
    },
    {
      icon: ShieldCheck,
      titleEn: "Built for Authority",
      titleBn: "নির্ভরযোগ্যতা ও অথরিটি",
      descEn:
        "Your website is your digital handshake. I design enterprise-grade experiences that swap generic templates for bespoke engineering, instantly commanding market authority and user trust.",
      descBn:
        "আপনার ওয়েবসাইট আপনার ডিজিটাল পরিচিতি। জেনেরিক টেমপ্লেট বাদ দিয়ে বিশেষায়িত ইঞ্জিনিয়ারিংয়ের মাধ্যমে নির্ভরযোগ্য ও প্রভাব সৃষ্টিকারী ডিজিটাল অভিজ্ঞতা তৈরি করি।",
      highlight: "Enterprise Grade",
    },
    {
      icon: TrendingUp,
      titleEn: "Scaling Without Limits",
      titleBn: "সীমাহীন স্কেলেবিলিটি",
      descEn:
        "Stop solving for today; architect for 10x growth. I eliminate technical debt by delivering a hardened foundation that scales automatically with your success.",
      descBn:
        "শুধুমাত্র আজকের জন্য নয়, ১০ গুণ প্রবৃদ্ধির কথা মাথায় রেখে আর্কিটেকচার সাজাই। টেকনিক্যাল ডেট দূর করে একটি শক্তিশালী সিস্টেম উপহার দিই।",
      highlight: "10x Architecture",
    },
    {
      icon: Sparkles,
      titleEn: "Conversion Engine",
      titleBn: "কনভার্সন ইঞ্জিন",
      descEn:
        "Transforming passive visitors into active customers through behavioral UI patterns, fluid micro-interactions, and frictionless UX design.",
      descBn:
        "আচরণগত ইউআই প্যাটার্ন এবং সহজ ইউজার এক্সপেরিয়েন্সের মাধ্যমে সাধারণ ভিজিটরদের সক্রিয় গ্রাহকে রূপান্তরিত করা।",
      highlight: "High ROI",
    },
    {
      icon: Activity,
      titleEn: "Core Vital Mastery",
      titleBn: "কোর ওয়েব ভাইটালস দক্ষতা",
      descEn:
        "Sub-second Largest Contentful Paint (LCP) and zero Cumulative Layout Shift (CLS). Engineered for raw speed that beats 99% of the competition.",
      descBn:
        "সাব-সেকেন্ড এলসিপি এবং শূন্য লেআউট শিফট। ৯৯% প্রতিযোগীদের চেয়ে দ্রুততম লোডিং পারফরম্যান্স।",
      highlight: "100/100 Lighthouse",
    },
    {
      icon: Layers,
      titleEn: "Semantic Architecture",
      titleBn: "সিম্যান্টিক আর্কিটেকচার ও এসইও",
      descEn:
        "Clean, type-safe TypeScript code structured for maximum SEO crawlability, rich JSON-LD snippets, and effortless long-term maintainability.",
      descBn:
        "টাইপ-সেফ কোড যা সার্চ ইঞ্জিনের ক্রলিং ও র্যাঙ্কিং বৃদ্ধির জন্য কাঠামোগতভাবে অপটিমাইজ করা।",
      highlight: "Deep SEO",
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#030303] py-28 px-6 sm:px-12 overflow-hidden border-b border-white/[0.06]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/[0.02] blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-px w-8 bg-accent" />
            <span>{isBn ? "ডিজিটাল ভিত্তি ও দর্শন" : "THE DIGITAL FOUNDATION"}</span>
            <span className="h-px w-8 bg-accent" />
          </div>

          <h2
            className={`text-4xl sm:text-6xl font-black tracking-tighter uppercase text-white ${
              isBn ? "font-bengali tracking-normal" : "font-sans"
            }`}
          >
            {isBn ? "কেন আপনার ডিজিটাল ভিত্তি গুরুত্বপূর্ণ" : "Why Your Digital Foundation Matters"}
          </h2>

          <p
            className={`text-base sm:text-lg text-text-secondary leading-relaxed ${
              isBn ? "font-bengaliSerif text-lg text-text-primary/80" : "font-sans"
            }`}
          >
            {isBn
              ? "আমি জটিল ব্যাকএন্ড সিস্টেমের নিখুঁত আর্কিটেকচার এবং উচ্চ-রূপান্তরক্ষম আধুনিক ইউজার ইন্টারফেসের মধ্যে সেতুবন্ধন তৈরি করি।"
              : "I bridge the gap between complex backend logic and high-conversion user interfaces."}
          </p>
        </div>

        {/* 6-Grid Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.titleEn}
                className="group relative p-8 rounded-2xl bg-[#090909] border border-white/[0.07] hover:border-accent/40 transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-accent tracking-wider uppercase bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                      {p.highlight}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-bold text-white group-hover:text-accent transition-colors ${
                      isBn ? "font-bengali" : "font-sans"
                    }`}
                  >
                    {isBn ? p.titleBn : p.titleEn}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm text-text-secondary leading-relaxed ${
                      isBn ? "font-bengaliSerif text-sm leading-relaxed text-text-primary/80" : "font-sans"
                    }`}
                  >
                    {isBn ? p.descBn : p.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Big Quote Ribbon */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0d0d0d] via-[#111111] to-[#0d0d0d] border border-white/[0.08] text-center space-y-4 max-w-4xl mx-auto">
          <p
            className={`text-xl sm:text-3xl font-black tracking-tight text-white ${
              isBn ? "font-bengali" : "font-sans uppercase"
            }`}
          >
            {isBn
              ? "“অনবদ্য ইঞ্জিনিয়ারিং চোখে পড়ে না, কিন্তু তার ফলাফল অস্বীকার করা যায় না।”"
              : "“Great engineering is invisible. Great results are undeniable.”"}
          </p>
          <div className="font-mono text-xs text-accent uppercase tracking-widest">
            — JOY CHANDRA UDAY · SOFTWARE ENGINEER
          </div>
        </div>
      </div>
    </section>
  );
}
