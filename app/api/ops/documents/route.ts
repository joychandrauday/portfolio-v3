import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";

/**
 * GET /api/ops/documents
 * Supports ?public=true for visitors to see only public docs
 */
export async function GET(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  const searchParams = req.nextUrl.searchParams;
  const isPublicOnly = searchParams.get("public") === "true";

  if (!isAuthed && !isPublicOnly) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [folders, documents] = await Promise.all([
      prisma.documentFolder.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.document.findMany({
        where: isPublicOnly ? { isPublic: true } : {},
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        include: {
          folder: {
            select: { id: true, name: true, slug: true, icon: true, color: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      folders,
      documents,
      count: documents.length,
    });
  } catch (err: any) {
    console.error("[api/ops/documents] read error:", err);
    return NextResponse.json({ error: "Failed to fetch documents", folders: [], documents: [] }, { status: 500 });
  }
}

/**
 * POST /api/ops/documents
 * Dispatcher for document and folder management
 */
export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action || "create_document";

  try {
    switch (action) {
      /* ── Folder Actions ────────────────────────────────────────── */
      case "create_folder": {
        const name = (body.name || "").trim();
        if (!name) return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const folder = await prisma.documentFolder.create({
          data: {
            name,
            slug: slug || `folder-${Date.now()}`,
            icon: body.icon || "folder",
            color: body.color || "#FFB44B",
            description: body.description || null,
            sortOrder: Number(body.sortOrder || 0),
          },
        });
        return NextResponse.json({ success: true, folder });
      }

      case "update_folder": {
        const id = body.id;
        if (!id) return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });

        const folder = await prisma.documentFolder.update({
          where: { id },
          data: {
            name: body.name ? body.name.trim() : undefined,
            icon: body.icon || undefined,
            color: body.color || undefined,
            description: body.description !== undefined ? body.description : undefined,
            sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
          },
        });
        return NextResponse.json({ success: true, folder });
      }

      case "delete_folder": {
        const id = body.id;
        if (!id) return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
        await prisma.documentFolder.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      /* ── Document Actions ──────────────────────────────────────── */
      case "create_document": {
        const title = (body.title || "").trim();
        if (!title) return NextResponse.json({ error: "Document title is required" }, { status: 400 });

        const document = await prisma.document.create({
          data: {
            title,
            description: body.description || null,
            folderId: body.folderId || null,
            fileType: body.fileType || "pdf",
            fileUrl: body.fileUrl || null,
            fileSize: body.fileSize || null,
            content: body.content || null,
            tags: Array.isArray(body.tags) ? body.tags : [],
            isPublic: Boolean(body.isPublic ?? true),
            pinned: Boolean(body.pinned ?? false),
            issuedAt: body.issuedAt ? new Date(body.issuedAt) : null,
          },
          include: { folder: true },
        });
        return NextResponse.json({ success: true, document });
      }

      case "update_document": {
        const id = body.id;
        if (!id) return NextResponse.json({ error: "Document ID is required" }, { status: 400 });

        const document = await prisma.document.update({
          where: { id },
          data: {
            title: body.title ? body.title.trim() : undefined,
            description: body.description !== undefined ? body.description : undefined,
            folderId: body.folderId !== undefined ? body.folderId : undefined,
            fileType: body.fileType || undefined,
            fileUrl: body.fileUrl !== undefined ? body.fileUrl : undefined,
            fileSize: body.fileSize !== undefined ? body.fileSize : undefined,
            content: body.content !== undefined ? body.content : undefined,
            tags: Array.isArray(body.tags) ? body.tags : undefined,
            isPublic: body.isPublic !== undefined ? Boolean(body.isPublic) : undefined,
            pinned: body.pinned !== undefined ? Boolean(body.pinned) : undefined,
            issuedAt: body.issuedAt !== undefined ? (body.issuedAt ? new Date(body.issuedAt) : null) : undefined,
          },
          include: { folder: true },
        });
        return NextResponse.json({ success: true, document });
      }

      case "delete_document": {
        const id = body.id;
        if (!id) return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
        await prisma.document.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    console.error(`[api/ops/documents] error handling ${action}:`, err);
    return NextResponse.json({ error: err.message || "Operation failed" }, { status: 500 });
  }
}
