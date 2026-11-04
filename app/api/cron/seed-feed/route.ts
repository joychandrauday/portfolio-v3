/**
 * POST /api/cron/seed-feed
 * Vercel cron endpoint that triggers a daily scrape+seed of all feed sources.
 * Reuses scrapeAllSources from lib/feed-scraper.
 *
 * Protected by CRON_SECRET header to prevent public invocation.
 */

import { NextRequest, NextResponse } from "next/server";
import { scrapeAllSources } from "@/lib/feed-scraper";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") || req.headers.get("authorization");

  const expectedSecret = process.env.CRON_SECRET || "joy-chandra-uday-cron-secret-2025";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await scrapeAllSources();

    return NextResponse.json({
      success: true,
      message: `Daily feed seed complete: ${result.totalCreated} insights created from ${result.sourcesCount} sources.`,
      result,
    });
  } catch (err: any) {
    console.error("/api/cron/seed-feed error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Daily seed failed" },
      { status: 500 },
    );
  }
}