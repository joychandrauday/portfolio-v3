/**
 * POST /api/ops/feed/scrape
 * Manual admin trigger to scrape one or all feed sources.
 * Requires ops session.
 */

import { NextRequest, NextResponse } from "next/server";
import { scrapeAllSources, scrapeSource } from "@/lib/feed-scraper";

export async function POST(req: NextRequest) {
  const { source, topicFilter } = await req.json();

  try {
    // If source is specified, scrape only that source
    if (source) {
      const result = await scrapeSource(source, topicFilter);
      return NextResponse.json({
        success: true,
        message: `Seeded ${result.insightsCreated} insights from source "${source}".`,
        result,
      });
    }

    // Otherwise, scrape all sources (roadmap.sh + others)
    const result = await scrapeAllSources(topicFilter);
    return NextResponse.json({
      success: true,
      message: `Seeded ${result.totalCreated} insights from ${result.sourcesCount} sources.`,
      result,
    });
  } catch (err: any) {
    console.error("/api/ops/feed/scrape error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Scrape failed" },
      { status: 500 },
    );
  }
}