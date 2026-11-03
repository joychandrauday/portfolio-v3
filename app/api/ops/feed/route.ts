import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOpsSession } from "@/lib/auth";

const DEFAULT_INSIGHTS = [
  {
    slug: "linux-find-exec-power-pattern",
    title: "5x Faster File Batching in Linux with find ... + instead of \\;",
    topic: "linux",
    category: "TERMINAL HACK",
    summary: "Why find -exec cmd {} \\; spawns a new process per file, and how + groups arguments.",
    content: "When running `find . -name '*.log' -exec rm {} \\;`, Linux forks and executes `rm` for every single file found. On 10,000 files, that is 10,000 process forks. By changing `\\;` to `+`, Linux passes as many filenames as possible in a single argv invocation, reducing execution time from 15 seconds to under 200ms.",
    codeSnippet: "# Slow: 1 process fork per file\nfind /var/log -name '*.gz' -exec rm {} \\;\n\n# Fast (POSIX): batches up to ARG_MAX in one fork\nfind /var/log -name '*.gz' -exec rm {} +",
    commandSnippet: "find . -type f -name '*.log' -exec rm {} +",
    bgTheme: "obsidian-terminal",
    tags: ["linux", "bash", "performance"],
    likesCount: 42,
  },
  {
    slug: "ai-llm-structured-outputs-json-schema",
    title: "Stop Regex Parsing: Guarantee 100% Type-Safe LLM Extraction",
    topic: "ai",
    category: "LLM ARCHITECTURE",
    summary: "Constrained decoding beats prompt engineering for reliable production pipelines.",
    content: "Prompting an LLM with 'return only valid JSON' fails under load because temperature causes random markdown wraps. Using Constrained Decoding (Grammar Masking / OpenAI response_format / Gemini schema) guarantees the model's token distribution only emits tokens that conform to your exact AST schema at the inference engine level.",
    codeSnippet: "const response = await ai.generateContent({\n  contents: [{ role: 'user', parts: [{ text: userDoc }] }],\n  generationConfig: {\n    responseMimeType: 'application/json',\n    responseSchema: documentSchema,\n  },\n});",
    commandSnippet: "response_mime_type='application/json'",
    bgTheme: "cyber-mesh",
    tags: ["ai", "llm", "structured-outputs", "typesafe"],
    likesCount: 68,
  },
  {
    slug: "money-rule-of-72-and-tech-equity",
    title: "The Rule of 72 & The Hidden Math of Engineer Comp",
    topic: "money",
    category: "WEALTH PRINCIPLE",
    summary: "How compound return doubling times change how you evaluate startup equity vs cash.",
    content: "Divide 72 by your annual expected return percentage to find how many years it takes to double your money. At 10% market return, capital doubles every 7.2 years ($100k becomes $400k in 14.4 years without adding a dime). When evaluating startup equity with a 4-year cliff and 90% failure rate, discount unvested illiquid shares against guaranteed liquid compounding.",
    codeSnippet: "// Doubling Time (Years) ≈ 72 / Annual_Return_Rate\n// 8% return  -> 72 / 8  = 9 years per 2x\n// 12% return -> 72 / 12 = 6 years per 2x\n// $50k invested at age 24 @ 10% -> $800k at age 52",
    commandSnippet: "YearsToDouble = 72 / ExpectedAnnualYield",
    bgTheme: "amber-vintage",
    tags: ["money", "equity", "investing", "career"],
    likesCount: 89,
  },
  {
    slug: "postgres-index-cardinality-select-for-update",
    title: "Why SELECT ... FOR UPDATE Without an Index Causes Table Locks",
    topic: "system-design",
    category: "DATABASE INTERNALS",
    summary: "PostgreSQL row-level locks escalate to full sequential scan locks if the WHERE clause is unindexed.",
    content: "When you run `SELECT ... FOR UPDATE WHERE account_id = $1`, PostgreSQL intends to take an exclusive lock on just that row. However, if `account_id` lacks a B-tree index, Postgres must perform a sequential scan, examining every tuple in the table and locking tuples along the scan path. Always verify your lock predicates have an index to avoid catastrophic lock escalation.",
    codeSnippet: "-- Without index: scans whole table and blocks concurrent writers\nSELECT balance FROM accounts WHERE user_uuid = $1 FOR UPDATE;\n\n-- Fix: create the covering index\nCREATE INDEX idx_accounts_user_uuid ON accounts (user_uuid);",
    commandSnippet: "EXPLAIN ANALYZE SELECT * FROM ledger FOR UPDATE;",
    bgTheme: "emerald-matrix",
    tags: ["postgres", "concurrency", "distributed-systems", "database"],
    likesCount: 57,
  },
  {
    slug: "dev-hacks-git-worktree-multitasking",
    title: "Kill Stash Hell: Work on Multiple Branches at Once with Git Worktree",
    topic: "dev-hacks",
    category: "DEV HACKS",
    summary: "Never run git stash again when an urgent hotfix interrupts feature work.",
    content: "`git worktree` lets you check out multiple branches of the same repository into separate directories simultaneously. You can run `npm run dev` in your feature branch while debugging a production hotfix in a second folder, sharing the exact same underlying `.git` objects with zero duplicated disk space.",
    codeSnippet: "# Create an isolated directory for the hotfix branch\ngit worktree add ../hotfix-auth-bug hotfix/auth-patch\n\n# Work there freely, then clean up when merged:\ngit worktree remove ../hotfix-auth-bug",
    commandSnippet: "git worktree add ../hotfix-branch main",
    bgTheme: "indigo-nebula",
    tags: ["git", "productivity", "dev-hacks", "cli"],
    likesCount: 94,
  },
  {
    slug: "security-ssh-key-ed25519-vs-rsa",
    title: "Ditch RSA 2048/4096: Why Ed25519 is the Modern Standard for SSH",
    topic: "security",
    category: "SECURITY HARDENING",
    summary: "Ed25519 is faster, collision-proof against modern attacks, and immune to side-channel timing.",
    content: "RSA keys require 4096 bits to be secure, producing bloated signatures and slow handshakes. Ed25519 uses Twisted Edwards Curve cryptography over Curve25519. At just 256 bits, it provides superior security to RSA 4096, generates smaller keys (68 characters), computes handshakes orders of magnitude faster, and is inherently immune to cache-timing attacks.",
    codeSnippet: "# Generate modern Ed25519 keypair\nssh-keygen -t ed25519 -C \"joy@production-ops\"\n\n# Modern sshd_config hardening:\nHostKey /etc/ssh/ssh_host_ed25519_key\nPubkeyAuthentication yes\nPasswordAuthentication no",
    commandSnippet: "ssh-keygen -t ed25519 -C \"user@host\"",
    bgTheme: "solar-flare",
    tags: ["security", "ssh", "cryptography", "linux"],
    likesCount: 76,
  },
];

/**
 * GET /api/ops/feed
 * Supports ?topic=... and ?public=true
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const topic = searchParams.get("topic");
  const isPublicOnly = searchParams.get("public") === "true";

  try {
    let whereClause: any = {};
    if (isPublicOnly) {
      whereClause.isPublished = true;
    }
    if (topic && topic !== "all") {
      whereClause.topic = topic;
    }

    let items = await prisma.insightItem.findMany({
      where: whereClause,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    // If database has no insights yet, seed with high-signal defaults
    if (items.length === 0 && (!topic || topic === "all")) {
      for (const item of DEFAULT_INSIGHTS) {
        await prisma.insightItem.upsert({
          where: { slug: item.slug },
          update: {},
          create: item,
        });
      }
      items = await prisma.insightItem.findMany({
        where: whereClause,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
    }

    return NextResponse.json({
      items,
      count: items.length,
    });
  } catch (err: any) {
    console.error("[api/ops/feed] GET error:", err);
    // Graceful fallback to static defaults if DB is temporarily offline
    const filtered = DEFAULT_INSIGHTS.filter((i) => !topic || topic === "all" || i.topic === topic);
    return NextResponse.json({
      items: filtered.map((f, idx) => ({ ...f, id: `static-${idx}`, createdAt: new Date().toISOString() })),
      count: filtered.length,
    });
  }
}

/**
 * POST /api/ops/feed
 * Dispatches insight actions
 */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action || "create_insight";

  // Public action: Like increment
  if (action === "like_insight") {
    const id = body.id;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    try {
      const updated = await prisma.insightItem.update({
        where: { id },
        data: { likesCount: { increment: 1 } },
        select: { id: true, likesCount: true },
      });
      return NextResponse.json({ success: true, likesCount: updated.likesCount });
    } catch {
      return NextResponse.json({ success: true, likesCount: (body.currentLikes || 0) + 1 });
    }
  }

  // Admin actions: requires ops session
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    switch (action) {
      case "create_insight": {
        const title = (body.title || "").trim();
        if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
        const slug =
          body.slug ||
          title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
          `insight-${Date.now()}`;

        const item = await prisma.insightItem.create({
          data: {
            slug,
            title,
            topic: body.topic || "dev-hacks",
            category: body.category || "ENGINEERING",
            summary: body.summary || null,
            content: body.content || "",
            codeSnippet: body.codeSnippet || null,
            commandSnippet: body.commandSnippet || null,
            bgTheme: body.bgTheme || "cyber-mesh",
            tags: Array.isArray(body.tags) ? body.tags : [],
            isPublished: Boolean(body.isPublished ?? true),
            sortOrder: Number(body.sortOrder || 0),
          },
        });
        return NextResponse.json({ success: true, item });
      }

      case "update_insight": {
        const id = body.id;
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const item = await prisma.insightItem.update({
          where: { id },
          data: {
            title: body.title ? body.title.trim() : undefined,
            topic: body.topic || undefined,
            category: body.category || undefined,
            summary: body.summary !== undefined ? body.summary : undefined,
            content: body.content !== undefined ? body.content : undefined,
            codeSnippet: body.codeSnippet !== undefined ? body.codeSnippet : undefined,
            commandSnippet: body.commandSnippet !== undefined ? body.commandSnippet : undefined,
            bgTheme: body.bgTheme || undefined,
            tags: Array.isArray(body.tags) ? body.tags : undefined,
            isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
            sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
          },
        });
        return NextResponse.json({ success: true, item });
      }

      case "delete_insight": {
        const id = body.id;
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
        await prisma.insightItem.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    console.error(`[api/ops/feed] ${action} failed:`, err);
    return NextResponse.json({ error: err.message || "Operation failed" }, { status: 500 });
  }
}
