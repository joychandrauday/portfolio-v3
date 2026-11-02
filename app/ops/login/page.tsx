"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Shield, ArrowRight, Lock, Key } from "lucide-react";

export default function OpsLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/ops/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Access denied");
      } else {
        router.push("/ops");
        router.refresh();
      }
    } catch {
      setError("Network or operational error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 selection:bg-accent selection:text-black">
      <div className="w-full max-w-md bg-bg-surface border border-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-accent/60 blur-[2px]" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-text-primary">
              JOY // OPS GATEWAY
            </h1>
            <p className="text-xs text-text-muted font-mono">
              Personal Operations & Command Center
            </p>
          </div>
        </div>

        <div className="bg-bg-elevated/70 border border-border-subtle rounded-lg p-3 mb-6 font-mono text-xs text-text-muted flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent shrink-0" />
          <span>Restricted gateway. Authentication required for system management.</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-xs font-mono text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-accent" /> Master Access Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter master password..."
              autoFocus
              className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-accent hover:bg-accent-hover text-black font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-muted">
          <span className="flex items-center gap-1">
            <Key className="w-3 h-3 text-accent/70" /> Default: <code className="text-accent/90">joyuday2025</code>
          </span>
          <a
            href="/"
            className="hover:text-accent transition-colors underline underline-offset-4"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
