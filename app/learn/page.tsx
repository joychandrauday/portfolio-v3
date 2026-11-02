"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";
import { Search } from "lucide-react";

export default function LearnIndex() {
  const { t, isBn } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  const roadmaps = [
    {
      slug: "linux-roadmap",
      title: isBn ? "লিনックス মৌলিক" : "Linux Mastery",
      description: isBn 
        ? "লিনックス কমান্ড লাইন থেকে শুরু করে প্রশাসনিক কাজ sampai"
        : "From terminal basics to system administration",
      estimatedHours: 200,
      difficulty: "beginner-to-intermediate"
    }
    // Add more roadmaps later
  ];

  const filtered = roadmaps.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Header />
      
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
          {filtered.map((rm) => (
            <Link
              key={rm.slug}
              href={`/learn/${rm.slug}`}
              className="block p-6 bg-bg-surface border border-border rounded-lg hover:border-accent/50 hover:bg-accent/[0.02] transition-colors"
            >
              <h2 className="text-xl font-bold text-text-primary mb-2">{rm.title}</h2>
              <p className="text-text-secondary text-sm mb-3">{rm.description}</p>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span>{rm.estimatedHours}h estimated</span>
                <span>•</span>
                <span>{rm.difficulty}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}