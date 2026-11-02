"use client";

import React, { useEffect, useState } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Languages,
  Sparkles,
  Save,
  Check,
  Eye,
  ExternalLink,
  Clock,
  Share2,
  X,
  Copy,
  Download,
  Send,
  Linkedin,
  Twitter,
  Code,
} from "lucide-react";

interface PostItem {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  contentEn: string;
  contentBn: string;
  tags: string[];
  readingTimeMinutes: number;
  published: boolean;
  publishedAt: string | null;
  coverImage?: string | null;
}

export default function OpsPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"en" | "bn">("en");
  const [isEditing, setIsEditing] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Syndication Modal State
  const [syndicatePostModal, setSyndicatePostModal] = useState<PostItem | null>(null);
  const [syndicatePlatform, setSyndicatePlatform] = useState<"linkedin" | "devto" | "twitter">("linkedin");
  const [syndicateLoading, setSyndicateLoading] = useState(false);
  const [syndicateOutput, setSyndicateOutput] = useState("");

  const [currentPost, setCurrentPost] = useState<PostItem>({
    id: "",
    slug: "",
    titleEn: "",
    titleBn: "",
    excerptEn: "",
    excerptBn: "",
    contentEn: "",
    contentBn: "",
    tags: ["Engineering", "Architecture"],
    readingTimeMinutes: 4,
    published: false,
    publishedAt: null,
  });

  const [tagInput, setTagInput] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/ops/posts");
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = () => {
    setCurrentPost({
      id: `post-${Date.now()}`,
      slug: "",
      titleEn: "",
      titleBn: "",
      excerptEn: "",
      excerptBn: "",
      contentEn: "",
      contentBn: "",
      tags: ["Engineering"],
      readingTimeMinutes: 3,
      published: false,
      publishedAt: null,
    });
    setIsEditing(true);
    setActiveTab("en");
  };

  const handleEdit = (p: PostItem) => {
    setCurrentPost(p);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await fetch("/api/ops/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchPosts();
      if (currentPost.id === id) setIsEditing(false);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/ops/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPost),
      });
      if (res.ok) {
        await fetchPosts();
        setIsEditing(false);
      } else {
        alert("Failed to save post");
      }
    } catch {
      alert("Error saving");
    } finally {
      setSaving(false);
    }
  };

  // AI Auto-translate English to Bengali
  const handleAITranslate = async () => {
    if (!currentPost.titleEn && !currentPost.contentEn) {
      alert("Please enter English title and content first.");
      return;
    }

    setTranslating(true);
    try {
      const textToTranslate = `${currentPost.titleEn}\n---EXCERPT---\n${currentPost.excerptEn}\n---CONTENT---\n${currentPost.contentEn}`;

      const res = await fetch("/api/ops/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "translate",
          text: textToTranslate,
          targetLang: "bn",
        }),
      });

      const data = await res.json();
      if (data.result) {
        const parts = data.result.split(/---(?:EXCERPT|CONTENT)---/);
        if (parts.length >= 3) {
          setCurrentPost((prev) => ({
            ...prev,
            titleBn: parts[0].trim(),
            excerptBn: parts[1].trim(),
            contentBn: parts[2].trim(),
          }));
        } else {
          setCurrentPost((prev) => ({
            ...prev,
            contentBn: data.result,
          }));
        }
        setActiveTab("bn");
      }
    } catch (err) {
      alert("AI translation failed. Check API keys in settings.");
    } finally {
      setTranslating(false);
    }
  };

  // Multi-Platform Syndication Trigger
  const handleOpenSyndication = async (post: PostItem, platform: "linkedin" | "devto" | "twitter" = "linkedin") => {
    setSyndicatePostModal(post);
    setSyndicatePlatform(platform);
    setSyndicateLoading(true);
    setSyndicateOutput("");

    try {
      const res = await fetch("/api/ops/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "syndicate",
          title: post.titleEn || post.titleBn,
          content: post.contentEn || post.contentBn,
          platform,
        }),
      });
      const data = await res.json();
      setSyndicateOutput(data.result || data.error || "Generation error");
    } catch {
      setSyndicateOutput("Failed to generate platform package.");
    } finally {
      setSyndicateLoading(false);
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (!currentPost.tags.includes(tagInput.trim())) {
      setCurrentPost({
        ...currentPost,
        tags: [...currentPost.tags, tagInput.trim()],
      });
    }
    setTagInput("");
  };

  const removeTag = (t: string) => {
    setCurrentPost({
      ...currentPost,
      tags: currentPost.tags.filter((tag) => tag !== t),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-text-primary">
              BILINGUAL CONTENT STUDIO & SYNDICATOR
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent">
              Phase 3 Active
            </span>
          </div>
          <p className="text-xs font-mono text-text-muted mt-1">
            Bilingual publishing (EN ➔ BN) with automated multi-platform export for LinkedIn, Dev.to, and X.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleNewPost}
            className="flex items-center gap-2 px-3 py-2 bg-accent hover:bg-accent-hover text-black font-semibold text-xs font-mono rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit / Create Form */
        <div className="bg-bg-surface border border-border rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Language View:
              </span>
              <div className="flex bg-bg border border-border rounded-lg p-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeTab === "en" ? "bg-accent text-black font-bold" : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("bn")}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeTab === "bn" ? "bg-accent text-black font-bold" : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  বাংলা (Bengali)
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAITranslate}
                disabled={translating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 rounded-lg text-xs font-mono transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{translating ? "Translating with Groq..." : "AI Auto-Translate (EN ➔ BN)"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenSyndication(currentPost, "linkedin")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated border border-border hover:border-accent text-text-primary rounded-lg text-xs font-mono transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-accent" />
                <span>Syndicate Post</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-bg border border-border rounded-lg text-xs font-mono text-text-muted hover:text-text-primary"
              >
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Slug & Settings row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Slug URL</label>
                <input
                  type="text"
                  value={currentPost.slug}
                  onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                  placeholder="e.g. scalable-systems-architecture"
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Reading Time (min)</label>
                <input
                  type="number"
                  value={currentPost.readingTimeMinutes}
                  onChange={(e) =>
                    setCurrentPost({ ...currentPost, readingTimeMinutes: Number(e.target.value) })
                  }
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                  <input
                    type="checkbox"
                    checked={currentPost.published}
                    onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className={currentPost.published ? "text-emerald-400 font-bold" : "text-text-muted"}>
                    {currentPost.published ? "✓ Published Live" : "Draft (Unpublished)"}
                  </span>
                </label>
              </div>
            </div>

            {/* Language Content fields */}
            {activeTab === "en" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={currentPost.titleEn}
                    onChange={(e) => setCurrentPost({ ...currentPost, titleEn: e.target.value })}
                    placeholder="Article title in English..."
                    required
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm font-sans text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Excerpt (English)</label>
                  <textarea
                    rows={2}
                    value={currentPost.excerptEn}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerptEn: e.target.value })}
                    placeholder="Brief summary for preview cards..."
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs font-sans text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-text-muted">
                      Content Markdown (English)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-1 text-[11px] font-mono text-accent hover:underline cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{showPreview ? "Hide Preview" : "Preview .md Code"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={currentPost.contentEn}
                    onChange={(e) => setCurrentPost({ ...currentPost, contentEn: e.target.value })}
                    placeholder="Write article in standard markdown..."
                    className="w-full bg-bg border border-border rounded-lg p-3 text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
                  />
                  {showPreview && (
                    <div className="mt-3">
                      <MarkdownPreview
                        content={currentPost.contentEn || "*(No English markdown content entered yet)*"}
                        title={`Preview: ${currentPost.titleEn || "English Article"}`}
                        filename={`${currentPost.slug || "article"}-en.md`}
                        defaultMode="split"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">শিরোনাম (বাংলা)</label>
                  <input
                    type="text"
                    value={currentPost.titleBn}
                    onChange={(e) => setCurrentPost({ ...currentPost, titleBn: e.target.value })}
                    placeholder="নিবন্ধের শিরোনাম বাংলায় লিখুন..."
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm font-bengali text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">সারাংশ (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={currentPost.excerptBn}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerptBn: e.target.value })}
                    placeholder="সংক্ষিপ্ত ভূমিকা..."
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs font-bengali text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-text-muted">
                      সম্পূর্ণ বিবরণ (বাংলায় মার্কডাউন)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-1 text-[11px] font-mono text-accent hover:underline cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{showPreview ? "প্রিভিউ লুকান" : "প্রিভিউ .md কোড"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={currentPost.contentBn}
                    onChange={(e) => setCurrentPost({ ...currentPost, contentBn: e.target.value })}
                    placeholder="বাংলায় বিস্তারিত লিখুন..."
                    className="w-full bg-bg border border-border rounded-lg p-3 text-xs font-bengali text-text-primary focus:outline-none focus:border-accent"
                  />
                  {showPreview && (
                    <div className="mt-3">
                      <MarkdownPreview
                        content={currentPost.contentBn || "*(কোনো বাংলা কন্টেন্ট যুক্ত করা হয়নি)*"}
                        title={`প্রিভিউ: ${currentPost.titleBn || "বাংলা নিবন্ধ"}`}
                        filename={`${currentPost.slug || "article"}-bn.md`}
                        defaultMode="split"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags row */}
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentPost.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-bg border border-border rounded text-[11px] font-mono text-text-primary"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-text-muted hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag and hit Enter..."
                  className="bg-bg border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-1 bg-bg-elevated hover:bg-border text-xs font-mono rounded"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-border-subtle flex justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-black font-semibold text-xs font-mono rounded-lg transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save Article"}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Posts Table */
        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-text-muted">
              No articles published yet. Click "New Article" to create your first bilingual post.
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 hover:bg-bg-elevated/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          post.published ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      <span className="font-semibold text-text-primary text-sm font-sans">
                        {post.titleEn}
                      </span>
                    </div>
                    {post.titleBn && (
                      <div className="text-text-muted font-bengali text-xs">
                        {post.titleBn}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent" />
                        {post.readingTimeMinutes} min read
                      </span>
                      <span>•</span>
                      <span>Slug: /{post.slug}</span>
                      <span>•</span>
                      <span>{post.tags?.join(", ")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenSyndication(post, "linkedin")}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 rounded-lg text-xs font-mono transition-colors"
                      title="Syndicate to Social / Dev Platforms"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Syndicate</span>
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 hover:bg-bg border border-border rounded-lg text-text-muted hover:text-text-primary transition-colors"
                      title="Edit Article"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 hover:bg-red-950/20 border border-border rounded-lg text-text-muted hover:text-red-400 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Multi-Platform Syndication Modal */}
      {syndicatePostModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-bg-surface border border-border rounded-xl p-4 sm:p-6 space-y-4 my-4 sm:my-0 max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-border-subtle">
              <div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-accent" />
                  <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-text-primary">
                    Multi-Platform Syndication Hub
                  </h2>
                </div>
                <p className="text-xs font-mono text-text-muted mt-0.5">
                  Package "{syndicatePostModal.titleEn || syndicatePostModal.titleBn}" with 1 click.
                </p>
              </div>
              <button
                onClick={() => setSyndicatePostModal(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleOpenSyndication(syndicatePostModal, "linkedin")}
                className={`p-3 rounded-lg border text-left font-mono transition-colors ${
                  syndicatePlatform === "linkedin"
                    ? "bg-accent/15 border-accent text-accent font-bold"
                    : "bg-bg border-border text-text-muted hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </div>
                <span className="text-[10px] opacity-75 block mt-1">
                  Long-form & carousel breakdown
                </span>
              </button>

              <button
                onClick={() => handleOpenSyndication(syndicatePostModal, "devto")}
                className={`p-3 rounded-lg border text-left font-mono transition-colors ${
                  syndicatePlatform === "devto"
                    ? "bg-accent/15 border-accent text-accent font-bold"
                    : "bg-bg border-border text-text-muted hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Code className="w-4 h-4" /> Dev.to / Hashnode
                </div>
                <span className="text-[10px] opacity-75 block mt-1">
                  YAML frontmatter bundle
                </span>
              </button>

              <button
                onClick={() => handleOpenSyndication(syndicatePostModal, "twitter")}
                className={`p-3 rounded-lg border text-left font-mono transition-colors ${
                  syndicatePlatform === "twitter"
                    ? "bg-accent/15 border-accent text-accent font-bold"
                    : "bg-bg border-border text-text-muted hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Twitter className="w-4 h-4" /> X / Twitter
                </div>
                <span className="text-[10px] opacity-75 block mt-1">
                  5-7 tweet technical thread
                </span>
              </button>
            </div>

            {/* Loading state */}
            {syndicateLoading && (
              <div className="p-8 bg-bg border border-dashed border-accent/40 rounded-lg text-center text-xs font-mono text-accent animate-pulse">
                ⚡ Packaging technical syndication for {syndicatePlatform.toUpperCase()} with Groq Qwen 3.8...
              </div>
            )}

            {/* Output view with MarkdownPreview */}
            {!syndicateLoading && syndicateOutput && (
              <div className="space-y-3">
                <MarkdownPreview
                  content={syndicateOutput}
                  title={`${syndicatePostModal.slug || "post"}-${syndicatePlatform}.md`}
                  filename={`${syndicatePostModal.slug || "post"}-${syndicatePlatform}.md`}
                  defaultMode="preview"
                />
              </div>
            )}

            <div className="pt-3 border-t border-border-subtle flex justify-end">
              <button
                onClick={() => setSyndicatePostModal(null)}
                className="px-4 py-1.5 bg-bg-elevated text-text-primary rounded text-xs font-mono hover:bg-border"
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}