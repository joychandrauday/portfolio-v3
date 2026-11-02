"use client";

import React, { useState, useEffect } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";
import {
  Sparkles,
  Send,
  Code2,
  Database,
  Layers,
  Languages,
  Bug,
  Mail,
  Zap,
  Clock,
  RotateCcw,
  History,
  Copy,
  Check,
  Download,
  Trash2,
  Sliders,
  ChevronRight,
  Bot,
  Terminal,
} from "lucide-react";

type ModeKey =
  | "general"
  | "code_review"
  | "sql_architect"
  | "system_rfc"
  | "translator"
  | "bug_diagnostics"
  | "outreach";

interface ModeConfig {
  key: ModeKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  placeholder: string;
  systemPrompt: string;
  presets: string[];
}

const MODES: ModeConfig[] = [
  {
    key: "general",
    label: "General Engineering",
    icon: Bot,
    description: "General-purpose technical guidance, algorithmic thinking, and architecture answers.",
    placeholder: "Ask anything about systems engineering, performance tuning, or Joy's tech stack...",
    systemPrompt: `You are Joy Chandra Uday's executive technical AI copilot.
Joy is a Software Engineer at garirhat.com and Founder of Grow With Owl. He specializes in TypeScript, Next.js, Node.js, PostgreSQL, Distributed Systems, Concurrency Primitives (StockFlow, FlowBridge), and AI evaluation (DocuPilot).
Provide rigorous, concise, craftsmanship-focused answers in clean Markdown. Skip generic filler.`,
    presets: [
      "Explain how StockFlow prevents double-spends using PostgreSQL row-level locks",
      "Compare optimistic concurrency control vs pessimistic locking in high-throughput ledgers",
      "How to design zero-downtime database migrations with LibSQL / SQLite",
      "Next.js 14 App Router: server actions vs route handlers performance audit",
    ],
  },
  {
    key: "code_review",
    label: "Code Review & Refactor",
    icon: Code2,
    description: "Analyze code for race conditions, memory leaks, algorithmic complexity, and type safety.",
    placeholder: "Paste TypeScript, Node.js, SQL, or React code to review and refactor...",
    systemPrompt: `You are an elite principal engineer reviewing code for Joy Chandra Uday.
Analyze the submitted code for:
1. Concurrency safety & race conditions (shared state, async interleavings).
2. Algorithmic efficiency & memory allocation bottlenecks.
3. Clean error handling & invariant enforcement.
Provide:
- Identified issues & severity
- Refactored drop-in production code
- Complexity analysis before vs after`,
    presets: [
      "Review this async queue processing loop for unhandled rejection and backpressure",
      "Refactor this TypeScript reducer for strict type safety and zero allocations",
      "Detect potential race conditions in this concurrent caching wrapper",
      "Optimize this React 18 component to avoid redundant client re-renders",
    ],
  },
  {
    key: "sql_architect",
    label: "SQL & Index Architect",
    icon: Database,
    description: "Optimize queries, design composite indexes, and review transaction isolation levels.",
    placeholder: "Paste SQL schema, EXPLAIN ANALYZE output, or complex queries...",
    systemPrompt: `You are a Principal Database Administrator specializing in PostgreSQL, SQLite, and LibSQL.
Help Joy Chandra Uday optimize database performance for high-throughput marketplace systems like Garirhat.
Cover:
1. Index selection (B-Tree, GiST, partial indexes, covering indexes).
2. Transaction lock contention (SELECT ... FOR UPDATE, FOR NO KEY UPDATE, SKIP LOCKED).
3. Query execution plan optimization and write-ahead log impact.`,
    presets: [
      "Write an atomic inventory deduction query using SELECT FOR UPDATE with zero deadlocks",
      "Design an optimal indexing strategy for a 1M row vehicle search table with multi-attribute filters",
      "Compare PostgreSQL SERIALIZABLE isolation vs REPEATABLE READ in a ledger environment",
      "Explain how WAL checkpointing works in SQLite / LibSQL under heavy write bursts",
    ],
  },
  {
    key: "system_rfc",
    label: "System Design RFC",
    icon: Layers,
    description: "Generate comprehensive Request for Comments (RFCs) and architectural specifications.",
    placeholder: "Describe the system or feature requirement (e.g. Real-time vehicle pricing ticker)...",
    systemPrompt: `You are a Systems Architect drafting a production RFC for Joy Chandra Uday's software infrastructure.
Output a clean, thorough RFC Markdown document structured with:
1. Problem Statement & Business Goals
2. High-Level Architecture (Mermaid diagram if applicable)
3. Data Model & Storage Schema
4. Concurrency, Idempotency & Failure Semantics
5. Latency & Throughput Envelope (P95/P99 estimates)
6. Security & Observability`,
    presets: [
      "Draft an RFC for an idempotent webhook delivery worker with exponential backoff and dead-letter queue",
      "Design a real-time price change notifier using WebSockets and Redis pub/sub for 100k users",
      "Architect a transactional outbox pattern implementation for multi-service consistency",
      "Design an edge-cached vehicle search API with stale-while-revalidate guarantees",
    ],
  },
  {
    key: "translator",
    label: "Bilingual Technical Translator",
    icon: Languages,
    description: "Natural, idiomatic translation between English and Bengali (বাংলা) for engineering.",
    placeholder: "Enter English or Bengali technical text to translate...",
    systemPrompt: `You are a bilingual technical editor fluent in English and Bengali (বাংলা) for Joy Chandra Uday's portfolio.
Rules:
- Retain all code blocks (\`\`\`) exactly as written without translation.
- Translate technical concepts into elegant, fluent Bengali or natural English.
- Keep standard terminology accurate (e.g., race condition, lock contention, write-ahead log, idempotency).
- Do not add conversational conversational preamble; output only the translated markdown.`,
    presets: [
      "Translate to Bengali: 'Row-level locking guarantees transaction serializability under high concurrency.'",
      "Translate to Bengali: 'Optimistic UI updates paired with durable state machines eliminate client latency.'",
      "Translate to English: 'আমাদের ডিস্ট্রিবিউটেড ক্যাশে সিস্টেম প্রতি সেকেন্ডে বিশ হাজার রিকোয়েস্ট হ্যান্ডেল করতে পারে।'",
      "Translate to Bengali: 'Event-driven architectures require idempotent consumer handlers to prevent duplicate side effects.'",
    ],
  },
  {
    key: "bug_diagnostics",
    label: "Bug & Crash Diagnostics",
    icon: Bug,
    description: "Diagnose stack traces, runtime errors, and tricky Docker/database issues.",
    placeholder: "Paste error log, unhandled exception stack trace, or Docker crash report...",
    systemPrompt: `You are an expert systems debugger.
When presented with an error or stack trace:
1. State the exact root cause in 1-2 clear sentences.
2. Explain the mechanism (why it failed).
3. Provide the precise patch or corrective code diff.
4. Suggest a prevention strategy (e.g., TypeScript guard, database constraint, timeout).`,
    presets: [
      "Diagnose: PostgreSQL error: 'deadlock detected while executing transaction concurrent update'",
      "Diagnose: Next.js 'Error: Text content does not match server-rendered HTML' hydration error",
      "Diagnose: Node.js 'MaxListenersExceededWarning: Possible EventEmitter memory leak detected'",
      "Diagnose: SQLite/LibSQL 'Error: database is locked (5)' during parallel writes",
    ],
  },
  {
    key: "outreach",
    label: "Executive Outreach & DMs",
    icon: Mail,
    description: "Craft punchy cold emails, technical proposals, recruiter negotiations, and DMs.",
    placeholder: "Describe the recipient, goal, and context (e.g. Emailing CTO of Vercel for platform role)...",
    systemPrompt: `You are an executive career and client communication advisor for Joy Chandra Uday.
Draft punchy, confident, craftsmanship-driven emails or messages.
Avoid generic boilerplate. Highlight Joy's concrete production work (garirhat.com scale, StockFlow concurrency primitives, Grow With Owl edtech).
Keep it concise (3-4 paragraphs max).`,
    presets: [
      "Draft a 3-paragraph cold email to an Engineering Director about a Backend / Systems role",
      "Draft a confident salary negotiation response for a Senior Full-Stack role offer",
      "Draft a concise consulting proposal for optimizing a slow PostgreSQL marketplace query engine",
      "Draft a LinkedIn DM to an engineering lead expressing interest in distributed systems problems",
    ],
  },
];

interface HistoryEntry {
  id: string;
  mode: ModeKey;
  prompt: string;
  response: string;
  provider: string;
  latencyMs: number;
  timestamp: string;
}

export default function OpsAiWorkspace() {
  const [activeMode, setActiveMode] = useState<ModeKey>("general");
  const [provider, setProvider] = useState<"auto" | "groq" | "gemini">("auto");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [metaInfo, setMetaInfo] = useState<{ provider: string; latencyMs: number } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const currentMode = MODES.find((m) => m.key === activeMode) || MODES[0];

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("joy_ops_ai_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const saveToHistory = (entry: HistoryEntry) => {
    const updated = [entry, ...history.slice(0, 19)];
    setHistory(updated);
    try {
      localStorage.setItem("joy_ops_ai_history", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleClearHistory = () => {
    if (!confirm("Clear all session AI history?")) return;
    setHistory([]);
    try {
      localStorage.removeItem("joy_ops_ai_history");
    } catch {}
  };

  const handleExecute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setOutput("");
    setMetaInfo(null);

    try {
      const res = await fetch("/api/ops/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "completion",
          prompt,
          systemPrompt: currentMode.systemPrompt,
          provider,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.result || "No response generated.");
        const info = {
          provider: data.provider || "AI Engine",
          latencyMs: data.latencyMs || 0,
        };
        setMetaInfo(info);

        saveToHistory({
          id: `hist-${Date.now()}`,
          mode: activeMode,
          prompt,
          response: data.result,
          provider: info.provider,
          latencyMs: info.latencyMs,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err: any) {
      setOutput(`Execution failure: ${err.message || "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: HistoryEntry) => {
    setActiveMode(item.mode);
    setPrompt(item.prompt);
    setOutput(item.response);
    setMetaInfo({ provider: item.provider, latencyMs: item.latencyMs });
    setShowHistory(false);
  };

  // Keyboard shortcut: Ctrl + Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-text-primary">
              AI COPILOT WORKSPACE // DAILY ENGINEERING STUDIO
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent font-semibold">
              Live Qwen 3.8 / Gemini
            </span>
          </div>
          <p className="text-xs font-mono text-text-muted mt-1">
            Dedicated day-to-day assistant for code reviews, SQL & index tuning, RFC drafting, bilingual translation, and error diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface hover:bg-bg-elevated border border-border text-text-primary text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-accent" />
            <span>History ({history.length})</span>
          </button>
        </div>
      </div>

      {/* Workflow Tabs */}
      <div className="flex flex-wrap gap-2 pb-1 overflow-x-auto">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.key;
          return (
            <button
              key={mode.key}
              onClick={() => {
                setActiveMode(mode.key);
                setOutput("");
                setMetaInfo(null);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                isActive
                  ? "bg-accent text-black font-bold shadow-sm"
                  : "bg-bg-surface border border-border text-text-muted hover:text-text-primary hover:border-accent/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Console (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-4">
            {/* Mode Description & Provider Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <span className="text-xs font-mono text-text-muted truncate">
                {currentMode.description}
              </span>
            </div>

            {/* Provider Model Switcher */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-muted text-[11px] uppercase">Engine Model:</span>
              <div className="flex bg-bg border border-border rounded-lg p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setProvider("auto")}
                  className={`px-2 py-1 rounded transition-colors ${
                    provider === "auto" ? "bg-accent text-black font-bold" : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Auto-select ultra-fast Groq Qwen 3.8 with fallbacks"
                >
                  Auto (Qwen 3.8)
                </button>
                <button
                  type="button"
                  onClick={() => setProvider("groq")}
                  className={`px-2 py-1 rounded transition-colors ${
                    provider === "groq" ? "bg-accent text-black font-bold" : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Force Groq sub-400ms inference"
                >
                  Groq Live
                </button>
                <button
                  type="button"
                  onClick={() => setProvider("gemini")}
                  className={`px-2 py-1 rounded transition-colors ${
                    provider === "gemini" ? "bg-accent text-black font-bold" : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Force Gemini 3.5 Flash"
                >
                  Gemini Flash
                </button>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleExecute} className="space-y-3 font-mono text-xs">
              <div>
                <textarea
                  rows={9}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={currentMode.placeholder}
                  className="w-full bg-bg border border-border rounded-lg p-3 text-text-primary focus:outline-none focus:border-accent text-xs font-mono resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-text-muted">
                  Press <kbd className="px-1 py-0.5 bg-bg border border-border rounded">Ctrl+Enter</kbd> to run
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPrompt("");
                      setOutput("");
                      setMetaInfo(null);
                    }}
                    className="px-3 py-1.5 bg-bg border border-border hover:border-accent/40 text-text-muted hover:text-text-primary rounded-lg text-xs transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-accent hover:bg-accent-hover text-black font-semibold rounded-lg text-xs transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{loading ? "Executing..." : "Execute"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Preset Prompts */}
          <div className="bg-bg-surface border border-border rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold block">
              Quick {currentMode.label} Presets
            </span>
            <div className="space-y-1.5 font-mono text-[11px]">
              {currentMode.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(preset)}
                  className="w-full text-left p-2 rounded-lg bg-bg border border-border-subtle hover:border-accent/40 text-text-muted hover:text-text-primary transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-2">{preset}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Console (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Output Card */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-4 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-bold uppercase text-text-primary">
                  Engineering Synthesizer Output
                </span>
              </div>

              {metaInfo && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{metaInfo.provider}</span>
                  {metaInfo.latencyMs > 0 && (
                    <span className="text-text-muted">({metaInfo.latencyMs}ms)</span>
                  )}
                </div>
              )}
            </div>

            {/* Output Display */}
            <div className="flex-1 flex flex-col justify-start">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  <p className="text-xs font-mono text-accent animate-pulse">
                    ⚡ Synthesizing response with {provider === "gemini" ? "Gemini Flash" : "Groq Qwen 3.8 (sub-400ms)"}...
                  </p>
                  <p className="text-[10px] font-mono text-text-muted max-w-sm">
                    Running in high-precision mode with Joy's systems and concurrency background pre-loaded.
                  </p>
                </div>
              ) : output ? (
                <MarkdownPreview
                  content={output}
                  title={`${currentMode.label} // Response`}
                  filename={`joy-ops-${currentMode.key}.md`}
                  defaultMode="preview"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center font-mono space-y-2 text-text-muted border border-dashed border-border-subtle rounded-lg">
                  <Bot className="w-8 h-8 text-accent/50 mb-1" />
                  <p className="text-xs text-text-primary">Workspace Ready</p>
                  <p className="text-[11px] max-w-sm">
                    Select a mode tab, choose a preset or paste code/query, and press Execute or Ctrl+Enter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History Drawer Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-bg-surface border-l border-border h-[100dvh] p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-accent" />
                <span className="font-bold text-text-primary uppercase">Session AI History</span>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-text-muted hover:text-text-primary"
              >
                Close
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-text-muted py-6 text-center">No history recorded yet in this session.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-1 text-[10px] text-red-400 hover:underline"
                  >
                    <Trash2 className="w-3 h-3" /> Clear History
                  </button>
                </div>

                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="p-3 bg-bg border border-border-subtle hover:border-accent/40 rounded-lg cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-accent uppercase font-bold">{item.mode}</span>
                      <span className="text-text-muted">{item.timestamp}</span>
                    </div>
                    <p className="text-text-primary line-clamp-2 text-[11px]">{item.prompt}</p>
                    <div className="text-[10px] text-text-muted flex items-center justify-between pt-1">
                      <span>{item.provider}</span>
                      {item.latencyMs > 0 && <span>{item.latencyMs}ms</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}