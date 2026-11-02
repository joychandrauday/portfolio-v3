"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import {
  ExternalLink,
  CheckCircle2,
  ArrowLeft,
  Home,
  ChevronRight,
  Terminal,
  Code,
} from "lucide-react";
import { getRoadmapBySlug, getStepBySlug } from "@/lib/roadmaps-data";

export default function StepDetail({
  params,
}: {
  params: { slug: string; phase: string; step: string };
}) {
  const { isBn } = useLanguage();
  const { slug, phase, step } = params;

  const roadmap = getRoadmapBySlug(slug);
  const stepContent = roadmap
    ? getStepBySlug(slug, phase, step)
    : undefined;

  if (!stepContent) {
    return (
      <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">
        <p className="text-text-secondary">Step not found</p>
      </div>
    );
  }

  const phaseTitle = roadmap.phases.find((p) => p.slug === phase)?.title || phase;

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
            {roadmap.title[isBn ? "bn" : "en"]}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/learn/${slug}/${phase}`} className="hover:text-accent transition-colors">
            {phaseTitle}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary">{stepContent.title[isBn ? "bn" : "en"] || stepContent.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
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
                      {roadmap.title[isBn ? "bn" : "en"]}
                    </Link>
                    <ChevronRight className="w-3 h-3 text-text-muted" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href={`/learn/${slug}/${phase}`} className="text-xs text-text-muted hover:text-accent transition-colors">
                      {phaseTitle}
                    </Link>
                    <ChevronRight className="w-3 h-3 text-text-muted" />
                  </div>
                  <div className="text-xs text-accent font-medium pl-2 border-l-2 border-accent">
                    {isBn ? "বর্তমান: " : "Current: "}{stepContent.title[isBn ? "bn" : "en"] || stepContent.title}
                  </div>
                </div>
              </div>

              <div className="bg-bg-surface border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-text-secondary">{phaseTitle}</div>
                      <div className="text-xs font-medium text-text-primary">0/{roadmap.phases.find((p) => p.slug === phase)?.steps.length || 0} steps</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href={`/learn/${slug}/${phase}`} className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors mb-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> {isBn ? "ফেজে ফিরুন" : "Back to Phase"}
                </Link>
                <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                  {stepContent.title[isBn ? "bn" : "en"] || stepContent.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span>{isBn ? "পর্ব: " : "Phase: "}{phaseTitle}</span>
                  <span>•</span>
                  <span>{stepContent.title[isBn ? "bn" : "en"] || stepContent.title}</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-bg-surface border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Learning Objective</h2>
              <p className="text-text-secondary leading-relaxed">
                {stepContent.description[isBn ? "bn" : "en"] || stepContent.description}
              </p>
            </div>

            {/* Commands */}
            {stepContent.commands && stepContent.commands.length > 0 && (
              <section className="bg-bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent" /> {isBn ? "প্রাসঙ্গিক কমান্ড" : "Related Commands"}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-text-muted">
                        <th className="pb-3">Command</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stepContent.commands.map((cmd, idx) => (
                        <tr key={idx} className="border-b border-border/50">
                          <td className="py-3">
                            <span className="font-mono text-text-secondary block whitespace-pre-wrap bg-bg/50 p-2 rounded border border-border/50 inline-block">
                              {cmd}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Resources Section */}
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-accent" /> {isBn ? "লার্নিং রিসোর্সেস" : "Learning Resources"}
              </h2>
              <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
                {stepContent.resources.length > 0 ? (
                  stepContent.resources.map((resource, idx) => {
                    const isObj = typeof resource === "object";
                    return (
                      <div key={idx} className="p-4 hover:bg-bg-surface/50 transition-colors border-b border-border last:border-b-0">
                        <a
                          href={isObj ? resource.url : resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent transition-colors"
                        >
                          <div className="w-6 h-6 rounded bg-bg flex items-center justify-center flex-shrink-0">
                            <ExternalLink className="w-3 h-3" />
                          </div>
                          <span className="break-all">
                            {isObj ? resource.label : resource}
                          </span>
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-text-muted text-sm">No resources available for this step.</div>
                )}
              </div>
            </section>

            {/* My Notes Section */}
            <section className="bg-bg-surface border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isBn ? "আমার শেখার নোট" : "My Learning Notes"}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed bg-bg/50 p-4 rounded border border-border/50">
                {stepContent.myNotes || stepContent.description[isBn ? "bn" : "en"] || stepContent.description}
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
