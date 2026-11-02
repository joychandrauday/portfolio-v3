"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/lib/data";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Copy, Check, Terminal } from "lucide-react";

export default function InteractiveCanvasHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { t, isBn } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle field
    const numParticles = 65;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
    }[] = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.4 + 0.15,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections between close particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Particle attraction to mouse
        const dx = mouseX - p1.x;
        const dy = mouseY - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p1.x += (dx / dist) * 0.6;
          p1.y += (dy / dist) * 0.6;
        }

        ctx.fillStyle = `rgba(229, 169, 60, ${p1.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * (1 - d / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#030303] px-6 sm:px-12 py-16">
      {/* Interactive WebGL/Canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-auto opacity-75"
      />

      {/* Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-900/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-900/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Top telemetry pill */}
      <div className="relative z-10 max-w-6xl mx-auto w-full pt-16 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-text-primary tracking-widest uppercase font-semibold text-[11px]">
            {t.hero.presence}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-accent">{t.hero.badge}</span>
        </div>

        <div className="text-text-muted text-[11px] hidden sm:block">
          DHAKA · 23.8103° N · FULL-STACK & SYSTEMS
        </div>
      </div>

      {/* Centerpiece Bold Statement */}
      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto py-12 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 font-mono text-xs text-accent uppercase tracking-widest">
            <span className="h-px w-10 bg-accent" />
            <span>JOY CHANDRA UDAY // PORTFOLIO</span>
          </div>

          <h1
            className={`text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase text-white leading-none ${
              isBn ? "font-bengali tracking-normal" : "font-sans"
            }`}
          >
            {isBn ? (
              <>
                সিস্টেম যা <span className="text-accent">কাজ করে।</span>
              </>
            ) : (
              <>
                Build A Website <span className="text-accent">that sells.</span>
              </>
            )}
          </h1>
        </div>

        <p
          className={`max-w-2xl text-lg sm:text-2xl text-text-secondary leading-relaxed font-sans ${
            isBn ? "font-bengaliSerif text-xl leading-relaxed text-text-primary/90" : ""
          }`}
        >
          {isBn
            ? "আমি জটিল ব্যাকএন্ড সিস্টেমের নিখুঁত আর্কিটেকচার এবং উচ্চ-রূপান্তরক্ষম আধুনিক ইউজার ইন্টারফেসের মধ্যে সেতুবন্ধন তৈরি করি।"
            : "I bridge the gap between complex backend logic and high-conversion user interfaces."}
        </p>

        {/* Action Controls */}
        <div className="pt-4 flex flex-wrap items-center gap-4 font-mono text-xs">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-black font-bold uppercase tracking-wider transition-all shadow-lg shadow-accent/20 cursor-pointer"
          >
            <span>{t.hero.ctaProjects}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            onClick={copyEmail}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-text-primary transition-all cursor-pointer backdrop-blur-md"
          >
            {copiedEmail ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Email Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-text-muted" />
                <span>{siteConfig.email}</span>
              </>
            )}
          </button>

          <a
            href="/resume"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent hover:bg-white/[0.05] border border-white/[0.08] text-text-primary transition-all"
          >
            <span>{isBn ? "জীবনবৃত্তান্ত" : "Resume Dossier"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
          </a>

          <div className="flex items-center gap-4 ml-0 sm:ml-auto">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className="text-text-muted hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span className="text-white/20">/</span>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-text-muted hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom ticker hint */}
      <div className="relative z-10 max-w-6xl mx-auto w-full pb-6 flex items-center justify-between text-text-muted/60 font-mono text-xs">
        <div className="flex items-center gap-2">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>SCROLL TO EXPLORE ARCHITECTURAL FOUNDATION</span>
        </div>
        <div className="hidden sm:block">GROW WITH OWL · G2G DIGITAL</div>
      </div>
    </section>
  );
}
