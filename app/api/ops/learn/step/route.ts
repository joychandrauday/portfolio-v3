import { NextRequest, NextResponse } from "next/server";
import { getRoadmapBySlug, getStepBySlug } from "@/lib/roadmaps-data";

export const dynamic = 'force-dynamic';

/**
 * GET /api/ops/learn/step?slug=...&phase=...&step=...
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const phaseSlug = searchParams.get('phase');
  const stepSlug = searchParams.get('step');

  if (!slug || !phaseSlug || !stepSlug) {
    return NextResponse.json({ error: "slug, phase, and step are required" }, { status: 400 });
  }

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