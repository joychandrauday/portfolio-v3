"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, X, Share, Plus } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "jcu:pwa-install-dismissed";
const SHOW_DELAY_MS = 6000;

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIosSafari() {
  if (typeof navigator === "undefined" || typeof document === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && "ontouchend" in document);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return isIos && isSafari;
}

/**
 * Subtle "Install app" affordance for the PWA.
 * Chrome/Edge use the native install prompt; iOS Safari gets an
 * "Add to Home Screen" hint since it has no prompt API.
 */
export default function InstallPWA() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  const hiddenRoute = pathname === "/ops/login" || pathname.startsWith("/offline");

  useEffect(() => {
    if (hiddenRoute) return;
    if (isStandalone()) return;

    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* storage blocked */
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    const onInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS Safari never fires beforeinstallprompt — offer the manual hint instead.
    if (isIosSafari()) {
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [hiddenRoute]);

  const dismiss = () => {
    setVisible(false);
    setShowIosGuide(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* storage blocked */
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } catch {
        /* user dismissed */
      }
      setDeferredPrompt(null);
      setVisible(false);
      return;
    }
    setShowIosGuide((prev) => !prev);
  };

  if (!visible || hiddenRoute) return null;

  const ios = !deferredPrompt && isIosSafari();

  return (
    <div className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 print:hidden">
      {showIosGuide && ios && (
        <div className="mb-2 w-64 rounded-xl border border-accent/30 bg-bg-surface/95 p-3 text-[11px] leading-relaxed text-text-secondary shadow-xl backdrop-blur">
          <p className="mb-2 font-semibold text-text-primary">Install on iPhone / iPad</p>
          <ol className="space-y-1.5">
            <li className="flex items-center gap-1.5">
              <span className="font-mono text-accent">1.</span>
              <span>Tap the <Share className="inline h-3 w-3" /> Share button</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="font-mono text-accent">2.</span>
              <span>Choose <Plus className="inline h-3 w-3" /> Add to Home Screen</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="font-mono text-accent">3.</span>
              <span>Tap <span className="font-semibold">Add</span></span>
            </li>
          </ol>
        </div>
      )}

      <div className="flex items-center gap-1 rounded-full border border-accent/30 bg-bg-surface/90 p-1 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={handleInstall}
          className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold text-black transition-colors hover:bg-accent-hover"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{ios ? "Add to Home Screen" : "Install app"}</span>
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="rounded-full p-1.5 text-text-muted transition-colors hover:text-text-primary"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
