"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";

export default function RoadmapDetail({ params }: { params: { slug: string } }) {
  const { t, isBn } = useLanguage();
  const slug = params.slug;
  
  const phases = getRoadmapPhases(slug, isBn);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Header />
      
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        
        {/* Back link */}
        <div>
          <Link href="/learn" className="text-sm text-text-muted hover:text-accent">← Back to roadmaps</Link>
        </div>
        
        {/* Roadmap Title */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {slug === "linux-roadmap" ? (isBn ? "লিনিস্ক এক্সপ্রেশন" : "Linux Mastery") : slug}
          </h1>
          <p className="text-text-secondary">{slug === "linux-roadmap" ? "কে কমান্ড লাইনে থেকে প্রশাসনিক কাজ পর্যন্ত একীভূত করা" : ""}</p>
        </div>

        {/* Phase List */}
        <div className="space-y-4">
          {phases.map((phase, idx) => (
            <Link
              key={phase.slug}
              href={`/learn/${slug}/${phase.slug}`}
              className="block p-5 border border-border rounded-lg hover:border-accent/30 hover:bg-accent/[0.02] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    {idx + 1}. {phase.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{phase.description}</p>
                </div>
                <span className="text-xs text-text-muted bg-bg-surface px-2 py-1 rounded">
                  {phase.duration}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function getRoadmapPhases(slug: string, isBn: boolean) {
  if (slug === "linux-roadmap") {
    return [
      {
        slug: "foundation",
        title: isBn ? "মৌলিক ভিত্তি ও পরিচালনা" : "Foundation & Navigation",
        duration: "1-2 weeks",
        description: isBn 
          ? "ফাইল সিস্টেমের বেসিকজ এবং কমান্ড লাইনের সাধারণ চেনারি"
          : "File system basics, terminal navigation, package management"
      },
      {
        slug: "shell",
        title: isBn ? "শেল প্রোগ্রামিং" : "Shell Programming & Automation",
        duration: "2-3 weeks",
        description: isBn 
          ? "bash স্ক্রিপ্ট ও অটোমেশন একাতুতা"
          : "Bash scripting, automation, development workflow"
      },
      {
        slug: "system-admin",
        title: isBn ? "প্রশাসনিক কাজ" : "System Administration",
        duration: "3-4 weeks",
        description: isBn 
          ? "দেজ কার্নেল ও টুলগুলো একাতোলা হবে"
          : "Systemd services, firewall, user management, backups"
      },
      {
        slug: "security",
        title: isBn ? "সিকিউরিটি একাতুতা" : "Security & Hardening",
        duration: "2-3 weeks",
        description: isBn 
          ? "নির্দেশনঊপ নির্মাণ কন্ট্রোল করা এখন শুরু"
          : "SSH, sudo permissions, firewalls, secure configuration"
      },
      {
        slug: "containerization",
        title: isBn ? "একতা বাস্তবায়ন" : "Containerization",
        duration: "2-3 weeks",
        description: isBn 
          ? "ওয়্যারহ্যাচ্ট ও ধারক স্থাপন একাতল"
          : "Docker fundamentals, container lifecycle, orchestration"
      }
    ];
  }
  return [];
}