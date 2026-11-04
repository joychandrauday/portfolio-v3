import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";
import {
  LEARN_RESOURCES_TAG,
  LEARN_RESOURCE_FORMATS,
  LEARN_RESOURCE_KINDS,
  serializeLearnResource,
} from "@/lib/learn-resources";

/**
 * Ops CRUD for phase/step wise learning materials.
 *
 *   GET  /api/ops/learn/resources?roadmap=&phase=&step=&public=true
 *   POST /api/ops/learn/resources  -> { action, ...payload }
 *
 * Files are already uploaded to Cloudinary by the browser; this endpoint only
 * stores the resulting URL and metadata.
 */

const KINDS = new Set<string>(LEARN_RESOURCE_KINDS);
const FORMATS = new Set<string>(LEARN_RESOURCE_FORMATS);

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function nullableStr(value: unknown): string | null {
  const out = str(value);
  return out.length > 0 ? out : null;
}

function int(value: unknown, fallback = 0, min = -100000, max = 100000): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function dateOrNull(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

async function uniqueSlug(
  roadmapSlug: string,
  phaseSlug: string | null,
  stepSlug: string | null,
  title: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(title) || `resource-${Date.now()}`;
  let candidate = base;
  let n = 2;

  // Bounded by the number of collisions; realistically 1–2 iterations.
  for (let i = 0; i < 50; i += 1) {
    const clash = await prisma.learnResource.findFirst({
      where: {
        roadmapSlug,
        phaseSlug,
        stepSlug,
        slug: candidate,
        ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
      },
      select: { id: true },
    });
    if (!clash) return candidate;
    candidate = `${base}-${n++}`;
  }

  return `${base}-${Date.now()}`;
}

export async function GET(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  const params = req.nextUrl.searchParams;
  const publicOnly = params.get("public") === "true";

  if (!isAuthed && !publicOnly) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where: Record<string, unknown> = {
    ...(params.get("roadmap") ? { roadmapSlug: params.get("roadmap") } : {}),
    ...(params.get("phase") ? { phaseSlug: params.get("phase") } : {}),
    ...(params.get("step") ? { stepSlug: params.get("step") } : {}),
  };

  if (publicOnly && !isAuthed) {
    where.isPublic = true;
    where.publishedAt = { not: null };
  }

  try {
    const rows = await prisma.learnResource.findMany({
      where,
      orderBy: [
        { roadmapSlug: "asc" },
        { phaseSlug: "asc" },
        { stepSlug: "asc" },
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
    });

    return NextResponse.json({
      resources: rows.map((row) =>
        serializeLearnResource(row, { includeBody: isAuthed }),
      ),
      count: rows.length,
    });
  } catch (err) {
    console.error("[api/ops/learn/resources] read failed:", err);
    return NextResponse.json(
      { error: "Unable to read learning resources", resources: [] },
      { status: 503 },
    );
  }
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const action = str(body.action);
  const kind = str(body.kind, "file");

  try {
    switch (action) {
      case "create_resource": {
        const roadmapSlug = str(body.roadmapSlug);
        const title = str(body.title);
        if (!roadmapSlug || !title) {
          return NextResponse.json(
            { error: "roadmapSlug and title are required" },
            { status: 400 },
          );
        }
        if (!KINDS.has(kind)) {
          return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
        }

        const format = kind === "note" ? str(body.format, "markdown") : null;
        if (format && !FORMATS.has(format)) {
          return NextResponse.json({ error: "Invalid format" }, { status: 400 });
        }

        const url = nullableStr(body.url);
        if (kind !== "note" && !url) {
          return NextResponse.json(
            { error: "url is required for file, link and video resources" },
            { status: 400 },
          );
        }

        const isPublic = body.isPublic === true;
        const phaseSlug = nullableStr(body.phaseSlug);
        const stepSlug = phaseSlug ? nullableStr(body.stepSlug) : null;
        const slug = await uniqueSlug(
          roadmapSlug,
          phaseSlug,
          stepSlug,
          str(body.slug) || title,
        );

        const created = await prisma.learnResource.create({
          data: {
            slug,
            roadmapSlug,
            phaseSlug,
            stepSlug,
            kind,
            format,
            title,
            titleBn: nullableStr(body.titleBn),
            summary: nullableStr(body.summary),
            summaryBn: nullableStr(body.summaryBn),
            url,
            storageKey: nullableStr(body.storageKey),
            mimeType: nullableStr(body.mimeType),
            sizeBytes:
              body.sizeBytes === null || body.sizeBytes === undefined
                ? null
                : int(body.sizeBytes, 0, 0, 2_000_000_000),
            body: kind === "note" ? str(body.body) : null,
            isPublic,
            sortOrder: int(body.sortOrder, 0),
            publishedAt: isPublic ? dateOrNull(body.publishedAt) ?? new Date() : null,
          },
        });

        revalidateTag(LEARN_RESOURCES_TAG);
        return NextResponse.json({ success: true, id: created.id, slug: created.slug });
      }

      case "update_resource": {
        const id = str(body.id);
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        const existing = await prisma.learnResource.findUnique({ where: { id } });
        if (!existing) {
          return NextResponse.json({ error: "Resource not found" }, { status: 404 });
        }

        const data: Record<string, unknown> = {};

        if ("title" in body) data.title = str(body.title);
        if ("titleBn" in body) data.titleBn = nullableStr(body.titleBn);
        if ("summary" in body) data.summary = nullableStr(body.summary);
        if ("summaryBn" in body) data.summaryBn = nullableStr(body.summaryBn);
        if ("url" in body) data.url = nullableStr(body.url);
        if ("storageKey" in body) data.storageKey = nullableStr(body.storageKey);
        if ("mimeType" in body) data.mimeType = nullableStr(body.mimeType);
        if ("sizeBytes" in body) {
          data.sizeBytes =
            body.sizeBytes === null
              ? null
              : int(body.sizeBytes, 0, 0, 2_000_000_000);
        }
        if ("sortOrder" in body) data.sortOrder = int(body.sortOrder, existing.sortOrder);
        if ("body" in body) data.body = str(body.body);

        if ("kind" in body) {
          const nextKind = str(body.kind);
          if (!KINDS.has(nextKind)) {
            return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
          }
          data.kind = nextKind;
        }

        if ("format" in body) {
          const nextFormat = str(body.format);
          if (nextFormat && !FORMATS.has(nextFormat)) {
            return NextResponse.json({ error: "Invalid format" }, { status: 400 });
          }
          data.format = nextFormat || null;
        }

        if ("isPublic" in body) {
          const isPublic = body.isPublic === true;
          data.isPublic = isPublic;
          if (!isPublic) {
            data.publishedAt = null;
          } else if (!existing.publishedAt) {
            data.publishedAt = dateOrNull(body.publishedAt) ?? new Date();
          }
        }

        // Moving a resource between phases/steps re-checks slug uniqueness.
        if ("phaseSlug" in body || "stepSlug" in body) {
          const nextPhase = "phaseSlug" in body ? nullableStr(body.phaseSlug) : existing.phaseSlug;
          const nextStep =
            "stepSlug" in body ? nullableStr(body.stepSlug) : existing.stepSlug;
          const phaseSlug = nextPhase;
          const stepSlug = phaseSlug ? nextStep : null;
          data.phaseSlug = phaseSlug;
          data.stepSlug = stepSlug;
          data.slug = await uniqueSlug(
            existing.roadmapSlug,
            phaseSlug,
            stepSlug,
            existing.slug,
            existing.id,
          );
        }

        if (Object.keys(data).length === 0) {
          return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
        }

        await prisma.learnResource.update({ where: { id }, data });
        revalidateTag(LEARN_RESOURCES_TAG);
        return NextResponse.json({ success: true });
      }

      case "delete_resource": {
        const id = str(body.id);
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        await prisma.learnResource.delete({ where: { id } });
        revalidateTag(LEARN_RESOURCES_TAG);
        return NextResponse.json({ success: true });
      }

      case "reorder_resource": {
        const id = str(body.id);
        const direction = str(body.direction);
        if (!id || !["up", "down"].includes(direction)) {
          return NextResponse.json(
            { error: "id and direction (up|down) are required" },
            { status: 400 },
          );
        }

        const current = await prisma.learnResource.findUnique({ where: { id } });
        if (!current) {
          return NextResponse.json({ error: "Resource not found" }, { status: 404 });
        }

        const siblings = await prisma.learnResource.findMany({
          where: {
            roadmapSlug: current.roadmapSlug,
            phaseSlug: current.phaseSlug,
            stepSlug: current.stepSlug,
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          select: { id: true, sortOrder: true },
        });

        const index = siblings.findIndex((s) => s.id === current.id);
        const target = direction === "up" ? index - 1 : index + 1;
        if (index === -1 || target < 0 || target >= siblings.length) {
          return NextResponse.json({ success: true, moved: false });
        }

        // Normalise the whole list so duplicate sortOrder values sort out.
        const reordered = [...siblings];
        [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

        await prisma.$transaction(
          reordered.map((item, position) =>
            prisma.learnResource.update({
              where: { id: item.id },
              data: { sortOrder: position },
            }),
          ),
        );

        revalidateTag(LEARN_RESOURCES_TAG);
        return NextResponse.json({ success: true, moved: true });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action || "(none)"}` },
          { status: 400 },
        );
    }
  } catch (err: any) {
    console.error(`[api/ops/learn/resources] ${action} failed:`, err);
    return NextResponse.json(
      { error: err?.message || "Operation failed" },
      { status: 500 },
    );
  }
}
