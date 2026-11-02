import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const publicOnly = searchParams.get("public") === "true";

  try {
    const learnings = await prisma.learning.findMany({
      where: publicOnly ? { isPublic: true } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(learnings.map((l) => ({
      ...l,
      isPublic: Boolean(l.isPublic),
      progress: l.progress !== null && l.progress !== undefined ? Number(l.progress) : null,
    })));
  } catch (err) {
    console.error("[api/ops/learnings] read failed:", err);
    return NextResponse.json([], { headers: { "x-db-status": "offline" } });
  }
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const id = body.id || `learn-${Date.now()}`;

    const learning = await prisma.learning.upsert({
      where: { id },
      update: {
        title: body.title,
        category: body.category || "Engineering",
        status: body.status || "learning",
        content: body.content || "",
        takeaways: body.takeaways || [],
        resources: body.resources || [],
        isPublic: body.isPublic,
        progress: body.progress ?? null,
      },
      create: {
        id,
        title: body.title,
        category: body.category || "Engineering",
        status: body.status || "learning",
        content: body.content || "",
        takeaways: body.takeaways || [],
        resources: body.resources || [],
        isPublic: body.isPublic,
        progress: body.progress ?? null,
      },
    });

    return NextResponse.json({ success: true, id: learning.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.learning.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}