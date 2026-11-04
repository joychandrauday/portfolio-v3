"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { RoadmapPhase, RoadmapStep } from "@/lib/roadmaps-data";
import type { SerializedLearnResource } from "@/lib/learn-resources";
import { ResourceList } from "@/components/learn/ResourceList";
import {
  StudyLogButton,
  StepStatusToggle,
} from "@/components/learn/StepStatusControls";
import { useStepStatus } from "@/components/learn/useStepStatus";

export function StepView({
  slug,
  roadmapTitle,
  roadmapSlugLabel,
  phase,
  step,
  resources,
  noteHtmlById,
  previous,
  next,
}: {
  slug: string;
  roadmapTitle: { en: string; bn: string };
  roadmapSlugLabel: string;
  phase: RoadmapPhase;
  step: RoadmapStep;
  resources: SerializedLearnResource[];
  noteHtmlById?: Record<string, string>;
  previous: { href: string; label: string } | null;
  next: { href: string; label: string } | null;
}) {
  const { isBn } = useLanguage();
  const { statusOf, updateStatus } = useStepStatus(slug, roadmapTitle.en);
  const [copied, setCopied] = React.useState<string | null>(null);
  const status = statusOf(step);

  const title = isBn && step.titleBn ? step.titleBn : step.title;
  const description =
    isBn && step.descriptionBn ? step.descriptionBn : step.description;
  const phaseName = isBn && phase.titleBn ? phase.titleBn : phase.title;

  const copyCommand = (command: string) => {
    void navigator.clipboard.writeText(command);
    setCopied(command);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-xs text-text-muted">
          <Link href="/learn" className="transition-colors hover:text-accent">
            {isBn ? "লার্ন" : "learn"}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/learn/${slug}`} className="transition-colors hover:text-accent">
            {isBn && roadmapTitle.bn ? roadmapTitle.bn : roadmapTitle.en}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={`/learn/${slug}/${phase.slug}`}
            className="transition-colors hover:text-accent"
          >
            {phaseName}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-primary">{title}</span>
        </nav>

        <header className="space-y-4 rounded-2xl border border-border bg-bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                // {roadmapSlugLabel} · {phaseName}
              </p>
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-muted">
                {step.estimatedMinutes && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3 opacity-60" />
                    {step.estimatedMinutes}m
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3 opacity-60" />
                  {resources.length} {isBn ? "মেটেরিয়াল" : "materials"}
                </span>
                <span
                  className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    status === "done"
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                      : status === "doing"
                        ? "border-accent/40 bg-accent/15 text-accent"
                        : "border-border bg-bg text-text-muted"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>

            <StepStatusToggle roadmapSlug={slug} roadmapTitle={roadmapTitle.en} step={step} />
          </div>

          <p className="max-w-3xl font-serif text-sm leading-relaxed text-text-secondary">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => void updateStatus(step, status === "done" ? "todo" : "done")}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold transition-colors ${
                status === "done"
                  ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                  : "bg-accent text-black hover:bg-accent/90"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {status === "done"
                ? isBn
                  ? "সম্পন্ন হয়েছে"
                  : "Completed"
                : isBn
                  ? "সম্পন্ন হিসেবে চিহ্নিত করুন"
                  : "Mark as completed"}
            </button>

            <Link
              href={`/learn/${slug}/${phase.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-mono text-xs text-text-primary transition-colors hover:bg-bg-surface"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-text-muted" />
              {isBn ? "পর্বে ফিরুন" : "Back to phase"}
            </Link>
          </div>
        </header>

        {step.commands && step.commands.length > 0 && (
          <section className="space-y-3 rounded-2xl border border-border bg-bg-surface p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
              <Terminal className="h-4 w-4 text-accent" />
              {isBn ? "প্রাসঙ্গিক কমান্ড" : "Related commands"}
            </h2>
            <div className="space-y-1.5">
              {step.commands.map((command, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-bg p-3"
                >
                  <code className="select-all whitespace-pre-wrap break-all font-mono text-xs text-accent">
                    {command}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyCommand(command)}
                    title="Copy command"
                    className="shrink-0 cursor-pointer rounded p-1 text-text-muted transition-colors hover:text-text-primary"
                  >
                    {copied === command ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <ResourceList
          resources={resources}
          bengali={isBn}
          heading={isBn ? "ধাপের মেটেরিয়াল ও রিসোর্স" : "Step materials & resources"}
          materialBase={`/learn/${slug}/${phase.slug}/${step.slug}`}
          noteHtmlById={noteHtmlById}
        />

        {!resources.length && step.resources.length > 0 && (
          <section className="space-y-3 rounded-2xl border border-border bg-bg-surface p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
              <BookOpen className="h-4 w-4 text-accent" />
              {isBn ? "সংকলিত রিসোর্স" : "Curated resources"}
            </h2>
            <div className="grid gap-2">
              {step.resources.map((resource, index) => {
                const isObject = typeof resource === "object" && resource !== null;
                const label = isObject ? resource.label : resource;
                const url = isObject ? resource.url : resource;
                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-bg p-3 text-xs transition-colors hover:border-accent hover:bg-accent/[0.03]"
                  >
                    <span className="truncate font-medium text-text-primary group-hover:text-accent">
                      {label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-text-muted group-hover:text-accent" />
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {step.myNotes && (
          <section className="space-y-2 rounded-2xl border border-accent/20 bg-bg-surface p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-4 w-4" />
              {isBn ? "আমার শেখার নোট" : "My learning notes"}
            </h2>
            <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-text-secondary">
              {step.myNotes}
            </p>
          </section>
        )}

        <StudyLogButton roadmapSlug={slug} roadmapTitle={roadmapTitle.en} step={step} />

        <nav className="flex items-center justify-between border-t border-border pt-6 font-mono text-xs">
          {previous ? (
            <Link
              href={previous.href}
              className="flex items-center gap-1.5 text-text-muted transition-colors hover:text-text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="max-w-[220px] truncate">{previous.label}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={next.href}
              className="flex items-center gap-1.5 font-semibold text-accent transition-colors hover:underline"
            >
              <span className="max-w-[220px] truncate">{next.label}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </div>
  );
}
