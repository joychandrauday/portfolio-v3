"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  CornerDownRight,
  Send,
  Copy,
  Check,
  Tag,
  Eye,
  Edit3,
} from "lucide-react";
import MarkdownPreview from "@/components/MarkdownPreview";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  responded: boolean;
  aiCategory?: string | null;
  aiDraft?: string | null;
  repliedAt?: string | null;
  createdAt: string;
}

export default function OpsInboxPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyInq, setActiveReplyInq] = useState<Inquiry | null>(null);
  const [editedDraft, setEditedDraft] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [transmitting, setTransmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/ops/inbox");
      const data = await res.json();
      if (Array.isArray(data)) setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleRead = async (inq: Inquiry) => {
    try {
      await fetch("/api/ops/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inq.id, isRead: !inq.isRead }),
      });
      fetchInquiries();
    } catch {
      alert("Update failed");
    }
  };

  const handleToggleResponded = async (inq: Inquiry) => {
    try {
      await fetch("/api/ops/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inq.id, responded: !inq.responded }),
      });
      fetchInquiries();
    } catch {
      alert("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry from archive?")) return;
    try {
      await fetch("/api/ops/inbox", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchInquiries();
      if (activeReplyInq?.id === id) setActiveReplyInq(null);
    } catch {
      alert("Delete failed");
    }
  };

  const handleOpenReplyBox = (inq: Inquiry) => {
    setActiveReplyInq(inq);
    setEditedDraft(inq.aiDraft || "");
    if (!inq.aiDraft) {
      handleGenerateReplyAI(inq);
    }
  };

  const handleGenerateReplyAI = async (inq: Inquiry) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ops/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "completion",
          prompt: `Draft a professional, courteous, and crisp email response from Joy Chandra Uday (Software Engineer at garirhat.com, Founder of Grow With Owl) to:
Sender: ${inq.name} <${inq.email}>
Subject: ${inq.subject || "Inquiry"}
Message received:
${inq.message}

Tone: Polite, engineering-focused, warm, and concise. Avoid corporate clichés.`,
        }),
      });
      const data = await res.json();
      const draft = data.result || data.error;
      setEditedDraft(draft);

      // Save generated draft back to inquiry
      await fetch("/api/ops/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inq.id, aiDraft: draft }),
      });
      fetchInquiries();
    } catch {
      setEditedDraft("Draft generation failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleTransmitReply = async (inq: Inquiry) => {
    if (!editedDraft.trim()) return;
    setTransmitting(true);
    try {
      const res = await fetch("/api/ops/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inq.id,
          replyText: editedDraft,
          recipientEmail: inq.email,
          recipientName: inq.name,
          subject: inq.subject,
        }),
      });
      const data = await res.json();
      alert(data.message || "Response logged and dispatched!");
      await fetchInquiries();
      setActiveReplyInq(null);
    } catch (e: any) {
      alert("Transmission error: " + e.message);
    } finally {
      setTransmitting(false);
    }
  };

  const copyDraft = () => {
    navigator.clipboard.writeText(editedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-text-primary flex flex-wrap items-center gap-2">
            <Mail className="w-5 h-5 text-accent" />
            COMMUNICATION & INQUIRIES INBOX
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            Autonomous inbound processing: auto-classification, instant AI reply drafting, and 1-click dispatch.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-bg-surface border border-border rounded-xl p-8 text-center font-mono text-xs text-text-muted animate-pulse">
          Loading archived inquiries...
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-bg-surface border border-border rounded-xl p-8 text-center font-mono text-xs text-text-muted">
          Your inbox is clean. No incoming inquiries at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`bg-bg-surface border rounded-xl p-5 font-mono text-xs transition-all space-y-3 ${
                !inq.isRead
                  ? "border-accent/50 shadow-sm shadow-accent/5 bg-accent/[0.02]"
                  : inq.responded
                  ? "border-border/70 opacity-90"
                  : "border-border"
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-subtle">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      !inq.isRead ? "bg-accent animate-pulse" : inq.responded ? "bg-emerald-500" : "bg-text-muted/40"
                    }`}
                  />
                  <span className="font-bold text-text-primary text-sm font-sans">{inq.name}</span>
                  
                  <a
                    href={`mailto:${inq.email}`}
                    className="text-text-muted hover:text-accent underline text-xs"
                  >
                    {inq.email}
                  </a>

                  {/* AI Category Pill */}
                  {inq.aiCategory && (
                    <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent text-[10px] uppercase font-semibold">
                      {inq.aiCategory}
                    </span>
                  )}

                  {inq.aiDraft && !inq.responded && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-semibold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>AI Draft Ready</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>{new Date(inq.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Subject */}
              {inq.subject && (
                <div className="text-accent font-semibold text-xs flex items-center gap-1.5">
                  <Tag className="w-3 h-3 opacity-60" />
                  <span>{inq.subject}</span>
                </div>
              )}

              {/* Original Message */}
              <p className="text-text-primary whitespace-pre-wrap leading-relaxed text-xs font-sans p-3 bg-bg/50 border border-border/50 rounded">
                {inq.message}
              </p>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(inq)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      inq.isRead
                        ? "bg-bg text-text-muted hover:text-text-primary"
                        : "bg-accent/20 text-accent font-bold"
                    }`}
                  >
                    {inq.isRead ? "Mark Unread" : "Mark as Read"}
                  </button>

                  <button
                    onClick={() => handleToggleResponded(inq)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      inq.responded
                        ? "bg-emerald-500/20 text-emerald-400 font-bold"
                        : "bg-bg text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {inq.responded ? "✓ Responded" : "Mark Responded"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReplyBox(inq)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-accent hover:bg-accent-hover text-black font-semibold rounded text-[11px] transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{inq.aiDraft ? "Review & Send AI Reply" : "Generate AI Reply"}</span>
                  </button>

                  <a
                    href={`mailto:${inq.email}?subject=${encodeURIComponent(
                      "Re: " + (inq.subject || "Your message to Joy Chandra Uday")
                    )}&body=${encodeURIComponent(inq.aiDraft || "")}`}
                    className="flex items-center gap-1 px-3 py-1 bg-bg-surface hover:bg-bg border border-border text-text-primary rounded text-[11px] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    <span>Mailto</span>
                  </a>

                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="p-1 text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Autonomous Draft Review Drawer */}
              {activeReplyInq?.id === inq.id && (
                <div className="mt-4 p-4 bg-bg border border-accent/40 rounded-lg space-y-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border text-[11px]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span className="text-accent font-bold uppercase tracking-wider">
                        Autonomous AI Reply Drafter (Groq Qwen 3.8)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="px-2 py-0.5 rounded border border-border bg-bg-surface hover:text-text-primary text-[10px] cursor-pointer"
                      >
                        {previewMode ? "Edit Raw Text" : "Rendered Preview"}
                      </button>

                      <button
                        type="button"
                        onClick={copyDraft}
                        className="flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-bg-surface hover:text-text-primary text-[10px] cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 opacity-60" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveReplyInq(null)}
                        className="text-text-muted hover:text-text-primary px-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {aiLoading ? (
                    <div className="py-8 text-center text-accent animate-pulse font-mono text-xs">
                      Analyzing inquiry context and drafting personalized response with Groq...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {previewMode ? (
                        <MarkdownPreview
                          content={editedDraft || "*(No draft generated)*"}
                          title={`Reply to: ${inq.name}`}
                          filename={`reply-${inq.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`}
                          defaultMode="preview"
                        />
                      ) : (
                        <textarea
                          rows={8}
                          value={editedDraft}
                          onChange={(e) => setEditedDraft(e.target.value)}
                          className="w-full bg-bg-surface border border-border focus:border-accent rounded p-3 text-text-primary font-mono text-xs leading-relaxed"
                        />
                      )}

                      {/* Transmit Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
                        <span className="text-[10px] text-text-muted font-sans">
                          Dispatches response and marks status as Responded in ledger.
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleGenerateReplyAI(inq)}
                            disabled={aiLoading}
                            className="px-3 py-1.5 rounded border border-border text-text-muted hover:text-text-primary text-[11px] cursor-pointer"
                          >
                            Regenerate with AI
                          </button>

                          <button
                            type="button"
                            disabled={transmitting || !editedDraft.trim()}
                            onClick={() => handleTransmitReply(inq)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-accent hover:bg-accent-hover text-black font-semibold rounded text-xs transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{transmitting ? "Transmitting..." : "Transmit & Mark Responded"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
