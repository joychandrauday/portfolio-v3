import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        summaryEn: true,
        summaryBn: true,
        contentEn: true,
        contentBn: true,
        category: true,
        techStack: true,
        liveUrl: true,
        repoUrl: true,
        featured: true,
        sortOrder: true,
        createdAt: true,
      },
    });

    return NextResponse.json(projects.map((p) => ({
      ...p,
      techStack: p.techStack || [],
      featured: Boolean(p.featured),
    })));
  } catch (err) {
    console.error("[api/ops/projects] read failed:", err);
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
      body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
      `proj-${Date.now()}`;

    const project = await prisma.project.upsert({
      where: { slug },
      update: {
        title: body.title,
        summaryEn: body.summaryEn || "",
        summaryBn: body.summaryBn || "",
        contentEn: body.contentEn || "",
        contentBn: body.contentBn || "",
        category: body.category || "Full Stack",
        techStack: body.techStack || [],
        liveUrl: body.liveUrl || null,
        repoUrl: body.repoUrl || null,
        featured: Boolean(body.featured),
        sortOrder: Number(body.sortOrder || 0),
      },
      create: {
        slug,
        title: body.title,
        summaryEn: body.summaryEn || "",
        summaryBn: body.summaryBn || "",
        contentEn: body.contentEn || "",
        contentBn: body.contentBn || "",
        category: body.category || "Full Stack",
        techStack: body.techStack || [],
        liveUrl: body.liveUrl || null,
        repoUrl: body.repoUrl || null,
        featured: Boolean(body.featured),
        sortOrder: Number(body.sortOrder || 0),
      },
    });

    return NextResponse.json({ success: true, id: project.id, slug: project.slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Project ID is required" }, { status: 400 });

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}