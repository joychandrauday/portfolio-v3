"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker.
 *
 * - Registers after load so it never competes with first-paint resources.
 * - Silent by design: no UI, no console noise in production.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      return;
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[pwa] service worker registration failed:", err?.message);
        }
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
