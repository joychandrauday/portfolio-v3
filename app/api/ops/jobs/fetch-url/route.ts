import { NextRequest, NextResponse } from "next/server";
import { verifyOpsSession } from "@/lib/auth";
import { htmlToText, detectPortal, originOf } from "@/lib/jobImport";

export const dynamic = "force-dynamic";

/**
 * POST /api/ops/jobs/fetch-url
 * Fetches a job posting server-side and returns clean text ready for AI extraction.
 */
export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { url } = await req.json();
    if (!url || !/^https?:\/\//i.test(String(url))) {
      return NextResponse.json({ error: "A valid http(s) URL is required" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let res: Response;
    try {
      res = await fetch(String(url), {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Source returned ${res.status}. Paste the description manually instead.` },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text();

    const text = contentType.includes("html") ? htmlToText(raw) : raw.trim();

    if (text.length < 80) {
      return NextResponse.json(
        {
          error:
            "The page returned almost no readable text (likely JavaScript-rendered). Paste the description manually.",
        },
        { status: 422 }
      );
    }

    const origin = originOf(String(url));

    return NextResponse.json({
      success: true,
      url: String(url),
      sourcePortal: detectPortal(String(url)),
      companyWebsite: origin,
      careerPageUrl: origin ? `${origin}/careers` : "",
      text: text.slice(0, 20000),
      characters: text.length,
    });
  } catch (err: any) {
    const message =
      err?.name === "AbortError"
        ? "The source took too long to respond. Paste the description manually."
        : err?.message || "Failed to fetch the job posting";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
