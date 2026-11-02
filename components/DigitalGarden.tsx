"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function DigitalGarden() {
  const { isBn } = useLanguage();

  const entries = [
    {
      date: "2026",
      num: "01",
      titleEn: "The Concurrency Paradox",
      titleBn: "কনকারেন্সি প্যারাডক্স",
      noteEn: "Why storing mutable balance is an anti-pattern, and why onHand = Σ movements guarantees zero race conditions.",
      noteBn: "কেন পরিবর্তনশীল ব্যালেন্স সংরক্ষণ করা ক্ষতিকর এবং কেন অ্যাপেন্ড-অনলি লেজার রেস কন্ডিশন সম্পূর্ণ দূর করে।",
    },
    {
      date: "2026",
      num: "02",
      titleEn: "Event Identity & Idempotency",
      titleBn: "ইভেন্ট আইডেন্টিটি ও আইডেমপোটেন্সি",
      noteEn: "Modeling workflow state machines around (workflowId, eventId) to survive server restarts without in-memory state loss.",
      noteBn: "মেমরির উপর নির্ভর না করে (workflowId, eventId) দিয়ে সার্ভার রিস্টার্টেও নির্বিঘ্ন ওয়ার্কফ্লো এক্সিকিউশন।",
    },
    {
      date: "2026",
      num: "03",
      titleEn: "Raft Quorum Correctness",
      titleBn: "র‍্যাফ্ট কনসেনসাস ও কোরাম",
      noteEn: "Randomized election timeouts (150-300ms) and majority quorum verification (2F + 1) to eliminate split-brain states.",
      noteBn: "স্প্লিট-ব্রেইন সমস্যা সমাধান এবং মেজরিটি কোরামের মাধ্যমে ডিস্ট্রিবিউটেড স্টেট মেশিন নিশ্চিতকরণ।",
    },
    {
      date: "2026",
      num: "04",
      titleEn: "Zero-Overhead Kernel Telemetry",
      titleBn: "কার্নেল অবজার্ভেবিলিটি ও eBPF",
      noteEn: "Tracing TCP socket transitions and memory allocations using verified sandboxed eBPF bytecode in the Linux kernel.",
      noteBn: "লিনাক্স কার্নেলে স্যান্ডবক্সড ইবিপিএফ বাইটকোড দিয়ে কোনো ওভারহেড ছাড়াই সকেট ট্র্যাকিং।",
    },
  ];

  return (
    <section className="space-y-6 pt-10 border-t border-border">
      <div className="flex items-center justify-between font-mono text-xs">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
          {isBn ? "সিস্টেমস গবেষণা ও নোট" : "Systems Notes & Primitives"}
        </h2>
        <span className="text-text-muted text-[11px]">[ 03 ]</span>
      </div>

      <div className="divide-y divide-border/60">
        {entries.map((entry) => (
          <div
            key={entry.num}
            className="py-4 first:pt-1 last:pb-1 space-y-1 group"
          >
            <div className="flex items-baseline justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-accent font-semibold">{entry.num}</span>
                <span
                  className={`text-sm font-medium text-text-primary group-hover:text-accent transition-colors ${
                    isBn ? "font-bengali text-base" : "font-sans"
                  }`}
                >
                  {isBn ? entry.titleBn : entry.titleEn}
                </span>
              </div>
              <span className="text-text-muted text-[11px]">{entry.date}</span>
            </div>

            <p
              className={`text-xs text-text-secondary leading-relaxed pl-6 ${
                isBn ? "font-bengali text-xs text-text-primary/75" : "font-sans"
              }`}
            >
              {isBn ? entry.noteBn : entry.noteEn}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
