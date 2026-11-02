"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import { Send, CheckCircle2, AlertCircle, Copy, Check, ArrowUpRight } from "lucide-react";

export default function WorkWithMe() {
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
        setErrorMessage(data.error || "Failed to transmit message.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Failed to transmit message. Please retry.");
    }
  };

  return (
    <section id="contact" className="space-y-6 pt-10 border-t border-border">
      <div className="flex items-center justify-between font-mono text-xs">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
          {isBn ? "যোগাযোগ" : "Contact"}
        </h2>
        <span className="text-text-muted text-[11px]">[ 04 ]</span>
      </div>

      <div className="space-y-3">
        <p
          className={`text-sm text-text-secondary leading-relaxed ${
            isBn ? "font-bengali text-base text-text-primary/80" : "font-sans"
          }`}
        >
          {isBn
            ? "প্ল্যাটফর্ম স্কেলিং, ব্যাকএন্ড কনসালটেন্সি বা নতুন সফটওয়্যার ইঞ্জিনিয়ারিং উদ্যোগের বিষয়ে সরাসরি বার্তা পাঠাতে পারেন।"
            : "Available for platform engineering, systems architecture consulting, and high-impact software roles."}
        </p>

        <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
          <button
            onClick={copyEmail}
            className="hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied email</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 opacity-60" />
                <span>{siteConfig.email}</span>
              </>
            )}
          </button>
          <span>•</span>
          <span>Dhaka & Patuakhali, BD</span>
        </div>
      </div>

      {/* Direct Contact Form */}
      <div className="pt-2">
        {status === "success" ? (
          <div className="py-4 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Message received</span>
            </div>
            <p className="text-text-secondary">
              Your inquiry has been logged in my /ops hub. I typically respond within 24 hours.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-accent underline cursor-pointer pt-1"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 font-sans text-xs">
            {status === "error" && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full bg-bg-surface border border-border focus:border-text-primary rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors"
              />

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full bg-bg-surface border border-border focus:border-text-primary rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors"
              />
            </div>

            <textarea
              rows={3}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Message"
              className="w-full bg-bg-surface border border-border focus:border-text-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted/60 focus:outline-none transition-colors leading-relaxed"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 rounded-lg bg-text-primary text-bg font-medium text-xs hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <span>{status === "loading" ? "Sending..." : "Send"}</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        )}
      </div>

      {/* Minimal Footer */}
      <div className="pt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-text-muted border-t border-border/60">
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-primary transition-colors flex items-center gap-0.5"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
          <span>•</span>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-primary transition-colors flex items-center gap-0.5"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
          <span>•</span>
          <a
            href={siteConfig.x}
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-primary transition-colors flex items-center gap-0.5"
          >
            <span>Twitter/X</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        </div>

        <div className="text-[11px] text-text-muted">
          © {new Date().getFullYear()} Joy Chandra Uday
        </div>
      </div>
    </section>
  );
}
