import { NextResponse } from "next/server";
import { getRoadmapBySlug, getRoadmapPhases, getPhaseBySlug } from "@/lib/roadmaps-data";

/**
 * GET /api/ops/learn/phases/:slug
 *
 * Returns all phases for a specific roadmap.
 * Used by /learn/[slug] page to dynamically load phases.
 */

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

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