import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhaseView } from "@/components/learn/PhaseView";
import {
  getAllRoadmaps,
  getPhaseBySlug,
  getRoadmapBySlug,
} from "@/lib/roadmaps-data";
import { getRoadmapResources } from "@/lib/learn-resources";
import { buildNoteHtmlMap } from "@/lib/learn-notes";

export const revalidate = 300;

const BASE_URL = "https://joychandrauday.vercel.app";

export function generateStaticParams() {
  return getAllRoadmaps().flatMap((roadmap) =>
    getRoadmapBySlug(roadmap.slug)?.phases.map((phase) => ({
      slug: roadmap.slug,
      phase: phase.slug,
    })) ?? [],
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; phase: string };
}): Promise<Metadata> {
  const roadmap = getRoadmapBySlug(params.slug);
  const phase = getPhaseBySlug(params.slug, params.phase);
  if (!roadmap || !phase) return { title: "Phase not found" };

  const title = `${phase.title} — ${roadmap.title.en}`;
  const description = phase.description || roadmap.description.en;
  const url = `${BASE_URL}/learn/${roadmap.slug}/${phase.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: "Joy Chandra Uday" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PhaseDetail({
  params,
}: {
  params: { slug: string; phase: string };
}) {
  const roadmap = getRoadmapBySlug(params.slug);
  const phase = getPhaseBySlug(params.slug, params.phase);
  if (!roadmap || !phase) notFound();

  const resources = await getRoadmapResources(roadmap.slug);
  const phaseResources = resources.byPhase[phase.slug] ?? [];
  const noteHtmlById = buildNoteHtmlMap([...phaseResources, ...resources.roadmap]);

  const stepMaterialCounts: Record<string, number> = {};
  phase.steps.forEach((step) => {
    stepMaterialCounts[step.slug] =
      resources.byStep[`${phase.slug}/${step.slug}`]?.length ?? 0;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${phase.title} — ${roadmap.title.en}`,
    description: phase.description,
    url: `${BASE_URL}/learn/${roadmap.slug}/${phase.slug}`,
    provider: { "@type": "Person", name: "Joy Chandra Uday" },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: phase.duration,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PhaseView
        slug={roadmap.slug}
        roadmapTitle={roadmap.title}
        roadmapSlugLabel={roadmap.slug.replace(/-/g, " ").toUpperCase()}
        phase={phase}
        stepMaterialCounts={stepMaterialCounts}
        phaseResources={phaseResources}
        roadmapMaterials={resources.roadmap}
        noteHtmlById={noteHtmlById}
      />
    </>
  );
}
