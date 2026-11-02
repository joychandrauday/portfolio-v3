"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import DhakaClock from "@/components/DhakaClock";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import {
  Sun,
  Moon,
  ArrowUpRight,
  Compass,
  FileText,
  Cpu,
  Layers,
  History,
  PenTool,
  Mail,
  FolderGit2,
} from "lucide-react";

export default function RetroMasthead() {
  const { language, setLanguage, isBn } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  }, [isBn]);

  // Global keyboard shortcuts via shared hook
  useKeyboardShortcuts();

  return (
    <header className="w-full border-b border-border/80 pb-6 pt-4 font-mono select-none">
      {/* Top telemetry & archival coordinates */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] tracking-wider text-text-muted pb-3 border-b border-border/40">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-text-primary uppercase tracking-widest">
            {isBn ? "ভলিউম ১ · সংস্করণ ২০২৬" : "VOL. XXIV · ISSUE 10"}
          </span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span>DHAKA, BANGLADESH</span>
          </span>
          <span className="hidden md:inline opacity-40">|</span>
          <span className="hidden md:inline">{currentDate}</span>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          <DhakaClock />
        </div>
      </div>

      {/* Main Classical Editorial Masthead Title */}
      <div className="py-6 sm:py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/" className="group inline-block">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl tracking-tight text-text-primary font-normal leading-none group-hover:opacity-90 transition-opacity">
              JOY CHANDRA UDAY
            </h1>
          </Link>
          <p className="mt-2 text-xs sm:text-sm tracking-widest uppercase text-text-secondary font-mono">
            {isBn
              ? "সফটওয়্যার প্রকৌশলী · কোর প্ল্যাটফর্ম সার্ভিসেস ও ডিস্ট্রিবিউটেড সিস্টেমস"
              : "Software Engineer · Core Platform Services & Distributed Systems"}
          </p>
        </div>

        {/* Minimalist Tactile Controls with Icons */}
        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="px-2.5 py-1 rounded border border-border hover:border-text-primary bg-bg-surface text-text-secondary hover:text-text-primary transition-all cursor-pointer text-[11px] tracking-wider"
            title="Toggle Language [Hotkey: L]"
          >
            {language === "en" ? "বাংলা" : "ENGLISH"}
          </button>

          {/* Theme Switcher with crisp Lucide Icons */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded border border-border hover:border-text-primary bg-bg-surface text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode [Hotkey: T]`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Nav Menu Strip with Vintage Rule Lines and Crisp Lucide Icons */}
      <nav className="pt-3 border-t-2 border-double border-border flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-xs text-text-secondary font-mono">
        <div className="flex items-center flex-wrap gap-4 sm:gap-6">
          <a
            href="#dossier"
            className="hover:text-text-primary hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 opacity-60 text-accent" />
            <span>{isBn ? "ডসিয়ার" : "DOSSIER"}</span>
          </a>
          <a
            href="#workbench"
            className="hover:text-text-primary hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 opacity-60 text-accent" />
            <span>{isBn ? "সিস্টেম বেঞ্চ" : "WORKBENCH"}</span>
          </a>
          <a
            href="#works"
            className="hover:text-text-primary hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 opacity-60 text-accent" />
            <span>{isBn ? "নির্বাচিত কাজ" : "WORKS"}</span>
          </a>
          <a
            href="#chronicle"
            className="hover:text-text-primary hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 opacity-60 text-accent" />
            <span>{isBn ? "ইতিহাস" : "CHRONICLE"}</span>
          </a>
          <a
            href="#dispatches"
            className="hover:text-text-primary hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <PenTool className="w-3.5 h-3.5 opacity-60 text-accent" />
            <span>{isBn ? "প্রবন্ধ" : "WRITING"}</span>
          </a>
          <a
            href="#memorandum"
            className="hover:text-text-primary hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 opacity-60 text-accent" />
            <span>{isBn ? "বার্তা" : "CONTACT"}</span>
          </a>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <Link
            href="/projects"
            className="text-text-primary hover:text-accent font-medium flex items-center gap-1.5 group"
          >
            <FolderGit2 className="w-3.5 h-3.5 opacity-60" />
            <span>{isBn ? "প্রকল্প আর্কাইভ" : "Projects Archive"}</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <span className="opacity-30">•</span>
          <Link
            href="/resume"
            className="text-text-primary hover:text-accent font-medium flex items-center gap-1.5 group"
          >
            <FileText className="w-3.5 h-3.5 opacity-60" />
            <span>{isBn ? "সিভি / রেজ্যুমে" : "Curriculum Vitae"}</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
