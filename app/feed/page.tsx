"use client";

import nextDynamic from "next/dynamic";

const FeedContent = nextDynamic(() => import("@/components/feed/FeedContent"), {
  ssr: false,
  loading: () => <p className="text-xs text-text-muted">Loading feed…</p>,
});

export default function FeedPage() {
  return <FeedContent />;
}
