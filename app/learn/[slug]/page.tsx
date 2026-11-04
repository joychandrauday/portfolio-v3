import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoadmapView } from "@/components/learn/RoadmapView";
import { getAllRoadmaps, getRoadmapBySlug } from "@/lib/roadmaps-data";
import { getRoadmapResources } from "@/lib/learn-resources";

export const revalidate = 300;

const BASE_URL = "https://joychandrauday.vercel.app";

export function generateStaticParams() {
  return getAllRoadmaps().map((roadmap) => ({ slug: roadmap.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const roadmap = getRoadmapBySlug(params.slug);
  if (!roadmap) return { title: "Roadmap not found" };

  const title = `${roadmap.title.en} Roadmap`;
  const description = roadmap.description.en;
  const url = `${BASE_URL}/learn/${roadmap.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Joy Chandra Uday",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RoadmapDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const roadmap = getRoadmapBySlug(params.slug);
  if (!roadmap) notFound();

  const resources = await getRoadmapResources(roadmap.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: roadmap.title.en,
    description: roadmap.description.en,
    url: `${BASE_URL}/learn/${roadmap.slug}`,
    educationalLevel: roadmap.difficulty,
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
    teaches: roadmap.phases.map((phase) => phase.title),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RoadmapView roadmap={roadmap} resources={resources} slug={roadmap.slug} />
    </>
  );
}
