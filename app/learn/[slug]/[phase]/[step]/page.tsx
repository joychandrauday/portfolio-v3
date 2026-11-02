"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { ExternalLink, CheckCircle2, ArrowLeft, Home, ChevronRight } from "lucide-react";

export default function StepDetail({
  params
}: {
  params: { slug: string; phase: string; step: string }
}) {
  const { t, isBn } = useLanguage();
  const { slug, phase, step } = params;
  
  const stepContent = getStepContent(slug, phase, step, isBn);

  if (!stepContent) {
    return (
      <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">
        <p className="text-text-secondary">Step not found</p>
      </div>
    );
  }

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
          <Link href={`/learn/${slug}/${phase}`} className="hover:text-accent transition-colors">
            {getPhaseTitle(phase, isBn)}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">{stepContent.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Roadmap Card */}
              <div className="bg-bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Learning Path</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Link href="/learn" className="text-xs text-text-muted hover:text-accent transition-colors">
                      {isBn ? "লার্ন" : "/learn"}
                    </Link>
                    <ChevronRight className="w-3 h-3 text-text-muted" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href={`/learn/${slug}`} className="text-xs text-text-muted hover:text-accent transition-colors">
                      {isBn ? "লিনাক্স রোডম্যাপ" : "/learn/linux-roadmap"}
                    </Link>
                    <ChevronRight className="w-3 h-3 text-text-muted" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href={`/learn/${slug}/${phase}`} className="text-xs text-text-muted hover:text-accent transition-colors">
                      {isBn ? "পর্ব: " + getPhaseTitle(phase, isBn) : "/learn/linux-roadmap/foundational"}
                    </Link>
                    <ChevronRight className="w-3 h-3 text-text-muted" />
                  </div>
                  <div className="text-xs text-accent font-medium pl-2 border-l-2 border-accent">
                    {isBn ? "বর্তমান: " + stepContent.title : "Current: " + stepContent.title}
                  </div>
                </div>
              </div>
              
              {/* Progress Widget */}
              <div className="bg-bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-text-secondary">Foundation Phase</div>
                      <div className="text-xs font-medium text-text-primary">3/3 completed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-text-muted" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-text-secondary">Shell Phase</div>
                      <div className="text-xs font-medium text-text-primary">0/2 completed</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-text-secondary mb-2">Overall Progress</div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <div className="text-xs text-accent mt-1">40% complete (4/10 steps)</div>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
              <div>
                <Link href={`/learn/${slug}/${phase}`} className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors mb-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> {isBn ? "ফেজে ফিরুন" : "Back to Phase"}
                </Link>
                <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">{stepContent.title}</h1>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span>{isBn ? "পর্ব: " + getPhaseTitle(phase, isBn) : "Phase: " + getPhaseTitle(phase, isBn)}</span>
                  <span>•</span>
                  <span>{stepContent.title}</span>
                </div>
              </div>
            </div>
            
            {/* Description Card */}
            <div className="bg-bg-surface border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Learning Objective</h2>
              <p className="text-text-secondary leading-relaxed">
                {stepContent.description}
              </p>
            </div>
            
            {/* Resources Section */}
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-accent" /> {isBn ? "লার্নিং রিসোর্সেস" : "Learning Resources"}
              </h2>
              <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
                {stepContent.resources.map((resource, idx) => (
                  <div key={idx} className="p-4 hover:bg-bg-surface/50 transition-colors border-b border-border last:border-b-0">
                    <a 
                      href={resource} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      <div className="w-6 h-6 rounded bg-bg flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-3 h-3" />
                      </div>
                      <span className="break-all">{resource}</span>
                    </a>
                  </div>
                ))}
              </div>
            </section>
            
            {/* My Notes Section */}
            <section className="bg-bg-surface border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isBn ? "আমার শেখার নোট" : "My Learning Notes"}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed bg-bg/50 p-4 rounded border border-border/50">
                {stepContent.myNotes}
              </p>
            </section>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button className="flex items-center gap-2 px-5 py-3 bg-accent text-black rounded-lg text-sm font-medium hover:bg-accent/90 transition-all shadow-sm hover:shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isBn ? "সম্পন্ন" : "Mark as Completed"}
              </button>
              <button className="flex items-center gap-2 px-5 py-3 border border-border text-text-primary rounded-lg text-sm hover:bg-bg-surface transition-all">
                <ExternalLink className="w-4 h-4 text-text-muted" /> {isBn ? "সাপোর্ট রিসোর্স" : "Suggest Resource"}
              </button>
              <button className="flex items-center gap-2 px-5 py-3 border border-border text-text-primary rounded-lg text-sm hover:bg-bg-surface transition-all">
                <ArrowLeft className="w-4 h-4 text-text-muted" /> {isBn ? "ফেজে ফিরুন" : "Back to Phase"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getPhaseTitle(phase: string, isBn: boolean): string {
  const titles: Record<string, string> = {
    "foundation": isBn ? "ফাউন্ডেশন" : "Foundation",
    "shell": isBn ? "শেল" : "Shell",
    "system-admin": isBn ? "সিস্টেম অ্যাডমিন" : "System Admin",
    "security": isBn ? "নিরাপত্তা" : "Security",
    "containerization": isBn ? "কনটেইনারাইজেশন" : "Containerization"
  };
  return titles[phase] || phase;
}

function getStepContent(slug: string, phase: string, step: string, isBn: boolean) {
  const linuxSteps: Record<string, Record<string, { title: string; description: string; resources: string[]; myNotes: string }>> = {
    "foundation": {
      "file-system": {
        title: isBn ? "ফাইল সিস্টেম বেসিক" : "File System Navigation",
        description: isBn ? "প্রকল্পের সুবিধার মুল ভিত্তি তৈরি করা ভালো" : "Understand how Linux organizes files and directories",
        resources: [
          "https://linuxhint.com/linux-file-system/",
          "https://www.gnu.org/software/coreutils/manual/html_node/index.html",
          "https://www.tutorialspoint.com/unix unix-commands/presentations/index.htm"
        ],
        myNotes: "I started with understanding root (/) vs home (~) - it seems backwards but makes sense once you understand permissions"
      },
      "permissions": {
        title: isBn ? "পারমিশনস" : "File Permissions & Ownership",
        description: isBn ? "শেষ ক্যুয়ার্ডের এক আবার scoreboard-scoreboard-style" : "Read/write/execute permissions, chmod, chown, chgrp",
        resources: [
          "https://www.linux.com/training/tutorials/understanding-linux-file-permissions/",
          "https://www.geeksforgeeks.org/chmod-command-in-linux/"
        ],
        myNotes: "Learning chmod was a game-changer - realizing that 755 = rwxr-xr-x opens up the entire file system structure"
      },
      "package-management": {
        title: isBn ? "প্যাকেজ ম্যানেজমেন্ট" : "Package Management",
        description: isBn ? "এক কমান্ডে সফ্টওয়্যার ইনস্টল করা" : "Install, remove, and manage software packages",
        resources: [
          "https://www.linux.com/training/tutorials/package-management-basics/",
          "https://wiki.archlinux.org/index.php/Pacman/Packaging_Guidelines"
        ],
        myNotes: "I learned that 'sudo' is the magic word for administrative tasks - makes system administration surprisingly simple!"
      }
    },
    "shell": {
      "bash-basics": {
        title: isBn ? "ব্যাশের মৌলিক" : "Bash Basics",
        description: isBn ? "জিনিসগুলো কিকড়া শিখানো" : "Variables, loops, conditionals, and basic shell scripting",
        resources: [
          "https://ryanstutorials.net/linuxtutorial/bash.php",
          "https://www.shellscript.sh/"
        ],
        myNotes: "I spent weeks just practicing variables and if-statements before moving on to actual scripts - it built the muscle memory I needed"
      }
    },
    "security": {
      "ssh-configuration": {
        title: isBn ? "এসএসএচ কনফিগারেশন" : "SSH Configuration",
        description: isBn ? "নির্দেশনঊপ এর SSH ক fissure..." : "Secure remote access with SSH keys and configuration",
        resources: [
          "https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server",
          "https://www.ssh.com/ssh/config"
        ],
        myNotes: "Moving from password authentication to SSH keys was my 'aha!' moment - it made remote work feel both more powerful and more secure"
      }
    },
    "containerization": {
      "docker-basics": {
        title: isBn ? "ডকায়ের মৌলিক" : "Docker Basics",
        description: isBn ? "ওয়্যারহ্যাচ্ট এবং ধারক স্থাপন" : "Containers, images, and Docker fundamentals",
        resources: [
          "https://docs.docker.com/get-started/",
          "https://www.docker.com/what-is-docker/"
        ],
        myNotes: "My first container was just running 'hello-world' - it seemed trivial, but understanding that isolated environment was the key to everything Docker"
      }
    }
  };

  if (linuxSteps[slug]?.[step]) {
    return linuxSteps[slug][step];
  }
  
  // Fallback - return a minimal version
  return {
    title: step.replace(/-/g, ' '),
    description: "Learning this step",
    resources: [],
    myNotes: "Add your personal notes here"
  };
}