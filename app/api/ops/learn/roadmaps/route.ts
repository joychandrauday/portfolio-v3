import { NextRequest, NextResponse } from "next/server";
import { ROADMAPS, getRoadmapSummaryBySlug, getAllRoadmaps, getRoadmapBySlug, roadmapToLearnTemplate } from "@/lib/roadmaps-data";

/**
 * GET /api/ops/learn/roadmaps
 *
 * Returns a list of all available roadmaps as summaries.
 * Used by the public /learning page to dynamically list roadmaps.
 */

export function getRoadmapsHandler() {
  const summaries = getAllRoadmaps();

  return NextResponse.json({
    roadmaps: summaries,
    count: summaries.length,
  });
}

/**
 * GET /api/ops/learn/roadmaps/:slug
 *
 * Returns the full roadmap data for a specific slug.
 * Used to fetch roadmap phases and details for /learn/[slug].
 */

export function getRoadmapHandler(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const roadmap = getRoadmapSummaryBySlug(slug);

  if (!roadmap) {
    return NextResponse.json(
      { error: `Roadmap "${slug}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({ roadmap });
}

/**
 * POST /api/ops/learn/roadmaps/import
 *
 * Import a roadmap into the Learning Flow system.
 * Takes a roadmap slug and converts it to a learn template.
 */

export function importRoadmapHandler(req: NextRequest) {
  return new Promise<NextResponse>(async (resolve) => {
    try {
      const body = await req.json();
      const { slug, templateKey } = body;

      if (!slug) {
        resolve(
          NextResponse.json({ error: "slug is required" }, { status: 400 })
        );
        return;
      }

      const roadmap = getRoadmapBySlug(slug);

      if (!roadmap) {
        resolve(
          NextResponse.json(
            { error: `Roadmap "${slug}" not found` },
            { status: 404 }
          )
        );
        return;
      }

      const template = roadmapToLearnTemplate(roadmap);

      if (templateKey) {
        resolve(
          NextResponse.json({
            success: true,
            template,
            key: templateKey,
            message: "Roadmap imported successfully",
          })
        );
        return;
      }

      resolve(
        NextResponse.json({
          success: true,
          template,
          message: `Roadmap "${roadmap.title.en}" imported as template "${template.label}"`,
        })
      );
    } catch (err) {
      console.error("[api/ops/learn/roadmaps/import] failed:", err);
      resolve(
        NextResponse.json({ error: "Import failed" }, { status: 500 })
      );
    }
  });
}

// Route handler dispatcher
export async function GET(req: NextRequest, { params }: { params: { slug?: string } }) {
  if (params?.slug) {
    return getRoadmapHandler(req, { params: { slug: params.slug } });
  }
  return getRoadmapsHandler();
}

export async function POST(req: NextRequest) {
  return importRoadmapHandler(req);
}