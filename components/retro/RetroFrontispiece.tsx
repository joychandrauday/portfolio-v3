"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import {
  Copy,
  Check,
  ArrowUpRight,
  ArrowDown,
  Building2,
  Sparkles,
  ExternalLink,
  Code2,
  Database,
  Layers,
  MapPin,
  CheckCircle2,
  FileDown,
} from "lucide-react";

export default function RetroFrontispiece() {
  const { isBn } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [dossierMode, setDossierMode] = useState<"brief" | "detailed">("brief");

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <section id="dossier" className="py-12 sm:py-20 border-b border-border/70 scroll-mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: The Archival Physical Plate */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative p-3 bg-bg-surface border border-border shadow-xs rounded-sm">
            {/* Vintage archival corners */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-text-primary/30" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-text-primary/30" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-text-primary/30" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-text-primary/30" />

            <div className="relative w-full aspect-[4/5] overflow-hidden bg-bg/50 border border-border/80">
              <Image
                src="/profile.png"
                alt="Joy Chandra Uday — Software Engineer"
                fill
                priority
                className="object-cover object-top filter grayscale contrast-105 hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-bg/90 backdrop-blur-xs border border-border text-[10px] font-mono tracking-widest text-text-muted flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>PLATE NO. 01</span>
              </div>
            </div>

            <div className="pt-3 pb-1 px-1 flex items-center justify-between text-[11px] font-mono text-text-muted border-t border-border/50 mt-2">
              <span className="tracking-wider uppercase font-medium text-text-primary">
                JOY CHANDRA UDAY
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 opacity-60 text-accent" />
                <span>DHAKA, BANGLADESH</span>
              </span>
            </div>
          </div>

          {/* Archival Dispatch & Coordinates Drawer */}
          <div className="p-4 bg-bg-surface/60 border border-border/70 rounded-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-text-muted pb-2 border-b border-border/50">
              <span className="uppercase tracking-widest font-semibold text-text-primary flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-accent" />
                <span>{isBn ? "সরাসরি যোগাযোগ ও লিঙ্ক" : "Archival Channels"}</span>
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">AVAILABLE</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={copyEmail}
                aria-label="Copy email address"
                className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-bg-surface border border-transparent hover:border-border text-left transition-colors cursor-pointer group"
              >
                <span className="text-text-secondary group-hover:text-text-primary truncate font-mono text-xs">
                  {siteConfig.email}
                </span>
                <span className="shrink-0 text-text-muted group-hover:text-text-primary flex items-center gap-1 text-[11px]">
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 opacity-60" />
                      <span>COPY</span>
                    </>
                  )}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded bg-bg/40 hover:bg-bg border border-border/60 hover:border-text-primary transition-colors"
                >
                  <span className="font-semibold">GITHUB</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded bg-bg/40 hover:bg-bg border border-border/60 hover:border-text-primary transition-colors"
                >
                  <span className="font-semibold">LINKEDIN</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Core Systems Strip */}
            <div className="pt-2 border-t border-border/50 text-[11px] text-text-muted space-y-1">
              <div className="text-[10px] tracking-wider uppercase opacity-60">
                CORE ENGINEERING FOCUS:
              </div>
              <div className="flex flex-wrap gap-1 text-text-secondary">
                {["Distributed Systems", "Platform Architecture", "Data Reliability", "Search & Retrieval"].map((s) => (
                  <span key={s} className="px-1.5 py-0.5 rounded bg-bg border border-border/60 text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Lead Narrative Spread */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Editorial Headline */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-accent/30 bg-accent/5 font-mono text-[11px] text-accent tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? "প্রকৌশল বিবৃতি ও ডসিয়ার" : "ENGINEERING DOSSIER"}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl tracking-tight text-text-primary leading-[1.18] font-normal">
              {isBn ? (
                <>
                  উচ্চ-কনকারেন্সি ব্যাকএন্ড, ইমিউটেবল লেজার এবং এমন সিস্টেম তৈরি যা চাপে ভেঙে পড়ে না।
                </>
              ) : (
                <>
                  Architecting resilient distributed backends, immutable ledgers, and systems that do not break under load.
                </>
              )}
            </h2>
          </div>

          {/* Primary Appointments: Garirhat -> G2G Digital -> OwlPrep */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {/* 1. Garirhat */}
            <div className="p-3.5 rounded-sm border border-border bg-bg-surface space-y-1.5 relative overflow-hidden">
              <div className="text-[10px] text-text-muted uppercase tracking-widest font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-accent" />
                  <span>APPOINTMENT</span>
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="text-sm font-serif font-semibold text-text-primary">
                Garirhat
              </div>
              <p className="text-text-secondary text-[11px] leading-relaxed font-sans">
                Software Engineer architecting core automotive platform services, search infrastructure, and multi-tenant systems at{" "}
                <a
                  href="https://garirhat.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-primary font-semibold underline underline-offset-2 hover:text-accent"
                >
                  garirhat.com
                </a>
                .
              </p>
            </div>

            {/* 2. G2G Digital */}
            <div className="p-3.5 rounded-sm border border-border bg-bg-surface space-y-1.5">
              <div className="text-[10px] text-text-muted uppercase tracking-widest font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-accent" />
                  <span>PLATFORM</span>
                </span>
                <span className="text-text-muted font-bold">2023–24</span>
              </div>
              <div className="text-sm font-serif font-semibold text-text-primary">
                G2G Digital
              </div>
              <p className="text-text-secondary text-[11px] leading-relaxed font-sans">
                Full-Stack Engineer building knowledge graph visualizations, concept clustering, and editorial workflow engines at{" "}
                <a
                  href="https://g2gdigital.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-primary font-semibold underline underline-offset-2 hover:text-accent"
                >
                  g2gdigital.com
                </a>
                .
              </p>
            </div>

            {/* 3. OwlPrep */}
            <div className="p-3.5 rounded-sm border border-border bg-bg-surface space-y-1.5">
              <div className="text-[10px] text-text-muted uppercase tracking-widest font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>VENTURE</span>
                </span>
                <span className="text-accent font-bold">FOUNDER</span>
              </div>
              <div className="text-sm font-serif font-semibold text-text-primary">
                OwlPrep
              </div>
              <p className="text-text-secondary text-[11px] leading-relaxed font-sans">
                Founder &amp; Lead Engineer of{" "}
                <a
                  href="https://growwithowl.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-primary font-semibold underline underline-offset-2 hover:text-accent"
                >
                  OwlPrep
                </a>
                ; architecting cognitive spaced repetition and structured training systems.
              </p>
            </div>
          </div>

          {/* Depth Toggle (Overview / Technical Dossier) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-border/60 pb-2">
              <span className="text-[11px] uppercase tracking-widest text-text-muted">
                {isBn ? "পাঠের গভীরতা নির্বাচন" : "SELECT READING DEPTH"}
              </span>

              <div className="inline-flex items-center gap-1 p-0.5 rounded border border-border bg-bg-surface">
                <button
                  onClick={() => setDossierMode("brief")}
                  className={`px-3 py-1 rounded text-[11px] transition-all cursor-pointer ${
                    dossierMode === "brief"
                      ? "bg-text-primary text-bg font-semibold shadow-xs"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {isBn ? "সংক্ষেপ" : "Brief"}
                </button>
                <button
                  onClick={() => setDossierMode("detailed")}
                  className={`px-3 py-1 rounded text-[11px] transition-all cursor-pointer ${
                    dossierMode === "detailed"
                      ? "bg-text-primary text-bg font-semibold shadow-xs"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {isBn ? "পূর্ণ ডসিয়ার" : "Full Dossier"}
                </button>
              </div>
            </div>

            {/* Narrative Prose with Soothing Typography */}
            <div
              className={`text-base sm:text-lg text-text-secondary leading-relaxed font-serif ${
                isBn ? "font-bengali text-lg leading-loose" : ""
              }`}
            >
              {dossierMode === "brief" ? (
                <p>
                  {isBn ? (
                    <>
                      আমি একজন সফটওয়্যার প্রকৌশলী। বর্তমানে{" "}
                      <a
                        href="https://garirhat.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-primary font-semibold underline underline-offset-4 hover:text-accent"
                      >
                        Garirhat
                      </a>
                      -এ কোর প্ল্যাটফর্ম সার্ভিসেস ও সার্চ অবকাঠামো তৈরিতে কর্মরত, পূর্বে{" "}
                      <a
                        href="https://g2gdigital.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-primary font-semibold underline underline-offset-4 hover:text-accent"
                      >
                        G2G Digital
                      </a>
                      -এ নলেজ গ্রাফ সিস্টেম নির্মাণ করেছি, এবং এডুটেক প্ল্যাটফর্ম{" "}
                      <a
                        href="https://growwithowl.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-primary font-semibold underline underline-offset-4 hover:text-accent"
                      >
                        OwlPrep
                      </a>
                      -এর প্রতিষ্ঠাতা। ফ্রেমওয়ার্ক জমানোর চেয়ে সিস্টেমের ফান্ডামেন্টালস শেখাকে আমি প্রাধান্য দিই—কীভাবে আর্কিটেকচার স্কেল করে এবং চাপের মুখেও বিশ্বস্ত থাকে।
                    </>
                  ) : (
                    <>
                      I am a software engineer focused on platform architecture and distributed systems. Currently, I engineer core automotive platform services and scalable search at{" "}
                      <a
                        href="https://garirhat.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-primary font-semibold underline underline-offset-4 hover:text-accent"
                      >
                        Garirhat
                      </a>
                      , previously built knowledge graph platforms at{" "}
                      <a
                        href="https://g2gdigital.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-primary font-semibold underline underline-offset-4 hover:text-accent"
                      >
                        G2G Digital
                      </a>
                      , and founded cognitive learning platform{" "}
                      <a
                        href="https://growwithowl.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-primary font-semibold underline underline-offset-4 hover:text-accent"
                      >
                        OwlPrep
                      </a>
                      . My practice centers on fundamental systems principles: resilient data consistency, high-concurrency access patterns, and durable execution that remains correct under failure.
                    </>
                  )}
                </p>
              ) : (
                <div className="space-y-4 text-base leading-relaxed">
                  <p>
                    {isBn ? (
                      <>
                        <strong className="text-text-primary font-medium">১. garirhat.com (কোর প্ল্যাটফর্ম সার্ভিসেস):</strong>{" "}
                        অটোমোটিভ ট্রেডিং অবকাঠামোর মাল্টি-টেন্যান্ট ইনভেন্টরি, দ্রুতগতির সার্চ ইনডেক্সিং পাইপলাইন, এবং হাই-থ্রুপুট বুকিং ট্রানজ্যাকশন নিয়ে কাজ করছি।
                      </>
                    ) : (
                      <>
                        <strong className="text-text-primary font-medium">1. garirhat.com (Core Platform Systems):</strong>{" "}
                        Architecting core automotive platform microservices, high-throughput vehicle search indexing, and multi-tenant inventory infrastructure designed for reliability and speed.
                      </>
                    )}
                  </p>
                  <p>
                    {isBn ? (
                      <>
                        <strong className="text-text-primary font-medium">২. G2G Digital (নলেজ প্ল্যাটফর্ম):</strong>{" "}
                        ধারণা ও তথ্যের সুবিন্যস্ত কাঠামো পরিচালনার জন্য নলেজ গ্রাফ ও এডিটোরিয়াল ওয়ার্কফ্লো ইঞ্জিন নির্মাণ।
                      </>
                    ) : (
                      <>
                        <strong className="text-text-primary font-medium">2. G2G Digital (Knowledge &amp; Editorial Platforms):</strong>{" "}
                        Engineered dynamic knowledge graph visualization systems, automated content evaluation pipelines, and keyboard-first mental model planning workflows.
                      </>
                    )}
                  </p>
                  <p>
                    {isBn ? (
                      <>
                        <strong className="text-text-primary font-medium">৩. OwlPrep (কগনিটিভ লার্নিং প্ল্যাটফর্ম):</strong>{" "}
                        স্পেসড রিপিটেশন অ্যালগরিদম ও পারসোনালাইজড ট্রেইনিং সমৃদ্ধ আধুনিক শিক্ষা প্ল্যাটফর্ম প্রতিষ্ঠা ও পরিচালনা।
                      </>
                    ) : (
                      <>
                        <strong className="text-text-primary font-medium">3. OwlPrep (Cognitive Learning Systems):</strong>{" "}
                        Founded and architected OwlPrep—an adaptive learning platform combining cognitive spaced repetition with automated structured training modules.
                      </>
                    )}
                  </p>
                  <p className="text-xs font-mono text-text-muted italic pt-1 border-t border-border/40">
                    // Principle: &quot;Learn why before how. Understand systems instead of memorizing tools. See what others scroll past.&quot;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Anchors */}
          <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
            <a
              href="#works"
              className="inline-flex items-center gap-2 px-5 py-3 rounded border border-text-primary bg-text-primary text-bg font-semibold hover:opacity-90 transition-all shadow-xs"
            >
              <span>{isBn ? "নির্বাচিত কাজ দেখুন" : "Examine Featured Works"}</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/resume"
              className="inline-flex items-center gap-2 px-5 py-3 rounded border border-border hover:border-text-primary bg-bg-surface hover:bg-bg text-text-primary transition-all font-semibold"
            >
              <FileDown className="w-3.5 h-3.5 opacity-60 text-accent" />
              <span>{isBn ? "সিভি / রেজ্যুমে ডাউনলোড" : "Curriculum Vitae / Resume"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
