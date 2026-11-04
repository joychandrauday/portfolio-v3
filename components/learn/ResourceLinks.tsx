"use client";

import React from "react";
import {
  FileText,
  Link2,
  PlayCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { formatBytes } from "@/lib/format";
import {
  resourceTitle,
  type SerializedLearnResource,
} from "@/lib/learn-resources";

const ICONS = {
  file: FileText,
  link: Link2,
  video: PlayCircle,
  note: Sparkles,
} as const;

/**
 * Lightweight, client-safe resource links.
 * Used inside interactive trees; full note bodies render on the step page.
 */
export function ResourceLinks({
  resources,
  bengali,
  emptyLabel,
}: {
  resources: SerializedLearnResource[];
  bengali: boolean;
  emptyLabel?: string;
}) {
  if (!resources || resources.length === 0) {
    return emptyLabel ? (
      <p className="font-mono text-xs italic text-text-muted">{emptyLabel}</p>
    ) : null;
  }

  return (
    <div className="space-y-1.5">
      {resources.map((resource) => {
        const Icon = ICONS[resource.kind] ?? FileText;
        const size = formatBytes(resource.sizeBytes);
        const label = resourceTitle(resource, bengali);

        if (resource.kind === "note" || !resource.url) {
          return (
            <div
              key={resource.id}
              className="flex items-center gap-2 rounded-lg border border-border/70 bg-bg px-2.5 py-2 text-xs text-text-secondary"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="truncate">{label}</span>
            </div>
          );
        }

        return (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-bg px-2.5 py-2 text-xs transition-colors hover:border-accent hover:bg-accent/[0.03]"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="truncate text-text-primary group-hover:text-accent">{label}</span>
              {size && (
                <span className="shrink-0 font-mono text-[10px] text-text-muted">{size}</span>
              )}
            </span>
            <ExternalLink className="h-3 w-3 shrink-0 text-text-muted group-hover:text-accent" />
          </a>
        );
      })}
    </div>
  );
}
