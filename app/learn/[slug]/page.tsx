"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { getRoadmapBySlug, roadmapToLearnTemplate } from "@/lib/roadmaps-data";
import { Home, ChevronRight, BookOpen, Clock, CheckCircle2, ArrowRight, Target, RefreshCw } from "lucide-react";

const LS_KEY = "portfolio_roadmap_tracks";

type LocalTrack = {
  slug: string;
  title: string;
  domain: string;
  goal: string;
  level: string;
  color: string;
  weeklyGoalMinutes: number;
  modules: {
    id: string;
    title: string;
    status: "todo" | "doing" | "done";
    estimateMinutes: number;
    resourceUrl: string | null;
    position: number;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

const loadTracks = (): Record<string, LocalTrack> => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveTracks = (tracks: Record<string, LocalTrack>) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(tracks));
  } catch {}
};

export default function RoadmapDetail({ params }: { params: { slug: string } }) {
  const { t, isBn } = useLanguage();
  const slug = params.slug;
  const phases = getRoadmapPhases(slug, isBn);
  const [tracked, setTracked] = useState<Record<string, LocalTrack>>({});
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState("");

  useEffect(() => {
    setTracked(loadTracks());
  }, []);

  const isTracked = Boolean(tracked[slug]);

  const handleTrackLocally = () => {
    setImporting(true);
    setImportStatus("");
    try {
      const roadmap = getRoadmapBySlug(slug);
      if (!roadmap) throw new Error("Roadmap not found");
      const template = roadmapToLearnTemplate(roadmap);
      const now = new Date().toISOString();
      const track: LocalTrack = {
        slug,
        title: template.title,
        domain: template.domain,
        goal: template.goal,
        level: template.level,
        color: template.color,
        weeklyGoalMinutes: template.weeklyGoalMinutes,
        modules: template.modules.map((m, i) => ({
          id: `local-${slug}-${i}`,
          title: m.title,
          status: "todo",
          estimateMinutes: m.estimateMinutes,
          resourceUrl: m.resourceUrl ?? null,
          position: i,
          completedAt: null,
          createdAt: now,
          updatedAt: now,
        })),
        createdAt: now,
        updatedAt: now,
      };
      const next = { ...tracked, [slug]: track };
      saveTracks(next);
      setTracked(next);
      setImportStatus(`Tracking “${template.title}” locally.`);
    } catch (err: any) {
      setImportStatus(err?.message || "Tracking failed");
    } finally {
      setImporting(false);
    }
  };
  const totalSteps = phases.reduce((acc, p) => acc + p.steps?.length || 0, 0);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/learn" className="hover:text-accent transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> {isBn ? "লার্ন" : "learn"}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">
            {slug === "linux-roadmap" ? (isBn ? "লিনাক্স মাস্টারি" : "Linux Mastery") : slug}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Roadmap Overview */}
              <div className="bg-bg-surface border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold text-text-primary mb-2">
                  {slug === "linux-roadmap" ? (isBn ? "লিনাক্স মাস্টারি" : "Linux Mastery") : slug}
                </h2>
                <p className="text-text-secondary text-sm mb-6">
                  {isBn ? "ফাইল সিস্টেম থেকে কন্টেইনারাইজেশন পর্যন্ত লিনাক্স দক্ষতা অর্জন করুন" : "Master Linux from file systems to containerization"}
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted">{isBn ? "পর্ব" : "Phases"}</div>
                      <div className="font-semibold text-text-primary">{phases.length}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted">{isBn ? "মোট ধাপ" : "Total Steps"}</div>
                      <div className="font-semibold text-text-primary">{totalSteps}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted">{isBn ? "আনুমানিক সময়" : "Est. Time"}</div>
                      <div className="font-semibold text-text-primary">10-15 weeks</div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-black rounded-lg font-medium text-sm hover:bg-accent/90 transition-all">
                  <Target className="w-4 h-4" /> {isBn ? "শুরু করুন" : "Start Learning"}
                </button>

                {importStatus && (
                  <div className={`mt-3 p-3 rounded-lg text-[11px] font-mono border ${importStatus.startsWith("Tracking") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-border bg-bg-surface/50 text-text-muted"}`}>
                    {importStatus}
                  </div>
                )}

                <button
                  onClick={isTracked ? undefined : handleTrackLocally}
                  disabled={importing || isTracked}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg text-xs font-mono text-text-muted hover:bg-bg-elevated hover:text-text-primary transition-colors disabled:opacity-50"
                >
                  {importing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> {isBn ? "ট্র্যাক করা হচ্ছে…" : "Tracking…"}
                    </>
                  ) : isTracked ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isBn ? "ট্র্যাক করা আছে" : "Tracking locally"}
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" /> {isBn ? "স্থানীয়ভাবে ট্র্যাক করুন" : "Track locally"}
                    </>
                  )}
                </button>
              </div>
              
              {/* Progress */}
              <div className="bg-bg-surface border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isBn ? "আপনার প্রগতি" : "Your Progress"}
                </h3>
                <div className="space-y-3">
                  {phases.map((phase, idx) => (
                    <div key={phase.slug} className="p-3 rounded-lg bg-bg/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-text-primary">{idx + 1}. {phase.title}</span>
                        <span className="text-xs text-text-muted">{isBn ? "০%" : "0%"}</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <div className="bg-accent h-1.5 rounded-full" style={{width: '0%'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <div className="text-2xl font-bold text-accent">0%</div>
                  <div className="text-xs text-text-muted">{isBn ? "সম্পূর্ণ" : "Complete"}</div>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/10 via-bg-surface to-bg border border-accent/20 p-8 md:p-12">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
                  <Target className="w-3 h-3" /> {isBn ? "রোডম্যাপ" : "Roadmap"}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  {slug === "linux-roadmap" ? (isBn ? "লিনাক্স মাস্টারি" : "Linux Mastery") : slug}
                </h1>
                <p className="text-text-secondary text-lg max-w-2xl mb-6">
                  {isBn ? "ফাইল সিস্টেমের মৌলিক বিষয় থেকে শুরু করে কন্টেইনারাইজেশন পর্যন্ত - লিনাক্স দক্ষতা অর্জনের সম্পূর্ণ পথ।" : "From file system fundamentals to containerization - the complete path to Linux mastery."}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {isBn ? "১০-১৫ সপ্তাহ" : "10-15 weeks"}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {phases.length} {isBn ? "পর্ব" : "phases"}</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {totalSteps} {isBn ? "ধাপ" : "steps"}</span>
                </div>
              </div>
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)"/>
                </svg>
              </div>
            </div>
            
            {/* Phases */}
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" /> {isBn ? "শিখার পর্বসমূহ" : "Learning Phases"}
              </h2>
              <div className="space-y-4">
                {phases.map((phase, idx) => (
                  <Link
                    key={phase.slug}
                    href={`/learn/${slug}/${phase.slug}`}
                    className="group block relative overflow-hidden bg-bg-surface border border-border rounded-xl p-6 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300"
                  >
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-105 transition-all duration-300">
                          <span className="text-2xl font-bold text-accent">{idx + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                            {phase.title}
                          </h3>
                          <p className="text-sm text-text-secondary mt-1">{phase.description}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        <span className="text-xs text-text-muted bg-bg px-2 py-1 rounded">
                          <Clock className="w-3 h-3 inline" /> {phase.duration}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-5 h-5 text-accent" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-border group-hover:bg-accent transition-all duration-500" style={{width: '0%'}}></div>
                  </Link>
                ))}
              </div>
            </section>
            
            {/* CTA */}
            <div className="text-center py-8">
              <Link 
                href="/learn"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" /> {isBn ? "সব রোডম্যাপ দেখুন" : "View All Roadmaps"}
              </Link>
            </div>
          </div>
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
          : "File system basics, terminal navigation, package management",
        steps: [
          { slug: "file-system", title: isBn ? "ফাইল সিস্টেম বেসিক" : "File System Navigation", description: "" },
          { slug: "permissions", title: isBn ? "পারমিশনস" : "File Permissions & Ownership", description: "" },
          { slug: "package-management", title: isBn ? "প্যাকেজ ম্যানেজমেন্ট" : "Package Management", description: "" }
        ]
      },
      {
        slug: "shell",
        title: isBn ? "শেল প্রোগ্রামিং" : "Shell Programming & Automation",
        duration: "2-3 weeks",
        description: isBn 
          ? "bash স্ক্রিপ্ট ও অটোমেশন একাতুতা"
          : "Bash scripting, automation, development workflow",
        steps: [
          { slug: "bash-basics", title: isBn ? "ব্যাশের মৌলিক" : "Bash Basics", description: "" },
          { slug: "automation", title: isBn ? "অটোমেশন" : "Automation & Cron Jobs", description: "" }
        ]
      },
      {
        slug: "system-admin",
        title: isBn ? "প্রশাসনিক কাজ" : "System Administration",
        duration: "3-4 weeks",
        description: isBn 
          ? "দেজ কার্নেল ও টুলগুলো একাতোলা হবে"
          : "Systemd services, firewall, user management, backups",
        steps: [
          { slug: "systemd-services", title: isBn ? "সিস্টেমড সার্ভিসেস" : "Systemd Services", description: "" },
          { slug: "user-management", title: isBn ? "ইউজার ম্যানেজমেন্ট" : "User Management", description: "" }
        ]
      },
      {
        slug: "security",
        title: isBn ? "সিকিউরিটি একাতুতা" : "Security & Hardening",
        duration: "2-3 weeks",
        description: isBn 
          ? "নির্দেশনঊপ নির্মাণ কন্ট্রোল করা এখন শুরু"
          : "SSH, sudo permissions, firewalls, secure configuration",
        steps: [
          { slug: "ssh-configuration", title: isBn ? "এসএসএচ কনফিগারেশন" : "SSH Configuration", description: "" },
          { slug: "firewall", title: isBn ? "ফায়ারওয়াল" : "Firewall & Network Security", description: "" }
        ]
      },
      {
        slug: "containerization",
        title: isBn ? "একতা বাস্তবায়ন" : "Containerization",
        duration: "2-3 weeks",
        description: isBn 
          ? "ওয়্যারহ্যাচ্ট ও ধারক স্থাপন একাতল"
          : "Docker fundamentals, container lifecycle, orchestration",
        steps: [
          { slug: "docker-basics", title: isBn ? "ডকায়ের মৌলিক" : "Docker Basics", description: "" },
          { slug: "docker-compose", title: isBn ? "ডকায়ে-কম্পোজ" : "Docker Compose", description: "" }
        ]
      }
    ];
  }
  return [];
}