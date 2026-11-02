import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

export interface AIProviderConfig {
  geminiKey?: string;
  groqKey?: string;
}

export async function runAICompletion({
  prompt,
  systemPrompt = "You are an intelligent executive career assistant, content editor, and bilingual software engineering translator for Joy Chandra Uday's personal Ops hub.",
  provider = "auto", // 'gemini' | 'groq' | 'auto'
}: {
  prompt: string;
  systemPrompt?: string;
  provider?: "gemini" | "groq" | "auto";
}): Promise<{ text: string; providerUsed: string }> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  // 1. Prefer Groq for ultra-fast response (~400ms) with qwen/qwen3.8-27b and openai/gpt-oss-120b
  if ((provider === "groq" || (provider === "auto" && groqKey)) && groqKey) {
    // Try primary Groq model
    try {
      const groq = new Groq({ apiKey: groqKey });
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        model: "qwen/qwen3.8-27b",
        temperature: 0.6,
      });

      const text = completion.choices[0]?.message?.content || "";
      if (text.trim()) {
        return { text, providerUsed: "Groq (Qwen 3.8 27B - Ultra Fast)" };
      }
    } catch (err: any) {
      console.warn("Groq qwen3.8-27b failed, trying fallback gpt-oss-120b:", err?.message);
      try {
        const groq = new Groq({ apiKey: groqKey });
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          model: "openai/gpt-oss-120b",
          temperature: 0.6,
        });

        const text = completion.choices[0]?.message?.content || "";
        if (text.trim()) {
          return { text, providerUsed: "Groq (GPT-OSS 120B)" };
        }
      } catch (e: any) {
        console.warn("Groq fallback also failed:", e?.message);
      }
    }
  }

  // 2. Try Gemini (gemini-3.5-flash / gemini-3.8-flash)
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel(
        {
          model: "gemini-3.5-flash",
          systemInstruction: systemPrompt,
        },
        { apiVersion: "v1beta" }
      );

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text.trim()) {
        return { text, providerUsed: "Google Gemini 3.5 Flash" };
      }
    } catch (err: any) {
      console.warn("Gemini gemini-3.5-flash failed:", err?.message);
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel(
          {
            model: "gemini-3.8-flash",
            systemInstruction: systemPrompt,
          },
          { apiVersion: "v1beta" }
        );

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text.trim()) {
          return { text, providerUsed: "Google Gemini 3.8 Flash" };
        }
      } catch (e: any) {
        console.warn("Gemini fallback failed:", e?.message);
      }
    }
  }

  // Fallback demo simulator if no API keys are configured or reachable
  return {
    providerUsed: "Local Simulation (Add GEMINI_API_KEY or GROQ_API_KEY in .env.local to activate live models)",
    text: `[AI Output Simulation]\n\nBased on your prompt: "${prompt.slice(0, 80)}..."\n\nTo unlock live high-speed generation with Groq or Google Gemini, please check your network connection or API keys.`,
  };
}

export async function translateBilingual({
  text,
  targetLang,
}: {
  text: string;
  targetLang: "en" | "bn";
}) {
  const prompt =
    targetLang === "bn"
      ? `Translate and polish the following software engineering / technical text into natural, elegant, fluent Bengali (বাংলা). Maintain technical clarity and readability:\n\n${text}`
      : `Translate and polish the following text into clear, modern, idiomatic English for a top-tier software engineer's portfolio:\n\n${text}`;

  const res = await runAICompletion({
    prompt,
    systemPrompt:
      "You are an expert bilingual technical editor fluent in English and Bengali (বাংলা). Provide only the translated text without conversational preamble.",
  });

  return res.text;
}

export async function generateCoverLetter({
  company,
  role,
  jobDescription,
  notes,
}: {
  company: string;
  role: string;
  jobDescription: string;
  notes?: string;
}) {
  const prompt = `Write a high-impact, authentic, engineering-centric cover letter in Markdown for:
Candidate: Joy Chandra Uday (Dhaka, Bangladesh · Software Engineer at garirhat.com · Founder of Grow With Owl · Author of open-source concurrency primitives).

Core Engineering Credentials to draw from:
- Garirhat.com: High-performance vehicle marketplace platform handling heavy catalog search, transaction integrity, PostgreSQL tuning, and low-latency API delivery.
- Grow With Owl: Educational technology platform and AI interactive prep system (OwlPrep/LexiLearn).
- StockFlow: Concurrency primitive engineered with row-level locks, zero race conditions under 20 concurrent workers, immutable ledger pattern.
- FlowBridge: Durable state machine with idempotent retry semantics, transactional outbox pattern, and crash-resilient queue processing.
- DocuPilot: AI document sanitization and evaluation pipeline.
- Stack: TypeScript, Next.js / React, Node.js, PostgreSQL, LibSQL, Redis, Docker, System Design.

Target Company: ${company}
Target Role: ${role}
Job Description:
${jobDescription || "Full-Stack / Backend Software Engineering position."}

Special Focus/Instructions:
${notes || "Highlight production craftsmanship, concurrency guarantees, and fast delivery."}

Tone & Rules:
- Highly professional, confident, technical, and direct.
- Avoid generic corporate clichés ("I am excited to apply", "dynamic team player").
- Focus on concrete systems engineering, reliability, and business impact.
- Structure in 3-4 punchy paragraphs with clear technical value proposition.`;

  const res = await runAICompletion({ prompt });
  return res.text;
}

// ── Comprehensive job posting extraction ─────────────────────────────
export interface ParsedJobPosting {
  company: string;
  role: string;
  location: string;
  workMode: string;
  employmentType: string;
  seniority: string;
  department: string;
  sourcePortal: string;
  sourceUrl: string;
  companyWebsite: string;
  careerPageUrl: string;
  companyIndustry: string;
  companySize: string;
  salaryRaw: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: string;
  techStack: string[];
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  tags: string[];
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactLinkedIn: string;
  postedAt: string | null;
  deadline: string | null;
  matchScore: number;
  matchReasons: string[];
  gaps: string[];
  aiSummary: string;
  priority: string;
}

const EMPTY_PARSED_JOB: ParsedJobPosting = {
  company: "",
  role: "",
  location: "Remote",
  workMode: "Unknown",
  employmentType: "Unknown",
  seniority: "Unknown",
  department: "",
  sourcePortal: "Unknown",
  sourceUrl: "",
  companyWebsite: "",
  careerPageUrl: "",
  companyIndustry: "",
  companySize: "",
  salaryRaw: "",
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: "USD",
  salaryPeriod: "year",
  techStack: [],
  requirements: [],
  responsibilities: [],
  benefits: [],
  tags: [],
  contactName: "",
  contactRole: "",
  contactEmail: "",
  contactLinkedIn: "",
  postedAt: null,
  deadline: null,
  matchScore: 78,
  matchReasons: [],
  gaps: [],
  aiSummary: "",
  priority: "medium",
};

/** Pull the first JSON object out of a model response, tolerating fences/preamble. */
export function extractJsonObject(text: string): Record<string, any> | null {
  if (!text) return null;
  const stripped = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(stripped);
  } catch {
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(stripped.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === "string" ? v.trim() : String(v ?? "").trim()))
    .filter(Boolean);
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value === "string") {
    const digits = value.replace(/[^0-9.]/g, "");
    if (!digits) return null;
    const n = Number(digits);
    return Number.isFinite(n) ? Math.round(n) : null;
  }
  return null;
}

/** Fallback salary range parsing when the model returns only a raw string. */
function parseSalaryRaw(raw: string): { min: number | null; max: number | null; currency?: string; period?: string } {
  if (!raw) return { min: null, max: null };
  const lower = raw.toLowerCase();
  const currency = /£|gbp/.test(lower)
    ? "GBP"
    : /€|eur/.test(lower)
      ? "EUR"
      : /₹|inr/.test(lower)
        ? "INR"
        : /৳|bdt|taka/.test(lower)
          ? "BDT"
          : /usd|\$/.test(lower)
            ? "USD"
            : undefined;
  const period = /hour|hr|per h/.test(lower)
    ? "hour"
    : /month|mo\b/.test(lower)
      ? "month"
      : /year|yr|annum|annual/.test(lower)
        ? "year"
        : undefined;

  const numbers = (lower.match(/\d[\d,.]*\s*k?/g) || [])
    .map((chunk) => {
      const isK = /k/.test(chunk);
      const n = Number(chunk.replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(n)) return null;
      const scaled = isK ? n * 1000 : n;
      return scaled < 1000 ? scaled * 1000 : scaled;
    })
    .filter((n): n is number => n !== null && n > 0)
    .sort((a, b) => a - b);

  return {
    min: numbers.length ? Math.round(numbers[0]) : null,
    max: numbers.length > 1 ? Math.round(numbers[numbers.length - 1]) : null,
    currency,
    period,
  };
}

export async function parseJobPosting({
  jobDescription,
  sourceUrl,
}: {
  jobDescription: string;
  sourceUrl?: string;
}): Promise<ParsedJobPosting> {
  const prompt = `You are an executive technical recruiter extracting EVERY piece of structured data from a job posting for Joy Chandra Uday (Full-Stack & Systems Software Engineer: TypeScript, Next.js, React, Node.js, PostgreSQL, Redis, Prisma, concurrency, distributed state machines).

Return ONLY raw JSON (no markdown, no backticks, no commentary) matching exactly this shape:
{
  "company": "Company name, or '' if not stated",
  "role": "Job title",
  "location": "City, Country or 'Remote'",
  "workMode": "Remote | Hybrid | Onsite | Unknown",
  "employmentType": "Full-time | Part-time | Contract | Internship | Freelance | Unknown",
  "seniority": "Intern | Junior | Mid | Senior | Lead | Principal | Unknown",
  "department": "Team/department name or ''",
  "sourcePortal": "LinkedIn | Indeed | Wellfound | Greenhouse | Lever | Workday | Ashby | Company Site | Referral | Other | Unknown",
  "sourceUrl": "URL of the job posting if present, else ''",
  "companyWebsite": "Company homepage URL if present/inferable",
  "careerPageUrl": "Company careers page URL if present or inferable from the domain (e.g. https://acme.com/careers)",
  "companyIndustry": "e.g. Fintech, Developer Tools, E-commerce",
  "companySize": "e.g. 11-50, 200-500, 1000+ employees",
  "salaryRaw": "Salary exactly as written, else ''",
  "salaryMin": 90000,
  "salaryMax": 120000,
  "salaryCurrency": "USD | EUR | GBP | INR | BDT | unknown",
  "salaryPeriod": "year | month | hour",
  "techStack": ["TypeScript", "PostgreSQL"],
  "requirements": ["Each must-have requirement as its own concise bullet"],
  "responsibilities": ["Each key responsibility as its own concise bullet"],
  "benefits": ["Each stated benefit/perk"],
  "tags": ["Short searchable tags e.g. backend, remote, senior"],
  "contactName": "Hiring manager/recruiter name if stated, else ''",
  "contactRole": "Their title if stated, else ''",
  "contactEmail": "Application/hiring email if stated, else ''",
  "contactLinkedIn": "Contact LinkedIn URL if stated, else ''",
  "postedAt": "YYYY-MM-DD or null",
  "deadline": "YYYY-MM-DD or null",
  "matchScore": 88,
  "matchReasons": ["Concrete reasons Joy is a strong fit"],
  "gaps": ["Concrete gaps or missing must-haves"],
  "aiSummary": "2-3 sentence neutral summary of the role and what the company wants",
  "priority": "high | medium | low"
}

Rules:
- salaryMin / salaryMax MUST be ANNUAL-equivalent whole numbers in the stated currency. Convert "per hour" and "per month" figures to annual before filling these fields (e.g. $50/hour -> 104000). If only one bound is known, set the other to null.
- If salary is undisclosed, use "" for salaryRaw and null for both bounds.
- Never invent a company name. Use "" when unknown.
- requirements/responsibilities/benefits: 4-10 items each, synthesized from the text, short and specific.
- matchScore reflects fit with Joy's stack above. Be honest.
- Output valid JSON only.

${sourceUrl ? `Known posting URL: ${sourceUrl}\n` : ""}Job Posting text:
${jobDescription.slice(0, 9000)}`;

  const res = await runAICompletion({
    prompt,
    systemPrompt:
      "You are an automated recruitment data extraction engine. Output strictly valid JSON with no markdown fences and no prose.",
  });

  const parsed = extractJsonObject(res.text);
  if (!parsed) {
    return {
      ...EMPTY_PARSED_JOB,
      sourceUrl: sourceUrl || "",
      aiSummary: "Could not parse the posting automatically — review the raw description.",
      requirements: ["Review the raw job description manually"],
    };
  }

  const salaryRaw = String(parsed.salaryRaw ?? parsed.salary_raw ?? parsed.salaryRange ?? "").trim();
  let salaryMin = asNumber(parsed.salaryMin ?? parsed.salary_min);
  let salaryMax = asNumber(parsed.salaryMax ?? parsed.salary_max);
  let salaryCurrency = String(parsed.salaryCurrency ?? parsed.salary_currency ?? "USD").trim() || "USD";
  let salaryPeriod = String(parsed.salaryPeriod ?? parsed.salary_period ?? "year").trim() || "year";

  if (salaryMin === null && salaryMax === null && salaryRaw) {
    const fallback = parseSalaryRaw(salaryRaw);
    salaryMin = fallback.min;
    salaryMax = fallback.max;
    if (fallback.currency) salaryCurrency = fallback.currency;
    if (fallback.period) salaryPeriod = fallback.period;
  }

  const matchScore = asNumber(parsed.matchScore ?? parsed.match_score) ?? 78;
  const priorityRaw = String(parsed.priority ?? "").toLowerCase();
  const priority =
    priorityRaw === "high" || priorityRaw === "low"
      ? priorityRaw
      : matchScore >= 85
        ? "high"
        : matchScore >= 65
          ? "medium"
          : "low";

  return {
    company: String(parsed.company ?? "").trim(),
    role: String(parsed.role ?? "").trim(),
    location: String(parsed.location ?? "Remote").trim() || "Remote",
    workMode: String(parsed.workMode ?? parsed.work_mode ?? "Unknown").trim(),
    employmentType: String(parsed.employmentType ?? parsed.employment_type ?? "Unknown").trim(),
    seniority: String(parsed.seniority ?? "Unknown").trim(),
    department: String(parsed.department ?? "").trim(),
    sourcePortal: String(parsed.sourcePortal ?? parsed.source_portal ?? "Unknown").trim(),
    sourceUrl: String(parsed.sourceUrl ?? parsed.source_url ?? sourceUrl ?? "").trim(),
    companyWebsite: String(parsed.companyWebsite ?? parsed.company_website ?? "").trim(),
    careerPageUrl: String(parsed.careerPageUrl ?? parsed.career_page_url ?? "").trim(),
    companyIndustry: String(parsed.companyIndustry ?? parsed.company_industry ?? "").trim(),
    companySize: String(parsed.companySize ?? parsed.company_size ?? "").trim(),
    salaryRaw,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryPeriod,
    techStack: asStringArray(parsed.techStack ?? parsed.tech_stack),
    requirements: asStringArray(parsed.requirements ?? parsed.key_requirements),
    responsibilities: asStringArray(parsed.responsibilities),
    benefits: asStringArray(parsed.benefits),
    tags: asStringArray(parsed.tags),
    contactName: String(parsed.contactName ?? parsed.contact_name ?? "").trim(),
    contactRole: String(parsed.contactRole ?? parsed.contact_role ?? "").trim(),
    contactEmail: String(parsed.contactEmail ?? parsed.contact_email ?? "").trim(),
    contactLinkedIn: String(parsed.contactLinkedIn ?? parsed.contact_linkedin ?? "").trim(),
    postedAt: parsed.postedAt ?? parsed.posted_at ?? null,
    deadline: parsed.deadline ?? null,
    matchScore: Math.max(0, Math.min(100, Math.round(matchScore))),
    matchReasons: asStringArray(parsed.matchReasons ?? parsed.match_reasons),
    gaps: asStringArray(parsed.gaps),
    aiSummary: String(parsed.aiSummary ?? parsed.ai_summary ?? parsed.rationale ?? "").trim(),
    priority,
  };
}

// ── Application email generation ─────────────────────────────────────
export async function generateApplicationEmail({
  company,
  role,
  contactName,
  contactRole,
  jobDescription,
  matchReasons,
  techStack,
  tone = "professional",
  extraInstructions,
}: {
  company: string;
  role: string;
  contactName?: string;
  contactRole?: string;
  jobDescription?: string;
  matchReasons?: string[];
  techStack?: string[];
  tone?: "professional" | "warm" | "concise";
  extraInstructions?: string;
}): Promise<{ subject: string; body: string }> {
  const toneGuide =
    tone === "warm"
      ? "Warm, human, and personable while still senior-level and precise."
      : tone === "concise"
        ? "Extremely concise — under 150 words, no filler, still substantive."
        : "Highly professional, confident, technical, and direct.";

  const prompt = `Write a job application EMAIL from Joy Chandra Uday.

Candidate profile:
- Software Engineer at garirhat.com (high-performance vehicle marketplace: catalog search, PostgreSQL tuning, low-latency APIs)
- Founder of Grow With Owl (EdTech, AI prep systems)
- Author of StockFlow (immutable append-only ledger, row-level locking, zero double-spends under load)
- Author of FlowBridge (durable idempotent state machine, transactional outbox)
- Stack: TypeScript, Next.js, React, Node.js, PostgreSQL, Prisma, Redis, Docker

Target:
- Company: ${company}
- Role: ${role}
- Recipient: ${contactName || "Hiring Team"}${contactRole ? ` (${contactRole})` : ""}
- Relevant strengths to leverage: ${(matchReasons || []).slice(0, 5).join("; ") || "full-stack delivery and systems reliability"}
- Their stack: ${(techStack || []).slice(0, 10).join(", ") || "modern web stack"}
- Job context: ${(jobDescription || "").slice(0, 1800) || "General software engineering role"}

Tone: ${toneGuide}
${extraInstructions ? `Extra instructions: ${extraInstructions}` : ""}

Rules:
- Plain text only (no markdown symbols, no bullet lists).
- 3 short paragraphs: (1) who Joy is + why this role specifically, (2) one concrete proof point tied to their needs, (3) clear call to action.
- Never use "I am excited to apply", "dynamic team player", "passionate", or other clichés.
- Include a sign-off: "Best regards,\\nJoy Chandra Uday" and (on the next line) "joychandrauday.vercel.app · github.com/joychandrauday".
- Do NOT invent the recipient's name if unknown — use "Hiring Team".

Return ONLY raw JSON:
{ "subject": "Application — <Role> | Joy Chandra Uday", "body": "Full email body with \\n line breaks" }`;

  const res = await runAICompletion({
    prompt,
    systemPrompt:
      "You are an elite technical career writer. Output strictly valid JSON with 'subject' and 'body' keys only, no markdown fences.",
  });

  const parsed = extractJsonObject(res.text);

  const subject =
    (parsed && typeof parsed.subject === "string" && parsed.subject.trim()) ||
    `Application — ${role || "Software Engineer"} | Joy Chandra Uday`;

  let body =
    (parsed && typeof parsed.body === "string" && parsed.body.trim()) ||
    `Hi ${contactName || "Hiring Team"},

I'm Joy Chandra Uday, a full-stack and systems engineer currently building high-throughput commerce infrastructure at garirhat.com. I'm writing about the ${role || "engineering"} role at ${company} — the systems problems you're describing line up closely with the work I do day to day.

At garirhat.com I own catalog search and transaction integrity on PostgreSQL, and I've shipped open-source concurrency primitives: StockFlow (append-only ledger with row-level locking, zero double-spends under load) and FlowBridge (idempotent state machine with a transactional outbox).

If it's useful, I'd welcome a short technical conversation about where ${company} is heading.

Best regards,
Joy Chandra Uday
joychandrauday.vercel.app · github.com/joychandrauday`;

  // Normalise escaped newlines if the model returned a single-line string
  body = body.replace(/\\n/g, "\n");

  return { subject, body };
}


export async function generateFollowUpEmail({
  company,
  role,
  daysApplied,
  contactName,
}: {
  company: string;
  role: string;
  daysApplied: number;
  contactName?: string;
}) {
  const prompt = `Write an assertive, polite, high-caliber engineering follow-up email in Markdown:
Candidate: Joy Chandra Uday (Software Engineer at garirhat.com, Founder of Grow With Owl)
Target Company: ${company}
Target Role: ${role}
Recipient Name: ${contactName || "Hiring Team"}
Time since application submitted: ${daysApplied} days ago

Key Points to include:
- Reiterate strong interest in ${company}'s technical challenges.
- Reference candidate's track record in production systems (low-latency search at Garirhat, concurrency primitives like StockFlow).
- Keep it concise, respectful of their time, and include a clear call-to-action (e.g., 15-minute introductory technical chat).`;

  const res = await runAICompletion({ prompt });
  return res.text;
}

export async function generateInterviewPrep({
  company,
  role,
  jobDescription,
}: {
  company: string;
  role: string;
  jobDescription?: string;
}) {
  const prompt = `Generate a high-yield Technical Interview Preparation Cheat Sheet in clean Markdown for Joy Chandra Uday:
Candidate: Joy Chandra Uday (Software Engineer @ garirhat.com, Founder @ Grow With Owl, author of StockFlow and FlowBridge).
Target Company: ${company}
Role: ${role}
Job Context: ${jobDescription?.slice(0, 1500) || "Modern full-stack and distributed architecture"}

Structure the cheat sheet with:
# 🎯 ${company} — ${role} Interview Dossier

## 1. Probable Architectural & System Design Questions
Generate 4 challenging system design / backend questions tailored to ${company}'s business domain (e.g. data consistency, caching, distributed queues, low-latency APIs).

## 2. Joy's Tactical Talking Points
Specific ways Joy can bring up:
- **Garirhat.com**: High-throughput catalog search and PostgreSQL indexing.
- **StockFlow**: Managing race conditions with row-level locks and zero double-spends under load.
- **FlowBridge**: Idempotent state machine with guaranteed execution.

## 3. Reverse-Interview Questions to Ask
3 intelligent, non-trivial questions Joy should ask the Engineering Manager to demonstrate senior technical discernment.`;

  const res = await runAICompletion({ prompt });
  return res.text;
}

export async function syndicatePost({
  title,
  content,
  platform,
}: {
  title: string;
  content: string;
  platform: "linkedin" | "devto" | "twitter";
}): Promise<string> {
  let prompt = "";
  if (platform === "linkedin") {
    prompt = `Transform the following technical engineering article by Joy Chandra Uday into a high-engagement LinkedIn technical post/carousel script in Markdown:
Title: ${title}
Content:
${content.slice(0, 3000)}

Guidelines:
- Hook the reader in the first 2 lines with a real architectural or production engineering insight (no clickbait).
- Break down the core technical problem and how it was solved (e.g., concurrency, row-level locks, latency, data pipelines).
- Use clean bullet points and short punchy paragraphs.
- Include a thought-provoking engineering question at the end to spur technical comments.
- 3-5 relevant hashtags (#SoftwareEngineering #SystemDesign #DistributedSystems).`;
  } else if (platform === "devto") {
    prompt = `Format the following article into a production-ready Dev.to / Hashnode markdown bundle:
Title: ${title}
Content:
${content.slice(0, 4000)}

Requirements:
- Begin with standard YAML frontmatter:
---
title: "${title.replace(/"/g, '\\"')}"
published: true
description: "Brief 150-char technical abstract"
tags: webdev, typescript, architecture, software
canonical_url: https://joychandrauday.vercel.app/blog
---
- Ensure all code blocks have correct syntax highlighting tags (e.g. \`\`\`typescript, \`\`\`sql).
- Keep the body intact with polished technical headers.`;
  } else {
    prompt = `Convert the following engineering article into a 5-to-7 tweet technical thread in Markdown:
Title: ${title}
Content:
${content.slice(0, 3000)}

Format each tweet clearly:
1/🧵 [The Hook]
2/ [The Architecture Challenge]
3/ [The Technical Solution]
4/ [Key Metric or Trade-off]
5/ [What We Learned]
6/ [Summary & Link]`;
  }

  const res = await runAICompletion({
    prompt,
    systemPrompt: "You are an elite developer advocate and technical content strategist. Output clean, formatted markdown ready for syndication.",
  });
  return res.text;
}

export async function analyzeJobPosting({
  jobDescription,
}: {
  jobDescription: string;
}) {
  const prompt = `Analyze this job posting for Joy Chandra Uday (Full Stack Engineer with React, Next.js, Node.js, TypeScript, Systems, MongoDB, PostgreSQL):

Job Description:
${jobDescription}

Provide output in clean Markdown with:
1. Match Score (0-100) and brief rationale
2. Top 5 Key Technical Requirements
3. 3 Strategic Talking Points for Interviews
4. Likely Technical Screening Questions (3 questions)`;

  const res = await runAICompletion({ prompt });
  return res.text;
}

export async function ingestResearch({
  input,
}: {
  input: string;
}): Promise<{
  title: string;
  category: string;
  content: string;
  takeaways: string[];
  resources: string[];
}> {
  const prompt = `You are an automated research assistant for Joy Chandra Uday's Second Brain (Systems Engineering, Concurrency, Distributed Systems).
Analyze the following technical content, research paper excerpt, or GitHub concept and extract structured knowledge.
Return ONLY valid JSON (no markdown formatting, no backticks):
{
  "title": "Concise Technical Title (e.g., Write-Ahead Logging & Crash Recovery)",
  "category": "System Design",
  "content": "Detailed 2-3 paragraph markdown summary of the problem, algorithmic invariant, and trade-offs.",
  "takeaways": [
    "First core principle or invariant",
    "Second architectural trade-off",
    "Third practical engineering lesson"
  ],
  "resources": ["Reference link or citation"]
}

Available Categories: "System Design", "Backend", "Frontend", "DevOps & Systems", "Databases", "AI & ML".

Input text or URL context:
${input.slice(0, 3500)}`;

  const res = await runAICompletion({
    prompt,
    systemPrompt: "You are a JSON knowledge extraction engine. Output strictly valid JSON without markdown code blocks.",
  });

  try {
    const cleaned = res.text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      title: parsed.title || "Systems Engineering Research",
      category: parsed.category || "System Design",
      content: parsed.content || input,
      takeaways: Array.isArray(parsed.takeaways) ? parsed.takeaways : [],
      resources: Array.isArray(parsed.resources) ? parsed.resources : [input.slice(0, 80)],
    };
  } catch {
    return {
      title: "Architectural Research Note",
      category: "System Design",
      content: input,
      takeaways: ["Extracted core invariant", "Performance trade-off under load", "Production resilience pattern"],
      resources: [input.slice(0, 80)],
    };
  }
}
