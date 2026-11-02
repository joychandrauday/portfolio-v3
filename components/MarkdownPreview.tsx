"use client";

import React, { useState } from "react";
import {
  Code,
  Eye,
  Columns,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  FileText,
} from "lucide-react";

interface MarkdownPreviewProps {
  content: string;
  title?: string;
  defaultMode?: "preview" | "code" | "split";
  filename?: string;
}

export default function MarkdownPreview({
  content,
  title = "AI Generated Markdown",
  defaultMode = "preview",
  filename = "document.md",
}: MarkdownPreviewProps) {
  const [viewMode, setViewMode] = useState<"preview" | "code" | "split">(defaultMode);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".md") ? filename : `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Simple, safe client-side markdown formatter
  const renderFormattedMarkdown = (raw: string) => {
    if (!raw) return <p className="text-text-muted italic">No content to preview.</p>;

    const lines = raw.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeLanguage = "";

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace(/^```/, "").trim();
          codeBlockContent = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`codeblock-${index}`} className="my-3 rounded-md overflow-hidden border border-border bg-bg/80">
              {codeLanguage && (
                <div className="px-3 py-1 bg-bg-surface border-b border-border text-[10px] font-mono text-text-muted uppercase tracking-wider">
                  {codeLanguage}
                </div>
              )}
              <pre className="p-3 text-xs font-mono text-text-primary overflow-x-auto leading-relaxed">
                <code>{codeBlockContent.join("\n")}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Horizontal rule
      if (/^(\*\*\*|---|___)$/.test(line.trim())) {
        elements.push(<hr key={`hr-${index}`} className="my-4 border-border/80" />);
        return;
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={`h1-${index}`} className="font-serif text-2xl font-bold text-text-primary mt-4 mb-2">
            {formatInlineText(line.replace(/^# /, ""))}
          </h1>
        );
        return;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={`h2-${index}`} className="font-serif text-xl font-semibold text-text-primary mt-3.5 mb-1.5 pb-1 border-b border-border/50">
            {formatInlineText(line.replace(/^## /, ""))}
          </h2>
        );
        return;
      }
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={`h3-${index}`} className="font-serif text-base font-semibold text-text-primary mt-3 mb-1">
            {formatInlineText(line.replace(/^### /, ""))}
          </h3>
        );
        return;
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={`quote-${index}`} className="border-l-2 border-accent pl-3 py-1 my-2 text-text-secondary italic font-serif text-sm bg-accent/5">
            {formatInlineText(line.replace(/^> /, ""))}
          </blockquote>
        );
        return;
      }

      // Unordered list
      if (/^[-*+]\s+/.test(line)) {
        elements.push(
          <li key={`li-${index}`} className="ml-4 list-disc text-xs sm:text-sm text-text-secondary my-1 leading-relaxed">
            {formatInlineText(line.replace(/^[-*+]\s+/, ""))}
          </li>
        );
        return;
      }

      // Numbered list
      if (/^\d+\.\s+/.test(line)) {
        elements.push(
          <li key={`num-${index}`} className="ml-4 list-decimal text-xs sm:text-sm text-text-secondary my-1 leading-relaxed">
            {formatInlineText(line.replace(/^\d+\.\s+/, ""))}
          </li>
        );
        return;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={`empty-${index}`} className="h-2" />);
        return;
      }

      // Standard paragraph
      elements.push(
        <p key={`p-${index}`} className="text-xs sm:text-sm text-text-secondary leading-relaxed my-1.5 font-sans">
          {formatInlineText(line)}
        </p>
      );
    });

    return <div className="space-y-1">{elements}</div>;
  };

  // Helper for inline **bold**, *italic*, `code`, and [link](url)
  const formatInlineText = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-bg border border-border text-[11px] font-mono text-accent">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i} className="italic text-text-secondary">{part.slice(1, -1)}</em>;
      }
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return (
          <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-accent underline hover:opacity-80">
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`border border-border bg-bg-surface rounded-lg overflow-hidden transition-all duration-300 font-mono text-xs ${
        isExpanded ? "fixed inset-4 z-50 shadow-2xl flex flex-col bg-bg" : "my-4"
      }`}
    >
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-bg border-b border-border select-none">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-accent" />
          <span className="font-semibold text-text-primary text-xs truncate max-w-xs sm:max-w-md">
            {title}
          </span>
          <span className="px-1.5 py-0.2 rounded bg-bg-surface border border-border text-[10px] text-text-muted">
            .md
          </span>
        </div>

        {/* Action and View Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Mode switchers */}
          <div className="flex items-center bg-bg-surface border border-border rounded p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                viewMode === "preview"
                  ? "bg-text-primary text-bg font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
              title="Preview Rendered Markdown"
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("code")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                viewMode === "code"
                  ? "bg-text-primary text-bg font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
              title="View Raw Markdown Code"
            >
              <Code className="w-3 h-3" />
              <span>.md Code</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                viewMode === "split"
                  ? "bg-text-primary text-bg font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
              title="Split View (Code & Preview)"
            >
              <Columns className="w-3 h-3" />
              <span>Split</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-border bg-bg hover:border-text-primary text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-[11px]"
            title="Copy Raw Markdown"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 opacity-60" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-1 rounded border border-border bg-bg hover:border-text-primary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Download as .md file"
          >
            <Download className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Fullscreen Expand/Collapse */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded border border-border bg-bg hover:border-text-primary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title={isExpanded ? "Collapse View" : "Expand Fullscreen"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5 opacity-70" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 opacity-70" />
            )}
          </button>
        </div>
      </div>

      {/* Main Body depending on mode */}
      <div className={`p-4 overflow-y-auto ${isExpanded ? "flex-1" : "max-h-[500px]"}`}>
        {viewMode === "preview" && (
          <div className="prose prose-invert max-w-none">
            {renderFormattedMarkdown(content)}
          </div>
        )}

        {viewMode === "code" && (
          <div className="relative font-mono text-xs">
            <pre className="p-3 bg-bg border border-border/80 rounded overflow-x-auto text-text-primary leading-relaxed whitespace-pre-wrap selection:bg-accent/20">
              <code>{content}</code>
            </pre>
          </div>
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {/* Left: Code */}
            <div className="border border-border rounded overflow-hidden flex flex-col bg-bg">
              <div className="px-3 py-1.5 bg-bg-surface border-b border-border text-[10px] text-text-muted flex items-center justify-between">
                <span>RAW MARKDOWN CODE</span>
                <span>{content.length} chars</span>
              </div>
              <pre className="p-3 text-xs font-mono text-text-primary overflow-auto leading-relaxed flex-1 whitespace-pre-wrap">
                <code>{content}</code>
              </pre>
            </div>

            {/* Right: Rendered Preview */}
            <div className="border border-border rounded overflow-hidden flex flex-col bg-bg-surface">
              <div className="px-3 py-1.5 bg-bg border-b border-border text-[10px] text-text-muted">
                <span>RENDERED PREVIEW</span>
              </div>
              <div className="p-3 overflow-auto flex-1">
                {renderFormattedMarkdown(content)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
