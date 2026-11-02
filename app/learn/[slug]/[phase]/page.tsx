"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";

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
      <Header />
      
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        
        {/* Back link */}
        <div>
          <Link href={`/learn/${slug}`} className="text-sm text-text-muted hover:text-accent">← Back to roadmap</Link>
        </div>
        
        {/* Phase Title */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">{phaseTitle}</h1>
          <p className="text-text-secondary">{getPhaseDescription(phase)}</p>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div key={step.slug} className="border-l-2 border-accent/30 pl-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {idx + 1}. {step.title}
              </h3>
              <p className="text-text-secondary mb-4">{step.description}</p>
              
              <Link
                href={`/learn/${slug}/${phase}/${step.slug}`}
                className="inline-block text-sm text-accent hover:text-accent/80 font-medium"
              >
                View step →
              </Link>
            </div>
          ))}
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
            description: isBn ? "এই কান্ডেরгол novice বাটে" : "Variables, loops, conditionals, and basic shell scripting"
          },
          {
            slug: "automation",
            title: isBn ? "অটোমেশন" : "Automation & Cron Jobs",
            description: isBn ? "এই কান্ডেরгол novice বাটে" : "Schedule tasks, automate repetitive work"
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

function getPhaseDescription(phase: string): string {
  const descriptions: Record<string, string> = {
    "foundation": "Start with Linux fundamentals - everything builds from here",
    "shell": "Learn to script and automate your workflow",
    "system-admin": "Manage Linux systems like a pro",
    "security": "Secure your Linux systems",
    "containerization": "Run applications in containers"
  };
  return descriptions[phase] || "";
}