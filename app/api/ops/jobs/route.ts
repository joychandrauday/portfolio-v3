import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";

// ── helpers ───────────────────────────────────────────────────────────
function toDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function toInt(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function toArray(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((v) => v.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

/** Fields a client may write. Kept in one place so create/update stay in sync. */
function buildJobData(body: any) {
  return {
    company: body.company !== undefined ? String(body.company).trim() : undefined,
    role: body.role !== undefined ? String(body.role).trim() : undefined,
    status: body.status !== undefined ? String(body.status) : undefined,
    location: body.location !== undefined ? String(body.location || "Remote") : undefined,
    salaryRange: body.salaryRange !== undefined ? body.salaryRange || null : undefined,
    jobUrl: body.jobUrl !== undefined ? body.jobUrl || null : undefined,
    jobDescription: body.jobDescription !== undefined ? body.jobDescription || null : undefined,
    contactName: body.contactName !== undefined ? body.contactName || null : undefined,
    contactEmail: body.contactEmail !== undefined ? body.contactEmail || null : undefined,
    coverLetter: body.coverLetter !== undefined ? body.coverLetter || null : undefined,
    notes: body.notes !== undefined ? body.notes || null : undefined,
    matchScore: toInt(body.matchScore),
    appliedAt: toDate(body.appliedAt),
    followUpAt: toDate(body.followUpAt),

    sourcePortal: body.sourcePortal !== undefined ? body.sourcePortal || null : undefined,
    sourceUrl: body.sourceUrl !== undefined ? body.sourceUrl || null : undefined,

    companyWebsite: body.companyWebsite !== undefined ? body.companyWebsite || null : undefined,
    careerPageUrl: body.careerPageUrl !== undefined ? body.careerPageUrl || null : undefined,
    companyIndustry: body.companyIndustry !== undefined ? body.companyIndustry || null : undefined,
    companySize: body.companySize !== undefined ? body.companySize || null : undefined,

    employmentType: body.employmentType !== undefined ? body.employmentType || null : undefined,
    workMode: body.workMode !== undefined ? body.workMode || null : undefined,
    seniority: body.seniority !== undefined ? body.seniority || null : undefined,
    department: body.department !== undefined ? body.department || null : undefined,
    techStack: toArray(body.techStack),
    requirements: toArray(body.requirements),
    responsibilities: toArray(body.responsibilities),
    benefits: toArray(body.benefits),
    tags: toArray(body.tags),

    salaryMin: toInt(body.salaryMin),
    salaryMax: toInt(body.salaryMax),
    salaryCurrency: body.salaryCurrency !== undefined ? body.salaryCurrency || null : undefined,
    salaryPeriod: body.salaryPeriod !== undefined ? body.salaryPeriod || null : undefined,

    contactRole: body.contactRole !== undefined ? body.contactRole || null : undefined,
    contactLinkedIn: body.contactLinkedIn !== undefined ? body.contactLinkedIn || null : undefined,
    priority: body.priority !== undefined ? String(body.priority || "medium") : undefined,
    aiSummary: body.aiSummary !== undefined ? body.aiSummary || null : undefined,
    matchReasons: toArray(body.matchReasons),
    gaps: toArray(body.gaps),

    postedAt: toDate(body.postedAt),
    deadline: toDate(body.deadline),
    lastContactedAt: toDate(body.lastContactedAt),
    nextActionAt: toDate(body.nextActionAt),
  };
}

/** Strip undefined keys so Prisma does not overwrite with nulls. */
function compact<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

/** Auto-create/refresh the company record so salary & career-page search works. */
async function upsertCompanyForJob(body: any): Promise<string | undefined> {
  const name = String(body.company || "").trim();
  if (!name) return undefined;

  const companyFields = {
    website: body.companyWebsite || null,
    careerPageUrl: body.careerPageUrl || null,
    industry: body.companyIndustry || null,
    companySize: body.companySize || null,
  };

  // Only send defined values on update so a sparse job save can't blank the KB.
  const update: Record<string, any> = {};
  for (const [k, v] of Object.entries(companyFields)) if (v) update[k] = v;

  const company = await prisma.company.upsert({
    where: { name },
    update,
    create: { name, ...companyFields },
  });

  return company.id;
}

// ── GET (list with search / filter / sort) ────────────────────────────
export async function GET(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const params = req.nextUrl.searchParams;
    const q = (params.get("q") || "").trim();
    const status = params.get("status") || "";
    const portal = params.get("portal") || "";
    const workMode = params.get("workMode") || "";
    const priority = params.get("priority") || "";
    const minSalary = Number(params.get("minSalary") || 0);
    const sort = params.get("sort") || "updated";

    const where: any = {};
    if (status && status !== "all") where.status = status;
    if (portal && portal !== "all") where.sourcePortal = { contains: portal, mode: "insensitive" };
    if (workMode && workMode !== "all") where.workMode = { contains: workMode, mode: "insensitive" };
    if (priority && priority !== "all") where.priority = priority;
    if (minSalary > 0) where.salaryMax = { gte: minSalary };

    if (q) {
      where.OR = [
        { company: { contains: q, mode: "insensitive" } },
        { role: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { sourcePortal: { contains: q, mode: "insensitive" } },
        { aiSummary: { contains: q, mode: "insensitive" } },
        { notes: { contains: q, mode: "insensitive" } },
        { techStack: { has: q } },
        { tags: { has: q } },
        { requirements: { has: q } },
      ];
    }

    const orderBy: any[] =
      sort === "salary"
        ? [{ salaryMax: "desc" }, { salaryMin: "desc" }, { updatedAt: "desc" }]
        : sort === "match"
          ? [{ matchScore: "desc" }, { updatedAt: "desc" }]
          : sort === "deadline"
            ? [{ deadline: "asc" }, { updatedAt: "desc" }]
            : [{ updatedAt: "desc" }];

    const jobs = await prisma.jobApplication.findMany({
      where,
      orderBy,
      include: { companyRef: true },
    });

    return NextResponse.json(jobs);
  } catch (err) {
    console.error("[api/ops/jobs] read failed:", err);
    return NextResponse.json([], { headers: { "x-db-status": "offline" } });
  }
}

// ── POST (create or update a full record) ─────────────────────────────
export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.company || !body.role) {
      return NextResponse.json({ error: "Company and role are required" }, { status: 400 });
    }

    const companyId = await upsertCompanyForJob(body);
    const data = compact({ ...buildJobData(body), companyId });

    if (body.id) {
      const job = await prisma.jobApplication.update({ where: { id: body.id }, data });
      return NextResponse.json({ success: true, id: job.id, job });
    }

    const job = await prisma.jobApplication.create({ data: data as any });
    return NextResponse.json({ success: true, id: job.id, job });
  } catch (err: any) {
    console.error("[api/ops/jobs] write failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── PATCH (partial update, inline edits) ──────────────────────────────
export async function PATCH(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

    const data: any = compact(buildJobData(body));

    // Stage transitions carry timeline side-effects.
    if (body.status === "applied") {
      const existing = await prisma.jobApplication.findUnique({ where: { id } });
      if (!existing?.appliedAt) data.appliedAt = new Date();
      data.lastContactedAt = new Date();
      if (!existing?.nextActionAt) {
        const next = new Date();
        next.setDate(next.getDate() + 5);
        data.nextActionAt = next;
        data.followUpAt = next;
      }
    }

    await prisma.jobApplication.update({ where: { id }, data });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[api/ops/jobs] patch failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── DELETE ────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

    await prisma.jobApplication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
