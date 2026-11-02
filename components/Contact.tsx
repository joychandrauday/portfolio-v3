"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import { Send, CheckCircle2, AlertCircle, Copy, Check, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const { t, isBn } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || t.contact.errorMsg);
      }
    } catch {
      setStatus("error");
      setErrorMessage(t.contact.errorMsg);
    }
  };

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
          <span className="text-accent font-bold">[ 06 ]</span>
          <span className="tracking-widest uppercase text-text-primary">
            {t.contact.title}
          </span>
          <span className="text-white/20">/</span>
          <span>INITIATE TRANSMISSION</span>
        </div>

        {/* Big Heading */}
        <div className="max-w-3xl space-y-4">
          <h2
            className={`text-3xl sm:text-5xl font-bold tracking-tight text-[#f7f7f7] ${
              isBn ? "font-bengali" : "font-sans"
            }`}
          >
            {t.contact.subtitle}
          </h2>

          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-text-muted pt-2">
            <span>DIRECT INBOX:</span>
            <button
              onClick={copyEmail}
              className="text-text-primary hover:text-accent font-semibold transition-colors flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-accent" />
                  <span>{siteConfig.email}</span>
                </>
              )}
            </button>
            <span>/</span>
            <span>{siteConfig.location}</span>
          </div>
        </div>

        {/* Minimalist Dispatch Form (No boxes, pure minimal lines) */}
        <div className="max-w-3xl">
          {status === "success" ? (
            <div className="py-12 space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.contact.successTitle}</span>
              </div>
              <p
                className={`text-text-secondary leading-relaxed ${
                  isBn ? "font-bengali text-sm" : ""
                }`}
              >
                {t.contact.successMsg}
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 px-5 py-2.5 rounded-full bg-white text-black font-semibold uppercase tracking-wider text-[11px] hover:bg-accent transition-colors"
              >
                Send Another Transmission
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 font-mono text-xs">
              {status === "error" && (
                <div className="p-3 bg-red-950/30 border border-red-800/40 rounded text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-text-muted uppercase text-[10px] tracking-widest">
                    {t.contact.nameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-transparent border-b border-white/[0.15] focus:border-accent py-2 text-text-primary text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-text-muted uppercase text-[10px] tracking-widest">
                    {t.contact.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full bg-transparent border-b border-white/[0.15] focus:border-accent py-2 text-text-primary text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-text-muted uppercase text-[10px] tracking-widest">
                  {t.contact.subjectLabel}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Software Engineering Opening / Distributed Architecture Consultation"
                  className="w-full bg-transparent border-b border-white/[0.15] focus:border-accent py-2 text-text-primary text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-text-muted uppercase text-[10px] tracking-widest">
                  {t.contact.messageLabel} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe project requirements, timeline, or engineering role..."
                  className="w-full bg-transparent border-b border-white/[0.15] focus:border-accent py-2 text-text-primary text-sm focus:outline-none transition-colors font-sans leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-8 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  <span>{status === "loading" ? t.contact.sending : t.contact.sendButton}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>

                <div className="text-[11px] text-text-muted hidden sm:block">
                  Committed directly to SQLite `/ops` database
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
