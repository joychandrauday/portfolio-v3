"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import { Terminal, MapPin, Award, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function AuthorShowcase() {
  const { isBn } = useLanguage();

  return (
    <section className="py-28 bg-[#070707] text-white border-b border-white/[0.06] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10 space-y-16">
        {/* Big Author Header */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-px w-8 bg-accent" />
            <span>ARCHITECT & CREATIVE BUILDER</span>
          </div>

          <h2
            className={`text-6xl sm:text-8xl font-black tracking-tighter uppercase leading-none ${
              isBn ? "font-bengali" : "font-sans"
            }`}
          >
            Joy Chandra <span className="text-accent">Uday.</span>
          </h2>
          <div className="h-1.5 w-24 bg-accent mt-3 rounded-full" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="md:col-span-2 group relative p-8 sm:p-12 rounded-3xl bg-[#0c0c0c] border border-white/[0.08] flex flex-col justify-between space-y-8 overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-mono text-xs text-accent">
                <Terminal className="w-4 h-4" />
                <span>CORE DIRECTIVE</span>
              </div>

              <blockquote
                className={`text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug ${
                  isBn ? "font-bengali" : "font-sans"
                }`}
              >
                &ldquo;{isBn ? siteConfig.mottoBn : siteConfig.motto}&rdquo;
              </blockquote>

              <p
                className={`text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl ${
                  isBn ? "font-bengaliSerif text-base text-text-primary/80" : "font-sans"
                }`}
              >
                {isBn
                  ? "টুলসের সিনট্যাক্স মুখস্থ করার চেয়ে ডেটাবেসের অভ্যন্তরীণ গঠন, নেটওয়ার্ক প্রোটোকল ও কনকারেন্সি মডেলের গভীর বোঝাপড়াই একজন প্রকৌশলীকে অনন্য করে তোলে।"
                  : "Rather than collecting frameworks, I focus on mastering the underlying principles that make distributed technologies scale reliably."}
              </p>
            </div>

            <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-text-muted">
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Base Station</span>
                <span className="text-text-primary flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  Patuakhali & Dhaka, Bangladesh (UTC+6)
                </span>
              </div>

              <div>
                <span className="text-white/40 block text-[10px] uppercase">Primary Stacks</span>
                <span className="text-text-primary mt-0.5 block">Next.js · Node.js · PostgreSQL · LibSQL</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Links Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0c0c0c] border border-white/[0.08] flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="font-mono text-xs text-accent uppercase tracking-widest">
                // ENTERPRISE RECORD
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                  <div className="text-2xl font-bold font-mono text-accent">Grow With Owl</div>
                  <div className="text-xs text-text-muted">Co-Founder & Lead Software Engineer</div>
                </div>

                <a
                  href={siteConfig.g2gAuthor}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-4 rounded-xl bg-black/40 border border-white/[0.06] hover:border-accent/40 space-y-1 transition-all group/g2g"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold font-mono text-accent">G2G Digital</div>
                    <ArrowUpRight className="w-4 h-4 text-accent/60 group-hover/g2g:text-accent transition-colors" />
                  </div>
                  <div className="text-xs text-text-muted">Author Archive & Technology Writer</div>
                  <div className="text-[10px] text-accent/80 font-mono">Articles on AI, Software & Systems ↗</div>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-3 font-mono text-xs">
              <a
                href="/resume"
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{isBn ? "পূর্ণাঙ্গ জীবনবৃত্তান্ত দেখুন" : "View Full Curriculum Vitae"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={siteConfig.g2gAuthor}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent font-semibold flex items-center justify-center gap-2 transition-colors border border-accent/30"
              >
                <span>{isBn ? "জি২জি ডিজিটাল আর্টিকেলসমূহ" : "G2G Digital Author Archive"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center justify-center gap-2 transition-colors border border-white/[0.06]"
              >
                <span>GitHub Repositories</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
