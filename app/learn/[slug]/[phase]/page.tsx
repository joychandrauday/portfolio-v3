"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { Home, ChevronRight, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";

export default function PhaseDetail({
  params
}: {
  params: { slug: string; phase: string }
}) {
  const { t, isBn } = useLanguage();
  const { slug, phase } = params;
  
  const { title: phaseTitle, steps } = getPhaseContent(slug, phase, isBn);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/learn" className="hover:text-accent transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> {isBn ? "লার্ন" : "learn"}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/learn/${slug}`} className="hover:text-accent transition-colors">
            {isBn ? "লিনাক্স রোডম্যাপ" : "Linux Roadmap"}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">{phaseTitle}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Phase Progress */}
              <div className="bg-bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" /> {isBn ? "এই পর্বে" : "In This Phase"}
                </h3>
                <div className="space-y-3">
                  {steps.map((step, idx) => (
                    <Link
                      key={step.slug}
                      href={`/learn/${slug}/${phase}/${step.slug}`}
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors group p-2 rounded-lg hover:bg-bg-surface/50"
                    >
                      <span className="w-5 h-5 flex items-center justify-center text-xs font-medium rounded-full border border-border group-hover:border-accent group-hover:text-accent transition-colors">
                        {idx + 1}
                      </span>
                      <span className="truncate">{step.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Phase Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">{isBn ? "মোট ধাপ" : "Total Steps"}</span>
                    <span className="font-medium text-text-primary">{steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">{isBn ? "সম্পন্ন" : "Completed"}</span>
                    <span className="font-medium text-emerald-400">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">{isBn ? "বাকি" : "Remaining"}</span>
                    <span className="font-medium text-text-primary">{steps.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Phase Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href={`/learn/${slug}`} className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors mb-3">
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" /> {isBn ? "রোডম্যাপে ফিরুন" : "Back to Roadmap"}
                </Link>
                <h1 className="text-3xl font-bold text-text-primary mb-3">{phaseTitle}</h1>
                <p className="text-text-secondary text-lg max-w-2xl">
                  {getPhaseDescription(phase, isBn)}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-accent" />
                </div>
              </div>
            </div>
            
            {/* Steps Grid */}
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" /> {isBn ? "পর্বের ধাপসমূহ" : "Phase Steps"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps.map((step, idx) => (
                  <Link
                    key={step.slug}
                    href={`/learn/${slug}/${phase}/${step.slug}`}
                    className="group bg-bg-surface border border-border rounded-xl p-6 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <span className="text-lg font-bold text-accent">{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">{step.description}</p>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            
            {/* Quick Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Link 
                href={`/learn/${slug}`}
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" /> {isBn ? "সব পর্ব দেখুন" : "View All Phases"}
              </Link>
              <div className="text-sm text-text-muted">
                {isBn ? "পর্ব " + phaseTitle : "Phase: " + phaseTitle} • {isBn ? "পর্বের শেষ" : "End of phase"}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getPhaseContent(slug: string, phase: string, isBn: boolean) {
  if (slug === "linux-roadmap") {
    const phaseMap: Record<string, { title: string; steps: Array<{slug: string, title: string, description: string}> }> = {
      "foundation": {
        title: isBn ? "মৌলিক ভিত্তি ও পরিচালনা" : "Foundation & Navigation",
        steps: [
          {
            slug: "file-system",
            title: isBn ? "ফাইল সিস্টেম বেসিক" : "File System Navigation",
            description: isBn ? "প্রকল্পের সুবিধার মুল ভিত্তি তৈরি করা ভালো" : "Understand how Linux organizes files and directories"
          },
          {
            slug: "permissions",
            title: isBn ? "পারমিশনস" : "File Permissions & Ownership",
            description: isBn ? "ফাইল পারমিশন ও মালিকানা" : "Read/write/execute permissions, chmod, chown, chgrp"
          },
          {
            slug: "package-management",
            title: isBn ? "প্যাকেজ ম্যানেজমেন্ট" : "Package Management",
            description: isBn ? "সফ্টওয়্যার ইনস্টল, রিমুভ ও ম্যানেজ করা" : "Install, remove, and manage software packages"
          }
        ]
      },
      "shell": {
        title: isBn ? "শেল প্রোগ্রামিং" : "Shell Programming & Automation",
        steps: [
          {
            slug: "bash-basics",
            title: isBn ? "ব্যাশের মৌলিক" : "Bash Basics",
            description: isBn ? "এই কান্ডেরগো novice বাটে" : "Variables, loops, conditionals, and basic shell scripting"
          },
          {
            slug: "automation",
            title: isBn ? "অটোমেশন" : "Automation & Cron Jobs",
            description: isBn ? "এই কান্ডেরগো novice বাটে" : "Schedule tasks, automate repetitive work"
          }
        ]
      },
      "system-admin": {
        title: isBn ? "প্রশাসনিক কাজ" : "System Administration",
        steps: [
          {
            slug: "systemd-services",
            title: isBn ? "সিস্টেমড সার্ভিসেস" : "Systemd Services",
            description: isBn ? "এই কান্ডেরগো novice বাটে" : "Manage system services and daemons"
          },
          {
            slug: "user-management",
            title: isBn ? "ইউজার ম্যানেজমেন্ট" : "User Management",
            description: isBn ? "এই কান্ডেরগো novice বাটে" : "Create users, groups, and manage access"
          }
        ]
      },
      "security": {
        title: isBn ? "সিকিউরিটি একাতুতা" : "Security & Hardening",
        steps: [
          {
            slug: "ssh-configuration",
            title: isBn ? "এসএসএচ কনফিগারেশন" : "SSH Configuration",
            description: isBn ? "এই কান্ডেরগো novice বাটে" : "Secure remote access with SSH keys and configuration"
          },
          {
            slug: "firewall",
            title: isBn ? "ফায়ারওয়াল" : "Firewall & Network Security",
            description: isBn ? "এই কান্ডেরগো novice বাটে" : "UFW, iptables, and network traffic control"
          }
        ]
      },
      "containerization": {
        title: isBn ? "একতা বাস্তবায়ন" : "Containerization",
        steps: [
          {
            slug: "docker-basics",
            title: isBn ? "ডকায়ের মৌলিক" : "Docker Basics",
            description: isBn ? "এই কান্ডেরগো novice বাটে" : "Containers, images, and Docker fundamentals"
          },
          {
            slug: "docker-compose",
            title: isBn ? "ডকায়ে-কম্পোজ" : "Docker Compose",
            description: isBn ? "এই কান্ডেরগো novice বাটে" : "Multi-container applications and orchestration"
          }
        ]
      }
    };
    
    const phaseData = phaseMap[phase];
    if (phaseData) {
      return phaseData;
    }
  }
  
  return { title: phase, steps: [] };
}

function getPhaseDescription(phase: string, isBn: boolean): string {
  const descriptions: Record<string, string> = {
    "foundation": isBn ? "লিনাক্স মৌলিক বিষয় দিয়ে শুরু করুন - সবকিছু এখান থেকে তৈরি হয়" : "Start with Linux fundamentals - everything builds from here",
    "shell": isBn ? "আপনার ওয়ার্কফ্লো স্ক্রিপ্ট এবং অটোমেট করতে শিখুন" : "Learn to script and automate your workflow",
    "system-admin": isBn ? "একজন পেশাদারের মতো লিনাক্স সিস্টেম পরিচালনা করুন" : "Manage Linux systems like a pro",
    "security": isBn ? "আপনার লিনাক্স সিস্টেম নিরাপদ করুন" : "Secure your Linux systems",
    "containerization": isBn ? "কন্টেইনারেই অ্যাপ্লিকেশন চালান" : "Run applications in containers"
  };
  return descriptions[phase] || "";
}