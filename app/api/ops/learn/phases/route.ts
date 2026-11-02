import { NextRequest, NextResponse } from "next/server";
import { getRoadmapBySlug, getRoadmapPhases } from "@/lib/roadmaps-data";

export const dynamic = 'force-dynamic';

/**
 * GET /api/ops/learn/phases?slug=...
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

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

  const phases = getRoadmapPhases(slug);

  return NextResponse.json({
    roadmap: {
      slug: roadmap.slug,
      title: roadmap.title,
      description: roadmap.description,
      estimatedHours: roadmap.estimatedHours,
      difficulty: roadmap.difficulty,
      icon: roadmap.icon,
      tags: roadmap.tags,
    },
    phases,
    totalPhases: phases.length,
    totalSteps: phases.reduce((acc, p) => acc + p.steps.length, 0),
  });
}