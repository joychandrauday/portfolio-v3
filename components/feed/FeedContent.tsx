"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
  Home,
  Search,
  Menu,
  X,
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
  { id: "all", label: "All", icon: Layers },
  { id: "linux", label: "Linux", icon: Terminal },
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "system-design", label: "Systems", icon: Cpu },
  { id: "dev-hacks", label: "Dev Hacks", icon: Zap },
  { id: "money", label: "Money", icon: TrendingUp },
  { id: "security", label: "Security", icon: ShieldCheck },
];

const THEME_GRADIENTS: Record<string, string> = {
  "cyber-mesh": "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
  "obsidian-terminal": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
  "emerald-matrix": "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
  "solar-flare": "linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)",
  "indigo-nebula": "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)",
  "amber-vintage": "linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)",
};

export default function FeedContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showTopicDrawer, setShowTopicDrawer] = useState(false);

  // Interactivity states
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Fetch insights
  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/ops/feed?public=true");
      const data = await res.json();
      if (Array.isArray(data.items)) setInsights(data.items);
    } catch (err) {
      console.error("Failed to load feed items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  // Filtered insights based on topic
  const filtered = useMemo(() => {
    return insights.filter((i) => activeTopic === "all" || i.topic === activeTopic);
  }, [insights, activeTopic]);

  // Snap scroll handling
  const snapRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (snapRef.current && filtered[index]) {
      const item = snapRef.current.children[index] as HTMLElement;
      if (item) {
        item.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [filtered]);

  // Handle scroll for snap tracking
  const handleScroll = useCallback(() => {
    if (!snapRef.current) return;
    const container = snapRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const index = Math.round(scrollTop / itemHeight);
    if (index >= 0 && index < filtered.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [filtered.length, currentIndex]);

  useEffect(() => {
    const container = snapRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        if (currentIndex < filtered.length - 1) {
          scrollToIndex(currentIndex + 1);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex > 0) {
          scrollToIndex(currentIndex - 1);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToIndex(filtered.length - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, filtered.length, scrollToIndex]);

  // Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Toggle like
  const toggleLike = (id: string) => {
    const liked = !likedMap[id];
    setLikedMap({ ...likedMap, [id]: liked });
    const cnt = (likesCountMap[id] || 0) + (liked ? 1 : -1);
    setLikesCountMap({ ...likesCountMap, [id]: cnt });
  };

  // Render gradient background
  const getBgStyle = (theme: string) => ({
    background: THEME_GRADIENTS[theme] || THEME_GRADIENTS["cyber-mesh"],
  });

  const currentItem = filtered[currentIndex];

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans">
      {/* Scroll-snap container - mobile full-screen, desktop normal */}
      <div
        ref={snapRef}
        className="relative h-full w-full overflow-y-auto snap-y snap-mandatory"
        style={{ height: "100vh", maxHeight: "100vh" }}
        onScroll={handleScroll}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full w-full snap-start">
            <p className="text-xs font-mono text-text-muted">Loading feed…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full snap-start text-center px-4">
            <p className="text-xs font-mono text-text-muted">No insights for this topic.</p>
          </div>
        ) : (
          filtered.map((item, idx) => (
            <article
              key={item.id}
              className="relative snap-start flex flex-col h-full w-full overflow-hidden"
              style={{ minHeight: "100vh" }}
            >
              {/* Animated gradient background */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-transparent via-black/60 to-black/90 z-0"
                style={getBgStyle(item.bgTheme)}
              />
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 z-0 opacity-10" style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }} />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full w-full p-6 md:p-10 lg:p-16">
                {/* Topic badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-[10px] font-mono uppercase tracking-wider">
                    {item.category || item.topic}
                  </span>
                  <span className="text-xs font-mono text-text-muted/60">#{item.topic}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-white leading-tight mb-4">
                  {item.title}
                </h1>

                {/* Summary */}
                {item.summary && (
                  <p className="text-base md:text-lg text-white/80 font-sans leading-relaxed mb-6 max-w-2xl">
                    {item.summary}
                  </p>
                )}

                {/* Main content */}
                <div className="flex-1 overflow-y-auto pr-4 max-w-2xl">
                  <div className="prose prose-invert max-w-none text-white/90 text-base leading-relaxed">
                    <p>{item.content}</p>
                  </div>

                  {/* Code snippet */}
                  {item.codeSnippet && (
                    <div className="mt-6 p-4 bg-black/50 border border-white/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-accent">CODE</span>
                        <button
                          onClick={() => handleCopy(item.codeSnippet!, item.id)}
                          className="flex items-center gap-1 text-xs font-mono text-white/60 hover:text-accent"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copiedSnippet === item.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-green-300 overflow-x-auto"><code>{item.codeSnippet}</code></pre>
                    </div>
                  )}

                  {/* Command snippet */}
                  {item.commandSnippet && (
                    <div className="mt-4 p-4 bg-black/50 border border-white/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-accent">COMMAND</span>
                        <button
                          onClick={() => handleCopy(item.commandSnippet!, item.id)}
                          className="flex items-center gap-1 text-xs font-mono text-white/60 hover:text-accent"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copiedSnippet === item.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-yellow-300 overflow-x-auto"><code>{item.commandSnippet}</code></pre>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tags.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 rounded bg-white/10 border border-white/20 text-[10px] font-mono text-white/80"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom meta */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(item.id)}
                      className="flex items-center gap-1.5 text-white/70 hover:text-rose-400 transition-colors"
                    >
                      <Heart className={likedMap[item.id] ? "fill-current text-rose-400" : "w-5 h-5"} />
                      <span className="text-sm font-mono">{likesCountMap[item.id] ?? item.likesCount}</span>
                    </button>
                    <button
                      onClick={() => setBookmarkedMap({ ...bookmarkedMap, [item.id]: !bookmarkedMap[item.id] })}
                      className="flex items-center gap-1.5 text-white/70 hover:text-amber-400 transition-colors"
                    >
                      <Bookmark className={bookmarkedMap[item.id] ? "fill-current text-amber-400" : "w-5 h-5"} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-white/70 hover:text-accent transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scroll indicator */}
              {idx < filtered.length - 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
                  <ChevronDown className="w-6 h-6 text-white/50" />
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {/* Bottom Navigation - Mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-bg-surface/95 backdrop-blur border-t border-border" style={showBottomNav ? {} : { display: "none" }}>
        <div className="flex items-center justify-between px-2 py-2">
          <button
            onClick={() => scrollToIndex(0)}
            className={`flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-mono transition-colors ${
              currentIndex === 0 ? "text-accent" : "text-text-muted"
            }`}
            aria-label="First"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setShowTopicDrawer(true)}
            className={`flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-mono transition-colors ${
              activeTopic !== "all" ? "text-accent" : "text-text-muted"
            }`}
            aria-label="Topics"
          >
            <Layers className="w-5 h-5" />
            <span>Topics</span>
          </button>

          <div className="flex items-center gap-1 px-3 py-2 text-[10px] font-mono text-text-muted">
            <span>{currentIndex + 1}</span>
            <span className="text-text-muted/40">/</span>
            <span>{filtered.length}</span>
          </div>

          <button
            onClick={() => scrollToIndex(filtered.length - 1)}
            className={`flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-mono transition-colors ${
              currentIndex === filtered.length - 1 ? "text-accent" : "text-text-muted"
            }`}
            aria-label="Last"
          >
            <Code2 className="w-5 h-5" />
            <span>Latest</span>
          </button>

          <button
            onClick={() => setShowBottomNav(false)}
            className="flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-mono text-text-muted"
            aria-label="Hide nav"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="h-0.5 bg-border relative overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / filtered.length) * 100}%` }}
          />
        </div>
      </nav>

      {/* Show nav button when hidden */}
      {!showBottomNav && (
        <button
          onClick={() => setShowBottomNav(true)}
          className="fixed bottom-4 right-4 z-50 md:hidden p-3 rounded-full bg-accent text-black shadow-lg animate-in"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Topic Drawer */}
      {showTopicDrawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={() => setShowTopicDrawer(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-bg-surface border-t border-border rounded-t-2xl p-6 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold font-mono text-text-primary">Topics</h3>
              <button
                onClick={() => setShowTopicDrawer(false)}
                className="p-1 text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTopic(t.id);
                    setShowTopicDrawer(false);
                    setCurrentIndex(0);
                  }}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    activeTopic === t.id
                      ? "bg-accent/15 border-accent text-accent"
                      : "border-border text-text-primary hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <t.icon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{t.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    {t.id}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop topic bar */}
      <div className="hidden md:flex md:items-center md:justify-center md:gap-2 md:p-4 md:border-b md:border-border md:bg-bg-surface/50 md:backdrop-blur md:sticky md:top-0 md:z-40">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTopic(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-colors ${
              activeTopic === t.id
                ? "bg-accent/15 border-accent text-accent"
                : "bg-bg border-border text-text-muted hover:text-text-primary"
            }`}
          >
            <t.icon className="inline w-4 h-4 mr-1" />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}