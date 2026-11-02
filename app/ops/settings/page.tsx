"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Key,
  Shield,
  Sparkles,
  Mail,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

export default function OpsSettingsPage() {
  const [copiedKey, setCopiedKey] = useState("");

  const copyTemplate = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const envSample = `# Database (PostgreSQL — Neon / Vercel Postgres)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Security & Ops Authentication
OPS_ADMIN_PASSWORD="your-strong-password-here"
JWT_SECRET="generate-any-random-string-at-least-32-chars"

# AI Free Tier Providers (Groq & Google Gemini)
GROQ_API_KEY="" # https://console.groq.com/keys (Fastest Llama 3 inference, Free)
GEMINI_API_KEY="" # https://aistudio.google.com/app/apikey (Google Gemini 1.5, Free)

# Email Notifications (Optional for automatic alerts)
RESEND_API_KEY="" # https://resend.com/api-keys (Free 3000 emails/mo)
`;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-text-primary flex flex-wrap items-center gap-2">
          <Settings className="w-5 h-5 text-accent" />
          SYSTEM CONFIGURATION & INTEGRATIONS
        </h1>
        <p className="text-xs font-mono text-text-muted mt-1">
          Manage your AI model free tiers, database persistence, and operational security keys.
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Groq Card */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" /> Groq Cloud (Llama 3.3 70B)
            </span>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-accent hover:underline flex items-center gap-1"
            >
              Get Free Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-text-muted text-[11px] leading-relaxed">
            Ultra low-latency inference for instant cover letters, interview Q&A generation, and rapid bilingual drafting. 100% Free tier available with generous rate limits.
          </p>
          <div className="text-[11px] text-text-muted pt-2 border-t border-border-subtle">
            Variable: <code className="text-accent">GROQ_API_KEY</code> in <code className="text-text-primary">.env.local</code>
          </div>
        </div>

        {/* Gemini Card */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" /> Google Gemini (1.5 Flash)
            </span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-accent hover:underline flex items-center gap-1"
            >
              Get Free Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-text-muted text-[11px] leading-relaxed">
            State-of-the-art context window and outstanding natural translation quality between English and Bengali (বাংলা). Free up to 15 requests per minute.
          </p>
          <div className="text-[11px] text-text-muted pt-2 border-t border-border-subtle">
            Variable: <code className="text-accent">GEMINI_API_KEY</code> in <code className="text-text-primary">.env.local</code>
          </div>
        </div>

        {/* Resend Email Card */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-primary flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" /> Resend Email Dispatcher
            </span>
            <a
              href="https://resend.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-accent hover:underline flex items-center gap-1"
            >
              Get Free Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-text-muted text-[11px] leading-relaxed">
            Delivers immediate inbox notifications to your personal email whenever someone submits an inquiry on your portfolio form.
          </p>
          <div className="text-[11px] text-text-muted pt-2 border-t border-border-subtle">
            Variable: <code className="text-accent">RESEND_API_KEY</code> in <code className="text-text-primary">.env.local</code>
          </div>
        </div>

        {/* Database & Storage Card */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-primary flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" /> PostgreSQL (Neon) · Prisma ORM
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
              CONNECTED
            </span>
          </div>
          <p className="text-text-muted text-[11px] leading-relaxed">
            Powered by serverless PostgreSQL on Neon and the Prisma ORM. Schema migrations and seeding run with <code className="text-accent">prisma db push</code> and <code className="text-accent">npm run db:seed</code>.
          </p>
          <div className="text-[11px] text-text-muted pt-2 border-t border-border-subtle">
            Provider: <code className="text-accent">postgresql</code> · Client: <code className="text-accent">@prisma/client</code>
          </div>
        </div>
      </div>

      {/* Environment Config Snippet Box */}
      <div className="bg-bg-surface border border-border rounded-xl p-6 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <span className="font-bold text-text-primary flex items-center gap-2">
            <Key className="w-4 h-4 text-accent" />
            Environment Template (`.env.local`)
          </span>
          <button
            onClick={() => copyTemplate(envSample, "env")}
            className="flex items-center gap-1 text-accent hover:text-accent-hover transition-colors"
          >
            {copiedKey === "env" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === "env" ? "Copied" : "Copy Template"}</span>
          </button>
        </div>

        <pre className="bg-bg p-4 rounded-lg overflow-x-auto text-[11px] text-text-muted leading-relaxed border border-border-subtle">
          {envSample}
        </pre>
      </div>
    </div>
  );
}
