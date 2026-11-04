"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Paperclip,
  Target,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { RoadmapPhase, RoadmapStep } from "@/lib/roadmaps-data";
import type { SerializedLearnResource } from "@/lib/learn-resources";
import { ResourceList } from "@/components/learn/ResourceList";
import {
  ProgressMeter,
  StepStatusButton,
} from "@/components/learn/StepStatusControls";

function localizedPhaseTitle(phase: RoadmapPhase, bengali: boolean): string {
  return bengali && phase.titleBn ? phase.titleBn : phase.title;
}

function localizedPhaseDescription(phase: RoadmapPhase, bengali: boolean): string {
  return bengali && phase.descriptionBn ? phase.descriptionBn : phase.description;
}

function localizedStepTitle(step: RoadmapStep, bengali: boolean): string {
  return bengali && step.titleBn ? step.titleBn : step.title;
}

function localizedStepDescription(step: RoadmapStep, bengali: boolean): string {
  return bengali && step.descriptionBn ? step.descriptionBn : step.description;
}

export function PhaseView({
  slug,
  roadmapTitle,
  roadmapSlugLabel,
  phase,
  stepMaterialCounts,
  phaseResources,
  roadmapMaterials,
  noteHtmlById,
}: {
  slug: string;
  roadmapTitle: { en: string; bn: string };
  roadmapSlugLabel: string;
  phase: RoadmapPhase;
  stepMaterialCounts: Record<string, number>;
  phaseResources: SerializedLearnResource[];
  roadmapMaterials: SerializedLearnResource[];
  noteHtmlById?: Record<string, string>;
}) {
  const { isBn } = useLanguage();
  const phaseName = localizedPhaseTitle(phase, isBn);
  const outcomes = (isBn && phase.outcomesBn?.length ? phase.outcomesBn : phase.outcomes) || [];

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-xs text-text-muted">
          <Link href="/learn" className="transition-colors hover:text-accent">
            {isBn ? "লার্ন" : "learn"}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/learn/${slug}`} className="transition-colors hover:text-accent">
            {isBn && roadmapTitle.bn ? roadmapTitle.bn : roadmapTitle.en}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-primary">{phaseName}</span>
        </nav>

        <header className="space-y-4 rounded-2xl border border-border bg-bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/15 text-accent">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  // {roadmapSlugLabel}
                </p>
                <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{phaseName}</h1>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="rounded border border-border bg-bg px-2.5 py-1 font-mono text-xs text-text-muted">
                {phase.duration}
              </span>
              <div className="rounded-lg border border-border bg-bg px-3 py-1.5">
                <ProgressMeter
                  roadmapSlug={slug}
                  roadmapTitle={roadmapTitle.en}
                  steps={phase.steps}
                />
              </div>
            </div>
          </div>

          <p className="max-w-3xl font-serif text-sm leading-relaxed text-text-secondary">
            {localizedPhaseDescription(phase, isBn)}
          </p>

          {outcomes.length > 0 && (
            <div className="space-y-2 rounded-xl border border-border/70 bg-bg p-4">
              <h2 className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                <Target className="h-3.5 w-3.5 text-accent" />
                <span>{isBn ? "এই পর্ব শেষে" : "By the end of this phase"}</span>
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        <div className="grid gap-8 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-8">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                {isBn ? "পর্বের ধাপসমূহ" : "Phase Steps"}
              </h2>
              <span className="font-mono text-xs text-text-muted">
                {phase.steps.length} {isBn ? "ধাপ" : "steps"}
              </span>
            </div>

            <div className="space-y-2.5">
              {phase.steps.map((step, index) => {
                const count = stepMaterialCounts[step.slug] ?? 0;
                return (
                  <Link
                    key={step.slug}
                    href={`/learn/${slug}/${phase.slug}/${step.slug}`}
                    className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-bg-surface p-4 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <StepStatusButton
                        roadmapSlug={slug}
                        roadmapTitle={roadmapTitle.en}
                        step={step}
                        className="mt-1"
                      />
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[10px] text-text-muted">
                        {index + 1}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent">
                          {localizedStepTitle(step, isBn)}
                        </h3>
                        <p className="line-clamp-2 text-xs text-text-secondary">
                          {localizedStepDescription(step, isBn)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-0.5 font-mono text-[10px] text-text-muted">
                          {step.estimatedMinutes && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3 opacity-60" />
                              {step.estimatedMinutes}m
                            </span>
                          )}
                          {count > 0 && (
                            <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-semibold text-accent">
                              {count} {isBn ? "মেটেরিয়াল" : "materials"}
                            </span>
                          )}
                          {step.commands && step.commands.length > 0 && (
                            <span className="rounded border border-border bg-bg px-1.5 py-0.5">
                              {step.commands.length} cmds
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-accent" />
                  </Link>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-xl border border-border bg-bg-surface p-5">
              <h2 className="mb-3 flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                <Paperclip className="h-3.5 w-3.5 text-accent" />
                <span>{isBn ? "পর্বের মেটেরিয়াল" : "Phase materials"}</span>
              </h2>
              <ResourceList
                resources={phaseResources}
                bengali={isBn}
                heading={isBn ? "এই পর্বের ফাইল ও নোট" : "Files & notes for this phase"}
                noteHtmlById={noteHtmlById}
              />
              {phaseResources.length === 0 && (
                <p className="font-mono text-xs italic text-text-muted">
                  {isBn
                    ? "এই পর্বে এখনো কোনো মেটেরিয়াল যোগ করা হয়নি।"
                    : "No phase-level material yet."}
                </p>
              )}
            </div>

            {roadmapMaterials.length > 0 && (
              <div className="rounded-xl border border-border bg-bg-surface p-5">
                <ResourceList
                  resources={roadmapMaterials}
                  bengali={isBn}
                  heading={isBn ? "রোডম্যাপ রেফারেন্স" : "Roadmap reference"}
                  noteHtmlById={noteHtmlById}
                />
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
