import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getStaticPost } from "@/lib/posts-static";
import Header from "@/components/Header";
import { Clock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";

interface BlogPostView {
  slug: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  contentEn: string;
  contentBn: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string | null;
  createdAt: string;
}

function normalize(post: any): BlogPostView | undefined {
  if (!post) return undefined;
  return {
    slug: String(post.slug),
    titleEn: String(post.titleEn ?? ""),
    titleBn: String(post.titleBn ?? ""),
    excerptEn: String(post.excerptEn ?? ""),
    excerptBn: String(post.excerptBn ?? ""),
    contentEn: String(post.contentEn ?? ""),
    contentBn: String(post.contentBn ?? ""),
    tags: Array.isArray(post.tags) ? post.tags : [],
    readingTimeMinutes: Number(post.readingTimeMinutes ?? 0),
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : typeof post.publishedAt === "string"
        ? post.publishedAt
        : null,
    createdAt: post.createdAt
      ? new Date(post.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

async function loadPost(slug: string): Promise<BlogPostView | undefined> {
  try {
    const row = await prisma.post.findUnique({ where: { slug } });
    return normalize(row) ?? normalize(getStaticPost(slug));
  } catch (err) {
    console.error("[blog/[slug]] database unavailable:", err);
    return normalize(getStaticPost(slug));
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await loadPost(params.slug);
  if (!post) {
    return { title: "Post Not Found | Joy Chandra Uday" };
  }
  return {
    title: `${post.titleEn} — Joy Chandra Uday`,
    description: post.excerptEn,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await loadPost(params.slug);

  if (!post) {
    notFound();
  }

  const tags = post.tags;

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/15 selection:text-text-primary">
      <main className="max-w-2xl mx-auto px-6 py-10 sm:py-14 space-y-8">
        <Header />

        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>back to writing</span>
          </Link>
        </div>

        <header className="space-y-3 pb-6 border-b border-border/60">
          <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
            <span>{post.readingTimeMinutes} min read</span>
            <span>•</span>
            <span>
              {new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            {post.titleEn}
          </h1>

          {post.titleBn && (
            <h2 className="text-xl sm:text-2xl font-semibold font-bengali text-text-primary/90 pt-1">
              {post.titleBn}
            </h2>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 text-xs font-mono text-text-muted">
              {tags.map((tag) => (
                <span key={tag} className="text-text-muted/80">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="py-2 space-y-8 text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
          <section className="space-y-4">
            <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
              [ English Edition ]
            </div>
            <div className="prose prose-sm sm:prose-base max-w-none text-text-primary leading-relaxed
              prose-headings:font-serif prose-headings:text-text-primary prose-headings:font-semibold
              prose-p:text-text-secondary prose-p:leading-relaxed
              prose-a:text-accent prose-a:underline prose-a:underline-offset-2 hover:prose-a:opacity-80
              prose-code:font-mono prose-code:text-accent prose-code:bg-bg-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-bg-surface prose-pre:border prose-pre:border-border/80 prose-pre:rounded-sm prose-pre:p-4 prose-pre:overflow-x-auto
              prose-blockquote:border-l-2 prose-blockquote:border-accent/40 prose-blockquote:pl-4 prose-blockquote:text-text-muted prose-blockquote:italic
              prose-strong:text-text-primary prose-strong:font-semibold
              prose-ul:text-text-secondary prose-ol:text-text-secondary
              prose-hr:border-border/60
              dark:prose-invert">
              <ReactMarkdown>{post.contentEn}</ReactMarkdown>
            </div>
          </section>

          {post.contentBn && (
            <section className="pt-8 border-t border-border/60 space-y-4">
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider font-bengali">
                [ বাংলা সংস্করণ ]
              </div>
              <div className="font-bengaliSerif text-base sm:text-lg leading-loose text-text-primary/90
                prose prose-base max-w-none
                prose-headings:font-bengaliSerif prose-headings:text-text-primary
                prose-p:leading-loose prose-a:text-accent
                prose-code:font-mono prose-code:text-accent prose-code:bg-bg-surface prose-code:px-1 prose-code:rounded
                prose-strong:text-text-primary">
                <ReactMarkdown>{post.contentBn}</ReactMarkdown>
              </div>
            </section>
          )}
        </article>

        <footer className="pt-8 border-t border-border/60 flex items-center justify-between text-xs font-mono text-text-muted">
          <span>JOY CHANDRA UDAY</span>
          <Link href="/#contact" className="hover:text-text-primary underline transition-colors">
            Discuss this architecture →
          </Link>
        </footer>
      </main>
    </div>
  );
}
