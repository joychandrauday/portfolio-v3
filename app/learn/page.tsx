"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { Search } from "lucide-react";
import type { RoadmapSummary } from "@/lib/roadmaps-data";

export default function LearnIndex() {
  const { t, isBn } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const res = await fetch("/api/ops/learn/roadmaps", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch roadmaps");
        const data = await res.json();
        setRoadmaps(data.roadmaps);
      } catch (err) {
        console.error("Failed to load roadmaps:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmaps();
  }, []);

  const filtered = roadmaps.filter((r) =>
    r.title[isBn ? "bn" : "en"]
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    r.description[isBn ? "bn" : "en"]
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? "শিখার পরিধি খুঁজুন..." : "Search roadmaps..."}
            className="w-full pl-9 pr-4 py-3 bg-bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {/* Roadmap List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="mx-auto animate-spin w-8 h-8 border-2 border-border border-b-transparent rounded-full"></div>
              <p className="mt-3 text-text-muted">Loading roadmaps…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-muted">No roadmaps match your search.</p>
            </div>
          ) : (
            <div>{filtered.map((rm) => (
              <Link
                key={rm.slug}
                href={`/learn/${rm.slug}`}
                className="block p-6 bg-bg-surface border border-border rounded-lg hover:border-accent/50 hover:bg-accent/[0.02] transition-colors"
              >
                <h2 className="text-xl font-bold text-text-primary mb-2">{rm.title[isBn ? "bn" : "en"]}</h2>
                <p className="text-text-secondary text-sm mb-3">{rm.description[isBn ? "bn" : "en"]}</p>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>{rm.estimatedHours}h estimated</span>
                  <span>•</span>
                  <span>{rm.difficulty}</span>
                </div>
              </Link>
            ))}</div>
          )}
        </div>
      </main>
    </div>
  );
}