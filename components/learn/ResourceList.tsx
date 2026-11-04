import React from "react";
import {
  FileText,
  Link2,
  PlayCircle,
  Sparkles,
  Download,
  ArrowUpRight,
  Paperclip,
} from "lucide-react";
import { MaterialViewer } from "@/components/learn/MaterialViewer";
import { formatBytes } from "@/lib/format";
import {
  resourceSummary,
  resourceTitle,
  type SerializedLearnResource,
} from "@/lib/learn-resources";

const KIND_META = {
  file: { icon: FileText, label: "File", labelBn: "ফাইল" },
  link: { icon: Link2, label: "Link", labelBn: "লিংক" },
  video: { icon: PlayCircle, label: "Video", labelBn: "ভিডিও" },
  note: { icon: Sparkles, label: "Note", labelBn: "নোট" },
} as const;

function isDownloadable(resource: SerializedLearnResource): boolean {
  return resource.kind === "file";
}

function ResourceCard({
  resource,
  bengali,
  materialBase,
  noteHtml,
}: {
  resource: SerializedLearnResource;
  bengali: boolean;
  materialBase?: string;
  noteHtml?: string;
}) {
  const meta = KIND_META[resource.kind] ?? KIND_META.file;
  const Icon = meta.icon;
  const title = resourceTitle(resource, bengali);
  const summary = resourceSummary(resource, bengali);
  const size = formatBytes(resource.sizeBytes);
  const href = resource.url || undefined;

  if (resource.kind === "note") {
    return (
      <details className="group rounded-xl border border-border bg-bg-surface/60 open:border-accent/40">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
          <span className="flex min-w-0 items-center gap-2.5">
            <Icon className="h-4 w-4 shrink-0 text-accent" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-text-primary group-open:text-accent">
                {title}
              </span>
              {summary && (
                <span className="block truncate text-xs text-text-muted">{summary}</span>
              )}
            </span>
          </span>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-text-muted">
            {bengali ? meta.labelBn : meta.label}
          </span>
        </summary>
        <div className="border-t border-border/70 p-4">
          <MaterialViewer
            body={resource.body}
            html={noteHtml}
            format={resource.format}
          />
          {materialBase && (
            <a
              href={`${materialBase}/${resource.slug}`}
              className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline"
            >
              {bengali ? "নোটের পেজ" : "Open note page"} →
            </a>
          )}
        </div>
      </details>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-bg-surface/60 p-4 transition-colors hover:border-accent hover:bg-accent/[0.03]"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-text-primary group-hover:text-accent">
            {title}
          </span>
          <span className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
            <span className="uppercase tracking-wider">
              {bengali ? meta.labelBn : meta.label}
            </span>
            {size && (
              <>
                <span>·</span>
                <span>{size}</span>
              </>
            )}
            {summary && (
              <>
                <span>·</span>
                <span className="truncate">{summary}</span>
              </>
            )}
          </span>
        </span>
      </span>
      {isDownloadable(resource) ? (
        <Download className="h-4 w-4 shrink-0 text-text-muted group-hover:text-accent" />
      ) : (
        <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted group-hover:text-accent" />
      )}
    </a>
  );
}

/**
 * Server-rendered list of phase/step materials.
 * Everything here is already filtered to published + public rows.
 */
export function ResourceList({
  resources,
  bengali,
  heading,
  materialBase,
  noteHtmlById,
}: {
  resources: SerializedLearnResource[];
  bengali: boolean;
  heading?: string;
  materialBase?: string;
  /** Server-rendered, sanitized HTML for markdown/HTML notes, keyed by id. */
  noteHtmlById?: Record<string, string>;
}) {
  if (!resources || resources.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
        <Paperclip className="h-4 w-4 text-accent" />
        <span>{heading ?? (bengali ? "লার্নিং মেটেরিয়াল" : "Learning materials")}</span>
        <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
          {resources.length}
        </span>
      </h2>
      <div className="grid gap-2.5">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            bengali={bengali}
            materialBase={materialBase}
            noteHtml={noteHtmlById?.[resource.id]}
          />
        ))}
      </div>
    </section>
  );
}
