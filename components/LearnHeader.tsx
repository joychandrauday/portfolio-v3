"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import { ArrowUpRight, Sun, Moon, BookOpen, Home } from "lucide-react";

export default function LearnHeader() {
  const { language, setLanguage, isBn } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 bg-bg/95 backdrop-blur-sm flex items-center justify-between border-b border-border/60 z-20">
      <div className="flex items-center gap-4 px-6 py-3">
        <Link
          href="/learn"
          className="flex items-center gap-2 text-lg font-bold text-text-primary transition-colors"
        >
          <BookOpen className="w-5 h-5 text-accent" />
          <span>{isBn ? "শিখার পরিধি" : "learn"}</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 hover:bg-bg-surface rounded-md transition-colors"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-text-muted hover:text-accent" />
            ) : (
              <Moon className="w-4 h-4 text-text-muted hover:text-accent" />
            )}
          </button>

          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="text-xs px-2.5 py-0.5 rounded border border-border text-text-secondary hover:text-accent transition-colors"
            title="Toggle Language"
            aria-label="Toggle Language"
          >
            {language === "en" ? "বাংলা" : "EN"}
          </button>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 px-6 py-3">
        <Link
          href="/learn"
          className="flex items-center gap-1.5 text-sm font-medium text-accent"
        >
          <Home className="w-3.5 h-3.5" /> {isBn ? "হোম" : "Home"}
        </Link>
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          {isBn ? "প্রকল্প" : "Projects"}
        </Link>
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          {isBn ? "প্রবন্ধ" : "Writing"}
        </Link>
        <Link
          href="/resume"
          className="flex items-center gap-1 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          {isBn ? "সিভি" : "Resume"}
          <ArrowUpRight className="w-3 h-3 opacity-60" />
        </Link>
      </div>
    </nav>
  );
}
