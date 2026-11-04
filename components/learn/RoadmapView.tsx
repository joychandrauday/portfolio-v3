"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Roadmap, RoadmapPhase, RoadmapStep } from "@/lib/roadmaps-data";
import {
  resourceKey,
  type RoadmapResourceBuckets,
  type SerializedLearnResource,
} from "@/lib/learn-resources";
import { ResourceLinks } from "@/components/learn/ResourceLinks";
import {
  AuthBadge,
  ProgressMeter,
  StepStatusButton,
  StepStatusToggle,
  StudyLogButton,
} from "@/components/learn/StepStatusControls";

function phaseTitle(phase: RoadmapPhase, bengali: boolean): string {
  return bengali && phase.titleBn ? phase.titleBn : phase.title;
}

function stepTitle(step: RoadmapStep, bengali: boolean): string {
  return bengali && step.titleBn ? step.titleBn : step.title;
}

function stepDescription(step: RoadmapStep, bengali: boolean): string {
  return bengali && step.descriptionBn ? step.descriptionBn : step.description;
}

function resourceCount(buckets: RoadmapResourceBuckets, phase: string, step: string): number {
  return buckets.byStep[resourceKey(phase, step)]?.length ?? 0;
}

export function RoadmapView({
  roadmap,
  resources,
  slug,
}: {
  roadmap: Roadmap;
  resources: RoadmapResourceBuckets;
  slug: string;
}) {
  const { isBn } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStep, setSelectedStep] = useState<{
    phase: RoadmapPhase;
    step: RoadmapStep;
  } | null>(() => {
    const firstPhase = roadmap.phases[0];
    const firstStep = firstPhase?.steps[0];
    return firstPhase && firstStep ? { phase: firstPhase, step: firstStep } : null;
  });
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const allSteps = useMemo(
    () =>
      roadmap.phases.flatMap((phase) =>
        phase.steps.map((step) => ({
          phase,
          step,
          estimate: step.estimatedMinutes ?? 30,
        })),
      ),
    [roadmap],
  );

  const matchesSearch = (step: RoadmapStep) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      step.title.toLowerCase().includes(query) ||
      step.description.toLowerCase().includes(query) ||
      (step.titleBn || "").toLowerCase().includes(query)
    );
  };

  const selectedIndex = selectedStep
    ? allSteps.findIndex((item) => item.step.slug === selectedStep.step.slug)
    : -1;

  const copyCommand = (command: string) => {
    void navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    window.setTimeout(() => setCopiedCommand(null), 2000);
  };

  const selectedResources: SerializedLearnResource[] = selectedStep
    ? resources.byStep[resourceKey(selectedStep.phase.slug, selectedStep.step.slug)] ?? []
    : [];

  return (
    <div className="min-h-screen bg-bg font-sans text-text-primary selection:bg-accent/15 selection:text-text-primary">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/95 px-4 py-3.5 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
            <Link href="/" className="transition-colors hover:text-text-primary">
              HOME
            </Link>
            <span>/</span>
            <Link href="/learn" className="flex items-center gap-1 transition-colors hover:text-accent">
              <BookOpen className="h-3.5 w-3.5" />
              <span>ROADMAPS</span>
            </Link>
            <span>/</span>
            <span className="max-w-[200px] truncate font-semibold text-text-primary">
              {isBn && roadmap.title.bn ? roadmap.title.bn : roadmap.title.en}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <AuthBadge roadmapSlug={slug} roadmapTitle={roadmap.title.en} />
            <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-3 py-1">
              <ProgressMeter
                roadmapSlug={slug}
                roadmapTitle={roadmap.title.en}
                steps={allSteps.map(({ step }) => step)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-surface p-6 sm:p-8">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-accent">
                // {roadmap.difficulty.toUpperCase()} ROADMAP
              </span>
              <span className="rounded border border-border bg-bg px-2.5 py-1 font-mono text-xs text-text-muted">
                Est. {roadmap.estimatedHours} Hours
              </span>
              <span className="rounded border border-border bg-bg px-2.5 py-1 font-mono text-xs text-text-muted">
                {roadmap.phases.length} Phases · {allSteps.length} Steps
              </span>
              <span className="rounded border border-border bg-bg px-2.5 py-1 font-mono text-xs text-text-muted">
                {Object.values(resources.byStep).reduce((n, list) => n + list.length, 0) +
                  Object.values(resources.byPhase).reduce((n, list) => n + list.length, 0) +
                  resources.roadmap.length}{" "}
                materials
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {isBn && roadmap.title.bn ? roadmap.title.bn : roadmap.title.en}
            </h1>

            <p className="font-serif text-sm leading-relaxed text-text-secondary sm:text-base">
              {isBn && roadmap.description.bn ? roadmap.description.bn : roadmap.description.en}
            </p>

            {roadmap.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {roadmap.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-border/80 bg-bg px-2 py-0.5 font-mono text-[11px] text-text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={isBn ? "ধাপ বা টপিক খুঁজুন..." : "Filter modules & steps..."}
                className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-4 font-mono text-xs text-text-primary placeholder:text-text-muted/60 transition-colors focus:border-accent focus:outline-none"
              />
            </div>
            <p className="self-start font-mono text-xs text-text-muted sm:self-auto">
              Tip: Click a step to inspect its resources, or open the full step page.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            {roadmap.phases.map((phase, phaseIndex) => {
              const visibleSteps = phase.steps.filter(matchesSearch);
              if (searchQuery && visibleSteps.length === 0) return null;

              return (
                <div
                  key={phase.slug}
                  className="relative space-y-4 rounded-xl border border-border bg-bg-surface/50 p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 font-mono text-xs font-bold text-accent">
                        {phaseIndex + 1}
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-text-primary sm:text-lg">
                          {phaseTitle(phase, isBn)}
                        </h2>
                        <p className="font-mono text-xs text-text-muted">{phase.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/learn/${slug}/${phase.slug}`}
                        className="rounded border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        {isBn ? "পর্ব দেখুন" : "Open phase"}
                      </Link>
                      <span className="rounded border border-border bg-bg px-2 py-0.5 font-mono text-xs text-text-muted">
                        {phase.steps.length} {isBn ? "টি ধাপ" : "steps"}
                      </span>
                    </div>
                  </div>

                  {phase.description && (
                    <p className="font-serif text-xs leading-relaxed text-text-secondary">
                      {isBn && phase.descriptionBn ? phase.descriptionBn : phase.description}
                    </p>
                  )}

                  <div className="space-y-2 pt-1">
                    {visibleSteps.map((step) => {
                      const isSelected = selectedStep?.step.slug === step.slug;
                      const count = resourceCount(resources, phase.slug, step.slug);

                      return (
                        <div
                          key={step.slug}
                          onClick={() => setSelectedStep({ phase, step })}
                          className={`group flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3.5 transition-all ${
                            isSelected
                              ? "border-accent bg-accent/10 shadow-sm"
                              : "border-border/80 bg-bg hover:border-text-primary/40 hover:bg-bg-surface"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <StepStatusButton
                              roadmapSlug={slug}
                              roadmapTitle={roadmap.title.en}
                              step={step}
                            />
                            <div className="min-w-0">
                              <h3
                                className={`truncate text-xs font-semibold sm:text-sm ${
                                  isSelected
                                    ? "text-accent"
                                    : "text-text-primary group-hover:text-accent"
                                }`}
                              >
                                {stepTitle(step, isBn)}
                              </h3>
                              {step.description && (
                                <p className="max-w-md truncate text-[11px] text-text-muted">
                                  {stepDescription(step, isBn)}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-text-muted">
                            {step.estimatedMinutes && (
                              <span className="hidden items-center gap-1 sm:inline-flex">
                                <Clock className="h-3 w-3 opacity-60" />
                                <span>{step.estimatedMinutes}m</span>
                              </span>
                            )}
                            {count > 0 && (
                              <span className="rounded border border-border bg-bg-surface px-2 py-0.5 text-[10px] font-semibold text-accent">
                                {count} res
                              </span>
                            )}
                            <Link
                              href={`/learn/${slug}/${phase.slug}/${step.slug}`}
                              onClick={(event) => event.stopPropagation()}
                              title={isBn ? "ধাপের পেজ খুলুন" : "Open step page"}
                              className="rounded p-1 transition-colors hover:bg-bg-elevated hover:text-accent"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                            <ChevronRight
                              className={`h-3.5 w-3.5 transition-transform ${
                                isSelected ? "translate-x-0.5 text-accent" : "text-text-muted/50"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-20 lg:col-span-5">
            {selectedStep ? (
              <div className="space-y-6 rounded-xl border border-border bg-bg-surface p-5 shadow-xl shadow-black/20 sm:p-6">
                <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                  <div className="min-w-0 space-y-1">
                    <span className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
                      // {phaseTitle(selectedStep.phase, isBn)}
                    </span>
                    <h3 className="text-lg font-bold leading-tight text-text-primary sm:text-xl">
                      {stepTitle(selectedStep.step, isBn)}
                    </h3>
                  </div>
                  <StepStatusToggle
                    roadmapSlug={slug}
                    roadmapTitle={roadmap.title.en}
                    step={selectedStep.step}
                  />
                </div>

                {selectedStep.step.description && (
                  <div className="space-y-1">
                    <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                      [ Concept Overview ]
                    </h4>
                    <p className="font-serif text-xs leading-relaxed text-text-secondary sm:text-sm">
                      {stepDescription(selectedStep.step, isBn)}
                    </p>
                  </div>
                )}

                {selectedStep.step.commands && selectedStep.step.commands.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                      <Terminal className="h-3.5 w-3.5 text-accent" />
                      <span>Command Snippets &amp; Cheats</span>
                    </h4>
                    <div className="space-y-1.5">
                      {selectedStep.step.commands.map((command, index) => (
                        <div
                          key={index}
                          className="group relative flex items-center justify-between rounded-lg border border-border/80 bg-bg p-2.5 font-mono text-xs text-accent"
                        >
                          <span className="truncate pr-8 select-all">{command}</span>
                          <button
                            type="button"
                            onClick={() => copyCommand(command)}
                            className="cursor-pointer p-1 text-text-muted transition-colors hover:text-text-primary"
                            title="Copy command"
                          >
                            {copiedCommand === command ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedStep.step.myNotes && (
                  <div className="space-y-1 rounded-lg border border-accent/20 bg-bg p-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-accent">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Architecture Notes &amp; Insight</span>
                    </div>
                    <p className="font-mono text-xs leading-relaxed text-text-secondary">
                      {selectedStep.step.myNotes}
                    </p>
                  </div>
                )}

                <div className="space-y-2 border-t border-border pt-2">
                  <h4 className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-muted">
                    <BookOpen className="h-3.5 w-3.5 text-accent" />
                    <span>Materials &amp; Curated Resources</span>
                  </h4>
                  <ResourceLinks
                    resources={selectedResources}
                    bengali={isBn}
                    emptyLabel={
                      isBn
                        ? "এই ধাপের জন্য এখনো কোনো মেটেরিয়াল যোগ করা হয়নি।"
                        : "No uploaded material for this step yet."
                    }
                  />
                  {selectedStep.step.resources && selectedStep.step.resources.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {selectedStep.step.resources.map((resource, index) => {
                        const isObject = typeof resource === "object" && resource !== null;
                        const label = isObject ? resource.label : resource;
                        const url = isObject ? resource.url : resource;
                        return (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="group flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-bg p-2.5 text-xs transition-colors hover:border-accent hover:bg-accent/[0.03]"
                          >
                            <span className="truncate font-medium text-text-primary group-hover:text-accent">
                              {label}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-text-muted group-hover:text-accent" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                <StudyLogButton
                  roadmapSlug={slug}
                  roadmapTitle={roadmap.title.en}
                  step={selectedStep.step}
                />

                <Link
                  href={`/learn/${slug}/${selectedStep.phase.slug}/${selectedStep.step.slug}`}
                  className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 font-mono text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  <span>{isBn ? "পূর্ণ ধাপের পেজ" : "Open full step page"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-xs">
                  {selectedIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedStep({
                          phase: allSteps[selectedIndex - 1].phase,
                          step: allSteps[selectedIndex - 1].step,
                        })
                      }
                      className="flex cursor-pointer items-center gap-1 text-text-muted transition-colors hover:text-text-primary"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Prev Step</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  {selectedIndex < allSteps.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedStep({
                          phase: allSteps[selectedIndex + 1].phase,
                          step: allSteps[selectedIndex + 1].step,
                        })
                      }
                      className="flex cursor-pointer items-center gap-1 font-semibold text-accent transition-all hover:underline"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2 rounded-xl border border-dashed border-border p-8 text-center font-mono text-xs text-text-muted">
                <BookOpen className="mx-auto h-6 w-6 text-accent/60" />
                <p>Select any step to inspect its materials and notes.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
