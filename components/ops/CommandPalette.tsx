"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  BrainCircuit,
  Mail,
  Settings,
  ExternalLink,
  Sparkles,
  Server,
  Terminal,
  Plus,
  ArrowRight,
  X,
} from "lucide-react";

interface CommandItem {
  id: string;
  category: "Navigation" | "Quick Action" | "External";
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-overview",
      category: "Navigation",
      title: "Overview & Mission Control",
      subtitle: "Dashboard telemetry, metrics & AI copilot",
      icon: LayoutDashboard,
      action: () => {
        router.push("/ops");
        onClose();
      },
    },
    {
      id: "nav-ai",
      category: "Navigation",
      title: "AI Copilot Workspace & Engineering Studio",
      subtitle: "Day-to-day code refactoring, SQL tuning, RFCs, bug diagnostics",
      icon: Sparkles,
      action: () => {
        router.push("/ops/ai");
        onClose();
      },
    },
    {
      id: "nav-jobs",
      category: "Navigation",
      title: "Career & Job Hunting Pipeline",
      subtitle: "Kanban CRM, 1-click JD parser, fit scores",
      icon: Briefcase,
      action: () => {
        router.push("/ops/jobs");
        onClose();
      },
    },
    {
      id: "nav-posts",
      category: "Navigation",
      title: "Bilingual Content Studio",
      subtitle: "EN ➔ BN publishing and multi-platform syndication",
      icon: FileText,
      action: () => {
        router.push("/ops/posts");
        onClose();
      },
    },
    {
      id: "nav-projects",
      category: "Navigation",
      title: "Project Showcase Manager",
      subtitle: "Curate verified engineering works & cards",
      icon: Layers,
      action: () => {
        router.push("/ops/projects");
        onClose();
      },
    },
    {
      id: "nav-learnings",
      category: "Navigation",
      title: "Second Brain (TIL & Research)",
      subtitle: "Systems engineering notes, invariants, takeaways",
      icon: BrainCircuit,
      action: () => {
        router.push("/ops/learnings");
        onClose();
      },
    },
    {
      id: "nav-inbox",
      category: "Navigation",
      title: "Contact Inquiries Inbox",
      subtitle: "Inbound leads, auto-drafted AI responses",
      icon: Mail,
      action: () => {
        router.push("/ops/inbox");
        onClose();
      },
    },
    {
      id: "nav-settings",
      category: "Navigation",
      title: "System Credentials & AI Keys",
      subtitle: "Groq, Gemini, database & master password",
      icon: Settings,
      action: () => {
        router.push("/ops/settings");
        onClose();
      },
    },

    // Quick Actions
    {
      id: "act-new-job",
      category: "Quick Action",
      title: "Track New Opportunity with AI",
      subtitle: "1-Click JD parser with Groq Qwen 3.8",
      icon: Plus,
      action: () => {
        router.push("/ops/jobs");
        onClose();
      },
      shortcut: "N",
    },
    {
      id: "act-new-post",
      category: "Quick Action",
      title: "Draft New Bilingual Article",
      subtitle: "Write once in EN or BN with auto-translation",
      icon: Sparkles,
      action: () => {
        router.push("/ops/posts");
        onClose();
      },
      shortcut: "P",
    },
    {
      id: "act-new-learning",
      category: "Quick Action",
      title: "Record TIL / Second Brain Note",
      subtitle: "Log paper reading or concurrency discovery",
      icon: BrainCircuit,
      action: () => {
        router.push("/ops/learnings");
        onClose();
      },
    },

    // External
    {
      id: "ext-portfolio",
      category: "External",
      title: "Open Public Portfolio",
      subtitle: "https://joychandrauday.vercel.app",
      icon: ExternalLink,
      action: () => {
        window.open("/", "_blank");
        onClose();
      },
    },
    {
      id: "ext-github",
      category: "External",
      title: "Joy's GitHub Ecosystem",
      subtitle: "StockFlow · FlowBridge · DocuPilot · Quick-Peek",
      icon: ExternalLink,
      action: () => {
        window.open("https://github.com/joychandrauday", "_blank");
        onClose();
      },
    },
    {
      id: "ext-garirhat",
      category: "External",
      title: "Garirhat.com Production",
      subtitle: "Live vehicle marketplace platform",
      icon: ExternalLink,
      action: () => {
        window.open("https://garirhat.com", "_blank");
        onClose();
      },
    },
  ];

  const filtered = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-start justify-center px-3 sm:px-4 pt-[calc(5rem+env(safe-area-inset-top))] sm:pt-20">
      <div className="w-full max-w-xl max-h-[calc(100dvh-7rem)] bg-bg-surface border border-border rounded-xl shadow-2xl overflow-hidden font-mono flex flex-col">
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-border-subtle bg-bg">
          <Search className="w-4 h-4 text-accent mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to destination (e.g. jobs, post, sentinel)..."
            className="w-full bg-transparent text-xs text-text-primary focus:outline-none placeholder:text-text-muted"
          />
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-muted">
              No matching commands found for "{query}".
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-accent/15 border border-accent/30 text-accent"
                      : "text-text-primary hover:bg-bg border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-accent" : "text-text-muted"}`} />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{cmd.title}</div>
                      {cmd.subtitle && (
                        <div className="text-[10px] text-text-muted truncate">{cmd.subtitle}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-bg border border-border text-text-muted">
                      {cmd.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-accent" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-border-subtle bg-bg flex items-center justify-between text-[10px] text-text-muted">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-bg-surface border border-border rounded">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 bg-bg-surface border border-border rounded">↵</kbd> select</span>
            <span><kbd className="px-1 py-0.5 bg-bg-surface border border-border rounded">esc</kbd> close</span>
          </div>
          <span className="text-accent font-semibold">JOY OPS COMMAND</span>
        </div>
      </div>
    </div>
  );
}