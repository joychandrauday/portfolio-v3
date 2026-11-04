/**
 * Structured feed source definitions (roadmap.sh-style).
 *
 * Each source exposes a stable slug and a list of "topics" (roadmap slugs)
 * whose phase/step content we can transform into micro-insight posts.
 * Fetching is server-side only — no client CORS concerns.
 */

export type FeedSourceKind = "roadmap" | "static";

export interface FeedSourceTopic {
  slug: string;
  title: string;
  /** Maps to an existing topic channel on the feed. */
  topic: string;
  /** Maps to an existing category tag. */
  category: string;
  /** Short label for the source attribution. */
  sourceLabel: string;
  /** Author name surfaced on each post. */
  author: string;
}

export interface FeedSource {
  slug: string;
  kind: FeedSourceKind;
  label: string;
  description: string;
  homepage: string;
  topics: FeedSourceTopic[];
}

/**
 * roadmap.sh exposes a fixed set of public learning roadmaps. We mirror
 * those slugs here so the scraper can walk phases/steps and emit
 * micro-insights (one per phase/step combination).
 */
export const FEED_SOURCES: FeedSource[] = [
  {
    slug: "roadmap.sh",
    kind: "roadmap",
    label: "roadmap.sh",
    description:
      "Structured, community-maintained learning roadmaps. Each phase/step becomes a bite-sized insight.",
    homepage: "https://roadmap.sh",
    topics: [
      {
        slug: "devops",
        title: "DevOps",
        topic: "dev-hacks",
        category: "DEVOPS",
        sourceLabel: "roadmap.sh / DevOps",
        author: "roadmap.sh community",
      },
      {
        slug: "linux",
        title: "Linux",
        topic: "linux",
        category: "TERMINAL HACK",
        sourceLabel: "roadmap.sh / Linux",
        author: "roadmap.sh community",
      },
      {
        slug: "programming",
        title: "Programming",
        topic: "dev-hacks",
        category: "PROGRAMMING",
        sourceLabel: "roadmap.sh / Programming",
        author: "roadmap.sh community",
      },
      {
        slug: "frontend",
        title: "Frontend",
        topic: "dev-hacks",
        category: "FRONTEND",
        sourceLabel: "roadmap.sh / Frontend",
        author: "roadmap.sh community",
      },
      {
        slug: "backend",
        title: "Backend",
        topic: "system-design",
        category: "BACKEND",
        sourceLabel: "roadmap.sh / Backend",
        author: "roadmap.sh community",
      },
    ],
  },
];

export function getFeedSource(slug: string): FeedSource | undefined {
  return FEED_SOURCES.find((s) => s.slug === slug);
}

export function listFeedSources(): FeedSource[] {
  return FEED_SOURCES;
}