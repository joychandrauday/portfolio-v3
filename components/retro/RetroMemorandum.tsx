"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import { Send, CheckCircle2, AlertCircle, Copy, Check, Mail } from "lucide-react";

export default function RetroMemorandum() {
  const { isBn } = useLanguage();
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
    setTimeout(() => setCopied(false), 2200);
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
        setErrorMessage(data.error || "Failed to transmit message.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Failed to transmit message. Please retry.");
    }
  };

  return (
    <section id="memorandum" className="py-12 sm:py-20 border-b border-border/70 scroll-mt-6">
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase tracking-widest">
              [ SECTION VI // POSTBOX & MEMORANDUM ]
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal">
              {isBn ? "সরাসরি যোগাযোগ ও বার্তা প্রেরণ" : "Memorandum & Direct Dispatch"}
            </h3>
          </div>
          <span className="font-mono text-xs text-text-muted">
            {isBn ? "প্রতিক্রিয়ার সময়: < ২৪ ঘন্টা" : "Direct Postbox"}
          </span>
        </div>

        {/* Vintage Memorandum Stationery Card */}
        <div className="p-6 sm:p-10 bg-bg-surface border-2 border-border rounded-sm shadow-xs space-y-6 relative">
          
          {/* Header of the Memorandum */}
          <div className="border-b-2 border-double border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-[10px] tracking-widest uppercase text-text-muted">
                COMMUNICATION DISPATCH FORM
              </div>
              <div className="text-sm font-serif font-bold text-text-primary">
                MEMORANDUM FOR JOY CHANDRA UDAY
              </div>
            </div>

            <button
              onClick={copyEmail}
              aria-label="Copy email address"
              className="px-3 py-1.5 rounded border border-border bg-bg hover:border-text-primary text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Mail className="w-3.5 h-3.5 opacity-60" />
              <span>{siteConfig.email}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-40" />
              )}
            </button>
          </div>

          {/* Form or Confirmation */}
          {status === "success" ? (
            <div className="p-8 border border-emerald-600/30 bg-emerald-500/5 rounded-sm text-center space-y-3 font-mono">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold text-text-primary">
                {isBn ? "বার্তা সফলভাবে প্রেরিত হয়েছে" : "Dispatch Transmitted & Cataloged"}
              </h4>
              <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                Your memorandum has been received. I typically respond to all technical inquiries within 24 hours.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-3 px-4 py-2 rounded border border-border text-xs text-text-primary hover:border-text-primary transition-colors cursor-pointer"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
              {status === "error" && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-600 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-text-muted">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Linus Torvalds"
                    className="w-full bg-bg border border-border focus:border-text-primary rounded-sm px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-colors text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-text-muted">
                    Return Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@organization.com"
                    className="w-full bg-bg border border-border focus:border-text-primary rounded-sm px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-colors text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-text-muted">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Platform architecture, consulting, or engineering collaboration"
                  className="w-full bg-bg border border-border focus:border-text-primary rounded-sm px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-colors text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-text-muted">
                  Memorandum Body
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry, distributed systems challenge, or proposal..."
                  className="w-full bg-bg border border-border focus:border-text-primary rounded-sm p-3.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none transition-colors text-xs font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-[11px] text-text-muted font-sans">
                  Dispatches are delivered directly and securely.
                </span>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-3 rounded-sm bg-text-primary text-bg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0"
                >
                  <span>{status === "loading" ? "TRANSMITTING..." : "TRANSMIT DISPATCH"}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
