import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getStaticPost } from "@/lib/posts-static";
import Header from "@/components/Header";
import { Clock, ArrowLeft, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

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
  coverImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
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
    readingTimeMinutes: Number(post.readingTimeMinutes ?? 3),
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : typeof post.publishedAt === "string"
        ? post.publishedAt
        : null,
    createdAt: post.createdAt
      ? new Date(post.createdAt).toISOString()
      : new Date().toISOString(),
    coverImage: post.coverImage || null,
    seoTitle: post.seoTitle || null,
    seoDescription: post.seoDescription || null,
    canonicalUrl: post.canonicalUrl || null,
    ogImage: post.ogImage || post.coverImage || null,
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

  const title = post.seoTitle || `${post.titleEn} — Joy Chandra Uday`;
  const description = post.seoDescription || post.excerptEn;
  const ogImg = post.ogImage || post.coverImage || "/apple-icon.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: ogImg }],
      publishedTime: post.publishedAt || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImg],
    },
    alternates: {
      canonical: post.canonicalUrl || `https://joychandrauday.vercel.app/blog/${post.slug}`,
    },
  };
}

/**
 * Sanitizes rich HTML or parses legacy markdown safely
 */
function renderArticleHtml(raw: string): string {
  if (!raw) return "";

  // Check if it's already HTML (e.g. from TipTap editor)
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  const html = isHtml ? raw : (marked.parse(raw) as string);

  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li",
      "blockquote", "code", "pre", "hr", "br", "strong", "em", "del",
      "img", "table", "thead", "tbody", "tr", "th", "td", "span", "div"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "class"],
      code: ["class"],
      pre: ["class"],
      span: ["class", "style"],
      div: ["class"],
      p: ["class", "style"],
      h1: ["class", "style"],
      h2: ["class", "style"],
      h3: ["class", "style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
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
  const englishHtml = renderArticleHtml(post.contentEn);
  const bengaliHtml = renderArticleHtml(post.contentBn);

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/15 selection:text-text-primary font-sans">
      <main className="max-w-3xl mx-auto px-6 py-10 sm:py-14 space-y-8">
        <Header />

        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>back to essays</span>
          </Link>
        </div>

        <header className="space-y-4 pb-6 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 opacity-60 text-accent" />
              <span>{post.readingTimeMinutes} min read</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 opacity-60" />
              <span>
                {new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-text-primary leading-tight">
            {post.titleEn}
          </h1>

          {post.titleBn && (
            <h2 className="text-xl sm:text-2xl font-semibold font-bengali text-text-primary/90 pt-1">
              {post.titleBn}
            </h2>
          )}

          {post.coverImage && (
            <div className="pt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.titleEn}
                className="w-full max-h-[420px] object-cover rounded-xl border border-border shadow-lg"
              />
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 text-xs font-mono text-text-muted">
              {tags.map((tag) => (
                <span key={tag} className="text-text-muted/80 bg-bg-surface px-2 py-0.5 rounded border border-border/60">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="py-2 space-y-10 text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
          {englishHtml && (
            <section className="space-y-4">
              <div className="text-xs font-mono text-accent font-semibold uppercase tracking-wider">
                [ English Edition ]
              </div>
              <div
                className="prose prose-sm sm:prose-base max-w-none text-text-primary leading-relaxed
                  prose-headings:font-serif prose-headings:text-text-primary prose-headings:font-bold
                  prose-p:text-text-secondary prose-p:leading-relaxed
                  prose-a:text-accent prose-a:underline prose-a:underline-offset-2 hover:prose-a:opacity-80
                  prose-code:font-mono prose-code:text-accent prose-code:bg-bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                  prose-pre:bg-bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                  prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:text-text-muted prose-blockquote:italic
                  prose-strong:text-text-primary prose-strong:font-semibold
                  prose-ul:text-text-secondary prose-ol:text-text-secondary
                  prose-img:rounded-xl prose-img:border prose-img:border-border
                  prose-hr:border-border/60
                  dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: englishHtml }}
              />
            </section>
          )}

          {bengaliHtml && (
            <section className="pt-8 border-t border-border/60 space-y-4">
              <div className="text-xs font-mono text-accent font-semibold uppercase tracking-wider font-bengali">
                [ বাংলা সংস্করণ ]
              </div>
              <div
                className="font-bengaliSerif text-base sm:text-lg leading-loose text-text-primary/90
                  prose prose-base max-w-none
                  prose-headings:font-bengaliSerif prose-headings:text-text-primary
                  prose-p:leading-loose prose-a:text-accent
                  prose-code:font-mono prose-code:text-accent prose-code:bg-bg-surface prose-code:px-1 prose-code:rounded
                  prose-strong:text-text-primary
                  dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: bengaliHtml }}
              />
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
