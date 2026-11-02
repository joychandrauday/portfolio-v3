"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import { Send, CheckCircle2, AlertCircle, Copy, Check, Terminal, MapPin, Mail } from "lucide-react";

export default function SyncContact() {
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
    <section
      id="contact"
      className="relative min-h-screen w-full bg-[#030303] flex flex-col items-center justify-center py-28 px-6 sm:px-12 antialiased overflow-hidden"
    >
      {/* Background Aceternity Curved Vector Beams */}
      <div className="absolute inset-0 flex h-full w-full items-center justify-center opacity-30 pointer-events-none">
        <svg
          className="h-full w-full"
          width="100%"
          height="100%"
          viewBox="0 0 696 316"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827"
            stroke="url(#beamGrad)"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-px w-8 bg-accent" />
            <span>TRANSMISSION TERMINAL</span>
            <span className="h-px w-8 bg-accent" />
          </div>

          <h2
            className={`text-6xl sm:text-8xl font-black tracking-tighter uppercase text-white ${
              isBn ? "font-bengali" : "font-sans"
            }`}
          >
            {isBn ? "যোগাযোগ শুরু করুন।" : "Let's Sync."}
          </h2>

          <p
            className={`max-w-xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed ${
              isBn ? "font-bengaliSerif text-lg text-text-primary/80" : "font-sans"
            }`}
          >
            {isBn
              ? "বর্তমানে ফুল-স্ট্যাক ও ব্যাকএন্ড সফটওয়্যার ইঞ্জিনিয়ারিং প্রজেক্ট এবং রিমোট রোলের জন্য উন্মুক্ত।"
              : "Currently available for full-stack opportunities, distributed systems consulting, and high-impact collaborations."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs pt-2">
            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-accent/40 text-text-primary transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied {siteConfig.email}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-accent" />
                  <span>{siteConfig.email}</span>
                </>
              )}
            </button>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/[0.06] text-text-muted">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>Dhaka & Patuakhali, Bangladesh (UTC+6)</span>
            </div>
          </div>
        </div>

        {/* Minimalist Interactive Form */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-md border border-white/[0.08] shadow-2xl">
          {status === "success" ? (
            <div className="py-12 text-center space-y-4 font-mono text-xs">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-sans">
                {t.contact.successTitle}
              </h3>
              <p className="text-text-muted max-w-sm mx-auto leading-relaxed">
                {t.contact.successMsg}
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 px-6 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-black font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Send Another Transmission
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
              {status === "error" && (
                <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-muted uppercase text-[10px] tracking-wider mb-2">
                    {t.contact.nameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-[#121212] border border-white/[0.08] focus:border-accent rounded-xl px-4 py-3 text-text-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-text-muted uppercase text-[10px] tracking-wider mb-2">
                    {t.contact.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full bg-[#121212] border border-white/[0.08] focus:border-accent rounded-xl px-4 py-3 text-text-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted uppercase text-[10px] tracking-wider mb-2">
                  {t.contact.subjectLabel}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Senior Software Engineer Opportunity / Systems Architecture"
                  className="w-full bg-[#121212] border border-white/[0.08] focus:border-accent rounded-xl px-4 py-3 text-text-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-text-muted uppercase text-[10px] tracking-wider mb-2">
                  {t.contact.messageLabel} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your tech stack, team goals, or project scope..."
                  className="w-full bg-[#121212] border border-white/[0.08] focus:border-accent rounded-xl p-4 text-text-primary focus:outline-none transition-colors font-sans text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-black font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-accent/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{status === "loading" ? t.contact.sending : t.contact.sendButton}</span>
                  <Send className="w-4 h-4" />
                </button>

                <div className="text-[11px] text-text-muted font-mono">
                  Routed instantly to Joy's SQLite /ops dashboard
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
