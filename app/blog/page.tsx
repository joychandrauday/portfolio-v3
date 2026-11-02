"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";
import { ArrowLeft, Search } from "lucide-react";
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
  tags?: string[];
}

const formatPostDate = formatPostMonth;

export default function BlogPage() {
  const { isBn } = useLanguage();
  const [posts, setPosts] = useState<PostItem[]>(staticPosts);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filtered = posts.filter((post) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      post.titleEn.toLowerCase().includes(q) ||
      (post.titleBn && post.titleBn.toLowerCase().includes(q)) ||
      post.excerptEn.toLowerCase().includes(q) ||
      (post.excerptBn && post.excerptBn.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/15 selection:text-text-primary">
      <main className="max-w-2xl mx-auto px-6 py-10 sm:py-14 space-y-8">
        <Header />

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? "মূল পাতায় ফিরুন" : "return"}</span>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {isBn ? "প্রবন্ধ ও প্রকাশনা" : "Writing & Essays"}
          </h1>
          <p className="text-sm text-text-secondary">
            {isBn
              ? "ডিস্ট্রিবিউটেড সিস্টেম, কনকারেন্সি প্যারাডক্স, ডেটাবেস ইন্টারনালস এবং সফটওয়্যার আর্কিটেকচার।"
              : "Essays on distributed systems correctness, append-only ledgers, and database internals."}
          </p>
        </div>

        <div className="relative pt-2">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search essays by title or concept..."
            className="w-full bg-bg-surface border border-border focus:border-text-primary rounded-lg pl-8 pr-3 py-1.5 text-xs font-sans text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors"
          />
        </div>

        <div className="divide-y divide-border/60 border-t border-border/60 pt-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs font-mono text-text-muted">
              {isBn ? "কোনো প্রবন্ধ পাওয়া যায়নি।" : "No articles found."}
            </div>
          ) : (
            filtered.map((post) => {
              const title = isBn && post.titleBn ? post.titleBn : post.titleEn;
              const excerpt = isBn && post.excerptBn ? post.excerptBn : post.excerptEn;

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="py-5 first:pt-2 last:pb-2 block space-y-1.5 group"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2
                      className={`text-base font-medium text-text-primary group-hover:text-accent transition-colors ${
                        isBn ? "font-bengali text-lg" : "font-sans"
                      }`}
                    >
                      {title}
                    </h2>
                    <span className="font-mono text-xs text-text-muted shrink-0">
                      {formatPostDate(post.publishedAt) || `${post.readingTimeMinutes} min`}
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
            })
          )}
        </div>
      </main>
    </div>
  );
}
