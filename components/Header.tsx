"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function Header() {
  const { language, setLanguage, isBn } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Global keyboard shortcuts (L, T, P, B, R)
  useKeyboardShortcuts();

  return (
    <nav className="sticky top-0 bg-bg/95 backdrop-blur-sm flex items-center justify-between text-xs font-mono text-text-muted pb-8 border-b border-border/60 z-10">
      {/* Brand identity */}
      <Link
        href="/"
        className="text-text-primary hover:text-accent font-semibold transition-colors flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>joychandrauday</span>
      </Link>

      {/* Inline non-sticky navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="hover:text-text-primary transition-colors hidden sm:inline-block"
          title="Projects (Hotkey: P)"
        >
          {isBn ? "প্রকল্প" : "projects"}
        </Link>

        <Link
          href="/blog"
          className="hover:text-text-primary transition-colors hidden sm:inline-block"
          title="Writing (Hotkey: B)"
        >
          {isBn ? "প্রবন্ধ" : "writing"}
        </Link>

        <Link
          href="/resume"
          className="hover:text-text-primary transition-colors flex items-center gap-0.5"
          title="Resume Dossier (Hotkey: R)"
        >
          <span>{isBn ? "সিভি" : "resume"}</span>
          <ArrowUpRight className="w-3 h-3 opacity-60" />
        </Link>

        <Link
          href="/learn"
          className="hover:text-text-primary transition-colors hidden sm:inline-block"
          title="Learning Roadmaps (Hotkey: Y)"
        >
          {isBn ? "শিখার পরিধি" : "learn"}
        </Link>

        {/* Theme switcher */}
        <button
          onClick={toggleTheme}
          className="hover:text-text-primary p-1 rounded transition-colors cursor-pointer"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode (Hotkey: T)`}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
          )}
        </button>

        {/* Language toggle */}
        <button
          onClick={() => setLanguage(language === "en" ? "bn" : "en")}
          className="hover:text-text-primary transition-colors px-1.5 py-0.5 rounded border border-border text-[11px]"
          title="Toggle Language (Hotkey: L)"
        >
          {language === "en" ? "বাংলা" : "EN"}
        </button>

      </div>
    </nav>
  );
}
