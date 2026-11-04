"use client";

import { useCallback, useEffect, useState } from "react";

export type StepStatus = "todo" | "doing" | "done";

export interface TrackedStep {
  slug: string;
  title: string;
  estimatedMinutes?: number;
  resourceUrl?: string | null;
}

interface SyncState {
  authed: boolean;
  map: Record<string, StepStatus>;
}

/**
 * Status is per-visitor for the public site (localStorage) and synced to the
 * ops database when the owner is signed in. Several islands on the same page
 * share one fetch and stay in sync through a custom event.
 */
const cache = new Map<string, Promise<SyncState>>();
const inFlightUpdates = new Set<string>();

function storageKey(roadmapSlug: string): string {
  return `learn_track_${roadmapSlug}`;
}

function eventName(roadmapSlug: string): string {
  return `learn-status:${roadmapSlug}`;
}

function readLocal(roadmapSlug: string): Record<string, StepStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(roadmapSlug));
    return raw ? (JSON.parse(raw) as Record<string, StepStatus>) : {};
  } catch {
    return {};
  }
}

function writeLocal(roadmapSlug: string, map: Record<string, StepStatus>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(roadmapSlug), JSON.stringify(map));
  } catch {
    /* storage disabled */
  }
}

async function loadStatus(roadmapSlug: string): Promise<SyncState> {
  const local = readLocal(roadmapSlug);

  try {
    const res = await fetch("/api/ops/learn", { cache: "no-store" });
    const data = await res.json();

    if (data?.authenticated && Array.isArray(data.tracks)) {
      const map: Record<string, StepStatus> = {};
      data.tracks.forEach((track: any) => {
        if (!Array.isArray(track?.modules)) return;
        track.modules.forEach((module: any) => {
          const match = module?.notes?.match(/Step:\s*([a-zA-Z0-9_-]+)/);
          const key = match ? match[1] : String(module?.title || "").toLowerCase();
          map[key] = module.status;
          map[String(module?.title || "").toLowerCase()] = module.status;
        });
      });
      return { authed: true, map: { ...local, ...map } };
    }
  } catch {
    /* offline — fall through to local */
  }

  return { authed: false, map: local };
}

function getStatus(roadmapSlug: string): Promise<SyncState> {
  const existing = cache.get(roadmapSlug);
  if (existing) return existing;

  const promise = loadStatus(roadmapSlug).catch(() => ({
    authed: false,
    map: readLocal(roadmapSlug),
  }));
  cache.set(roadmapSlug, promise);
  return promise;
}

export function useStepStatus(roadmapSlug: string, roadmapTitle: string) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, StepStatus>>({});
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getStatus(roadmapSlug).then((state) => {
      if (!active) return;
      setIsAuthed(state.authed);
      setStatusMap((current) => ({ ...state.map, ...current }));
      setReady(true);
    });

    const onCustom = () => {
      if (active) setStatusMap(readLocal(roadmapSlug));
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey(roadmapSlug) && active) {
        setStatusMap(readLocal(roadmapSlug));
      }
    };

    window.addEventListener(eventName(roadmapSlug), onCustom);
    window.addEventListener("storage", onStorage);

    return () => {
      active = false;
      window.removeEventListener(eventName(roadmapSlug), onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [roadmapSlug]);

  const updateStatus = useCallback(
    async (step: TrackedStep, nextStatus: StepStatus) => {
      const titleKey = step.title.toLowerCase();
      setSaving(step.slug);
      setStatusMap((current) => {
        const next = { ...current, [step.slug]: nextStatus, [titleKey]: nextStatus };
        if (!isAuthed) {
          writeLocal(roadmapSlug, next);
          window.dispatchEvent(new Event(eventName(roadmapSlug)));
        }
        return next;
      });

      if (isAuthed) {
        try {
          await fetch("/api/ops/learn", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "sync_roadmap_step",
              roadmapSlug,
              roadmapTitle,
              stepSlug: step.slug,
              stepTitle: step.title,
              status: nextStatus,
              estimateMinutes: step.estimatedMinutes || 30,
              resourceUrl: step.resourceUrl || null,
            }),
          });
        } catch (err) {
          console.error("Failed to sync step status", err);
        }
      }

      setSaving(null);
    },
    [isAuthed, roadmapSlug, roadmapTitle],
  );

  const cycleStatus = useCallback(
    (step: TrackedStep) => {
      const current = statusMap[step.slug] || statusMap[step.title.toLowerCase()] || "todo";
      const next: StepStatus =
        current === "todo" ? "doing" : current === "doing" ? "done" : "todo";
      return updateStatus(step, next);
    },
    [statusMap, updateStatus],
  );

  const logSession = useCallback(
    async (step: TrackedStep, minutes = 30) => {
      if (!isAuthed || inFlightUpdates.has(step.slug)) return false;
      inFlightUpdates.add(step.slug);
      try {
        const res = await fetch("/api/ops/learn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "log_session",
            minutes,
            note: `Studied ${step.title}`,
          }),
        });
        return res.ok;
      } catch {
        return false;
      } finally {
        inFlightUpdates.delete(step.slug);
      }
    },
    [isAuthed],
  );

  const statusOf = useCallback(
    (step: { slug: string; title: string }): StepStatus =>
      statusMap[step.slug] || statusMap[step.title.toLowerCase()] || "todo",
    [statusMap],
  );

  return { isAuthed, ready, statusMap, saving, statusOf, updateStatus, cycleStatus, logSession };
}
