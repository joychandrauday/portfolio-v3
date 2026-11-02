"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CommandPalette from "@/components/ops/CommandPalette";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  BrainCircuit,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Terminal,
  Menu,
  X,
  Sparkles,
  Command,
} from "lucide-react";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // If on login page, render children without sidebar
  const isLoginPage = pathname === "/ops/login";

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/ops/auth");
        const data = await res.json();
        if (!data.authenticated) {
          router.replace("/ops/login");
        } else {
          setCheckingAuth(false);
        }
      } catch {
        router.replace("/ops/login");
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  // Global hotkey: Cmd + K or Ctrl + K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Mobile drawer ergonomics: close on navigation, Escape, and lock page scroll.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    // If the viewport grows to desktop while the drawer is open, release the lock.
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const onViewportChange = () => {
      if (desktopQuery.matches) setMobileNavOpen(false);
    };
    desktopQuery.addEventListener("change", onViewportChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktopQuery.removeEventListener("change", onViewportChange);
    };
  }, [mobileNavOpen]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center font-mono text-sm text-text-muted">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>Verifying Command Credentials...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Executive Hub", href: "/ops", icon: LayoutDashboard },
    { label: "AI Copilot Studio", href: "/ops/ai", icon: Sparkles },
    { label: "Bilingual Blog", href: "/ops/posts", icon: FileText },
    { label: "Job Hunting CRM", href: "/ops/jobs", icon: Briefcase },
    { label: "Project Showcase", href: "/ops/projects", icon: Layers },
    { label: "Learning Flow", href: "/ops/learnings", icon: BrainCircuit },
    { label: "Contact Inbox", href: "/ops/inbox", icon: Mail },
    { label: "Settings & AI Keys", href: "/ops/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch("/api/ops/auth", { method: "DELETE" });
    router.replace("/ops/login");
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row text-text-primary selection:bg-accent selection:text-black font-sans">
      {/* Global Command Palette */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 flex items-center justify-between gap-3 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] bg-bg-surface/95 backdrop-blur border-b border-border z-30">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="w-4 h-4 text-accent shrink-0" />
          <span className="font-mono text-sm font-bold truncate">JOY // OPS</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="p-2 text-text-muted hover:text-accent border border-border rounded-lg"
            title="Command Palette"
            aria-label="Open command palette"
          >
            <Command className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-text-muted hover:text-text-primary border border-transparent rounded-lg"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNavOpen}
            aria-controls="ops-sidebar"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        id="ops-sidebar"
        className={`fixed md:sticky top-0 left-0 h-[100dvh] md:h-screen w-72 max-w-[85vw] md:w-64 md:max-w-none bg-bg-surface border-r border-border flex flex-col justify-between p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain z-40 transition-transform duration-200 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-xs font-bold tracking-wider text-text-primary uppercase">
                  OPS CONTROL
                </div>
                <div className="text-[10px] text-accent font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </div>
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              title="Open Public Portfolio"
              className="p-1.5 text-text-muted hover:text-accent transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* ⌘K Command Palette Quick Launcher */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 mb-4 bg-bg border border-border hover:border-accent/50 rounded-lg text-xs font-mono text-text-muted hover:text-text-primary transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-2 text-[11px]">
              <Command className="w-3.5 h-3.5 text-accent" />
              <span>Omni Search</span>
            </span>
            <kbd className="px-1.5 py-0.5 bg-bg-surface border border-border text-[9px] rounded text-text-muted group-hover:text-accent font-sans">
              ⌘K
            </kbd>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/20 font-semibold"
                      : "text-text-muted hover:text-text-primary hover:bg-bg-elevated"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-text-muted"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-4 border-t border-border-subtle space-y-2">
          <Link
            href="/ops/ai"
            className="px-3 py-2 bg-bg-elevated/40 hover:bg-bg-elevated border border-border-subtle hover:border-accent/40 rounded-lg text-[11px] font-mono text-text-muted hover:text-text-primary flex items-center justify-between transition-colors block"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              AI Studio
            </span>
            <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-bold">
              Qwen 3.8
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-text-muted hover:text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-bg p-4 md:p-8 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}