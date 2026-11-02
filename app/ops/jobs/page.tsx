"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Plus,
  ExternalLink,
  Sparkles,
  Building,
  MapPin,
  Calendar,
  ChevronRight,
  Clock,
  AlertTriangle,
  Zap,
  Send,
  Save,
  Search,
  Mail,
  Globe,
  Link2,
  RefreshCw,
  Target,
  TrendingUp,
  Layers,
  Loader2,
  X,
  Edit3,
  Trash2,
  CheckCircle2,
  DollarSign,
  Filter,
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import Button from "@/components/ui/Button";

type JobStatus = "wishlist" | "applied" | "screening" | "technical" | "offer" | "archived";

interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  location: string;
  salaryRange: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  jobUrl: string | null;
  jobDescription: string | null;
  contactName: string | null;
  contactEmail: string | null;
  coverLetter: string | null;
  notes: string | null;
  matchScore: number | null;
  appliedAt: string | null;
  followUpAt: string | null;
  sourcePortal: string | null;
  sourceUrl: string | null;
  companyWebsite: string | null;
  careerPageUrl: string | null;
  companyIndustry: string | null;
  employmentType: string | null;
  workMode: string | null;
  seniority: string | null;
  department: string | null;
  techStack: string[];
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  tags: string[];
  priority: "low" | "medium" | "high";
  aiSummary: string | null;
  matchReasons: string[];
  gaps: string[];
  postedAt: string | null;
  deadline: string | null;
  lastContactedAt: string | null;
  nextActionAt: string | null;
  updatedAt?: string;
}

interface CompanyKB {
  id: string;
  name: string;
  website: string | null;
  careerPageUrl: string | null;
  industry: string | null;
  topSalary: number | null;
  avgSalary: number | null;
  jobsCount: number;
}

const STATUS_COLORS: Record<JobStatus, string> = {
  wishlist: "bg-bg-elevated/40 text-text-muted border border-border/40",
  applied: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  screening: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  technical: "bg-accent/15 text-accent border border-accent/30",
  offer: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  archived: "bg-zinc-800 text-zinc-400 border border-zinc-700",
};

const STATUS_LABELS: Record<JobStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  screening: "Screening",
  technical: "Technical",
  offer: "Offer",
  archived: "Archived",
};

export default function OpsJobsPage() {
  const [activeTab, setActiveTab] = useState<"crm" | "extract" | "companies" | "deadlines">("crm");
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [companies, setCompanies] = useState<CompanyKB[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [workModeFilter, setWorkModeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"updated" | "salary" | "match" | "deadline">("updated");

  // Ingestion Drawer / Modal State
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [jdUrl, setJdUrl] = useState("");
  const [jdText, setJdText] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [extractError, setExtractError] = useState("");

  // Job Form State (for Create & Edit)
  const [editingJob, setEditingJob] = useState<Partial<JobApplication> | null>(null);
  const [isSavingJob, setIsSavingJob] = useState(false);

  // Application Email Dispatcher Modal State
  const [emailModalJob, setEmailModalJob] = useState<JobApplication | null>(null);
  const [emailTone, setEmailTone] = useState<"professional" | "warm" | "concise">("professional");
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailExtraPrompt, setEmailExtraPrompt] = useState("");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailResultMsg, setEmailResultMsg] = useState("");

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/ops/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/ops/companies");
      if (res.ok) {
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  // Fetch JD text server-side from URL
  const handleFetchUrl = async () => {
    if (!jdUrl.trim()) return;
    setIsFetchingUrl(true);
    setExtractError("");
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
        setEditingJob({
          company: data.company || "",
          role: data.role || "",
          location: data.location || "Remote",
          workMode: data.workMode || "Remote",
          employmentType: data.employmentType || "Full-time",
          seniority: data.seniority || "Senior",
          salaryRange: data.salaryRaw || "",
          salaryMin: data.salaryMin ?? null,
          salaryMax: data.salaryMax ?? null,
          salaryCurrency: data.salaryCurrency || "USD",
          sourcePortal: data.sourcePortal || "",
          sourceUrl: jdUrl || data.sourceUrl || "",
          companyWebsite: data.companyWebsite || "",
          careerPageUrl: data.careerPageUrl || "",
          companyIndustry: data.companyIndustry || "",
          techStack: data.techStack || [],
          requirements: data.requirements || [],
          responsibilities: data.responsibilities || [],
          benefits: data.benefits || [],
          contactName: data.contactName || "",
          contactEmail: data.contactEmail || "",
          matchScore: data.matchScore ?? 85,
          matchReasons: data.matchReasons || [],
          gaps: data.gaps || [],
          priority: data.priority || "medium",
          aiSummary: data.aiSummary || "",
          status: "wishlist",
          jobDescription: jdText,
        });
      }
    } catch {
      setExtractError("AI extraction failed. Check connection or API key.");
    } finally {
      setIsAiParsing(false);
    }
  };

  // Save Job to Database & Company KB
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob?.company || !editingJob?.role) {
      alert("Company and Role are required");
      return;
    }

    setIsSavingJob(true);
    try {
      const res = await fetch("/api/ops/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingJob),
      });

      if (res.ok) {
        await fetchJobs();
        await fetchCompanies();
        setEditingJob(null);
        setIsExtractModalOpen(false);
        setJdText("");
        setJdUrl("");
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to save job application");
      }
    } catch {
      alert("Network error while saving job");
    } finally {
      setIsSavingJob(false);
    }
  };

  // Delete Job
  const handleDeleteJob = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to remove the application for ${company}?`)) return;
    try {
      const res = await fetch("/api/ops/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
      }
    } catch {
      alert("Failed to delete application");
    }
  };

  // Quick Stage Update
  const handleQuickStatusChange = async (id: string, newStatus: JobStatus) => {
    try {
      const res = await fetch("/api/ops/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
        );
      }
    } catch {
      console.error("Status update error");
    }
  };

  // Open Application Email Modal
  const openEmailModal = (job: JobApplication) => {
    setEmailModalJob(job);
    setEmailRecipient(job.contactEmail || "");
    setEmailSubject(`Application: ${job.role} — Joy Chandra Uday`);
    setEmailBody(
      job.coverLetter ||
        `Hi ${job.contactName || "Hiring Team"},\n\nI am writing to express my strong interest in the ${job.role} opportunity at ${job.company}.\n\nWith extensive production experience engineering scalable backends, high-concurrency event pipelines, and distributed architectures (Next.js, Node.js, PostgreSQL), I am confident in delivering immediate value to your platform.\n\nYou can review my engineering dossier and verified systems at https://joychandrauday.vercel.app.\n\nBest regards,\nJoy Chandra Uday`
    );
    setEmailResultMsg("");
  };

  // AI Generate Outreach Email
  const handleGenerateAiEmail = async () => {
    if (!emailModalJob) return;
    setIsGeneratingEmail(true);
    setEmailResultMsg("");
    try {
      const res = await fetch("/api/ops/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "application_email",
          company: emailModalJob.company,
          role: emailModalJob.role,
          contactName: emailModalJob.contactName,
          contactRole: emailModalJob.seniority,
          jobDescription: emailModalJob.jobDescription,
          matchReasons: emailModalJob.matchReasons,
          techStack: emailModalJob.techStack,
          tone: emailTone,
          extraInstructions: emailExtraPrompt,
        }),
      });

      const data = await res.json();
      if (data.subject) setEmailSubject(data.subject);
      if (data.body) setEmailBody(data.body);
      setEmailResultMsg("✓ Tailored application email generated with Groq/Gemini!");
    } catch {
      setEmailResultMsg("Failed to generate email.");
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  // Dispatch or Save Application Email
  const handleSendEmail = async (sendLive: boolean) => {
    if (!emailModalJob) return;
    setIsSendingEmail(true);
    setEmailResultMsg("");
    try {
      const res = await fetch("/api/ops/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: emailModalJob.id,
          to: emailRecipient,
          subject: emailSubject,
          body: emailBody,
          send: sendLive,
          tone: emailTone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setEmailResultMsg(
          sendLive
            ? `✓ Application dispatched via ${data.channel || "email"}! Status updated to Applied.`
            : "✓ Draft saved to application record."
        );
        await fetchJobs();
        setTimeout(() => setEmailModalJob(null), 1500);
      } else {
        setEmailResultMsg(`Error: ${data.error}`);
      }
    } catch {
      setEmailResultMsg("Dispatch request failed.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          j.company.toLowerCase().includes(q) ||
          j.role.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          (j.techStack && j.techStack.some((t) => t.toLowerCase().includes(q)))
        );
      })
      .filter((j) => (statusFilter === "all" ? true : j.status === statusFilter))
      .filter((j) => (priorityFilter === "all" ? true : j.priority === priorityFilter))
      .filter((j) => (workModeFilter === "all" ? true : (j.workMode || "").toLowerCase().includes(workModeFilter.toLowerCase())))
      .sort((a, b) => {
        if (sortBy === "salary") {
          return (b.salaryMax || 0) - (a.salaryMax || 0);
        }
        if (sortBy === "match") {
          return (b.matchScore || 0) - (a.matchScore || 0);
        }
        if (sortBy === "deadline") {
          const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          return da - db;
        }
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      });
  }, [jobs, searchQuery, statusFilter, priorityFilter, workModeFilter, sortBy]);

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Briefcase className="w-5 h-5 text-accent" />
            <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-text-primary">
              CAREER INTELLIGENCE & JOB CRM
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent">
              Active Pipeline
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            1-Click JD parser, automated match scoring, application dispatch, and salary intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/ops/jobs/add"
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-black font-semibold text-xs py-2 px-3.5 rounded-lg cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Job</span>
          </Link>
          <Button
            onClick={() => {
              setEditingJob({
                company: "",
                role: "",
                location: "Remote",
                workMode: "Remote",
                priority: "medium",
                status: "wishlist",
                techStack: [],
                requirements: [],
              });
              setIsExtractModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-bg-elevated hover:bg-bg-elevated/80 border border-border text-text-primary text-xs py-2 px-3 rounded-lg cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Quick Modal</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab("crm")}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "crm"
              ? "bg-accent/15 text-accent border border-accent/30 font-bold"
              : "text-text-muted hover:text-text-primary hover:bg-bg-elevated"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Pipeline CRM ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("companies")}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "companies"
              ? "bg-accent/15 text-accent border border-accent/30 font-bold"
              : "text-text-muted hover:text-text-primary hover:bg-bg-elevated"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Company Intelligence ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("deadlines")}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "deadlines"
              ? "bg-accent/15 text-accent border border-accent/30 font-bold"
              : "text-text-muted hover:text-text-primary hover:bg-bg-elevated"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming Deadlines & Alarms</span>
        </button>
      </div>

      {/* Tab: Pipeline CRM */}
      {activeTab === "crm" && (
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Total Tracked</span>
              <span className="text-xl font-bold text-text-primary font-mono">{jobs.length}</span>
            </div>
            <div className="p-3 bg-bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Active Interviews</span>
              <span className="text-xl font-bold text-accent font-mono">
                {jobs.filter((j) => ["screening", "technical"].includes(j.status)).length}
              </span>
            </div>
            <div className="p-3 bg-bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">High Priority</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">
                {jobs.filter((j) => j.priority === "high").length}
              </span>
            </div>
            <div className="p-3 bg-bg-surface border border-border rounded-xl">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Avg Match Fit</span>
              <span className="text-xl font-bold text-accent font-mono">
                {jobs.length
                  ? Math.round(jobs.reduce((sum, j) => sum + (j.matchScore || 0), 0) / jobs.length)
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* Search and Filters Strip */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-bg-surface border border-border rounded-xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company, role, tech stack..."
                className="w-full pl-9 pr-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="technical">Technical</option>
              <option value="offer">Offer</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">Work Modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="salary">Top Salary</option>
              <option value="match">Match Score</option>
              <option value="deadline">Upcoming Deadline</option>
            </select>
          </div>

          {/* CRM Table */}
          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-text-muted animate-pulse">
                Loading career pipeline...
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Briefcase className="w-8 h-8 text-text-muted mx-auto opacity-40" />
                <p className="text-text-muted">No applications found matching your filters.</p>
                <Button
                  onClick={() => setIsExtractModalOpen(true)}
                  className="bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 text-xs px-3 py-1.5 rounded-lg"
                >
                  Import New Job Opportunity
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-bg-elevated/40 text-[10px] uppercase tracking-wider text-text-muted">
                      <th className="py-2.5 px-3">Company & Role</th>
                      <th className="py-2.5 px-3">Stage</th>
                      <th className="py-2.5 px-3">Compensation</th>
                      <th className="py-2.5 px-3">Fit</th>
                      <th className="py-2.5 px-3">Mode</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-bg-elevated/30 transition-colors group">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text-primary text-sm">{job.company}</span>
                            {job.companyWebsite && (
                              <a
                                href={job.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="text-text-muted hover:text-accent transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <div className="text-text-muted text-[11px] mt-0.5">{job.role}</div>
                          {job.techStack?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {job.techStack.slice(0, 3).map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] px-1.5 py-0.2 bg-bg border border-border rounded text-text-muted"
                                >
                                  {t}
                                </span>
                              ))}
                              {job.techStack.length > 3 && (
                                <span className="text-[9px] text-text-muted">+{job.techStack.length - 3}</span>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <select
                            value={job.status}
                            onChange={(e) => handleQuickStatusChange(job.id, e.target.value as JobStatus)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border ${
                              STATUS_COLORS[job.status]
                            }`}
                          >
                            <option value="wishlist">Wishlist</option>
                            <option value="applied">Applied</option>
                            <option value="screening">Screening</option>
                            <option value="technical">Technical</option>
                            <option value="offer">Offer</option>
                            <option value="archived">Archived</option>
                          </select>
                          {job.priority === "high" && (
                            <span className="block text-[9px] text-accent mt-1 font-bold">★ HIGH PRIORITY</span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span className="text-text-primary font-medium">
                            {job.salaryRange || "Undisclosed"}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold text-xs ${
                                (job.matchScore || 0) >= 80
                                  ? "text-emerald-400"
                                  : (job.matchScore || 0) >= 60
                                  ? "text-accent"
                                  : "text-text-muted"
                              }`}
                            >
                              {job.matchScore ?? "—"}%
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="text-text-muted text-[11px]">{job.location}</div>
                          {job.workMode && (
                            <span className="text-[9px] text-accent font-mono uppercase">{job.workMode}</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Send / Draft Application Button */}
                            <button
                              onClick={() => openEmailModal(job)}
                              className="p-1.5 rounded hover:bg-accent/15 text-text-muted hover:text-accent border border-transparent hover:border-accent/30 transition-all cursor-pointer"
                              title="Generate Outreach / Send Email"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setEditingJob(job);
                                setIsExtractModalOpen(true);
                              }}
                              className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary border border-transparent hover:border-border transition-all cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteJob(job.id, job.company)}
                              className="p-1.5 rounded hover:bg-red-950/20 text-text-muted hover:text-red-400 border border-transparent hover:border-red-900/30 transition-all cursor-pointer"
                              title="Delete Application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Company Intelligence */}
      {activeTab === "companies" && (
        <div className="space-y-4">
          <div className="p-4 bg-bg-surface border border-border rounded-xl">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1">
              COMPANY INTELLIGENCE & SALARY BENCHMARKS
            </h2>
            <p className="text-text-muted text-xs">
              Persistent knowledge base automatically compiled as you track opportunities.
            </p>
          </div>

          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-bg-elevated/40 text-[10px] uppercase tracking-wider text-text-muted">
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Industry</th>
                  <th className="py-2.5 px-3">Top Comp</th>
                  <th className="py-2.5 px-3">Applications</th>
                  <th className="py-2.5 px-3 text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-bg-elevated/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-text-primary">{c.name}</td>
                    <td className="py-3 px-3 text-text-muted">{c.industry || "Technology"}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      {c.topSalary ? `$${c.topSalary.toLocaleString()}/yr` : "—"}
                    </td>
                    <td className="py-3 px-3 text-text-muted">{c.jobsCount || 1} opportunities</td>
                    <td className="py-3 px-3 text-right">
                      {c.careerPageUrl && (
                        <a
                          href={c.careerPageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-accent hover:underline text-[11px]"
                        >
                          <span>Careers</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Deadlines & Alarms */}
      {activeTab === "deadlines" && (
        <div className="space-y-4">
          <div className="p-4 bg-bg-surface border border-border rounded-xl">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1">
              FOLLOW-UP ALARMS & UPCOMING DEADLINES
            </h2>
            <p className="text-text-muted text-xs">
              Never let an application slip. Scheduled touchpoints and closing dates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deadlines Card */}
            <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-3">
              <span className="font-bold text-accent uppercase text-xs flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Closing Deadlines
              </span>
              <div className="space-y-2">
                {jobs.filter((j) => j.deadline).length === 0 ? (
                  <p className="text-text-muted py-2">No deadlines recorded yet.</p>
                ) : (
                  jobs
                    .filter((j) => j.deadline)
                    .map((j) => (
                      <div
                        key={j.id}
                        className="p-2.5 bg-bg border border-border rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-text-primary block">{j.company}</span>
                          <span className="text-text-muted text-[11px]">{j.role}</span>
                        </div>
                        <span className="text-accent font-bold text-xs">
                          {new Date(j.deadline!).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Follow-up Reminders */}
            <div className="p-4 bg-bg-surface border border-border rounded-xl space-y-3">
              <span className="font-bold text-emerald-400 uppercase text-xs flex items-center gap-2">
                <Clock className="w-4 h-4" /> Next Actions & Follow-ups
              </span>
              <div className="space-y-2">
                {jobs.filter((j) => j.nextActionAt).length === 0 ? (
                  <p className="text-text-muted py-2">No pending follow-ups scheduled.</p>
                ) : (
                  jobs
                    .filter((j) => j.nextActionAt)
                    .map((j) => (
                      <div
                        key={j.id}
                        className="p-2.5 bg-bg border border-border rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-text-primary block">{j.company}</span>
                          <span className="text-text-muted text-[11px]">Applied Stage</span>
                        </div>
                        <span className="text-emerald-400 font-bold text-xs">
                          Follow-up: {new Date(j.nextActionAt!).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* MODAL 1: 1-Click AI Job Parser & Job Application Drawer          */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isExtractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-3xl my-4 sm:my-8 p-4 sm:p-6 space-y-4 shadow-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm text-text-primary">
                  {editingJob?.id ? `Edit Application: ${editingJob.company}` : "1-Click AI Job Ingest & Extraction"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsExtractModalOpen(false);
                  setEditingJob(null);
                }}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Extraction Controls (if creating new) */}
            {!editingJob?.id && (
              <div className="p-4 bg-bg border border-border rounded-xl space-y-3">
                <span className="font-bold text-accent uppercase text-[10px] tracking-wider block">
                  Step 1: Paste JD URL or Raw Text
                </span>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://jobs.lever.co/company/role... or careers page URL"
                    value={jdUrl}
                    onChange={(e) => setJdUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-bg-surface border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent"
                  />
                  <Button
                    type="button"
                    onClick={handleFetchUrl}
                    disabled={isFetchingUrl || !jdUrl.trim()}
                    className="px-3 py-1.5 bg-bg-elevated border border-border text-xs rounded-lg cursor-pointer"
                  >
                    {isFetchingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Fetch URL"}
                  </Button>
                </div>

                <textarea
                  rows={4}
                  placeholder="Or paste the job description text here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full p-2.5 bg-bg-surface border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent font-sans"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">
                    Extracts company, role, salary range, tech stack, fit score, and contact info automatically.
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
                        <span>Analyzing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Extract Everything</span>
                      </>
                    )}
                  </Button>
                </div>

                {extractError && (
                  <p className="text-red-400 text-xs bg-red-950/20 border border-red-900/30 p-2 rounded">
                    {extractError}
                  </p>
                )}
              </div>
            )}

            {/* Application Form */}
            {editingJob && (
              <form onSubmit={handleSaveJob} className="space-y-4">
                <span className="font-bold text-accent uppercase text-[10px] tracking-wider block">
                  Step 2: Review & Commit Application
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-text-muted block mb-1">Company *</label>
                    <input
                      type="text"
                      required
                      value={editingJob.company || ""}
                      onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                      className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-text-muted block mb-1">Role Title *</label>
                    <input
                      type="text"
                      required
                      value={editingJob.role || ""}
                      onChange={(e) => setEditingJob({ ...editingJob, role: e.target.value })}
                      className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-text-muted block mb-1">Location</label>
                    <input
                      type="text"
                      value={editingJob.location || ""}
                      onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                      className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-text-muted block mb-1">Work Mode</label>
                    <select
                      value={editingJob.workMode || "Remote"}
                      onChange={(e) => setEditingJob({ ...editingJob, workMode: e.target.value })}
                      className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-text-muted block mb-1">Salary Range / Comp</label>
                    <input
                      type="text"
                      placeholder="$120k - $160k or 150000"
                      value={editingJob.salaryRange || ""}
                      onChange={(e) => setEditingJob({ ...editingJob, salaryRange: e.target.value })}
                      className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-text-muted block mb-1">Match Fit Score (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingJob.matchScore ?? 85}
                      onChange={(e) => setEditingJob({ ...editingJob, matchScore: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-text-muted block mb-1">Contact Email</label>
                    <input
                      type="email"
                      placeholder="recruiter@company.com"
                      value={editingJob.contactEmail || ""}
                      onChange={(e) => setEditingJob({ ...editingJob, contactEmail: e.target.value })}
                      className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-text-muted block mb-1">Pipeline Status</label>
                    <select
                      value={editingJob.status || "wishlist"}
                      onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as JobStatus })}
                      className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs"
                    >
                      <option value="wishlist">Wishlist</option>
                      <option value="applied">Applied</option>
                      <option value="screening">Screening</option>
                      <option value="technical">Technical</option>
                      <option value="offer">Offer</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {editingJob.aiSummary && (
                  <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                    <span className="text-[10px] uppercase text-accent font-bold block mb-1">
                      AI Strategic Fit Summary
                    </span>
                    <p className="text-text-primary text-xs leading-relaxed">{editingJob.aiSummary}</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsExtractModalOpen(false);
                      setEditingJob(null);
                    }}
                    className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSavingJob}
                    className="px-5 py-2 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-xs cursor-pointer flex items-center gap-2"
                  >
                    {isSavingJob ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save to Pipeline</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* MODAL 2: Application Email Dispatcher & Outreach Generator       */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {emailModalJob && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-2xl my-4 sm:my-8 p-4 sm:p-6 space-y-4 shadow-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-accent">
                <Send className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm text-text-primary">
                  Generate & Send Application Email: {emailModalJob.company}
                </h3>
              </div>
              <button onClick={() => setEmailModalJob(null)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Generator Controls */}
            <div className="p-3 bg-bg border border-border rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-accent font-bold">AI Outreach Generator</span>
                <div className="flex items-center gap-2 text-xs">
                  <label className="text-text-muted text-[10px]">Tone:</label>
                  {(["professional", "warm", "concise"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEmailTone(t)}
                      className={`px-2 py-0.5 rounded text-[10px] capitalize cursor-pointer border ${
                        emailTone === t
                          ? "bg-accent/20 border-accent/40 text-accent font-bold"
                          : "border-border text-text-muted hover:text-text-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Optional custom instruction, e.g. 'Highlight our garirhat high-traffic experience'"
                value={emailExtraPrompt}
                onChange={(e) => setEmailExtraPrompt(e.target.value)}
                className="w-full px-3 py-1.5 bg-bg-surface border border-border rounded-lg text-text-primary text-xs"
              />

              <Button
                type="button"
                onClick={handleGenerateAiEmail}
                disabled={isGeneratingEmail}
                className="w-full flex items-center justify-center gap-1.5 bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 py-2 text-xs rounded-lg cursor-pointer"
              >
                {isGeneratingEmail ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Generate Tailored Email</span>
              </Button>
            </div>

            {/* Email Edit & Send Form */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-text-muted block mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  placeholder="recruiter@company.com"
                  className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-text-muted block mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-text-primary text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-text-muted block mb-1">Message Body</label>
                <textarea
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 bg-bg border border-border rounded-lg text-text-primary text-xs font-mono leading-relaxed"
                />
              </div>

              {emailResultMsg && (
                <p
                  className={`text-xs p-2.5 rounded border ${
                    emailResultMsg.startsWith("✓")
                      ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400"
                      : "bg-red-950/20 border-red-900/40 text-red-400"
                  }`}
                >
                  {emailResultMsg}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Button
                  type="button"
                  onClick={() => handleSendEmail(false)}
                  disabled={isSendingEmail}
                  className="px-3.5 py-1.5 bg-bg-elevated border border-border rounded-lg text-xs text-text-muted hover:text-text-primary cursor-pointer"
                >
                  Save Draft Only
                </Button>

                <Button
                  type="button"
                  onClick={() => handleSendEmail(true)}
                  disabled={isSendingEmail || !emailRecipient.trim()}
                  className="flex items-center gap-1.5 px-5 py-2 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-xs cursor-pointer"
                >
                  {isSendingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Send via Resend / Gmail & Advance Stage</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
