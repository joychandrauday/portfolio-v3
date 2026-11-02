"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, Github, ExternalLink, Linkedin, Twitter, Mail } from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative my-4 sm:my-0 w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-border bg-bg-surface p-6 shadow-2xl md:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-accent/5 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10">
          {/* Profile header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold text-xl">
              J
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary font-mono">
                Joy Chandra Uday
              </h2>
              <p className="text-xs text-text-muted">
                Software Engineer & Career Automation Builder
              </p>
            </div>
          </div>

          {/* Quick stat cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-bg/30 border border-border rounded-lg p-3 text-center">
              <div className="text-xl font-bold font-mono text-accent">2y+</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">
                Engineering XP
              </div>
            </div>
            <div className="bg-bg/30 border border-border rounded-lg p-3 text-center">
              <div className="text-xl font-bold font-mono text-accent">60+</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">
                Tech Interviews
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2 mb-6">
            <a
              href="http://g2gdigital.com/author/joychandrauday"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-accent/10 border border-accent/30 hover:border-accent text-accent hover:text-accent-hover transition-all text-sm font-mono font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              G2G Digital Author — joychandrauday
            </a>
            <a
              href="https://github.com/joychandrauday"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-bg/30 border border-border hover:border-accent/30 text-text-primary hover:text-accent transition-all text-sm font-mono"
            >
              <Github className="w-4 h-4" />
              GitHub — joychandrauday
            </a>
            <a
              href="https://linkedin.com/in/joychandrauday"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-bg/30 border border-border hover:border-accent/30 text-text-primary hover:text-accent transition-all text-sm font-mono"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn — joychandrauday
            </a>
            <a
              href="mailto:joychandrauday@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-bg/30 border border-border hover:border-accent/30 text-text-primary hover:text-accent transition-all text-sm font-mono"
            >
              <Mail className="w-4 h-4" />
              Email — joychandrauday
            </a>
          </div>

          {/* Footer */}
          <div className="text-center text-[9px] text-text-muted font-mono">
            <kbd className="px-1 py-0.5 bg-bg/30 border border-border rounded">ESC</kbd>
            {" to close"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
