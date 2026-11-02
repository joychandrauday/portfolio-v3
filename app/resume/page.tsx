"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { ArrowLeft, Printer, ArrowUpRight } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary py-12 px-4 sm:px-6 selection:bg-accent/15 selection:text-text-primary">
      {/* Top Navigation Bar */}
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between text-xs font-mono text-text-muted pb-4 border-b border-border/60 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>return</span>
        </Link>

        <button
          onClick={() => {
            if (typeof window !== "undefined") window.print();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-text-primary text-bg font-medium text-xs hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Main Resume Sheet */}
      <main className="max-w-2xl mx-auto space-y-10 print:p-0">
        {/* Header */}
        <header className="space-y-3 pb-6 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                {siteConfig.name}
              </h1>
              <p className="text-sm font-mono text-text-secondary mt-0.5">
                {siteConfig.role}
              </p>
            </div>

            <div className="font-mono text-xs text-text-muted sm:text-right space-y-0.5">
              <div>{siteConfig.location}</div>
              <div>
                <a href={`mailto:${siteConfig.email}`} className="text-text-primary hover:underline">
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex sm:justify-end gap-2 pt-0.5">
                <a href={siteConfig.github} target="_blank" rel="noreferrer" className="hover:underline">
                  GitHub
                </a>
                <span>•</span>
                <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed pt-2">
            Software Engineer at garirhat.com, previously engineer at G2G Digital, and founder of OwlPrep. Architecting scalable platform systems, immutable ledgers, and resilient digital products. Focused on fundamental systems engineering, durable state machines, and high-concurrency architectures.
          </p>
        </header>

        {/* Experience Section */}
        <section className="space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-wider text-text-primary font-semibold">
            Experience
          </h2>

          {/* 1. Garirhat */}
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm">
              <h3 className="font-semibold text-text-primary">
                Garirhat (<a href="https://garirhat.com" target="_blank" rel="noreferrer" className="hover:underline">garirhat.com</a>) — Software Engineer
              </h3>
              <span className="font-mono text-xs text-text-muted">
                2024 — Present · Dhaka, BD
              </span>
            </div>
            <ul className="list-disc list-inside text-xs sm:text-sm text-text-secondary space-y-1 leading-relaxed">
              <li>Engineering automotive platform architectures, multi-tenant inventory systems, and high-performance vehicle search indexing.</li>
              <li>Designing scalable service boundaries, optimized database schema indices, and automated telemetry logging.</li>
              <li>Collaborating on continuous delivery pipelines and sub-100ms response time guarantees across critical user journeys.</li>
            </ul>
          </div>

          {/* 2. G2G Digital */}
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm">
              <h3 className="font-semibold text-text-primary">
                G2G Digital (<a href="https://g2gdigital.com" target="_blank" rel="noreferrer" className="hover:underline">g2gdigital.com</a>) — Full-Stack Engineer
              </h3>
              <span className="font-mono text-xs text-text-muted">
                2023 — 2024 · Remote
              </span>
            </div>
            <ul className="list-disc list-inside text-xs sm:text-sm text-text-secondary space-y-1 leading-relaxed">
              <li>Architected the G2G Knowledge Graph editorial system for concept clustering and mental model planning.</li>
              <li>Implemented interactive graph visualization models with structured layout algorithms.</li>
              <li>Engineered the 10-point quality validation engine, rich text editing systems, and keyboard-first command workflows.</li>
            </ul>
          </div>

          {/* 3. OwlPrep */}
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm">
              <h3 className="font-semibold text-text-primary">
                OwlPrep (<a href="https://growwithowl.com" target="_blank" rel="noreferrer" className="hover:underline">growwithowl.com</a>) — Founder &amp; Lead Engineer
              </h3>
              <span className="font-mono text-xs text-text-muted">
                2023 — Present · Remote
              </span>
            </div>
            <ul className="list-disc list-inside text-xs sm:text-sm text-text-secondary space-y-1 leading-relaxed">
              <li>Architected and shipped OwlPrep, an adaptive learning platform with cognitive spaced repetition and structured training micro-capsules.</li>
              <li>Engineered interactive question bank engines, automated flashcard generation, and AI mentor guidance.</li>
              <li>Built authenticated session management, resilient state persistence, and responsive student dashboards.</li>
            </ul>
          </div>

          {/* 4. Open Source & Systems */}
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm">
              <h3 className="font-semibold text-text-primary">
                Open Source &amp; Systems — Independent Systems Builder
              </h3>
              <span className="font-mono text-xs text-text-muted">
                2023 — Present · Independent
              </span>
            </div>
            <ul className="list-disc list-inside text-xs sm:text-sm text-text-secondary space-y-1 leading-relaxed">
              <li>Authored <strong>StockFlow</strong>: Immutable append-only inventory ledger with concurrency verification under parallel worker traffic.</li>
              <li>Authored <strong>FlowBridge</strong>: Resilient workflow engine with restart-surviving delay steps and idempotent deduplication.</li>
              <li>Authored <strong>DocuPilot</strong>: AI extraction engine with prompt-injection defense and field-level F1 accuracy evaluation harness.</li>
            </ul>
          </div>
        </section>

        {/* Core Capabilities & Focus */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-text-primary font-semibold">
            Core Engineering Focus
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-text-secondary">
            <div>
              <span className="text-text-muted block text-[10px] uppercase">Platform Systems</span>
              <span className="text-text-primary font-medium">Distributed Microservices, Multi-Tenant Architecture, Search Indexing</span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase">Data &amp; State</span>
              <span className="text-text-primary font-medium">Append-Only Ledgers, Concurrency Control, Durable State Machines</span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase">API &amp; Integration</span>
              <span className="text-text-primary font-medium">Idempotent Execution, Webhook Resilience, Schema Validation</span>
            </div>
            <div>
              <span className="text-text-muted block text-[10px] uppercase">Infrastructure</span>
              <span className="text-text-primary font-medium">Containerization, Continuous Delivery, Linux Telemetry &amp; CI/CD</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-border/60 flex items-center justify-between text-xs font-mono text-text-muted">
          <span>JOY CHANDRA UDAY</span>
          <a href="https://joychandrauday.vercel.app" className="hover:underline">
            joychandrauday.vercel.app
          </a>
        </footer>
      </main>
    </div>
  );
}
