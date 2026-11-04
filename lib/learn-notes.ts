/**
 * Server-only helper: pre-renders note bodies so client components can stay
 * free of the markdown/sanitizer bundle.
 */

import { renderArticleHtml } from "@/lib/markdown";
import type { SerializedLearnResource } from "@/lib/learn-resources";

export function buildNoteHtmlMap(
  resources: SerializedLearnResource[],
): Record<string, string> {
  const map: Record<string, string> = {};

  for (const resource of resources) {
    if (resource.kind !== "note" || !resource.body) continue;
    if (resource.format && resource.format !== "markdown" && resource.format !== "html") {
      continue;
    }
    map[resource.id] = renderArticleHtml(resource.body);
  }

  return map;
}
