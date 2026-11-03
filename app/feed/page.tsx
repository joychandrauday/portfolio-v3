"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Terminal,
  Sparkles,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  Heart,
  Bookmark,
  Share2,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  Layers,
  Code2,
} from "lucide-react";

interface InsightItem {
  id: string;
  slug: string;
  title: string;
  topic: string;
  category: string;
  summary?: string | null;
  content: string;
  codeSnippet?: string | null;
  commandSnippet?: string | null;
  bgTheme: string;
  tags: string[];
  likesCount: number;
}

const TOPICS = [
  { id: "all", label: "All Topics", icon: Layers },
  { id: "linux", label: "Linux", icon: Terminal },
  { id: "ai", label: "AI & LLMs", icon: Sparkles },
  { id: "system-design", label: "System Design", icon: Cpu },
  { id: "dev-hacks", label: "Dev Hacks", icon: Zap },
  { id: "money", label: "Money & Wealth", icon: TrendingUp },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function MicroInsightsFeedPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Interactivity states
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  // Load saved topic preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("feed_preferred_topic");
      if (saved) setActiveTopic(saved);

      const savedBookmarks = localStorage.getItem("feed_bookmarks");
      if (savedBookmarks) setBookmarkedMap(JSON.parse(savedBookmarks));

      const savedLikes = localStorage.getItem("feed_likes");
      if (savedLikes) setLikedMap(JSON.parse(savedLikes));
    } catch {}
  }, []);

  // Fetch feed items
  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        const url = activeTopic === "all" ? "/api/ops/feed?public=true" : `/api/ops/feed?public=true&topic=${activeTopic}`;
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setInsights(data.items);
          const initialCounts: Record<string, number> = {};
          data.items.forEach((item: InsightItem) => {
            initialCounts[item.id] = item.likesCount || 0;
          });
          setLikesCountMap(initialCounts);
        }
      } catch (err) {
        console.error("Failed to load feed", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, [activeTopic]);

  // Handle topic change
  const handleSelectTopic = (topicId: string) => {
    setActiveTopic(topicId);
    try {
      localStorage.setItem("feed_preferred_topic", topicId);
    } catch {}
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    setCurrentIndex(0);
  };

  // Track active snapped card on scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight || window.innerHeight;
    const index = Math.round(scrollPos / height);
    if (index !== currentIndex && index >= 0 && index < insights.length) {
      setCurrentIndex(index);
    }
  };

  // Keyboard navigation: Down/J for next, Up/K for previous
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex, insights.length]);

  const scrollToIndex = (index: number) => {
    if (!containerRef.current || index < 0 || index >= insights.length) return;
    const height = containerRef.current.clientHeight || window.innerHeight;
    containerRef.current.scrollTo({
      top: index * height,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  // Like handler
  const handleToggleLike = async (item: InsightItem) => {
    const isLiked = likedMap[item.id];
    const currentCount = likesCountMap[item.id] || item.likesCount || 0;
    const nextLiked = !isLiked;
    const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

    const nextLikedMap = { ...likedMap, [item.id]: nextLiked };
    setLikedMap(nextLikedMap);
    setLikesCountMap({ ...likesCountMap, [item.id]: nextCount });

    try {
      localStorage.setItem("feed_likes", JSON.stringify(nextLikedMap));
      if (nextLiked) {
        await fetch("/api/ops/feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "like_insight", id: item.id, currentLikes: currentCount }),
        });
      }
    } catch {}
  };

  // Bookmark handler
  const handleToggleBookmark = (item: InsightItem) => {
    const nextMap = { ...bookmarkedMap, [item.id]: !bookmarkedMap[item.id] };
    setBookmarkedMap(nextMap);
    try {
      localStorage.setItem("feed_bookmarks", JSON.stringify(nextMap));
    } catch {}
  };

  // Copy code / command snippet
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Share card
  const handleShare = (item: InsightItem) => {
    const url = `${window.location.origin}/feed#${item.slug}`;
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  // Theme preset backgrounds
  const getThemeBackground = (theme: string) => {
    switch (theme) {
      case "obsidian-terminal":
        return "bg-gradient-to-b from-[#05070a] via-[#101721] to-[#040608] border-amber-500/20";
      case "emerald-matrix":
        return "bg-gradient-to-b from-[#02130b] via-[#052114] to-[#010a05] border-emerald-500/20";
      case "solar-flare":
        return "bg-gradient-to-b from-[#1c080b] via-[#291307] to-[#0d0406] border-orange-500/20";
      case "indigo-nebula":
        return "bg-gradient-to-b from-[#090e24] via-[#141233] to-[#040714] border-indigo-500/20";
      case "amber-vintage":
        return "bg-gradient-to-b from-[#14120e] via-[#211a11] to-[#0a0907] border-accent/25";
      case "cyber-mesh":
      default:
        return "bg-gradient-to-b from-[#0c091f] via-[#11192e] to-[#060814] border-cyan-500/20";
    }
  };

  const getTopicIcon = (topic: string) => {
    switch (topic) {
      case "linux":
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case "ai":
        return <Sparkles className="w-4 h-4 text-accent" />;
      case "money":
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case "system-design":
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case "security":
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
      default:
        return <Zap className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[#050505] text-text-primary overflow-hidden font-sans select-none">
      {/* ── Top Floating Navigation & Topic Pills ─────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-8 py-3.5 bg-black/60 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text-primary transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>

          {/* Topic Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTopic(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? "bg-accent text-black font-bold border-accent shadow-md shadow-accent/20"
                      : "bg-white/[0.04] text-text-muted hover:text-text-primary hover:bg-white/[0.08] border-white/[0.06]"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Current Position Counter */}
          <div className="text-xs font-mono text-accent font-bold shrink-0">
            {insights.length > 0 ? (
              <span>
                {String(currentIndex + 1).padStart(2, "0")} / {String(insights.length).padStart(2, "0")}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {/* ── Snap Scroll Container ───────────────────────────────────── */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {loading ? (
          <div className="h-[100dvh] w-full flex items-center justify-center font-mono text-xs text-text-muted">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span>Loading insights feed...</span>
            </div>
          </div>
        ) : insights.length === 0 ? (
          <div className="h-[100dvh] w-full flex flex-col items-center justify-center font-mono text-xs text-text-muted space-y-3">
            <Zap className="w-8 h-8 text-accent/50" />
            <p>No micro-insights found for this topic filter.</p>
            <button
              onClick={() => handleSelectTopic("all")}
              className="px-3 py-1.5 rounded-lg bg-accent text-black font-bold"
            >
              Reset to All Topics
            </button>
          </div>
        ) : (
          insights.map((item, idx) => {
            const isLiked = Boolean(likedMap[item.id]);
            const isBookmarked = Boolean(bookmarkedMap[item.id]);
            const likesCount = likesCountMap[item.id] ?? item.likesCount ?? 0;

            return (
              <section
                key={item.id}
                id={item.slug}
                className="h-[100dvh] w-full snap-start flex items-center justify-center p-4 sm:p-8 relative pt-16 pb-14"
              >
                {/* Dynamic Generative Aesthetic Background */}
                <div
                  className={`absolute inset-4 sm:inset-10 rounded-2xl border transition-all duration-700 shadow-2xl ${getThemeBackground(
                    item.bgTheme
                  )} overflow-hidden`}
                >
                  {/* Subtle Grid overlay for texture */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Card Content Layout */}
                  <div className="relative z-10 h-full max-w-2xl mx-auto p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
                    {/* Top Category Badge */}
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        {getTopicIcon(item.topic)}
                        <span className="font-mono text-xs font-bold tracking-widest text-accent uppercase">
                          // {item.category || item.topic}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-text-muted border border-white/[0.06]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Core Insight / Micro-Tutorial */}
                    <div className="space-y-4 my-auto py-4">
                      <h2 className="text-xl sm:text-3xl font-serif font-bold text-text-primary leading-tight">
                        {item.title}
                      </h2>

                      <p className="text-sm sm:text-base text-text-secondary font-serif leading-relaxed">
                        {item.content}
                      </p>

                      {/* Code or Command Snippet (1-Click Copy) */}
                      {(item.codeSnippet || item.commandSnippet) && (
                        <div className="space-y-1.5 pt-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                            <span className="flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5 text-accent" />
                              <span>Command / Code Execution</span>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  item.codeSnippet || item.commandSnippet || "",
                                  item.id
                                )
                              }
                              className="inline-flex items-center gap-1 text-accent hover:underline cursor-pointer"
                            >
                              {copiedSnippet === item.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Snippet</span>
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="p-3.5 rounded-xl bg-black/60 border border-white/[0.1] text-accent font-mono text-xs overflow-x-auto leading-relaxed select-all">
                            <code>{item.codeSnippet || item.commandSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Dock */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs font-mono">
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleLike(item)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isLiked ? "text-rose-400 font-bold" : "text-text-muted hover:text-text-primary"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-400 text-rose-400" : ""}`} />
                          <span>{likesCount}</span>
                        </button>

                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(item)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isBookmarked ? "text-accent font-bold" : "text-text-muted hover:text-text-primary"
                          }`}
                          title="Bookmark Insight"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-accent text-accent" : ""}`} />
                          <span className="hidden sm:inline">Save</span>
                        </button>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={() => handleShare(item)}
                          className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                          title="Copy Share Link"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      </div>

                      {/* Snap Indicator & Navigation Tip */}
                      <div className="flex items-center gap-2 text-text-muted text-[11px]">
                        <span className="hidden sm:inline opacity-60">Swipe or use ↑ / ↓ keys</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* ── Desktop Floating Next/Prev Arrow Controls ───────────────── */}
      <div className="hidden lg:flex fixed right-6 bottom-8 z-30 flex-col gap-2">
        <button
          onClick={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex <= 0}
          className="p-2.5 rounded-full bg-black/60 backdrop-blur border border-white/[0.1] text-text-secondary hover:text-text-primary hover:border-accent transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          title="Previous Insight [Hotkey: ↑ or K]"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <button
          onClick={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex >= insights.length - 1}
          className="p-2.5 rounded-full bg-black/60 backdrop-blur border border-white/[0.1] text-text-secondary hover:text-accent hover:border-accent transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          title="Next Insight [Hotkey: ↓ or J]"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-accent text-black font-mono text-xs font-bold rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}
