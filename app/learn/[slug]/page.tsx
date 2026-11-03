"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import {
  getRoadmapBySlug,
  Roadmap,
  RoadmapPhase,
  RoadmapStep,
} from "@/lib/roadmaps-data";
import {
  Home,
  ChevronRight,
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  ExternalLink,
  Terminal,
  Copy,
  Check,
  Search,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  ShieldCheck,
  Flame,
  Bookmark,
  Layers,
} from "lucide-react";

export default function RoadmapDetailPage({ params }: { params: { slug: string } }) {
  const { isBn } = useLanguage();
  const slug = params.slug;
  const roadmap = useMemo(() => getRoadmapBySlug(slug), [slug]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStep, setSelectedStep] = useState<{
    phase: RoadmapPhase;
    step: RoadmapStep;
  } | null>(null);

  // Authentication & Tracking State
  const [isAuthed, setIsAuthed] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, "todo" | "doing" | "done">>({});
  const [savingStatus, setSavingStatus] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [loggingMinutes, setLoggingMinutes] = useState(false);

  // Check auth & load initial tracked steps
  useEffect(() => {
    async function initTracking() {
      try {
        const res = await fetch("/api/ops/learn");
        const data = await res.json();
        if (data.authenticated && Array.isArray(data.tracks)) {
          setIsAuthed(true);
          const map: Record<string, "todo" | "doing" | "done"> = {};
          data.tracks.forEach((t: any) => {
            if (Array.isArray(t.modules)) {
              t.modules.forEach((m: any) => {
                // Match by notes containing step slug or module title
                const notesMatch = m.notes?.match(/Step:\s*([a-zA-Z0-9_-]+)/);
                const stepKey = notesMatch ? notesMatch[1] : m.title.toLowerCase();
                map[stepKey] = m.status;
                map[m.title.toLowerCase()] = m.status;
              });
            }
          });
          setStatusMap(map);
        } else {
          // Public visitor fallback from localStorage
          const local = localStorage.getItem(`learn_track_${slug}`);
          if (local) {
            try {
              setStatusMap(JSON.parse(local));
            } catch {}
          }
        }
      } catch {
        const local = localStorage.getItem(`learn_track_${slug}`);
        if (local) {
          try {
            setStatusMap(JSON.parse(local));
          } catch {}
        }
      }
    }
    initTracking();
  }, [slug]);

  // Set default selected step on first load
  useEffect(() => {
    if (roadmap && roadmap.phases.length > 0 && roadmap.phases[0].steps.length > 0) {
      setSelectedStep({
        phase: roadmap.phases[0],
        step: roadmap.phases[0].steps[0],
      });
    }
  }, [roadmap]);

  // Handle Step Status Update (DB synced if ops authed, localStorage otherwise)
  const handleUpdateStepStatus = async (
    step: RoadmapStep,
    phase: RoadmapPhase,
    newStatus: "todo" | "doing" | "done"
  ) => {
    const stepKey = step.slug;
    setSavingStatus(stepKey);

    const nextMap = { ...statusMap, [stepKey]: newStatus, [step.title.toLowerCase()]: newStatus };
    setStatusMap(nextMap);

    if (isAuthed) {
      try {
        await fetch("/api/ops/learn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sync_roadmap_step",
            roadmapSlug: slug,
            roadmapTitle: roadmap?.title.en || slug,
            stepSlug: step.slug,
            stepTitle: step.title,
            status: newStatus,
            estimateMinutes: step.estimatedMinutes || 30,
            resourceUrl: Array.isArray(step.resources) && step.resources.length > 0
              ? typeof step.resources[0] === "string"
                ? step.resources[0]
                : step.resources[0].url
              : null,
          }),
        });
      } catch (err) {
        console.error("Failed to sync step to ops database", err);
      }
    } else {
      localStorage.setItem(`learn_track_${slug}`, JSON.stringify(nextMap));
    }

    setSavingStatus(null);
  };

  // Quick 30m session logging for Ops user
  const handleLogQuickSession = async (step: RoadmapStep) => {
    if (!isAuthed) return;
    setLoggingMinutes(true);
    try {
      await fetch("/api/ops/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "log_session",
          minutes: 30,
          note: `Completed session on ${step.title}`,
        }),
      });
      alert(`Logged 30m study time for "${step.title}"`);
    } catch {
      alert("Failed to log session");
    } finally {
      setLoggingMinutes(false);
    }
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(cmd);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-bg text-text-primary flex flex-col items-center justify-center p-6 space-y-4">
        <h1 className="text-2xl font-bold font-mono">ROADMAP NOT FOUND</h1>
        <p className="text-text-muted text-sm">The roadmap “{slug}” is not currently indexed.</p>
        <Link
          href="/learn"
          className="px-4 py-2 bg-accent text-black font-mono text-xs font-semibold rounded-lg hover:bg-accent/90 transition-colors"
        >
          ← Browse All Roadmaps
        </Link>
      </div>
    );
  }

  // Calculate telemetry
  const allSteps: { phase: RoadmapPhase; step: RoadmapStep }[] = [];
  roadmap.phases.forEach((p) => {
    p.steps.forEach((s) => allSteps.push({ phase: p, step: s }));
  });

  const totalSteps = allSteps.length;
  const doneCount = allSteps.filter(
    (item) => statusMap[item.step.slug] === "done" || statusMap[item.step.title.toLowerCase()] === "done"
  ).length;
  const progressPct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  // Filter steps by search query
  const matchesSearch = (title: string, desc: string) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  };

  // Find index of selected step for Prev/Next navigation
  const selectedIndex = selectedStep
    ? allSteps.findIndex((i) => i.step.slug === selectedStep.step.slug)
    : -1;

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/15 selection:text-text-primary font-sans">
      {/* Top Bar with Coordinates & Telemetry */}
      <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-border px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <Link href="/" className="hover:text-text-primary transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-accent transition-colors flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>ROADMAPS</span>
            </Link>
            <span>/</span>
            <span className="text-text-primary font-semibold truncate max-w-[200px]">
              {isBn && roadmap.title.bn ? roadmap.title.bn : roadmap.title.en}
            </span>
          </div>

          {/* Ops Authentication Pill & Progress */}
          <div className="flex items-center gap-3">
            {isAuthed ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OPS LOGGED IN · SYNCED</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-bg-surface border border-border text-text-muted font-mono text-[10px]">
                <span>PUBLIC VIEW</span>
              </span>
            )}

            {/* Overall Progress Pill */}
            <div className="flex items-center gap-2 bg-bg-surface border border-border px-3 py-1 rounded-lg">
              <div className="text-[11px] font-mono text-text-muted">
                <span className="text-accent font-bold">{doneCount}</span> / {totalSteps}
              </div>
              <div className="w-16 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-text-primary font-semibold">{progressPct}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Roadmap Hub */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Roadmap Hero Header */}
        <div className="border border-border bg-bg-surface rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold tracking-wider uppercase">
                // {roadmap.difficulty.toUpperCase()} ROADMAP
              </span>
              <span className="px-2.5 py-1 rounded bg-bg border border-border text-text-muted text-xs font-mono">
                Est. {roadmap.estimatedHours} Hours
              </span>
              <span className="px-2.5 py-1 rounded bg-bg border border-border text-text-muted text-xs font-mono">
                {roadmap.phases.length} Phases · {totalSteps} Steps
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary">
              {isBn && roadmap.title.bn ? roadmap.title.bn : roadmap.title.en}
            </h1>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-serif">
              {isBn && roadmap.description.bn ? roadmap.description.bn : roadmap.description.en}
            </p>

            {roadmap.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {roadmap.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg text-text-muted border border-border/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Search bar inside header */}
          <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? "ধাপ বা টপিক খুঁজুন..." : "Filter modules & steps..."}
                className="w-full pl-9 pr-4 py-2 bg-bg border border-border focus:border-accent rounded-lg text-xs font-mono text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors"
              />
            </div>
            <p className="text-xs font-mono text-text-muted self-start sm:self-auto">
              Tip: Click any step node to inspect all step-wise resources &amp; commands in place.
            </p>
          </div>
        </div>

        {/* 2-Column Layout: Visual Tree (Left) + Step Inspector (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: roadmap.sh Visual Path (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-8">
            {roadmap.phases.map((phase, pIdx) => {
              const visibleSteps = phase.steps.filter((s) =>
                matchesSearch(s.title, s.description)
              );
              if (searchQuery && visibleSteps.length === 0) return null;

              return (
                <div
                  key={phase.slug}
                  className="border border-border bg-bg-surface/50 rounded-xl p-5 sm:p-6 space-y-4 relative"
                >
                  {/* Phase Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 text-accent font-mono text-xs font-bold flex items-center justify-center">
                        {pIdx + 1}
                      </span>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-text-primary">
                          {phase.title}
                        </h2>
                        <p className="text-xs text-text-muted font-mono">{phase.duration}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-text-muted bg-bg px-2 py-0.5 rounded border border-border">
                      {phase.steps.length} {isBn ? "টি ধাপ" : "steps"}
                    </span>
                  </div>

                  {phase.description && (
                    <p className="text-xs text-text-secondary leading-relaxed font-serif">
                      {phase.description}
                    </p>
                  )}

                  {/* Step Nodes Sequence (roadmap.sh style) */}
                  <div className="space-y-2 pt-1">
                    {visibleSteps.map((step, sIdx) => {
                      const stepStatus =
                        statusMap[step.slug] || statusMap[step.title.toLowerCase()] || "todo";
                      const isSelected = selectedStep?.step.slug === step.slug;

                      return (
                        <div
                          key={step.slug}
                          onClick={() => setSelectedStep({ phase, step })}
                          className={`group flex items-center justify-between gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-accent/10 border-accent shadow-sm"
                              : "bg-bg border-border/80 hover:border-text-primary/40 hover:bg-bg-surface"
                          }`}
                        >
                          {/* Left: Status icon & Title */}
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Cycle Status Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const next =
                                  stepStatus === "todo"
                                    ? "doing"
                                    : stepStatus === "doing"
                                    ? "done"
                                    : "todo";
                                handleUpdateStepStatus(step, phase, next);
                              }}
                              disabled={savingStatus === step.slug}
                              className="shrink-0 cursor-pointer p-0.5 rounded hover:bg-bg-elevated transition-colors"
                              title={`Current: ${stepStatus}. Click to cycle.`}
                            >
                              {stepStatus === "done" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : stepStatus === "doing" ? (
                                <PlayCircle className="w-4 h-4 text-accent animate-pulse" />
                              ) : (
                                <Circle className="w-4 h-4 text-text-muted/50 group-hover:text-accent transition-colors" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <h3
                                className={`text-xs sm:text-sm font-semibold truncate ${
                                  stepStatus === "done"
                                    ? "line-through text-text-muted"
                                    : isSelected
                                    ? "text-accent"
                                    : "text-text-primary group-hover:text-accent"
                                }`}
                              >
                                {step.title}
                              </h3>
                              {step.description && (
                                <p className="text-[11px] text-text-muted truncate max-w-md">
                                  {step.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: Resources count pill & Estimated Time */}
                          <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-text-muted">
                            {step.estimatedMinutes && (
                              <span className="hidden sm:inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 opacity-60" />
                                <span>{step.estimatedMinutes}m</span>
                              </span>
                            )}
                            {step.resources && step.resources.length > 0 && (
                              <span className="px-2 py-0.5 rounded bg-bg-surface border border-border text-accent text-[10px] font-semibold">
                                {step.resources.length} res
                              </span>
                            )}
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isSelected ? "text-accent translate-x-0.5" : "text-text-muted/50"
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

          {/* RIGHT: Unified Step Inspector Panel (5 Cols on desktop, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            {selectedStep ? (
              <div className="border border-border bg-bg-surface rounded-xl p-5 sm:p-6 space-y-6 shadow-xl shadow-black/20">
                {/* Header Context */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-border">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold block">
                      // {selectedStep.phase.title}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary leading-tight">
                      {selectedStep.step.title}
                    </h3>
                  </div>

                  {/* Status Toggle in Inspector */}
                  <div className="shrink-0 flex items-center gap-1">
                    {(["todo", "doing", "done"] as const).map((st) => {
                      const current =
                        statusMap[selectedStep.step.slug] ||
                        statusMap[selectedStep.step.title.toLowerCase()] ||
                        "todo";
                      const active = current === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() =>
                            handleUpdateStepStatus(selectedStep.step, selectedStep.phase, st)
                          }
                          className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer border ${
                            active
                              ? st === "done"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                : st === "doing"
                                ? "bg-accent/20 text-accent border-accent/40"
                                : "bg-bg-elevated text-text-primary border-border"
                              : "bg-bg text-text-muted border-border/60 hover:text-text-primary"
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step Description */}
                {selectedStep.step.description && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted font-semibold">
                      [ Concept Overview ]
                    </h4>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-serif">
                      {selectedStep.step.description}
                    </p>
                  </div>
                )}

                {/* Monospace Commands & Recipes */}
                {selectedStep.step.commands && selectedStep.step.commands.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-accent" />
                        <span>Command Snippets &amp; Cheats</span>
                      </h4>
                    </div>

                    <div className="space-y-1.5">
                      {selectedStep.step.commands.map((cmd, i) => (
                        <div
                          key={i}
                          className="group relative flex items-center justify-between bg-bg border border-border/80 rounded-lg p-2.5 font-mono text-xs text-accent"
                        >
                          <span className="truncate pr-8 select-all">{cmd}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCommand(cmd)}
                            className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                            title="Copy command"
                          >
                            {copiedCommand === cmd ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal Study Notes */}
                {selectedStep.step.myNotes && (
                  <div className="p-3.5 rounded-lg bg-bg border border-accent/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-accent text-xs font-mono font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Architecture Notes &amp; Insight</span>
                    </div>
                    <p className="text-xs text-text-secondary font-mono leading-relaxed">
                      {selectedStep.step.myNotes}
                    </p>
                  </div>
                )}

                {/* Curated Resources (All in ONE place) */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-accent" />
                    <span>Curated Study Resources</span>
                  </h4>

                  {selectedStep.step.resources && selectedStep.step.resources.length > 0 ? (
                    <div className="space-y-2">
                      {selectedStep.step.resources.map((res, rIdx) => {
                        const isObj = typeof res === "object" && res !== null;
                        const label = isObj ? res.label : res;
                        const url = isObj ? res.url : res;

                        return (
                          <a
                            key={rIdx}
                            href={url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-bg border border-border/80 hover:border-accent hover:bg-accent/[0.03] text-xs transition-colors group"
                          >
                            <span className="text-text-primary group-hover:text-accent font-medium truncate">
                              {label}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted font-mono italic">
                      No external URLs indexed for this step. Refer to the overview above.
                    </p>
                  )}
                </div>

                {/* Ops Special Action: Log Study Session */}
                {isAuthed && (
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-mono text-text-muted">Study Logging</span>
                    <button
                      type="button"
                      onClick={() => handleLogQuickSession(selectedStep.step)}
                      disabled={loggingMinutes}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/40 text-accent font-mono text-xs font-semibold hover:bg-accent/25 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{loggingMinutes ? "Logging..." : "+30m Study Log"}</span>
                    </button>
                  </div>
                )}

                {/* Prev / Next Step Navigator */}
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                  {selectedIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() => setSelectedStep(allSteps[selectedIndex - 1])}
                      className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Prev Step</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  {selectedIndex < allSteps.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setSelectedStep(allSteps[selectedIndex + 1])}
                      className="flex items-center gap-1 text-accent hover:underline transition-all cursor-pointer font-semibold"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-xl p-8 text-center text-xs font-mono text-text-muted space-y-2">
                <BookOpen className="w-6 h-6 mx-auto text-accent/60" />
                <p>Select any step from the roadmap to view its resources, commands, and study notes.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
