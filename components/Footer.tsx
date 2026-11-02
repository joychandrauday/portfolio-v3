"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-6 border-t border-border/60 text-xs font-mono text-text-muted bg-bg-surface">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>© {new Date().getFullYear()} Joy Chandra Uday</div>
        <div className="flex items-center gap-4">
          <Link
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-primary flex items-center gap-0.5"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </Link>
          <a
            href={siteConfig.g2gAuthor}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:text-accent-hover flex items-center gap-0.5"
            title="Joy Chandra Uday — G2G Digital Author Profile & Articles"
          >
            <span>G2G Digital Author</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
          <Link
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-primary flex items-center gap-0.5"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </Link>
          <Link
            href={siteConfig.x}
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-primary flex items-center gap-0.5"
          >
            <span>Twitter/X</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
