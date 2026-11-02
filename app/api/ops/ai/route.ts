import { NextRequest, NextResponse } from "next/server";
import { verifyOpsSession } from "@/lib/auth";
import {
  runAICompletion,
  translateBilingual,
  generateCoverLetter,
  analyzeJobPosting,
  parseJobPosting,
  generateApplicationEmail,
  generateFollowUpEmail,
  generateInterviewPrep,
  syndicatePost,
  ingestResearch,
} from "@/lib/ai";

export async function POST(req: NextRequest) {
  const isAuthed = await verifyOpsSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, provider = "auto" } = body;

    if (action === "translate") {
      const { text, targetLang } = body;
      if (!text) {
        return NextResponse.json({ error: "Text is required" }, { status: 400 });
      }
      const translation = await translateBilingual({ text, targetLang: targetLang || "bn" });
      return NextResponse.json({ result: translation });
    }

    if (action === "cover_letter") {
      const { company, role, jobDescription, notes } = body;
      const letter = await generateCoverLetter({ company, role, jobDescription, notes });
      return NextResponse.json({ result: letter });
    }

    if (action === "analyze_job") {
      const { jobDescription } = body;
      const analysis = await analyzeJobPosting({ jobDescription });
      return NextResponse.json({ result: analysis });
    }

    if (action === "parse_jd") {
      const { jobDescription, sourceUrl } = body;
      if (!jobDescription) {
        return NextResponse.json({ error: "Job description is required" }, { status: 400 });
      }
      const parsed = await parseJobPosting({ jobDescription, sourceUrl });
      return NextResponse.json({
        ...parsed,
        // Legacy aliases kept so older clients keep working
        salary_range: parsed.salaryRaw || "Undisclosed",
        match_score: parsed.matchScore,
        key_requirements: parsed.requirements,
        rationale: parsed.aiSummary,
      });
    }

    if (action === "application_email") {
      const { company, role, contactName, contactRole, jobDescription, matchReasons, techStack, tone, extraInstructions } = body;
      if (!company || !role) {
        return NextResponse.json({ error: "Company and role are required" }, { status: 400 });
      }
      const email = await generateApplicationEmail({
        company,
        role,
        contactName,
        contactRole,
        jobDescription,
        matchReasons,
        techStack,
        tone,
        extraInstructions,
      });
      return NextResponse.json(email);
    }

    if (action === "follow_up") {
      const { company, role, daysApplied = 4, contactName } = body;
      const email = await generateFollowUpEmail({ company, role, daysApplied, contactName });
      return NextResponse.json({ result: email });
    }

    if (action === "interview_prep") {
      const { company, role, jobDescription } = body;
      const prep = await generateInterviewPrep({ company, role, jobDescription });
      return NextResponse.json({ result: prep });
    }

    if (action === "syndicate") {
      const { title, content, platform = "linkedin" } = body;
      if (!title || !content) {
        return NextResponse.json({ error: "Title and content required" }, { status: 400 });
      }
      const syndicated = await syndicatePost({ title, content, platform });
      return NextResponse.json({ result: syndicated });
    }

    if (action === "ingest_research") {
      const { input } = body;
      if (!input) {
        return NextResponse.json({ error: "Input text or link required" }, { status: 400 });
      }
      const data = await ingestResearch({ input });
      return NextResponse.json(data);
    }

    if (action === "completion") {
      const { prompt, systemPrompt } = body;
      const start = Date.now();
      const res = await runAICompletion({ prompt, systemPrompt, provider });
      const latencyMs = Date.now() - start;
      return NextResponse.json({
        result: res.text,
        provider: res.providerUsed,
        latencyMs,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI execution failure" }, { status: 500 });
  }
}
