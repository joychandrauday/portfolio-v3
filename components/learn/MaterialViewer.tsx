import React from "react";
import type { LearnResourceFormat } from "@/lib/learn-resources";

/**
 * Renders a long-form learning note.
 *
 * The sanitized HTML for markdown/HTML notes is produced on the server
 * (`renderArticleHtml`) and passed in as `html`, which keeps marked +
 * sanitize-html out of the client bundle. `code` and `checklist` are
 * rendered locally from the raw body.
 */
export function MaterialViewer({
  body,
  html,
  format = "markdown",
  className = "",
}: {
  body?: string | null;
  html?: string | null;
  format?: LearnResourceFormat | null;
  className?: string;
}) {
  if (format === "code") {
    if (!body) return null;
    return (
      <pre
        className={`overflow-x-auto rounded-lg border border-border bg-bg p-4 font-mono text-xs leading-relaxed text-text-secondary ${className}`}
      >
        <code>{body}</code>
      </pre>
    );
  }

  if (format === "checklist") {
    if (!body) return null;
    const items = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const done = /^\[(x|X|\u2713)\]\s*/.test(line);
        const label = line.replace(/^\[( |x|X|\u2713)\]\s*/, "");
        return { done, label };
      });

    return (
      <ul className={`space-y-2 ${className}`}>
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-mono ${
                item.done
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                  : "border-border text-text-muted"
              }`}
            >
              {item.done ? "\u2713" : ""}
            </span>
            <span className={item.done ? "text-text-muted line-through" : ""}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  const rendered = html ?? "";
  if (!rendered) {
    // Fallback for legacy rows without pre-rendered HTML.
    return body ? (
      <p className={`whitespace-pre-wrap text-sm text-text-secondary ${className}`}>{body}</p>
    ) : null;
  }

  return (
    <div
      className={`prose prose-sm prose-invert max-w-none prose-headings:font-serif prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:text-accent prose-pre:border prose-pre:border-border prose-pre:bg-bg ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
