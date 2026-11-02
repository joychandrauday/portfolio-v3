"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import { ArrowUp, Terminal, ArrowUpRight } from "lucide-react";

export default function RetroColophon() {
  const { isBn } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full pt-12 pb-16 border-t-2 border-double border-border font-mono text-xs text-text-muted space-y-8 select-none">
      
      {/* Top Colophon Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border/50">
        
        {/* Monograph & Rights */}
        <div className="space-y-2 max-w-sm">
          <div className="font-serif text-lg font-bold text-text-primary tracking-wide">
            JOY CHANDRA UDAY
          </div>
          <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
            Software Engineer at{" "}
            <a
              href="https://garirhat.com"
              target="_blank"
              rel="noreferrer"
              className="text-text-primary underline underline-offset-2 hover:text-accent font-medium"
            >
              garirhat.com
            </a>
            , previously engineer at{" "}
            <a
              href="https://g2gdigital.com"
              target="_blank"
              rel="noreferrer"
              className="text-text-primary underline underline-offset-2 hover:text-accent font-medium"
            >
              G2G Digital
            </a>
            , and founder of{" "}
            <a
              href="https://growwithowl.com"
              target="_blank"
              rel="noreferrer"
              className="text-text-primary underline underline-offset-2 hover:text-accent font-medium"
            >
              OwlPrep
            </a>
            . Focused on scalable platforms and resilient distributed architectures.
          </p>
          <div className="text-[10px] text-text-muted pt-1">
            © {new Date().getFullYear()} JOY CHANDRA UDAY · ALL RIGHTS RESERVED
          </div>
        </div>

        {/* Quick Archival Links */}
        <div className="space-y-2 text-[11px]">
          <div className="uppercase tracking-widest text-text-primary font-semibold text-[10px]">
            ARCHIVAL SECTIONS
          </div>
          <div className="flex flex-col space-y-1.5">
            <Link href="/projects" className="hover:text-text-primary transition-colors flex items-center gap-1">
              <span>All Projects &amp; Invariants</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
            <Link href="/blog" className="hover:text-text-primary transition-colors flex items-center gap-1">
              <span>Engineering Writing &amp; Dispatches</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
            <Link href="/resume" className="hover:text-text-primary transition-colors flex items-center gap-1">
              <span>Curriculum Vitae</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Location & Time Indicator */}
        <div className="space-y-2 text-[11px] max-w-xs">
          <div className="uppercase tracking-widest text-text-primary font-semibold text-[10px]">
            DISPATCH ORIGIN
          </div>
          <div className="text-[11px] text-text-secondary font-sans leading-relaxed">
            Dhaka, Bangladesh · Independent Systems &amp; Software Engineering Dossier
          </div>
        </div>

        {/* Return to Top */}
        <div className="self-start">
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded border border-border bg-bg-surface hover:bg-bg hover:border-text-primary text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
            aria-label="Return to top of page"
            title="Return to Masthead"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>TOP</span>
          </button>
        </div>

      </div>

      {/* Bottom Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] tracking-wider text-text-muted">
        <div>DESIGNED WITH TIMELESS RESTRAINT</div>
        <div>ALL RIGHTS RESERVED</div>
      </div>

    </footer>
  );
}
