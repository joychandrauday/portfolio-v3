/**
 * Public learning materials — phase & step wise assets and notes.
 *
 * The roadmap skeleton (modules, phases, steps) stays in
 * `lib/roadmaps-data.ts`. This module only resolves the *attachments*:
 * uploaded files, external links, videos and long-form notes stored in
 * `LearnResource` rows and keyed by (roadmapSlug, phaseSlug, stepSlug).
 *
 * Reads are public and cached; writes go through the ops API which calls
 * `revalidateTag(LEARN_RESOURCES_TAG)`.
 */

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export const LEARN_RESOURCES_TAG = "learn-resources";
export const LEARN_RESOURCES_REVALIDATE_SECONDS = 300;

export type LearnResourceKind = "file" | "link" | "video" | "note";
export type LearnResourceFormat = "markdown" | "html" | "code" | "checklist";

export const LEARN_RESOURCE_KINDS: LearnResourceKind[] = [
  "file",
  "link",
  "video",
  "note",
];

export const LEARN_RESOURCE_FORMATS: LearnResourceFormat[] = [
  "markdown",
  "html",
  "code",
  "checklist",
];

export interface SerializedLearnResource {
  id: string;
  slug: string;
  roadmapSlug: string;
  phaseSlug: string | null;
  stepSlug: string | null;
  kind: LearnResourceKind;
  format: LearnResourceFormat | null;
  title: string;
  titleBn: string | null;
  summary: string | null;
  summaryBn: string | null;
  url: string | null;
  storageKey: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  body: string | null;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapResourceBuckets {
  /** Roadmap-level reference material (phaseSlug and stepSlug are null). */
  roadmap: SerializedLearnResource[];
  /** Keyed by phaseSlug — phase-level material (stepSlug null). */
  byPhase: Record<string, SerializedLearnResource[]>;
  /** Keyed by `${phaseSlug}/${stepSlug}` — step-level material. */
  byStep: Record<string, SerializedLearnResource[]>;
}

export function resourceKey(
  phaseSlug: string,
  stepSlug: string,
): string {
  return `${phaseSlug}/${stepSlug}`;
}

export function serializeLearnResource(row: {
  id: string;
  slug: string;
  roadmapSlug: string;
  phaseSlug: string | null;
  stepSlug: string | null;
  kind: string;
  format: string | null;
  title: string;
  titleBn: string | null;
  summary: string | null;
  summaryBn: string | null;
  url: string | null;
  storageKey: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  body: string | null;
  sortOrder: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}, options: { includeBody?: boolean } = {}): SerializedLearnResource {
  return {
    id: row.id,
    slug: row.slug,
    roadmapSlug: row.roadmapSlug,
    phaseSlug: row.phaseSlug,
    stepSlug: row.stepSlug,
    kind: (LEARN_RESOURCE_KINDS as string[]).includes(row.kind)
      ? (row.kind as LearnResourceKind)
      : "file",
    format: row.format
      ? ((LEARN_RESOURCE_FORMATS as string[]).includes(row.format)
          ? (row.format as LearnResourceFormat)
          : null)
      : null,
    title: row.title,
    titleBn: row.titleBn,
    summary: row.summary,
    summaryBn: row.summaryBn,
    url: row.url,
    storageKey: row.storageKey,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    // Notes are rendered publicly; file bodies are never sent to the client.
    body:
      options.includeBody || row.kind === "note" ? row.body : null,
    sortOrder: row.sortOrder,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function bucketize(
  rows: SerializedLearnResource[],
): RoadmapResourceBuckets {
  const buckets: RoadmapResourceBuckets = { roadmap: [], byPhase: {}, byStep: {} };

  for (const row of rows) {
    if (!row.phaseSlug) {
      buckets.roadmap.push(row);
      continue;
    }
    if (!row.stepSlug) {
      (buckets.byPhase[row.phaseSlug] ||= []).push(row);
      continue;
    }
    (buckets.byStep[resourceKey(row.phaseSlug, row.stepSlug)] ||= []).push(row);
  }

  return buckets;
}

async function readPublicResources(
  roadmapSlug: string,
): Promise<RoadmapResourceBuckets> {
  try {
    const rows = await prisma.learnResource.findMany({
      where: {
        roadmapSlug,
        isPublic: true,
        publishedAt: { not: null },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return bucketize(rows.map((row) => serializeLearnResource(row)));
  } catch (err) {
    // A missing table or unreachable database must not break public pages.
    console.error("[learn-resources] read failed:", err);
    return { roadmap: [], byPhase: {}, byStep: {} };
  }
}

/**
 * All published material for one roadmap, bucketed by position.
 * Cached per roadmap and invalidated by tag from the ops API.
 */
export const getRoadmapResources = unstable_cache(
  readPublicResources,
  ["learn-resources-by-roadmap"],
  {
    tags: [LEARN_RESOURCES_TAG],
    revalidate: LEARN_RESOURCES_REVALIDATE_SECONDS,
  },
);

/** Phase-level material for one phase (excludes step-level rows). */
export async function getPhaseResources(
  roadmapSlug: string,
  phaseSlug: string,
): Promise<SerializedLearnResource[]> {
  const buckets = await getRoadmapResources(roadmapSlug);
  return buckets.byPhase[phaseSlug] ?? [];
}

/** Step-level material for one step. */
export async function getStepResources(
  roadmapSlug: string,
  phaseSlug: string,
  stepSlug: string,
): Promise<SerializedLearnResource[]> {
  const buckets = await getRoadmapResources(roadmapSlug);
  return buckets.byStep[resourceKey(phaseSlug, stepSlug)] ?? [];
}

/** A single published resource by its stable slug, or null. */
export async function getStepResourceBySlug(
  roadmapSlug: string,
  phaseSlug: string,
  stepSlug: string,
  slug: string,
): Promise<SerializedLearnResource | null> {
  const rows = await getStepResources(roadmapSlug, phaseSlug, stepSlug);
  return rows.find((row) => row.slug === slug) ?? null;
}

/** Locale-aware label helpers used by the public components. */
export function resourceTitle(
  resource: Pick<SerializedLearnResource, "title" | "titleBn">,
  bengali: boolean,
): string {
  return bengali && resource.titleBn ? resource.titleBn : resource.title;
}

export function resourceSummary(
  resource: Pick<SerializedLearnResource, "summary" | "summaryBn">,
  bengali: boolean,
): string | null {
  if (bengali && resource.summaryBn) return resource.summaryBn;
  return resource.summary;
}
