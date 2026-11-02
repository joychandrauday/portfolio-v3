import { NextResponse } from "next/server";
import { getRoadmapBySlug, getStepBySlug } from "@/lib/roadmaps-data";

/**
 * GET /api/ops/learn/step/:slug/:phase/:step
 *
 * Returns a specific step with all its details.
 * Used by /learn/[slug]/[phase]/[step] page to dynamically load step content.
 */

export async function GET(
  _req: Request,
  { params }: { params: { slug: string; phase: string; step: string } }
) {
  const { slug, phase: phaseSlug, step: stepSlug } = params;

  const roadmap = getRoadmapBySlug(slug);
  if (!roadmap) {
    return NextResponse.json(
      { error: `Roadmap "${slug}" not found` },
      { status: 404 }
    );
  }

  const step = getStepBySlug(slug, phaseSlug, stepSlug);
  if (!step) {
    return NextResponse.json(
      { error: `Step "${stepSlug}" not found in phase "${phaseSlug}" of roadmap "${slug}"` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    roadmap: {
      slug: roadmap.slug,
      title: roadmap.title,
    },
    step,
  });
}