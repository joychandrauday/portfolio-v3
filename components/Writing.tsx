"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { ArrowRight } from "lucide-react";

interface PostItem {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  readingTimeMinutes: number;
  publishedAt: string | null;
}

const fallbackPosts: PostItem[] = [
  {
    id: "post-1",
    slug: "correctness-under-concurrency-postgres",
    titleEn: "Correctness Under Concurrency: Why Mutating Balance in Place is an Anti-Pattern",
    titleBn: "কনকারেন্সির অধীনে নির্ভুলতা: কেন ব্যালেন্স সরাসরি পরিবর্তন করা ক্ষতিকর",
    excerptEn:
      "A deep dive into race conditions, row-level locks, deadlocks, and why immutable append-only ledgers (onHand = Σ movements) guarantee zero double-spends.",
    excerptBn:
      "ডেটাবেস রেস কন্ডিশন, রো-লেভেল লক এবং কেন অ্যাপেন্ড-অনলি লেজার সিস্টেম ডাবল স্পেন্ডিং চিরতরে প্রতিরোধ করে তার বাস্তবিক বিশ্লেষণ।",
    readingTimeMinutes: 6,
    publishedAt: "Oct 2026",
  },
  {
    id: "post-2",
    slug: "surviving-server-restarts-workflow-engines",
    titleEn: "Surviving Server Restarts: Idempotent Workflows and Durable Delays",
    titleBn: "সার্ভার রিস্টার্টের পরও নিরবচ্ছিন্ন ওয়ার্কফ্লো: আইডেমপোটেন্ট সিস্টেম",
    excerptEn:
      "How to architect durable state machines without relying on volatile in-memory timers. Using (workflowId, eventId) execution tuples and exponential backoff.",
    excerptBn:
      "মেমরিতে টাইমার না রেখে ডেটাবেস স্টেট মেশিন ও আইডেমপোটেন্সি কি দিয়ে কীভাবে সার্ভার রিস্টার্টেও নিরবচ্ছিন্ন ওয়ার্কফ্লো বজায় রাখা যায়।",
    readingTimeMinutes: 8,
    publishedAt: "Sep 2026",
  },
];

export default function Writing() {
  const { isBn } = useLanguage();
  const [posts, setPosts] = useState<PostItem[]>(fallbackPosts);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/ops/posts?public=true");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to load posts", err);
      }
    }
    loadPosts();
  }, []);

  const displayPosts = posts.slice(0, 2);

  return (
    <section id="writing" className="space-y-6 pt-10 border-t border-border">
      <div className="flex items-center justify-between font-mono text-xs">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
          {isBn ? "প্রবন্ধ ও প্রকাশনা" : "Writing & Essays"}
        </h2>
        <span className="text-text-muted text-[11px]">[ 02 ]</span>
      </div>

      <div className="divide-y divide-border/60">
        {displayPosts.map((post) => {
          const title = isBn && post.titleBn ? post.titleBn : post.titleEn;
          const excerpt = isBn && post.excerptBn ? post.excerptBn : post.excerptEn;

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="py-5 first:pt-1 last:pb-1 block space-y-1.5 group"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3
                  className={`text-base font-medium text-text-primary group-hover:text-accent transition-colors ${
                    isBn ? "font-bengali text-lg" : "font-sans"
                  }`}
                >
                  {title}
                </h3>
                <span className="font-mono text-xs text-text-muted shrink-0">
                  {post.publishedAt || `${post.readingTimeMinutes} min read`}
                </span>
              </div>

              <p
                className={`text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2 ${
                  isBn ? "font-bengali text-sm text-text-primary/75" : "font-sans"
                }`}
              >
                {excerpt}
              </p>
            </Link>
          );
        })}
      </div>

      {/* View All Writing Button */}
      <div className="pt-2">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors py-1.5"
        >
          <span>
            {isBn
              ? `সকল প্রবন্ধ পড়ুন (${posts.length}) →`
              : `View all articles & essays (${posts.length}) →`}
          </span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
