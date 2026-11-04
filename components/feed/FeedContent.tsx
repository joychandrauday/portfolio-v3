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

export default function FeedContent() {
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

  // Fetch insights (same as original)
  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/ops/feed");
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

  // Snap‑scroll handling (kept from original page)
  // ... (You can copy the original scrolling logic here if needed) 

  return (
    <div className="min-h-screen bg-bg text-text-primary" ref={containerRef}>
      {/* Header and topic pills */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-bold">Micro‑Insights Feed</h1>
        <div className="flex gap-2">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className={`px-3 py-1 rounded-lg text-sm font-mono ${activeTopic === t.id ? "bg-accent/15 border-accent text-accent" : "bg-bg-surface border-border text-text-muted"}`}
            >
              <t.icon className="inline w-4 h-4 mr-1" /> {t.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      {loading ? (
        <p className="p-4 text-text-muted">Loading feed…</p>
      ) : (
        <div className="space-y-4 p-4">
          {filtered.map((item) => (
            <div key={item.id} className="p-4 bg-bg-surface border border-border rounded-lg">
              <h2 className="font-bold text-lg mb-2">{item.title}</h2>
              <p className="text-sm mb-2">{item.summary}</p>
              {/* Actions */}
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => {
                    const liked = !likedMap[item.id];
                    setLikedMap({ ...likedMap, [item.id]: liked });
                    const cnt = (likesCountMap[item.id] || 0) + (liked ? 1 : -1);
                    setLikesCountMap({ ...likesCountMap, [item.id]: cnt });
                  }}
                  className="flex items-center gap-1"
                >
                  <Heart className={likedMap[item.id] ? "text-red-500" : ""} /> {likesCountMap[item.id] ?? item.likesCount}
                </button>
                <button
                  onClick={() => setBookmarkedMap({ ...bookmarkedMap, [item.id]: !bookmarkedMap[item.id] })}
                  className="flex items-center gap-1"
                >
                  <Bookmark className={bookmarkedMap[item.id] ? "text-accent" : ""} />
                </button>
                {item.commandSnippet && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.commandSnippet!);
                      setCopiedSnippet(item.id);
                      setTimeout(() => setCopiedSnippet(null), 2000);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Copy />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
