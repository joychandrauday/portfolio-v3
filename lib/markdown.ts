/**
 * Shared rich-text rendering for blog posts and public learning materials.
 *
 * Accepts either TipTap-style HTML or legacy markdown and always returns
 * sanitized HTML. The allowlist is intentionally narrow — it is the single
 * trust boundary for author-supplied content on the public site.
 */

import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li",
  "blockquote", "code", "pre", "hr", "br", "strong", "em", "del",
  "img", "table", "thead", "tbody", "tr", "th", "td", "span", "div",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "name", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "class", "loading"],
  code: ["class"],
  pre: ["class"],
  span: ["class", "style"],
  div: ["class"],
  p: ["class", "style"],
  h1: ["class", "style"],
  h2: ["class", "style"],
  h3: ["class", "style"],
};

/** Sanitizes rich HTML or parses legacy markdown safely. */
export function renderArticleHtml(raw: string): string {
  if (!raw) return "";

  // Check if it's already HTML (e.g. from the TipTap editor)
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  const html = isHtml ? raw : (marked.parse(raw) as string);

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      // External links must not leak the opener reference.
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const external = /^https?:\/\//i.test(href);
        return {
          tagName,
          attribs: external
            ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
            : attribs,
        };
      },
    },
  });
}

export { formatBytes } from "@/lib/format";
