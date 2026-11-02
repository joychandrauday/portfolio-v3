import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/ops/companies
 * Company knowledge base with salary + pipeline aggregates so Joy can search
 * for "which companies pay best / where did I already apply".
 *
 * Query: ?q=<text>&sort=salary|jobs|updated
 */
export async function GET(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const params = req.nextUrl.searchParams;
    const q = (params.get("q") || "").trim();
    const sort = params.get("sort") || "salary";

    const companies = await prisma.company.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { industry: { contains: q, mode: "insensitive" } },
              { notes: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        jobs: {
          select: {
            id: true,
            role: true,
            status: true,
            salaryMin: true,
            salaryMax: true,
            salaryCurrency: true,
            matchScore: true,
            sourcePortal: true,
            appliedAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const enriched = companies.map((c) => {
      const withSalary = c.jobs.filter((j) => typeof j.salaryMax === "number");
      const topSalary = withSalary.length
        ? Math.max(...withSalary.map((j) => j.salaryMax as number))
        : null;
      const avgSalary = withSalary.length
        ? Math.round(
            withSalary.reduce((sum, j) => sum + ((j.salaryMax as number) || 0), 0) / withSalary.length
          )
        : null;

      const currencies = Array.from(
        new Set(withSalary.map((j) => j.salaryCurrency).filter(Boolean))
      ) as string[];

      const portals = Array.from(new Set(c.jobs.map((j) => j.sourcePortal).filter(Boolean)));

      const bestMatch = c.jobs.reduce<number | null>(
        (best, j) => (typeof j.matchScore === "number" && (best === null || j.matchScore > best) ? j.matchScore : best),
        null
      );

      const lastActivity = c.jobs.reduce<Date | null>((latest, j) => {
        const d = j.updatedAt ? new Date(j.updatedAt) : null;
        if (!d) return latest;
        return !latest || d > latest ? d : latest;
      }, null);

      return {
        id: c.id,
        name: c.name,
        website: c.website,
        careerPageUrl: c.careerPageUrl,
        industry: c.industry,
        companySize: c.companySize,
        notes: c.notes,
        jobCount: c.jobs.length,
        appliedCount: c.jobs.filter((j) => j.appliedAt || j.status !== "wishlist").length,
        topSalary,
        avgSalary,
        currency: currencies[0] || "USD",
        portals,
        bestMatch,
        lastActivity: lastActivity ? lastActivity.toISOString() : null,
        roles: c.jobs.map((j) => j.role),
      };
    });

    enriched.sort((a, b) => {
      if (sort === "jobs") return b.jobCount - a.jobCount;
      if (sort === "updated") {
        const at = a.lastActivity ? Date.parse(a.lastActivity) : 0;
        const bt = b.lastActivity ? Date.parse(b.lastActivity) : 0;
        return bt - at;
      }
      // salary (default): companies without a disclosed salary sink to the bottom
      return (b.topSalary ?? -1) - (a.topSalary ?? -1);
    });

    const totalCompanies = enriched.length;
    const withSalary = enriched.filter((c) => c.topSalary !== null).length;

    return NextResponse.json({
      companies: enriched,
      summary: {
        totalCompanies,
        withSalaryData: withSalary,
        totalApplications: enriched.reduce((sum, c) => sum + c.jobCount, 0),
      },
    });
  } catch (err) {
    console.error("[api/ops/companies] read failed:", err);
    return NextResponse.json({ companies: [], summary: null }, { headers: { "x-db-status": "offline" } });
  }
}
