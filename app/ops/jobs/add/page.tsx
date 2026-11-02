"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  ArrowLeft,
  Sparkles,
  Zap,
  Save,
  Loader2,
  Globe,
  ExternalLink,
  Plus,
  X,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";

type JobStatus = "wishlist" | "applied" | "screening" | "technical" | "offer" | "archived";

interface NewJobState {
  company: string;
  role: string;
  status: JobStatus;
  location: string;
  workMode: string;
  employmentType: string;
  seniority: string;
  salaryRange: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  jobUrl: string;
  jobDescription: string;
  contactName: string;
  contactEmail: string;
  contactLinkedIn: string;
  companyWebsite: string;
  careerPageUrl: string;
  companyIndustry: string;
  techStack: string[];
  requirements: string[];
  priority: "low" | "medium" | "high";
  matchScore: number;
  aiSummary: string;
  matchReasons: string[];
  gaps: string[];
  deadline: string;
  notes: string;
}

export default function AddJobPage() {
  const router = useRouter();

  // Extraction State
  const [jdUrl, setJdUrl] = useState("");
  const [jdText, setJdText] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [extractSuccess, setExtractSuccess] = useState("");

  // Tag inputs
  const [techInput, setTechInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [job, setJob] = useState<NewJobState>({
    company: "",
    role: "",
    status: "wishlist",
    location: "Remote",
    workMode: "Remote",
    employmentType: "Full-time",
    seniority: "Senior",
    salaryRange: "",
    salaryCurrency: "USD",
    jobUrl: "",
    jobDescription: "",
    contactName: "",
    contactEmail: "",
    contactLinkedIn: "",
    companyWebsite: "",
    careerPageUrl: "",
    companyIndustry: "Technology",
    techStack: [],
    requirements: [],
    priority: "medium",
    matchScore: 85,
    aiSummary: "",
    matchReasons: [],
    gaps: [],
    deadline: "",
    notes: "",
  });

  // Fetch JD text server-side from URL
  const handleFetchUrl = async () => {
    if (!jdUrl.trim()) return;
    setIsFetchingUrl(true);
    setExtractError("");
    setExtractSuccess("");
    try {
      const res = await fetch("/api/ops/jobs/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jdUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setExtractError(data.error || "Failed to fetch JD URL");
      } else {
        setJdText(data.text || "");
        setJob((prev) => ({ ...prev, jobUrl: jdUrl, sourceUrl: jdUrl }));
        setExtractSuccess("✓ Job description fetched from URL! Click 'Extract Everything with AI' below.");
      }
    } catch {
      setExtractError("Network error while fetching JD URL");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // AI Extract Everything from JD
  const handleAiParse = async () => {
    if (!jdText.trim()) {
      setExtractError("Paste a job description or fetch a URL first");
      return;
    }
    setIsAiParsing(true);
    setExtractError("");
    setExtractSuccess("");
    try {
      const res = await fetch("/api/ops/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "parse_jd",
          jobDescription: jdText,
          sourceUrl: jdUrl || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setExtractError(data.error);
      } else {
        setJob((prev) => ({
          ...prev,
          company: data.company || prev.company,
          role: data.role || prev.role,
          location: data.location || prev.location,
          workMode: data.workMode || prev.workMode,
          employmentType: data.employmentType || prev.employmentType,
          seniority: data.seniority || prev.seniority,
          salaryRange: data.salaryRaw || prev.salaryRange,
          salaryMin: data.salaryMin ?? prev.salaryMin,
          salaryMax: data.salaryMax ?? prev.salaryMax,
          salaryCurrency: data.salaryCurrency || prev.salaryCurrency,
          jobUrl: jdUrl || data.sourceUrl || prev.jobUrl,
          companyWebsite: data.companyWebsite || prev.companyWebsite,
          careerPageUrl: data.careerPageUrl || prev.careerPageUrl,
          companyIndustry: data.companyIndustry || prev.companyIndustry,
          techStack: data.techStack?.length ? data.techStack : prev.techStack,
          requirements: data.requirements?.length ? data.requirements : prev.requirements,
          contactName: data.contactName || prev.contactName,
          contactEmail: data.contactEmail || prev.contactEmail,
          contactLinkedIn: data.contactLinkedIn || prev.contactLinkedIn,
          matchScore: data.matchScore ?? prev.matchScore,
          matchReasons: data.matchReasons || prev.matchReasons,
          gaps: data.gaps || prev.gaps,
          priority: data.priority || prev.priority,
          aiSummary: data.aiSummary || prev.aiSummary,
          jobDescription: jdText,
        }));
        setExtractSuccess(`✓ Successfully extracted "${data.company || "Job"}" details! Review and commit below.`);
      }
    } catch {
      setExtractError("AI extraction failed. Check connection or API key.");
    } finally {
      setIsAiParsing(false);
    }
  };

  const addTechBadge = () => {
    if (!techInput.trim()) return;
    if (!job.techStack.includes(techInput.trim())) {
      setJob({ ...job, techStack: [...job.techStack, techInput.trim()] });
    }
    setTechInput("");
  };

  const removeTechBadge = (t: string) => {
    setJob({ ...job, techStack: job.techStack.filter((x) => x !== t) });
  };

  // Submit Job to DB
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job.company.trim() || !job.role.trim()) {
      alert("Company and Role are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/ops/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      if (res.ok) {
        router.push("/ops/jobs");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add job application");
      }
    } catch {
      alert("Failed to submit job. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/ops/jobs"
            className="p-1.5 rounded-lg bg-bg-elevated/60 hover:bg-bg-elevated text-text-muted hover:text-text-primary border border-border transition-colors cursor-pointer"
            title="Back to CRM"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-accent" />
              <h1 className="text-base sm:text-lg font-bold font-mono tracking-tight text-text-primary">
                TRACK NEW OPPORTUNITY
              </h1>
            </div>
            <p className="text-text-muted text-[11px] mt-0.5">
              1-Click ingest with AI extraction, automatic match score & company intelligence
            </p>
          </div>
        </div>

        <Link
          href="/ops/jobs"
          className="text-text-muted hover:text-text-primary text-xs flex items-center gap-1"
        >
          Cancel
        </Link>
      </div>

      {/* 1-Click AI Extraction Box */}
      <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-accent">
          <Sparkles className="w-4 h-4" />
          <h2 className="font-bold uppercase tracking-wider text-xs text-text-primary">
            Quick Ingest: Paste JD URL or Description
          </h2>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://jobs.lever.co/company/role... or careers link"
            value={jdUrl}
            onChange={(e) => setJdUrl(e.target.value)}
            className="flex-1 px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
          />
          <Button
            type="button"
            onClick={handleFetchUrl}
            disabled={isFetchingUrl || !jdUrl.trim()}
            className="px-3 py-2 bg-bg-elevated border border-border text-xs rounded-lg cursor-pointer"
          >
            {isFetchingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Fetch URL"}
          </Button>
        </div>

        <textarea
          rows={5}
          placeholder="Or paste the job description text here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          className="w-full p-3 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent font-sans leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-text-muted">
            Analyzes company, role, salary range, tech stack, and compatibility score.
          </span>
          <Button
            type="button"
            onClick={handleAiParse}
            disabled={isAiParsing || !jdText.trim()}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-black font-bold px-4 py-2 text-xs rounded-lg cursor-pointer"
          >
            {isAiParsing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting with Groq/Gemini...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Extract Everything with AI</span>
              </>
            )}
          </Button>
        </div>

        {extractError && (
          <p className="text-red-400 text-xs bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg">
            {extractError}
          </p>
        )}

        {extractSuccess && (
          <p className="text-emerald-400 text-xs bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg">
            {extractSuccess}
          </p>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-bg-surface border border-border rounded-xl p-6 space-y-6">
        <h2 className="font-bold uppercase tracking-wider text-xs text-accent">
          Application Details
        </h2>

        {/* Primary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={job.company}
              onChange={(e) => setJob({ ...job, company: e.target.value })}
              placeholder="e.g. Stripe, Linear, Vercel"
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Role Title *</label>
            <input
              type="text"
              required
              value={job.role}
              onChange={(e) => setJob({ ...job, role: e.target.value })}
              placeholder="e.g. Senior Backend / Platform Engineer"
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Location</label>
            <input
              type="text"
              value={job.location}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
              placeholder="Remote / San Francisco, CA"
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Work Mode</label>
            <select
              value={job.workMode}
              onChange={(e) => setJob({ ...job, workMode: e.target.value })}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Compensation / Salary Range</label>
            <input
              type="text"
              value={job.salaryRange}
              onChange={(e) => setJob({ ...job, salaryRange: e.target.value })}
              placeholder="$140k - $180k USD / Year"
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Pipeline Stage</label>
            <select
              value={job.status}
              onChange={(e) => setJob({ ...job, status: e.target.value as JobStatus })}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            >
              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="technical">Technical</option>
              <option value="offer">Offer</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Match Fit Score (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={job.matchScore}
              onChange={(e) => setJob({ ...job, matchScore: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Priority</label>
            <select
              value={job.priority}
              onChange={(e) => setJob({ ...job, priority: e.target.value as any })}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Contact Recruiter Email</label>
            <input
              type="email"
              value={job.contactEmail}
              onChange={(e) => setJob({ ...job, contactEmail: e.target.value })}
              placeholder="recruiter@company.com"
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-text-muted block mb-1">Contact Name / Hiring Lead</label>
            <input
              type="text"
              value={job.contactName}
              onChange={(e) => setJob({ ...job, contactName: e.target.value })}
              placeholder="e.g. Alex Smith"
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div>
          <label className="text-[10px] uppercase text-text-muted block mb-1.5">Tech Stack</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add skill badge (e.g. TypeScript, Redis, PostgreSQL)"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTechBadge();
                }
              }}
              className="flex-1 px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
            />
            <Button
              type="button"
              onClick={addTechBadge}
              className="px-3 py-1.5 bg-bg-elevated border border-border text-xs rounded-lg"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {job.techStack.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-bg border border-border text-xs text-text-primary"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => removeTechBadge(t)}
                  className="text-text-muted hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        {job.aiSummary && (
          <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <span className="text-[10px] uppercase text-accent font-bold block mb-1">
              AI Strategic Match Summary
            </span>
            <p className="text-text-primary text-xs leading-relaxed">{job.aiSummary}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/ops/jobs"
            className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-xs text-text-muted hover:text-text-primary"
          >
            Cancel
          </Link>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-xs cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Commit to Career Pipeline</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

