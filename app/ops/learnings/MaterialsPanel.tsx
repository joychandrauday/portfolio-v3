"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  CloudUpload,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Link2,
  Loader2,
  Paperclip,
  Pencil,
  PlayCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import MarkdownPreview from "@/components/MarkdownPreview";
import { ROADMAPS } from "@/lib/roadmaps-data";

type Kind = "file" | "link" | "video" | "note";
type Format = "markdown" | "html" | "code" | "checklist";

interface Resource {
  id: string;
  slug: string;
  roadmapSlug: string;
  phaseSlug: string | null;
  stepSlug: string | null;
  kind: Kind;
  format: Format | null;
  title: string;
  titleBn: string | null;
  summary: string | null;
  summaryBn: string | null;
  url: string | null;
  storageKey: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  body: string | null;
  isPublic: boolean;
  sortOrder: number;
  publishedAt: string | null;
}

const KIND_OPTIONS: { value: Kind; label: string; icon: typeof FileText }[] = [
  { value: "file", label: "File (PDF, zip, image)", icon: FileText },
  { value: "link", label: "External link", icon: Link2 },
  { value: "video", label: "Video", icon: PlayCircle },
  { value: "note", label: "Written note", icon: Sparkles },
];

const FORMAT_OPTIONS: { value: Format; label: string }[] = [
  { value: "markdown", label: "Markdown" },
  { value: "html", label: "Rich HTML" },
  { value: "code", label: "Code / snippet" },
  { value: "checklist", label: "Checklist" },
];

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 || unit === 0 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`;
}

function kindIcon(kind: Kind) {
  return KIND_OPTIONS.find((option) => option.value === kind)?.icon ?? FileText;
}

function resourceTypeFor(file: File): "image" | "video" | "raw" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "raw";
}

interface DraftState {
  id?: string;
  kind: Kind;
  format: Format;
  title: string;
  titleBn: string;
  summary: string;
  summaryBn: string;
  url: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number | null;
  body: string;
  isPublic: boolean;
}

const EMPTY_DRAFT: DraftState = {
  kind: "file",
  format: "markdown",
  title: "",
  titleBn: "",
  summary: "",
  summaryBn: "",
  url: "",
  storageKey: "",
  mimeType: "",
  sizeBytes: null,
  body: "",
  isPublic: true,
};

export default function MaterialsPanel() {
  const [roadmapSlug, setRoadmapSlug] = useState(ROADMAPS[0]?.slug ?? "");
  const [phaseSlug, setPhaseSlug] = useState<string>("");
  const [stepSlug, setStepSlug] = useState<string>("");

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const roadmap = useMemo(
    () => ROADMAPS.find((item) => item.slug === roadmapSlug) ?? ROADMAPS[0],
    [roadmapSlug],
  );
  const phase = useMemo(
    () => roadmap?.phases.find((item) => item.slug === phaseSlug) ?? null,
    [roadmap, phaseSlug],
  );

  useEffect(() => {
    setPhaseSlug("");
    setStepSlug("");
  }, [roadmapSlug]);

  useEffect(() => {
    setStepSlug("");
  }, [phaseSlug]);

  const load = useCallback(async (silent = false) => {
    if (!roadmapSlug) return;
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ roadmap: roadmapSlug });
      if (phaseSlug) params.set("phase", phaseSlug);
      if (stepSlug) params.set("step", stepSlug);

      const res = await fetch(`/api/ops/learn/resources?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.status === 401) {
        setError("Session expired — sign in to ops again.");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load materials");

      // Show exact-position rows only; parents are implied by the selectors.
      const rows: Resource[] = (data.resources || []).filter((row: Resource) => {
        if (phaseSlug === "" ) return row.phaseSlug === null;
        if (stepSlug === "") return row.phaseSlug === phaseSlug && row.stepSlug === null;
        return row.phaseSlug === phaseSlug && row.stepSlug === stepSlug;
      });

      setResources(rows);
      setError("");
    } catch (err: any) {
      setError(err?.message || "Could not load materials");
    } finally {
      setLoading(false);
    }
  }, [roadmapSlug, phaseSlug, stepSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const positionLabel = stepSlug
    ? `${phase?.title ?? phaseSlug} › ${phase?.steps.find((s) => s.slug === stepSlug)?.title ?? stepSlug}`
    : phaseSlug
      ? `${phase?.title ?? phaseSlug} (phase level)`
      : "Roadmap level";

  const openCreate = () => {
    setDraft({ ...EMPTY_DRAFT });
    setModalError("");
    setShowPreview(false);
    setModalOpen(true);
  };

  const openEdit = (resource: Resource) => {
    setDraft({
      id: resource.id,
      kind: resource.kind,
      format: resource.format ?? "markdown",
      title: resource.title,
      titleBn: resource.titleBn ?? "",
      summary: resource.summary ?? "",
      summaryBn: resource.summaryBn ?? "",
      url: resource.url ?? "",
      storageKey: resource.storageKey ?? "",
      mimeType: resource.mimeType ?? "",
      sizeBytes: resource.sizeBytes,
      body: resource.body ?? "",
      isPublic: resource.isPublic,
    });
    setModalError("");
    setShowPreview(false);
    setModalOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setModalError("");
    try {
      const resourceType = resourceTypeFor(file);

      const signRes = await fetch("/api/ops/learn/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapSlug,
          phaseSlug: phaseSlug || null,
          stepSlug: stepSlug || null,
          resourceType,
        }),
      });
      const sign = await signRes.json().catch(() => ({}));
      if (!signRes.ok) throw new Error(sign.error || "Could not sign the upload");

      const maxBytes = Number(sign.maxFileBytes || 0);
      if (maxBytes && file.size > maxBytes) {
        throw new Error(`File is too large (max ${formatBytes(maxBytes)}).`);
      }

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sign.apiKey);
      form.append("timestamp", String(sign.timestamp));
      form.append("folder", sign.folder);
      form.append("signature", sign.signature);
      form.append("allowed_formats", sign.allowedFormats);
      form.append("max_file_size", String(sign.maxFileBytes));

      const uploadRes = await fetch(sign.uploadUrl, { method: "POST", body: form });
      const uploaded = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        throw new Error(uploaded?.error?.message || "Cloudinary rejected the upload");
      }

      setDraft((current) => ({
        ...current,
        kind: current.kind === "note" ? "file" : current.kind,
        url: uploaded.secure_url,
        storageKey: uploaded.public_id,
        mimeType: file.type || `${uploaded.resource_type}/${uploaded.format}`,
        sizeBytes: Number(uploaded.bytes) || file.size,
        title: current.title || file.name.replace(/\.[^.]+$/, ""),
      }));
      setNotice("File uploaded to Cloudinary.");
    } catch (err: any) {
      setModalError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      setModalError("A title is required.");
      return;
    }
    if (draft.kind !== "note" && !draft.url.trim()) {
      setModalError("Upload a file or paste a URL.");
      return;
    }

    setSaving(true);
    setModalError("");
    try {
      const payload = {
        action: draft.id ? "update_resource" : "create_resource",
        ...(draft.id ? { id: draft.id } : {}),
        roadmapSlug,
        phaseSlug: phaseSlug || null,
        stepSlug: stepSlug || null,
        kind: draft.kind,
        format: draft.kind === "note" ? draft.format : null,
        title: draft.title,
        titleBn: draft.titleBn,
        summary: draft.summary,
        summaryBn: draft.summaryBn,
        url: draft.kind === "note" ? null : draft.url,
        storageKey: draft.storageKey,
        mimeType: draft.mimeType,
        sizeBytes: draft.sizeBytes,
        body: draft.kind === "note" ? draft.body : null,
        isPublic: draft.isPublic,
      };

      const res = await fetch("/api/ops/learn/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save the material");

      setModalOpen(false);
      setNotice(draft.id ? "Material updated." : "Material created.");
      await load(true);
    } catch (err: any) {
      setModalError(err?.message || "Could not save the material");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (resource: Resource) => {
    if (!window.confirm(`Delete “${resource.title}”?`)) return;
    setBusyId(resource.id);
    try {
      const res = await fetch("/api/ops/learn/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_resource", id: resource.id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setNotice("Material deleted.");
      await load(true);
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const togglePublish = async (resource: Resource) => {
    setBusyId(resource.id);
    try {
      const res = await fetch("/api/ops/learn/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_resource",
          id: resource.id,
          isPublic: !resource.isPublic,
        }),
      });
      if (!res.ok) throw new Error("Could not change visibility");
      await load(true);
    } catch (err: any) {
      setError(err?.message || "Could not change visibility");
    } finally {
      setBusyId(null);
    }
  };

  const move = async (resource: Resource, direction: "up" | "down") => {
    setBusyId(resource.id);
    try {
      await fetch("/api/ops/learn/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder_resource", id: resource.id, direction }),
      });
      await load(true);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      {notice && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {notice}
          </span>
          <button onClick={() => setNotice("")} className="cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-bg-surface p-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Roadmap
            </span>
            <select
              value={roadmapSlug}
              onChange={(event) => setRoadmapSlug(event.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
            >
              {ROADMAPS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title.en}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Phase
            </span>
            <select
              value={phaseSlug}
              onChange={(event) => setPhaseSlug(event.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
            >
              <option value="">Roadmap level</option>
              {roadmap?.phases.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Step
            </span>
            <select
              value={stepSlug}
              onChange={(event) => setStepSlug(event.target.value)}
              disabled={!phaseSlug}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text-primary focus:border-accent focus:outline-none disabled:opacity-50"
            >
              <option value="">Phase level</option>
              {phase?.steps.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
            <Paperclip className="h-3.5 w-3.5 text-accent" />
            <span className="text-text-primary">{positionLabel}</span>
            <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[10px]">
              {resources.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 font-mono text-xs text-text-muted transition-colors hover:text-text-primary"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={openCreate}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-2.5 py-1.5 font-mono text-xs font-semibold text-accent transition-colors hover:bg-accent/25"
            >
              <Plus className="h-3.5 w-3.5" />
              Add material
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-surface p-6 font-mono text-xs text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading materials…
        </div>
      ) : resources.length === 0 ? (
        <div className="space-y-2 rounded-xl border border-dashed border-border p-8 text-center">
          <BookOpen className="mx-auto h-6 w-6 text-accent/60" />
          <p className="font-mono text-xs text-text-muted">
            No material at this position yet. Add a file, link or note.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map((resource, index) => {
            const Icon = kindIcon(resource.kind);
            return (
              <div
                key={resource.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-bg-surface p-3"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-text-primary">
                        {resource.title}
                      </span>
                      <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] uppercase text-text-muted">
                        {resource.kind}
                      </span>
                      {resource.format && (
                        <span className="font-mono text-[10px] text-text-muted">
                          {resource.format}
                        </span>
                      )}
                      {resource.sizeBytes ? (
                        <span className="font-mono text-[10px] text-text-muted">
                          {formatBytes(resource.sizeBytes)}
                        </span>
                      ) : null}
                      {!resource.isPublic && (
                        <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-400">
                          draft
                        </span>
                      )}
                    </div>
                    {resource.summary && (
                      <p className="truncate text-xs text-text-muted">{resource.summary}</p>
                    )}
                    <p className="truncate font-mono text-[10px] text-text-muted/70">
                      {resource.storageKey || resource.url || "/" + resource.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(resource, "up")}
                    disabled={index === 0 || busyId === resource.id}
                    title="Move up"
                    className="cursor-pointer rounded p-1.5 text-text-muted transition-colors hover:text-text-primary disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => move(resource, "down")}
                    disabled={index === resources.length - 1 || busyId === resource.id}
                    title="Move down"
                    className="cursor-pointer rounded p-1.5 text-text-muted transition-colors hover:text-text-primary disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => togglePublish(resource)}
                    disabled={busyId === resource.id}
                    title={resource.isPublic ? "Unpublish" : "Publish"}
                    className="cursor-pointer rounded p-1.5 text-text-muted transition-colors hover:text-accent disabled:opacity-30"
                  >
                    {resource.isPublic ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open"
                      className="rounded p-1.5 text-text-muted transition-colors hover:text-accent"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(resource)}
                    title="Edit"
                    className="cursor-pointer rounded p-1.5 text-text-muted transition-colors hover:text-text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(resource)}
                    disabled={busyId === resource.id}
                    title="Delete"
                    className="cursor-pointer rounded p-1.5 text-text-muted transition-colors hover:text-red-400 disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:items-center">
          <form
            onSubmit={save}
            className="my-8 w-full max-w-2xl space-y-4 rounded-xl border border-border bg-bg-surface p-5 shadow-2xl sm:my-0"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="font-mono text-sm font-bold text-text-primary">
                  {draft.id ? "EDIT MATERIAL" : "NEW MATERIAL"}
                </h2>
                <p className="font-mono text-[10px] text-text-muted">{positionLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="cursor-pointer rounded p-1 text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {modalError}
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              {KIND_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = draft.kind === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, kind: option.value }))}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                      active
                        ? "border-accent/40 bg-accent/15 text-accent"
                        : "border-border bg-bg text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 sm:col-span-2">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Title (EN)
                </span>
                <input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="e.g. File permissions cheat-sheet"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Title (বাংলা, optional)
                </span>
                <input
                  value={draft.titleBn}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, titleBn: event.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
              <label className="space-y-1">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Summary (EN)
                </span>
                <input
                  value={draft.summary}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, summary: event.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
              <label className="space-y-1">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Summary (বাংলা)
                </span>
                <input
                  value={draft.summaryBn}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, summaryBn: event.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
                />
              </label>
            </div>

            {draft.kind !== "note" ? (
              <div className="space-y-2">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  File or URL
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent hover:bg-accent/25">
                    {uploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CloudUpload className="h-3.5 w-3.5" />
                    )}
                    {uploading ? "Uploading…" : "Upload to Cloudinary"}
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.zip,.md,.txt,.json,.csv,image/*,video/*"
                      disabled={uploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void handleUpload(file);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  <span className="font-mono text-[10px] text-text-muted">
                    max 25 MB · pdf, zip, md, images, video
                  </span>
                </div>
                <input
                  value={draft.url}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, url: event.target.value }))
                  }
                  placeholder="https://… or upload above"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
                />
                {draft.sizeBytes ? (
                  <p className="font-mono text-[10px] text-text-muted">
                    {formatBytes(draft.sizeBytes)} · {draft.mimeType || "unknown type"}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    Note body
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={draft.format}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          format: event.target.value as Format,
                        }))
                      }
                      className="rounded border border-border bg-bg px-2 py-1 font-mono text-[10px] text-text-primary focus:border-accent focus:outline-none"
                    >
                      {FORMAT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowPreview((value) => !value)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded border border-border px-2 py-1 font-mono text-[10px] text-text-muted hover:text-text-primary"
                    >
                      <Eye className="h-3 w-3" />
                      {showPreview ? "Edit" : "Preview"}
                    </button>
                  </div>
                </div>

                {showPreview ? (
                  <div className="max-h-72 overflow-y-auto rounded-lg border border-border bg-bg p-3">
                    <MarkdownPreview content={draft.body} title={draft.title || "Preview"} />
                  </div>
                ) : (
                  <textarea
                    value={draft.body}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, body: event.target.value }))
                    }
                    rows={10}
                    placeholder={
                      draft.format === "checklist"
                        ? "- [ ] First task\n- [x] Done task"
                        : "Write the note in markdown…"
                    }
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
                  />
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={draft.isPublic}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, isPublic: event.target.checked }))
                  }
                  className="h-3.5 w-3.5 accent-[#FFB44B]"
                />
                {draft.isPublic ? "Published publicly" : "Draft (ops only)"}
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent hover:bg-accent/25 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {saving ? "Saving…" : "Save material"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
