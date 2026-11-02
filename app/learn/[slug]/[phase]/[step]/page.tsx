"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";
import { ExternalLink, CheckCircle2 } from "lucide-react";

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
      <Header />
      
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        
        {/* Back link */}
        <div>
          <Link href={`/learn/${slug}/${phase}`} className="text-sm text-text-muted hover:text-accent">← Back to phase</Link>
        </div>
        
        {/* Step Title */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">{stepContent.title}</h1>
          <p className="text-text-secondary">{stepContent.description}</p>
        </div>

        {/* Resources Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Learning Resources</h2>
          <ul className="space-y-3 text-sm text-text-secondary">
            {stepContent.resources.map((resource, idx) => (
              <li key={idx}>
                <a 
                  href={resource} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  {resource}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* My Notes Section */}
        <section className="bg-bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-3">My Learning Notes</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {stepContent.myNotes}
          </p>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mark as Completed
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border text-text-primary rounded-lg text-sm hover:bg-bg-surface transition-colors">
            <ExternalLink className="w-3 h-3 text-text-muted" /> Suggest Resource
          </button>
        </div>
      </main>
    </div>
  );
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