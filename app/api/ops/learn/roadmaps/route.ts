import { NextRequest, NextResponse } from "next/server";
import { getAllRoadmaps, getRoadmapBySlug, roadmapToLearnTemplate } from "@/lib/roadmaps-data";

/**
 * GET /api/ops/learn/roadmaps
 */
export async function GET() {
  const summaries = getAllRoadmaps();
  return NextResponse.json({
    roadmaps: summaries,
    count: summaries.length,
  });
}

/**
 * POST /api/ops/learn/roadmaps
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, templateKey } = body;

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const roadmap = getRoadmapBySlug(slug);

    if (!roadmap) {
      return NextResponse.json(
        { error: `Roadmap "${slug}" not found` },
        { status: 404 }
      );
    }

    const template = roadmapToLearnTemplate(roadmap);

    if (templateKey) {
      return NextResponse.json({
        success: true,
        template,
        key: templateKey,
        message: "Roadmap imported successfully",
      });
    }

    return NextResponse.json({
      success: true,
      template,
      message: `Roadmap "${roadmap.title.en}" imported as template "${template.label}"`,
    });
  } catch (err) {
    console.error("[api/ops/learn/roadmaps] failed:", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
