/**
 * Feed scraper: converts roadmap.sh-style structured sources into
 * micro-insight posts and seeds them to the database.
 *
 * Server-side only: no client CORS issues. Uses the existing
 * lib/roadmaps-data.ts roadmap skeleton and the FEED_SOURCES
 * definitions to create one Post per roadmap phase + step.
 *
 * Architecture (per plan D2):
 * - Input: a source slug (e.g. "roadmap.sh") and an optional topic filter
 * - Process: walk each roadmap → each phase → each step → emit an InsightItem
 * - Output: upserts to Prisma InsightItem table; returns stats
 */

import { ROADMAPS, type Roadmap, type RoadmapPhase, type RoadmapStep } from "@/lib/roadmaps-data";
import { getFeedSource, listFeedSources } from "@/lib/feed-sources";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";

/**
 * Map a roadmap phase + step into a micro-insight post.
 * One InsightItem is emitted per (roadmap, phase, step) triplet.
 */
function phaseStepToInsight(
  roadmap: Roadmap,
  phase: RoadmapPhase,
  step: RoadmapStep,
  sourceSlug: string,
  sourceAuthor: string,
  topic?: string,
  category?: string,
) {
  const title = step.title || step.slug || "Untitled Insight";
  const slug = roadmap.slug + "-" + phase.slug + "-" + step.slug;
  // Derive a concise summary from the step description (first sentence or 120 chars)
  let summary = step.description || "";
  if (summary.length > 120) {
    summary = summary.slice(0, 120).trimEnd() + "…";
  }
  const content = step.description || "";
  const codeSnippet = step.commands?.[0] || null;
  const bgTheme =
    step.title?.includes("Permission") || step.title?.includes("systemd")
      ? "emerald-matrix"
      : step.title?.includes("Network") || step.title?.includes("Networking")
        ? "solar-flare"
        : step.title?.includes("Package") || step.title?.includes("Package Management")
          ? "obsidian-terminal"
          : "cyber-mesh";
  const tags: string[] = [];
  if (topic) tags.push(topic);
  if (category) tags.push(category);
  if (roadmap.tags?.length) roadmap.tags.forEach((t) => tags.push(t));
  if (tags.length === 0) tags.push("roadmap");

  return {
    slug,
    title,
    topic: topic || "dev-hacks",
    category: category || "ENGINEERING",
    summary,
    content,
    codeSnippet,
    bgTheme,
    tags: Array.from(new Set(tags)),
    source: sourceSlug,
    author: sourceAuthor,
    status: "published",
    backgroundType: "animation",
    backgroundRef: null,
  };
}

/**
 * Scrape a single roadmap source and seed insights.
 * Returns a stats object.
 */
export async function scrapeSource(sourceSlug: string, topicFilter?: string) {
  // Auth check: only ops-admins may seed
  const isOps = await verifyOpsSession();
  if (!isOps) {
    throw new Error("Unauthorized: ops session required");
  }

  const source = getFeedSource(sourceSlug);
  if (!source) {
    throw new Error(`Source "${sourceSlug}" not found`);
  }
  const sourceAuthor = source.topics?.[0]?.author || sourceSlug;

  // Filter roadmaps by topic if provided
  const roadmapsToProcess = topicFilter
    ? ROADMAPS.filter((rm) => rm.tags?.includes(topicFilter))
    : ROADMAPS;

  let created = 0;
  let skipped = 0;

  for (const roadmap of roadmapsToProcess) {
    // Walk each phase → each step
    for (const phase of roadmap.phases) {
      for (const step of phase.steps) {
        // Derive topic/category from roadmap tags
        const derivedTopic = roadmap.tags?.[0] || "dev-hacks";
        const derivedCategory = roadmap.tags?.[1]?.toUpperCase() || "ENGINEERING";

        const insight = phaseStepToInsight(
          roadmap,
          phase,
          step,
          sourceSlug,
          sourceAuthor,
          derivedTopic,
          derivedCategory,
        );

        // Upsert by slug (unique constraint)
        await prisma.insightItem.upsert({
          where: { slug: insight.slug },
          update: {
            title: insight.title,
            topic: insight.topic,
            category: insight.category,
            summary: insight.summary,
            content: insight.content,
            codeSnippet: insight.codeSnippet,
            bgTheme: insight.bgTheme,
            tags: insight.tags,
            source: insight.source,
            author: insight.author,
            status: insight.status,
            backgroundType: insight.backgroundType,
            backgroundRef: insight.backgroundRef,
            updatedAt: new Date(),
          },
          create: insight,
        });
        created++;
      }
    }
  }

  return {
    sourceSlug,
    roadmapsScanned: roadmapsToProcess.length,
    insightsCreated: created,
    insightsSkipped: skipped,
  };
}

/**
 * Batch-scrape all known roadmap.sh sources.
 * Returns stats per source + totals.
 */
export async function scrapeAllSources(topicFilter?: string) {
  const results: Array<{ sourceSlug: string; stats: Awaited<ReturnType<typeof scrapeSource>> }> = [];

  for (const source of listFeedSources()) {
    const stats = await scrapeSource(source.slug, topicFilter);
    results.push({ sourceSlug: source.slug, stats });
  }

  const totalCreated = results.reduce(
    (sum, r) => sum + r.stats.insightsCreated,
    0,
  );
  const totalSkipped = results.reduce(
    (sum, r) => sum + r.stats.insightsSkipped,
    0,
  );

  return {
    sourcesCount: results.length,
    totalCreated,
    totalSkipped,
    results,
  };
}