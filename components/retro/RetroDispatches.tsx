"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { ArrowRight, BookOpen, Clock, PenTool } from "lucide-react";
import { staticPosts, formatPostMonth } from "@/lib/posts-static";

interface PostItem {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  readingTimeMinutes: number;
  publishedAt: string | null;
  coverImage?: string | null;
}

export default function RetroDispatches() {
  const { isBn } = useLanguage();
  const [posts, setPosts] = useState<PostItem[]>(staticPosts);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/ops/posts?public=true");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      } catch {}
    }
    loadPosts();
  }, []);

  const displayPosts = posts.slice(0, 3);

  return (
    <section id="dispatches" className="py-12 sm:py-20 border-b border-border/70 scroll-mt-6">
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase tracking-widest flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5" />
              <span>[ SECTION V // ESSAYS & DISPATCHES ]</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal">
              {isBn ? "প্রকৌশল প্রবন্ধ ও গবেষণা নোট" : "Published Dispatches & Technical Monologues"}
            </h3>
          </div>
          <span className="font-mono text-xs text-text-muted">
            {isBn ? "দ্বিভাষিক প্রকাশনা" : "Bilingual Publications"}
          </span>
        </div>

        {/* Article Cards with Soothing White Space */}
        <div className="space-y-6">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="p-6 sm:p-7 bg-bg-surface border border-border/80 hover:border-text-primary/70 transition-all rounded-sm space-y-3 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-text-muted">
                <span className="text-accent font-semibold">
                  {formatPostMonth(post.publishedAt) || "ARCHIVAL DISPATCH"}
                </span>
                
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 opacity-60" />
                  <span>{post.readingTimeMinutes} min read</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <h4 className="font-serif text-xl sm:text-2xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {isBn && post.titleBn ? post.titleBn : post.titleEn}
                    </Link>
                  </h4>

                  <p
                    className={`text-sm sm:text-base text-text-secondary leading-relaxed font-serif ${
                      isBn ? "font-bengali text-base" : ""
                    }`}
                  >
                    {isBn && post.excerptBn ? post.excerptBn : post.excerptEn}
                  </p>
                </div>

                {post.coverImage && (
                  <div className="w-full sm:w-28 sm:h-20 h-36 rounded overflow-hidden border border-border shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-text-primary hover:text-accent font-semibold group/link"
                >
                  <span>{isBn ? "সম্পূর্ণ প্রবন্ধ পড়ুন →" : "Read Full Dispatch →"}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Dedicated "View All" Button Link */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs border-t border-border/60">
          <span className="text-text-muted text-[11px]">
            {isBn
              ? `ব্লগে অন্যান্য প্রযুক্তিগত প্রবন্ধ প্রকাশিত রয়েছে`
              : `Explore complete technical essays on database internals and systems`}
          </span>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-3 rounded border border-border hover:border-text-primary bg-bg-surface hover:bg-bg text-text-primary font-semibold transition-all group self-start sm:self-auto"
          >
            <span>{isBn ? "সকল প্রবন্ধ দেখুন (ব্লগ পাতা) →" : "Explore All Dispatches (Writing Archive)"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
