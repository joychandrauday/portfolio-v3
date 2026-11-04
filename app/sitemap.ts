import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { staticPosts } from "@/lib/posts-static";
import { getAllRoadmaps, getRoadmapBySlug } from "@/lib/roadmaps-data";

function learnRoutes(baseUrl: string): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [];

  for (const summary of getAllRoadmaps()) {
    const roadmap = getRoadmapBySlug(summary.slug);
    if (!roadmap) continue;

    routes.push({
      url: `${baseUrl}/learn/${roadmap.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    for (const phase of roadmap.phases) {
      routes.push({
        url: `${baseUrl}/learn/${roadmap.slug}/${phase.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });

      for (const step of phase.steps) {
        routes.push({
          url: `${baseUrl}/learn/${roadmap.slug}/${phase.slug}/${step.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://joychandrauday.vercel.app";

  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Sitemap post fetch error", err);
  }

  // Keep published essays discoverable even when the database is unavailable.
  if (blogRoutes.length === 0) {
    blogRoutes = staticPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/feed`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/documents`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...learnRoutes(baseUrl), ...blogRoutes];
}
