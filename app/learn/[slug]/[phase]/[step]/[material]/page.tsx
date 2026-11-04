import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Download,
  FileText,
} from "lucide-react";
import { MaterialViewer } from "@/components/learn/MaterialViewer";
import {
  getStepResourceBySlug,
  getStepResources,
  resourceSummary,
  resourceTitle,
} from "@/lib/learn-resources";
import { getPhaseBySlug, getRoadmapBySlug, getStepBySlug } from "@/lib/roadmaps-data";
import { formatBytes } from "@/lib/format";
import { renderArticleHtml } from "@/lib/markdown";

export const revalidate = 300;

const BASE_URL = "https://joychandrauday.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; phase: string; step: string; material: string };
}): Promise<Metadata> {
  const roadmap = getRoadmapBySlug(params.slug);
  const phase = getPhaseBySlug(params.slug, params.phase);
  const step = getStepBySlug(params.slug, params.phase, params.step);
  if (!roadmap || !phase || !step) return { title: "Material not found" };

  const resource = await getStepResourceBySlug(
    roadmap.slug,
    phase.slug,
    step.slug,
    params.material,
  );
  if (!resource) return { title: "Material not found" };

  const title = `${resource.title} — ${step.title}`;
  const description =
    resource.summary || resource.body?.slice(0, 155) || step.description || roadmap.description.en;
  const url = `${BASE_URL}/learn/${roadmap.slug}/${phase.slug}/${step.slug}/${resource.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: "Joy Chandra Uday" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MaterialPage({
  params,
}: {
  params: { slug: string; phase: string; step: string; material: string };
}) {
  const roadmap = getRoadmapBySlug(params.slug);
  const phase = getPhaseBySlug(params.slug, params.phase);
  const step = getStepBySlug(params.slug, params.phase, params.step);
  if (!roadmap || !phase || !step) notFound();

  const resource = await getStepResourceBySlug(
    roadmap.slug,
    phase.slug,
    step.slug,
    params.material,
  );
  if (!resource) notFound();

  const siblings = await getStepResources(roadmap.slug, phase.slug, step.slug);
  const index = siblings.findIndex((item) => item.id === resource.id);
  const previous = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  const base = `/learn/${roadmap.slug}/${phase.slug}/${step.slug}`;
  const size = formatBytes(resource.sizeBytes);
  const noteHtml =
    resource.kind === "note" && resource.body ? renderArticleHtml(resource.body) : null;

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-xs text-text-muted">
          <Link href="/learn" className="hover:text-accent">
            learn
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/learn/${roadmap.slug}`} className="hover:text-accent">
            {roadmap.title.en}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/learn/${roadmap.slug}/${phase.slug}`} className="hover:text-accent">
            {phase.title}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={base} className="hover:text-accent">
            {step.title}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-primary">{resource.title}</span>
        </nav>

        <header className="space-y-3 rounded-2xl border border-border bg-bg-surface p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                // {resource.kind}
                {resource.format ? ` · ${resource.format}` : ""}
              </p>
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                {resource.title}
              </h1>
              {(resource.summary || resource.summaryBn) && (
                <p className="font-serif text-sm text-text-secondary">
                  {resourceSummary(resource, false)}
                </p>
              )}
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-accent">
              <FileText className="h-5 w-5" />
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            {size && (
              <span className="inline-flex items-center gap-1 rounded border border-border bg-bg px-2 py-1 font-mono text-[10px] text-text-muted">
                <Download className="h-3 w-3" />
                {size}
              </span>
            )}
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 font-mono text-xs font-semibold text-accent transition-colors hover:bg-accent/25"
              >
                {resource.kind === "file"
                  ? "Download"
                  : resource.kind === "video"
                    ? "Watch"
                    : "Open"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            <Link
              href={base}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-text-primary transition-colors hover:bg-bg-surface"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-text-muted" />
              Back to step
            </Link>
            {step.estimatedMinutes && (
              <span className="inline-flex items-center gap-1 rounded border border-border bg-bg px-2 py-1 font-mono text-[10px] text-text-muted">
                <Clock className="h-3 w-3" />
                {step.estimatedMinutes}m
              </span>
            )}
          </div>
        </header>

        {resource.body ? (
          <article className="rounded-2xl border border-border bg-bg-surface p-6 sm:p-8">
            <MaterialViewer body={resource.body} html={noteHtml} format={resource.format} />
          </article>
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-6 font-mono text-xs text-text-muted">
            This resource is hosted externally. Use the button above to open it.
          </p>
        )}

        <nav className="flex items-center justify-between border-t border-border pt-6 font-mono text-xs">
          {previous ? (
            <Link
              href={`${base}/${previous.slug}`}
              className="flex items-center gap-1.5 text-text-muted hover:text-text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="max-w-[220px] truncate">{resourceTitle(previous, false)}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`${base}/${next.slug}`}
              className="flex items-center gap-1.5 font-semibold text-accent hover:underline"
            >
              <span className="max-w-[220px] truncate">{resourceTitle(next, false)}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </div>
  );
}
