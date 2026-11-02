"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  FileText,
  Layers,
  BrainCircuit,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Terminal,
  Menu,
  X,
  Sparkles,
  Command,
  ChevronRight,
  Server,
  ShieldCheck,
  Github,
  Cpu,
  RefreshCw,
  Sun,
  Moon,
  Send,
  CheckCircle2,
  Clock,
  Building,
  Activity,
  Star,
  Edit3,
  Trash2,
  Plus,
  Search,
  Linkedin,
  Twitter,
} from "lucide-react";

import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";

import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import Button from "@/components/ui/Button";

import ProfileModal from "@/components/ops/ProfileModal";

import { useEffect, useState } from "react";

interface Service {
  name: string;
  status: "operational" | "degraded" | "down";
  latencyMs: number;
  role: string;
}

interface Telemetry {
  timestamp: string;
  services: Service[];
  github: { public_repos: number; followers: number } | null;
  system: {
    dbEngine: string;
    aiPrimary: string;
    aiFallback: string;
    nodeVersion: string;
    uptimeSeconds: number;
  };
}

export default function OpsDashboard() {
  const { language, setLanguage, isBn } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [telemetryLoading, setTelemetryLoading] = useState(true);

  // Dashboard stats
  const [stats, setStats] = useState({
    jobsCount: 0,
    activeInterviews: 0,
    postsCount: 0,
    projectsCount: 0,
    learningsCount: 0,
    unreadInquiries: 0,
  });

  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);

  // AI prompt state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState<string>("");

  // Auto-fetch data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [
          jobsRes,
          postsRes,
          projRes,
          learnRes,
          inqRes,
        ] = await Promise.all([
          fetch("/api/ops/jobs").then((r) => r.json()),
          fetch("/api/ops/posts").then((r) => r.json()),
          fetch("/api/ops/projects").then((r) => r.json()),
          fetch("/api/ops/learnings").then((r) => r.json()),
          fetch("/api/ops/inbox").then((r) => r.json()),
        ]);

        const jobs = Array.isArray(jobsRes) ? jobsRes : [];
        const posts = Array.isArray(postsRes) ? postsRes : [];
        const projs = Array.isArray(projRes) ? projRes : [];
        const learns = Array.isArray(learnRes) ? learnRes : [];
        const inqs = Array.isArray(inqRes) ? inqRes : [];

        setStats({
          jobsCount: jobs.length,
          activeInterviews: jobs.filter(
            (j: any) => ["screening", "technical", "onsite"].includes(j.status)
          ).length,
          postsCount: posts.length,
          projectsCount: projs.length,
          learningsCount: learns.length,
          unreadInquiries: inqs.filter((i: any) => !i.isRead).length,
        });

        setRecentJobs(jobs.slice(0, 4));
        setRecentInquiries(inqs.slice(0, 3));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      }
    }

    fetchDashboardData();
  }, [pathname]);

  // Fetch telemetry
  const fetchTelemetry = async () => {
    setTelemetryLoading(true);
    try {
      const res = await fetch("/api/ops/telemetry");
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (err) {
      console.error("Telemetry ping error:", err);
    } finally {
      setTelemetryLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, [pathname]);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiResult("");
    try {
      const res = await fetch("/api/ops/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "completion",
          input: aiPrompt,
        }),
      });
      const data = await res.json();
      setAiResult(data.result || data.error || "");
      setAiProvider(data.provider || "AI Engine");
    } catch {
      setAiResult("Failed to execute prompt.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-accent" />
          <div>
            <h1 className="font-semibold text-lg font-mono tracking-tight text-text-primary">
              EXECUTIVE TELEMETRY & DISPATCH
            </h1>
            <p className="text-xs text-text-muted">
              Live monitoring, CRM pipeline stats, and AI prompt dispatcher
            </p>
          </div>
        </div>

        {/* Profile & Theme controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted self-start sm:self-auto">
          {/* Profile Modal Trigger */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="w-7 h-7 rounded-full bg-accent text-black flex items-center justify-center font-bold hover:scale-105 transition-transform text-xs cursor-pointer"
            title="Profile (J)"
          >
            J
          </button>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-text-muted" />
            ) : (
              <Moon className="w-4 h-4 text-text-muted" />
            )}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="px-2 py-1 rounded border border-border hover:border-accent/50 text-text-primary hover:text-accent transition-colors cursor-pointer text-xs uppercase"
            title="Toggle Language (EN/BN)"
          >
            {language === "en" ? "বাংলা" : "EN"}
          </button>

          {/* Quick inquiries count */}
          <Link
            href="/ops/inbox"
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-bg-elevated/40 border border-border text-text-muted hover:text-text-primary transition-colors text-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="font-bold text-accent">{stats.unreadInquiries}</span>
          </Link>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Job Pipeline */}
        <Card className="group hover:bg-bg-elevated/30 transition-all cursor-pointer" onClick={() => router.push("/ops/jobs")}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-accent group-hover:text-primary transition-colors" />
              <span className="uppercase text-xs font-semibold font-mono text-text-muted">
                Job Pipeline
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-text-primary">{stats.jobsCount}</div>
            <div className="text-xs text-accent mt-1">
              {stats.activeInterviews} in active stages
            </div>
          </CardContent>
        </Card>

        {/* Bilingual Posts */}
        <Card className="group hover:bg-bg-elevated/30 transition-all cursor-pointer" onClick={() => router.push("/ops/posts")}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent group-hover:text-primary transition-colors" />
              <span className="uppercase text-xs font-semibold font-mono text-text-muted">
                Bilingual Posts
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-text-primary">{stats.postsCount}</div>
            <div className="text-xs text-text-muted mt-1">EN / BN synchronized</div>
          </CardContent>
        </Card>

        {/* Second Brain */}
        <Card className="group hover:bg-bg-elevated/30 transition-all cursor-pointer" onClick={() => router.push("/ops/learnings")}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-accent group-hover:text-primary transition-colors" />
              <span className="uppercase text-xs font-semibold font-mono text-text-muted">
                Second Brain
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-text-primary">
              {stats.learningsCount}
            </div>
            <div className="text-xs text-text-muted mt-1">TIL & Systems research</div>
          </CardContent>
        </Card>

        {/* Inquiries */}
        <Card className="group hover:bg-bg-elevated/30 transition-all cursor-pointer" onClick={() => router.push("/ops/inbox")}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent group-hover:text-primary transition-colors" />
              <span className="uppercase text-xs font-semibold font-mono text-text-muted">
                Inquiries
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-text-primary">{stats.unreadInquiries}</div>
            <div className="text-xs text-text-muted mt-1">
              {stats.unreadInquiries > 0 ? "Action required" : "Inbox clear"}
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Telemetry Sentinel */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-accent" />
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-text-primary">
                    Production Uptime Sentinel
                  </h2>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent">
                    Phase 4 Live
                  </span>
                </div>
                <button
                  onClick={() => {
                    fetchTelemetry();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-bg-elevated/40 border border-border text-xs text-text-muted hover:text-accent hover:border-accent/30 transition-all cursor-pointer"
                  title="Refresh Telemetry"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${telemetryLoading ? "animate-spin text-accent" : ""}`} />
                  <span>Ping Now</span>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {telemetry ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
                  {/* Services */}
                  <div className="bg-bg/50 border border-border/50 rounded-lg p-3">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Services</p>
                    <div className="space-y-1">
                      {telemetry.services.map((svc) => (
                        <div
                          key={svc.name}
                          className="flex items-center justify-between p-2 rounded bg-bg/30 text-xs"
                        >
                          <span className="font-bold text-text-primary truncate">{svc.name}</span>
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              svc.status === "operational"
                                ? "bg-emerald-400"
                                : svc.status === "degraded"
                                ? "bg-amber-400"
                                : "bg-red-400"
                            }`}
                          />
                          <span className="text-[9px] text-text-muted">{svc.latencyMs}ms</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="bg-bg/50 border border-border/50 rounded-lg p-3">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2">GitHub</p>
                    <div className="flex items-center gap-2 text-xs">
                      <Github className="w-4 h-4 text-text-muted" />
                      <span>
                        {telemetry?.github?.public_repos || 0} repos ·{" "}
                        {telemetry?.github?.followers || 0} followers
                      </span>
                    </div>
                  </div>

                  {/* AI Engine */}
                  <div className="bg-bg/50 border border-border/50 rounded-lg p-3">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2">AI Engine</p>
                    <div className="flex items-center gap-2 text-xs">
                      <Sparkles className="w-4 h-4 text-text-muted" />
                      <span className="font-bold text-text-primary">
                        {telemetry?.system?.aiPrimary}
                      </span>
                    </div>
                  </div>

                  {/* DB Engine */}
                  <div className="bg-bg/50 border border-border/50 rounded-lg p-3">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Database</p>
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-400">{telemetry?.system?.dbEngine}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-muted animate-pulse">
                  Connecting to production endpoints...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Jobs & Inquiries - Two Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-text-primary">
                      Active Pipeline Highlights
                    </h3>
                  </div>
                  <Link
                    href="/ops/jobs"
                    className="text-xs font-mono text-text-muted hover:text-accent transition-colors"
                  >
                    View All <ChevronRight className="w-3 h-3 opacity-60" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentJobs.length === 0 ? (
                  <p className="text-xs text-text-muted py-4">
                    No active applications recorded.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {recentJobs.map((job: any) => (
                      <div
                        key={job.id}
                        className="p-3 bg-bg/30 border border-border/50 rounded-lg text-xs font-mono"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-text-primary">{job.company}</div>
                            <div className="text-text-muted text-[11px]">{job.role}</div>
                          </div>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase ${
                              job.status === "screening" || job.status === "technical"
                                ? "bg-accent/20 text-accent"
                                : job.status === "applied"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-bg-elevated text-text-muted"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Inquiries */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-text-primary">
                    Recent Portfolio Inquiries
                  </h3>
                  <Link
                    href="/ops/inbox"
                    className="text-xs font-mono text-text-muted hover:text-accent transition-colors"
                  >
                    View All <ChevronRight className="w-3 h-3 opacity-60" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentInquiries.length === 0 ? (
                  <p className="text-xs text-text-muted py-4">No incoming inquiries.</p>
                ) : (
                  <div className="space-y-2">
                    {recentInquiries.map((inq: any) => (
                      <div
                        key={inq.id}
                        className="p-3 bg-bg/30 border border-border/50 rounded-lg text-xs font-mono"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-text-primary">{inq.name}</div>
                            <div className="text-text-muted text-[11px]">{inq.email}</div>
                            <div className="text-accent text-[11px] truncate max-w-[200px]">
                              {inq.subject || "—"}
                            </div>
                          </div>
                          <span className="text-[9px] text-text-muted">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Automated Copilot */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-text-primary">
                  AI Automated Copilot
                </h3>
                <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded font-bold">
                  Groq Qwen 3.8 / Gemini Flash
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleAiSubmit}>
                <Input
                  placeholder="e.g. 'Draft a cold email for Senior Frontend at Stripe'"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{aiLoading ? "Thinking..." : "Execute"}</span>
                </Button>
              </form>

              {aiResult && (
                <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                  <pre className="text-xs font-mono whitespace-pre-wrap text-text-primary">
                    {aiResult}
                  </pre>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-[10px] text-text-muted mb-2">
                  Quick actions:
                </p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() =>
                      setAiPrompt(
                        "Draft a tailored outreach note highlighting distributed systems, Next.js, and high-concurrency Node.js experience."
                      )
                    }
                    className="hover:text-accent underline cursor-pointer"
                  >
                    Outreach Draft
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAiPrompt(
                        "What are the 5 hardest interview questions for Senior React/Next.js and Node.js roles?"
                      )
                    }
                    className="hover:text-accent underline cursor-pointer"
                  >
                    Interview Prep
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAiPrompt(
                        "Translate into clean technical Bengali: 'Optimistic UI updates paired with event-driven WebSockets eliminate user latency.'"
                      )
                    }
                    className="hover:text-accent underline cursor-pointer"
                  >
                    Bengali Translate
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
    </div>
  );
}