"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";

export default function About() {
  const { isBn } = useLanguage();
  return (
    <section id="about" className="py-12 border-b border-border/60">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          {isBn ? "পরিচিতি" : "About Me"}
        </h2>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 shadow-md">
            <Image src="/profile.png" alt="Profile" fill className="object-cover" />
          </div>
          <p className="text-base text-text-secondary leading-relaxed">
            {isBn
              ? "আমি একটি সফটওয়্যার ইঞ্জিনিয়ার, বর্তমানে গরিরহাটে কাজ করছি এবং Grow With Owl-এর প্রতিষ্ঠাতা। আমি উচ্চ কনকারেন্সি ব্যাকএন্ড ও ইমিউটেবল লেজার আর্কিটেকচার নিয়ে কাজ করি."
              : "I’m a software engineer currently at garirhat.com and the founder of Grow With Owl. I specialize in high‑concurrency back‑ends and immutable ledger architecture."}
          </p>
        </div>
      </div>
    </section>
  );
}
