import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";
import { LEARN_TEMPLATE_BY_KEY } from "@/lib/learn-templates";

/**
 * Learning Flow API.
 *
 * One dispatcher, action-based (matches /api/ops/ai). All reads and writes
 * are private — personal study data never goes public.
 *
 *   GET  /api/ops/learn   -> { tracks, sessions }
 *   POST /api/ops/learn   -> { action, ...payload }
 */

const TRACK_STATUSES = new Set(["planned", "active", "paused", "done"]);
const MODULE_STATUSES = new Set(["todo", "doing", "done"]);

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function int(value: unknown, fallback: number, min = 0, max = 100000): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function dateOrNull(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) {
    return NextResponse.json({ authenticated: false, tracks: [], sessions: [] });
  }

  try {
    const [tracks, sessions] = await Promise.all([
      prisma.learningTrack.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          modules: { orderBy: [{ position: "asc" }, { createdAt: "asc" }] },
        },
      }),
      prisma.learningSession.findMany({
        orderBy: { studiedAt: "desc" },
        take: 200,
        include: {
          track: { select: { title: true, color: true } },
          module: { select: { title: true } },
        },
      }),
    ]);

    return NextResponse.json({
      tracks: tracks.map((t) => ({
        ...t,
        targetDate: t.targetDate ? t.targetDate.toISOString() : null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        modules: t.modules.map((m) => ({
          ...m,
          completedAt: m.completedAt ? m.completedAt.toISOString() : null,
          createdAt: m.createdAt.toISOString(),
          updatedAt: m.updatedAt.toISOString(),
        })),
      })),
      sessions: sessions.map((s) => ({
        id: s.id,
        trackId: s.trackId,
        moduleId: s.moduleId,
        minutes: s.minutes,
        note: s.note,
        studiedAt: s.studiedAt.toISOString(),
        trackTitle: s.track?.title ?? null,
        trackColor: s.track?.color ?? null,
        moduleTitle: s.module?.title ?? null,
      })),
    });
  } catch (err) {
    console.error("[api/ops/learn] read failed:", err);
    return NextResponse.json({ error: "Unable to read learning data" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const action = str(body.action);

  try {
    switch (action) {
      /* ── Tracks ───────────────────────────────────────────────── */
      case "create_track": {
        const title = str(body.title);
        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

        const modules = Array.isArray(body.modules) ? body.modules : [];
        const status = TRACK_STATUSES.has(str(body.status)) ? str(body.status) : "active";

        const track = await prisma.learningTrack.create({
          data: {
            title,
            domain: str(body.domain, "General") || "General",
            goal: str(body.goal),
            level: str(body.level, "beginner") || "beginner",
            status,
            color: str(body.color, "#f59e0b") || "#f59e0b",
            weeklyGoalMinutes: int(body.weeklyGoalMinutes, 300, 0, 10080),
            targetDate: dateOrNull(body.targetDate),
            sortOrder: int(body.sortOrder, 0, -1000, 1000),
            modules: {
              create: modules
                .map((m: any, i: number) => ({
                  title: str(m?.title),
                  notes: str(m?.notes),
                  estimateMinutes: int(m?.estimateMinutes, 30, 5, 1440),
                  resourceUrl: str(m?.resourceUrl) || null,
                  position: i,
                  status: "todo" as const,
                }))
                .filter((m: any) => m.title.length > 0),
            },
          },
          include: { modules: true },
        });

        return NextResponse.json({ success: true, id: track.id, modules: track.modules.length });
      }

      case "update_track": {
        const id = str(body.id);
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        const data: Record<string, unknown> = {};
        if ("title" in body) data.title = str(body.title);
        if ("domain" in body) data.domain = str(body.domain, "General") || "General";
        if ("goal" in body) data.goal = str(body.goal);
        if ("level" in body) data.level = str(body.level, "beginner") || "beginner";
        if ("status" in body && TRACK_STATUSES.has(str(body.status))) data.status = str(body.status);
        if ("color" in body) data.color = str(body.color, "#f59e0b") || "#f59e0b";
        if ("weeklyGoalMinutes" in body) data.weeklyGoalMinutes = int(body.weeklyGoalMinutes, 300, 0, 10080);
        if ("targetDate" in body) data.targetDate = dateOrNull(body.targetDate);
        if ("sortOrder" in body) data.sortOrder = int(body.sortOrder, 0, -1000, 1000);

        if (Object.keys(data).length === 0) {
          return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
        }

        await prisma.learningTrack.update({ where: { id }, data });
        return NextResponse.json({ success: true });
      }

      case "delete_track": {
        const id = str(body.id);
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        await prisma.learningTrack.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      /* ── Modules ──────────────────────────────────────────────── */
      case "add_module": {
        const trackId = str(body.trackId);
        const title = str(body.title);
        if (!trackId || !title) {
          return NextResponse.json({ error: "trackId and title are required" }, { status: 400 });
        }

        const last = await prisma.learningModule.findFirst({
          where: { trackId },
          orderBy: { position: "desc" },
          select: { position: true },
        });

        const module = await prisma.learningModule.create({
          data: {
            trackId,
            title,
            notes: str(body.notes),
            estimateMinutes: int(body.estimateMinutes, 30, 5, 1440),
            resourceUrl: str(body.resourceUrl) || null,
            position: (last?.position ?? -1) + 1,
          },
        });

        return NextResponse.json({ success: true, id: module.id });
      }

      case "update_module": {
        const id = str(body.id);
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

        const existing = await prisma.learningModule.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: "Module not found" }, { status: 404 });

        const data: Record<string, unknown> = {};
        if ("title" in body) data.title = str(body.title);
        if ("notes" in body) data.notes = str(body.notes);
        if ("resourceUrl" in body) data.resourceUrl = str(body.resourceUrl) || null;
        if ("estimateMinutes" in body) data.estimateMinutes = int(body.estimateMinutes, 30, 5, 1440);
        if ("position" in body) data.position = int(body.position, existing.position, 0, 10000);

        if ("status" in body) {
          const status = str(body.status);
          if (!MODULE_STATUSES.has(status)) {
            return NextResponse.json({ error: "Invalid module status" }, { status: 400 });
          }
          data.status = status;
          data.completedAt = status === "done" ? existing.completedAt ?? new Date() : null;
        }

        if (Object.keys(data).length === 0) {
          return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
        }

        await prisma.learningModule.update({ where: { id }, data });
        return NextResponse.json({ success: true });
      }

      case "delete_module": {
        const id = str(body.id);
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        await prisma.learningModule.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      case "reorder_module": {
        const id = str(body.id);
        const direction = str(body.direction);
        if (!id || !["up", "down"].includes(direction)) {
          return NextResponse.json({ error: "id and direction (up|down) are required" }, { status: 400 });
        }

        const current = await prisma.learningModule.findUnique({ where: { id } });
        if (!current) return NextResponse.json({ error: "Module not found" }, { status: 404 });

        const neighbour = await prisma.learningModule.findFirst({
          where: {
            trackId: current.trackId,
            position: direction === "up" ? { lt: current.position } : { gt: current.position },
          },
          orderBy: { position: direction === "up" ? "desc" : "asc" },
        });

        if (!neighbour) return NextResponse.json({ success: true, moved: false });

        await prisma.$transaction([
          prisma.learningModule.update({ where: { id: current.id }, data: { position: neighbour.position } }),
          prisma.learningModule.update({ where: { id: neighbour.id }, data: { position: current.position } }),
        ]);

        return NextResponse.json({ success: true, moved: true });
      }

      /* ── Sessions (time log) ──────────────────────────────────── */
      case "log_session": {
        const minutes = int(body.minutes, 0, 1, 1440);
        if (!minutes) return NextResponse.json({ error: "minutes must be at least 1" }, { status: 400 });

        const moduleId = str(body.moduleId) || null;
        let trackId = str(body.trackId) || null;
        let module: { id: string; trackId: string; status: string } | null = null;

        if (moduleId) {
          module = await prisma.learningModule.findUnique({
            where: { id: moduleId },
            select: { id: true, trackId: true, status: true },
          });
          if (module) trackId = module.trackId;
        }

        const studiedAt = dateOrNull(body.studiedAt) ?? new Date();

        const session = await prisma.learningSession.create({
          data: { trackId, moduleId: module?.id ?? null, minutes, note: str(body.note), studiedAt },
        });

        // Logging time on a not-started module moves it into "doing".
        if (module && module.status === "todo") {
          await prisma.learningModule.update({ where: { id: module.id }, data: { status: "doing" } });
        }

        // Optional one-tap completion from the session modal.
        if (module && body.markDone === true) {
          await prisma.learningModule.update({
            where: { id: module.id },
            data: { status: "done", completedAt: new Date() },
          });
        }

        return NextResponse.json({ success: true, id: session.id });
      }

      case "delete_session": {
        const id = str(body.id);
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        await prisma.learningSession.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      /* ── Templates ────────────────────────────────────────────── */
      case "apply_template": {
        const trackId = str(body.trackId);
        const templateKey = str(body.templateKey);
        const template = LEARN_TEMPLATE_BY_KEY[templateKey];

        if (!trackId || !template) {
          return NextResponse.json({ error: "trackId and a valid templateKey are required" }, { status: 400 });
        }

        const existing = await prisma.learningModule.findMany({
          where: { trackId },
          select: { title: true, position: true },
        });
        const seen = new Set(existing.map((m) => m.title.toLowerCase()));
        let position = existing.reduce((max, m) => Math.max(max, m.position), -1) + 1;

        const toCreate = template.modules
          .filter((m) => !seen.has(m.title.toLowerCase()))
          .map((m) => ({
            trackId,
            title: m.title,
            estimateMinutes: m.estimateMinutes,
            resourceUrl: m.resourceUrl ?? null,
            position: position++,
          }));

        if (toCreate.length > 0) {
          await prisma.learningModule.createMany({ data: toCreate });
        }

        return NextResponse.json({ success: true, added: toCreate.length });
      }

      /* ── Sync Roadmap Step (from /learn) ───────────────────────── */
      case "sync_roadmap_step": {
        const roadmapSlug = str(body.roadmapSlug);
        const roadmapTitle = str(body.roadmapTitle, roadmapSlug || "Roadmap");
        const stepSlug = str(body.stepSlug);
        const stepTitle = str(body.stepTitle, stepSlug);
        const status = MODULE_STATUSES.has(body.status) ? (body.status as "todo" | "doing" | "done") : "todo";
        const estimateMinutes = int(body.estimateMinutes, 30);
        const resourceUrl = body.resourceUrl ? str(body.resourceUrl) : null;

        if (!roadmapSlug || !stepSlug) {
          return NextResponse.json({ error: "roadmapSlug and stepSlug are required" }, { status: 400 });
        }

        // Find or create track
        let track = await prisma.learningTrack.findFirst({
          where: {
            OR: [
              { title: { equals: roadmapTitle, mode: "insensitive" } },
              { goal: { contains: roadmapSlug, mode: "insensitive" } },
            ],
          },
        });

        if (!track) {
          track = await prisma.learningTrack.create({
            data: {
              title: roadmapTitle,
              domain: "Roadmap",
              goal: `Roadmap track: ${roadmapSlug}`,
              level: "intermediate",
              status: "active",
              color: "#FFB44B",
              weeklyGoalMinutes: 300,
            },
          });
        }

        // Find or create module for this step
        let moduleItem = await prisma.learningModule.findFirst({
          where: {
            trackId: track.id,
            OR: [
              { title: { equals: stepTitle, mode: "insensitive" } },
              { notes: { contains: stepSlug, mode: "insensitive" } },
            ],
          },
        });

        const completedAt = status === "done" ? new Date() : null;

        if (moduleItem) {
          moduleItem = await prisma.learningModule.update({
            where: { id: moduleItem.id },
            data: {
              status,
              completedAt,
              notes: moduleItem.notes || `Step: ${stepSlug}`,
            },
          });
        } else {
          const maxPos = await prisma.learningModule.aggregate({
            where: { trackId: track.id },
            _max: { position: true },
          });
          const nextPos = (maxPos._max.position ?? -1) + 1;

          moduleItem = await prisma.learningModule.create({
            data: {
              trackId: track.id,
              title: stepTitle,
              status,
              estimateMinutes,
              resourceUrl,
              position: nextPos,
              completedAt,
              notes: `Step: ${stepSlug}`,
            },
          });
        }

        return NextResponse.json({
          success: true,
          trackId: track.id,
          moduleId: moduleItem.id,
          status: moduleItem.status,
          completedAt: moduleItem.completedAt,
        });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action || "(none)"}` }, { status: 400 });
    }
  } catch (err: any) {
    console.error(`[api/ops/learn] ${action} failed:`, err);
    return NextResponse.json({ error: err?.message || "Operation failed" }, { status: 500 });
  }
}
