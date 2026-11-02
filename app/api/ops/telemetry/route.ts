import { NextRequest, NextResponse } from "next/server";
import { verifyOpsSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface ServiceCheck {
  name: string;
  role: string;
  url: string;
  status: "operational" | "degraded" | "down";
  latencyMs: number;
  httpStatus: number | null;
  error?: string;
}

async function pingUrl(name: string, role: string, url: string): Promise<ServiceCheck> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "JoyOpsSentinel/1.0 (+https://joychandrauday.vercel.app)",
      },
    });

    clearTimeout(timeout);
    const latencyMs = Date.now() - start;

    return {
      name,
      role,
      url,
      status: res.status < 400 ? "operational" : res.status < 500 ? "degraded" : "down",
      latencyMs,
      httpStatus: res.status,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    return {
      name,
      role,
      url,
      status: "down",
      latencyMs,
      httpStatus: null,
      error: err.name === "AbortError" ? "Timeout (>6s)" : (err.message || "Unreachable"),
    };
  }
}

export async function GET(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ping services concurrently
  const targets = [
    { name: "Garirhat Production", role: "Primary Employer Platform", url: "https://garirhat.com" },
    { name: "Grow With Owl", role: "EdTech Venture (OwlPrep)", url: "https://growwithowl.com" },
    { name: "Joy Portfolio Edge", role: "Vercel Production Edge", url: "https://joychandrauday.vercel.app" },
    { name: "GitHub API Telemetry", role: "Developer Ecosystem", url: "https://api.github.com/users/joychandrauday" },
  ];

  const checks = await Promise.all(
    targets.map((t) => pingUrl(t.name, t.role, t.url))
  );

  // GitHub user profile metrics
  let githubData = null;
  try {
    const ghRes = await fetch("https://api.github.com/users/joychandrauday", {
      headers: {
        "User-Agent": "JoyOpsSentinel/1.0",
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (ghRes.ok) {
      const data = await ghRes.json();
      githubData = {
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        updated_at: data.updated_at || null,
        html_url: data.html_url || "https://github.com/joychandrauday",
      };
    }
  } catch {
    // Non-blocking fallback
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    services: checks,
    github: githubData,
    system: {
      dbEngine: "PostgreSQL (Neon) + Prisma ORM",
      aiPrimary: "Groq Qwen 3.8 27B (Sub-400ms)",
      aiFallback: "Groq GPT-OSS 120B / Gemini 3.5 Flash",
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
}