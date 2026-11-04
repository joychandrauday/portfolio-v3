import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StepView } from "@/components/learn/StepView";
import {
  getAllRoadmaps,
  getPhaseBySlug,
  getRoadmapBySlug,
  getStepBySlug,
} from "@/lib/roadmaps-data";
import { getStepResources } from "@/lib/learn-resources";
import { buildNoteHtmlMap } from "@/lib/learn-notes";

export const revalidate = 300;

const BASE_URL = "https://joychandrauday.vercel.app";

export function generateStaticParams() {
  return getAllRoadmaps().flatMap((summary) => {
    const roadmap = getRoadmapBySlug(summary.slug);
    return (
      roadmap?.phases.flatMap((phase) =>
        phase.steps.map((step) => ({
          slug: roadmap.slug,
          phase: phase.slug,
          step: step.slug,
        })),
      ) ?? []
    );
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; phase: string; step: string };
}): Promise<Metadata> {
  const roadmap = getRoadmapBySlug(params.slug);
  const phase = getPhaseBySlug(params.slug, params.phase);
  const step = getStepBySlug(params.slug, params.phase, params.step);
  if (!roadmap || !phase || !step) return { title: "Step not found" };

  const title = `${step.title} — ${phase.title}`;
  const description = step.description || roadmap.description.en;
  const url = `${BASE_URL}/learn/${roadmap.slug}/${phase.slug}/${step.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: "Joy Chandra Uday" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function StepDetail({
  params,
}: {
  params: { slug: string; phase: string; step: string };
}) {
  const roadmap = getRoadmapBySlug(params.slug);
  const phase = getPhaseBySlug(params.slug, params.phase);
  const step = getStepBySlug(params.slug, params.phase, params.step);
  if (!roadmap || !phase || !step) notFound();

  const resources = await getStepResources(roadmap.slug, phase.slug, step.slug);
  const noteHtmlById = buildNoteHtmlMap(resources);

  const flat = roadmap.phases.flatMap((p) =>
    p.steps.map((s) => ({ phase: p, step: s })),
  );
  const index = flat.findIndex(
    (item) => item.phase.slug === phase.slug && item.step.slug === step.slug,
  );

  const toLink = (item: { phase: typeof phase; step: typeof step } | undefined) =>
    item
      ? {
          href: `/learn/${roadmap.slug}/${item.phase.slug}/${item.step.slug}`,
          label: item.step.title,
        }
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: step.title,
    description: step.description,
    url: `${BASE_URL}/learn/${roadmap.slug}/${phase.slug}/${step.slug}`,
    learningResourceType: "lesson",
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
    about: phase.title,
    timeRequired: step.estimatedMinutes ? `PT${step.estimatedMinutes}M` : undefined,
    isPartOf: {
      "@type": "Course",
      name: roadmap.title.en,
      url: `${BASE_URL}/learn/${roadmap.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StepView
        slug={roadmap.slug}
        roadmapTitle={roadmap.title}
        roadmapSlugLabel={roadmap.slug.replace(/-/g, " ").toUpperCase()}
        phase={phase}
        step={step}
        resources={resources}
        noteHtmlById={noteHtmlById}
        previous={toLink(index > 0 ? flat[index - 1] : undefined)}
        next={toLink(index < flat.length - 1 ? flat[index + 1] : undefined)}
      />
    </>
  );
}
