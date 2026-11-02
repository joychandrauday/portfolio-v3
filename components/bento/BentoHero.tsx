"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import { ArrowUpRight, Copy, Check, MapPin, Building2, Sparkles } from "lucide-react";

export default function BentoHero() {
  const { isBn } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [bioMode, setBioMode] = useState<"brief" | "detailed">("brief");

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-6">
      {/* Top presence row */}
      <div className="space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-border bg-bg-surface shrink-0 shadow-xs">
            <Image
              src="/profile.png"
              alt="Joy Chandra Uday — Software Engineer"
              fill
              priority
              className="object-cover object-top filter grayscale contrast-105 hover:grayscale-0 transition-all duration-300"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                {siteConfig.name}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary font-mono flex items-center gap-1.5">
              <span>Software Engineer @</span>
              <a
                href="https://garirhat.com"
                target="_blank"
                rel="noreferrer"
                className="text-text-primary font-semibold hover:underline underline-offset-2"
              >
                garirhat.com
              </a>
            </p>
          </div>
        </div>

        {/* Bio Length Selector (Lee Robinson style) */}
        <div className="flex items-center justify-between pt-1">
          <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-bg-surface border border-border text-xs font-mono">
            <button
              onClick={() => setBioMode("brief")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                bioMode === "brief"
                  ? "bg-text-primary text-bg font-medium shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {isBn ? "সংক্ষিপ্ত" : "Overview"}
            </button>
            <button
              onClick={() => setBioMode("detailed")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                bioMode === "detailed"
                  ? "bg-text-primary text-bg font-medium shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {isBn ? "বিস্তারিত" : "Deep Dive"}
            </button>
          </div>

          <span className="text-[11px] font-mono text-text-muted hidden sm:inline">
            Dhaka & Patuakhali, BD (UTC+6)
          </span>
        </div>

        {/* Dynamic Bio Text */}
        <div
          className={`text-sm text-text-secondary leading-relaxed transition-all duration-200 ${
            isBn ? "font-bengali text-base leading-relaxed text-text-primary/90" : "font-sans"
          }`}
        >
          {bioMode === "brief" ? (
            <p>
              {isBn ? (
                <>
                  আমি একজন সফটওয়্যার প্রকৌশলী। বর্তমানে{" "}
                  <a href="https://garirhat.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">
                    garirhat.com
                  </a>
                  -এ অটোমোটিভ প্ল্যাটফর্মের কোর সার্ভিস ও স্কেলেবল সার্চ তৈরিতে নিয়োজিত এবং{" "}
                  <a href="https://growwithowl.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">
                    Grow With Owl
                  </a>
                  -এর প্রতিষ্ঠাতা। আমি উচ্চ-কনকারেন্সি ব্যাকএন্ড ও ইমিউটেবল লেজার আর্কিটেকচার তৈরি করি।
                </>
              ) : (
                <>
                  I engineer scalable automotive platforms, multi-tenant inventory, and search infrastructure at{" "}
                  <a href="https://garirhat.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">
                    garirhat.com
                  </a>{" "}
                  and founded{" "}
                  <a href="https://growwithowl.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">
                    Grow With Owl
                  </a>
                  . I specialize in distributed concurrency, immutable append-only ledgers, and low-latency database systems.
                </>
              )}
            </p>
          ) : (
            <div className="space-y-2.5">
              <p>
                {isBn ? (
                  <>
                    বর্তমানে <a href="https://garirhat.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">garirhat.com</a>-এ আধুনিক অটোমোটিভ প্ল্যাটফর্মের কোর সার্ভিস, সাব-১০০ মিলিসেকেন্ড সার্চ ও মাইক্রোসার্ভিস আর্কিটেকচারে কাজ করছি।
                  </>
                ) : (
                  <>
                    Currently engineering core platform microservices, multi-tenant inventory, and sub-100ms vehicle search at{" "}
                    <a href="https://garirhat.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">
                      garirhat.com
                    </a>
                    .
                  </>
                )}
              </p>
              <p>
                {isBn ? (
                  <>
                    পাশাপাশি, <a href="https://growwithowl.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">Grow With Owl</a>-এর প্রতিষ্ঠাতা হিসেবে <span className="text-text-primary font-medium">OwlPrep</span> (স্পেসড রিপিটেশন প্ল্যাটফর্ম) গড়ে তুলেছি এবং <a href="https://g2gdigital.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">G2G Digital</a>-এ ফুল-স্ট্যাক নলেজ গ্রাফ সিস্টেম নির্মাণ করেছি।
                  </>
                ) : (
                  <>
                    Founder of <a href="https://growwithowl.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">Grow With Owl</a> (gamified spaced repetition with AI mentors), engineered editorial knowledge graph platforms at <a href="https://g2gdigital.com" target="_blank" rel="noreferrer" className="text-text-primary font-semibold underline hover:text-accent">G2G Digital</a>, and author open-source concurrency primitives (StockFlow, FlowBridge).
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Connectivity Action Bar */}
      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted border-t border-border/60">
        <button
          onClick={copyEmail}
          className="hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer py-1"
        >
          {copiedEmail ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Copied email
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 opacity-60" />
              <span>{siteConfig.email}</span>
            </>
          )}
        </button>

        <span>•</span>

        <a
          href={siteConfig.github}
          target="_blank"
          rel="noreferrer"
          className="hover:text-text-primary transition-colors flex items-center gap-0.5"
        >
          <span>GitHub</span>
          <ArrowUpRight className="w-3 h-3 opacity-60" />
        </a>

        <span>•</span>

        <a
          href={siteConfig.linkedin}
          target="_blank"
          rel="noreferrer"
          className="hover:text-text-primary transition-colors flex items-center gap-0.5"
        >
          <span>LinkedIn</span>
          <ArrowUpRight className="w-3 h-3 opacity-60" />
        </a>

        <span>•</span>

        <a
          href={siteConfig.x}
          target="_blank"
          rel="noreferrer"
          className="hover:text-text-primary transition-colors flex items-center gap-0.5"
        >
          <span>Twitter/X</span>
          <ArrowUpRight className="w-3 h-3 opacity-60" />
        </a>

        <span>•</span>

        <Link
          href="/resume"
          className="text-text-primary font-semibold hover:underline transition-colors flex items-center gap-0.5"
        >
          <span>{isBn ? "সিভি" : "Resume"}</span>
          <ArrowUpRight className="w-3 h-3 opacity-60" />
        </Link>
      </div>
    </div>
  );
}
