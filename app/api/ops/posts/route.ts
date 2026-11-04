import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";
import { staticPosts } from "@/lib/posts-static";

export async function GET(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  const searchParams = req.nextUrl.searchParams;
  const publicOnly = searchParams.get("public") === "true";

  if (!isAuthed && !publicOnly) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: publicOnly ? { published: true } : {},
      orderBy: publicOnly ? { publishedAt: "desc" } : { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        titleEn: true,
        titleBn: true,
        excerptEn: true,
        excerptBn: true,
        contentEn: true,
        contentBn: true,
        tags: true,
        coverImage: true,
        readingTimeMinutes: true,
        published: true,
        publishedAt: true,
        seoTitle: true,
        seoDescription: true,
        canonicalUrl: true,
        ogImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (posts.length === 0 && publicOnly) {
      return NextResponse.json(staticPosts);
    }

    return NextResponse.json(posts.map((p) => ({
      ...p,
      tags: p.tags || [],
      published: Boolean(p.published),
    })));
  } catch (err) {
    console.error("[api/ops/posts] read failed:", err);
    if (publicOnly) {
      return NextResponse.json(staticPosts, { headers: { "x-db-status": "fallback" } });
    }
    return NextResponse.json([], { headers: { "x-db-status": "offline" } });
  }
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const slug =
      body.slug ||
      body.titleEn?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
      `post-${Date.now()}`;

    const published = Boolean(body.published);

    // Determine whether this is an edit of an existing row (by id) or a new post.
    const existing = body.id
      ? await prisma.post.findUnique({ where: { id: body.id } })
      : await prisma.post.findUnique({ where: { slug } });

    const data = {
      slug,
      titleEn: body.titleEn || "Untitled Post",
      titleBn: body.titleBn || "শিরোনামহীন",
      excerptEn: body.excerptEn || "",
      excerptBn: body.excerptBn || "",
      contentEn: body.contentEn || "",
      contentBn: body.contentBn || "",
      tags: body.tags || [],
      coverImage: body.coverImage || null,
      readingTimeMinutes: Number(body.readingTimeMinutes || 3),
      published,
      publishedAt: published ? existing?.publishedAt ?? new Date() : null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      canonicalUrl: body.canonicalUrl || null,
      ogImage: body.ogImage || body.coverImage || null,
    };

    const post = existing
      ? await prisma.post.update({ where: { id: existing.id }, data })
      : await prisma.post.create({ data });

    return NextResponse.json({ success: true, slug: post.slug, id: post.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}