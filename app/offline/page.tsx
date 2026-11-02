import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are offline. Cached pages remain available.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-bg px-6 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-bg-surface text-accent">
        <WifiOff className="h-6 w-6" />
      </div>

      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        Signal lost
      </p>

      <h1 className="max-w-md font-serif text-3xl leading-tight text-text-primary sm:text-4xl">
        You&apos;re offline right now.
      </h1>

      <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary">
        Pages you have already visited stay available. Reconnect to load fresh content.
      </p>

      <p className="mt-2 font-bengali text-sm text-text-muted">
        আপনি অফলাইনে আছেন। আগে দেখা পেজগুলো এখনো পড়া যাবে।
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-accent-hover"
      >
        Try home
      </Link>

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        Joy Chandra Uday · Engineering Dossier
      </p>
    </main>
  );
}
