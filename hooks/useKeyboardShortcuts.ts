import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Registers global keyboard shortcuts for the portfolio.
 * L → Toggle Language, T → Toggle Theme,
 * P → /projects, B → /blog, R → /resume
 *
 * Safe: ignores keystrokes when focus is in an input or textarea.
 */
export function useKeyboardShortcuts() {
  const { language, setLanguage } = useLanguage();
  const { toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key.toLowerCase()) {
        case "l":
          e.preventDefault();
          setLanguage(language === "en" ? "bn" : "en");
          break;
        case "t":
          e.preventDefault();
          toggleTheme();
          break;
        case "p":
          e.preventDefault();
          router.push("/projects");
          break;
        case "b":
          e.preventDefault();
          router.push("/blog");
          break;
        case "r":
          e.preventDefault();
          router.push("/resume");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [language, setLanguage, toggleTheme, router]);
}
