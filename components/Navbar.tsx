"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import { ArrowUpRight, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { language, setLanguage, isBn } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Keyboard shortcut listener (L for lang, T for theme, P for projects, B for blog, O for ops, R for resume)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        setLanguage(language === "en" ? "bn" : "en");
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        router.push("/projects");
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        router.push("/blog");
      } else if (e.key === "y" || e.key === "Y") {
        e.preventDefault();
        router.push("/learn");
      } else if (e.key === "o" || e.key === "O") {
        e.preventDefault();
        router.push("/ops");
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        router.push("/resume");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [language, setLanguage, toggleTheme, router]);

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border transition-colors pt-[env(safe-area-inset-top)]">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between text-xs font-mono">
        {/* Brand identity */}
        <Link
          href="/"
          className="text-text-primary hover:text-accent font-semibold transition-colors flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>joychandrauday</span>
        </Link>

        {/* Clean nav items */}
        <nav className="flex items-center gap-4 text-text-muted">
          <Link
            href="/projects"
            className="hover:text-text-primary transition-colors hidden sm:inline-block"
            title="Projects (P)"
          >
            {isBn ? "প্রকল্প" : "projects"}
          </Link>

          <Link
            href="/blog"
            className="hover:text-text-primary transition-colors hidden sm:inline-block"
            title="Writing (B)"
          >
            {isBn ? "প্রবন্ধ" : "writing"}
          </Link>

          <Link
            href="/resume"
            className="hover:text-text-primary transition-colors flex items-center gap-0.5"
            title="Resume (R)"
          >
            <span>{isBn ? "সিভি" : "resume"}</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </Link>

          <Link
            href="/learn"
            className="hover:text-text-primary transition-colors hidden sm:inline-block"
            title="Learn"
          >
            {isBn ? "শিখার পরিধি" : "learn"}
          </Link>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="hover:text-text-primary p-1 rounded transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode (T)`}
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
            title="Toggle Language (L)"
          >
            {language === "en" ? "বাংলা" : "EN"}
          </button>


          <Link
            href="/ops"
            className="text-text-muted hover:text-accent font-medium text-[11px]"
            title="Command Center (O)"
          >
            /ops
          </Link>
        </nav>
      </div>
    </header>
  );
}
