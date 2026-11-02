// lib/jobImport.ts — helpers for importing a job posting from a URL.

const PORTAL_HOSTS: { match: RegExp; name: string }[] = [
  { match: /linkedin\./i, name: "LinkedIn" },
  { match: /indeed\./i, name: "Indeed" },
  { match: /wellfound\.|angel\.co/i, name: "Wellfound" },
  { match: /greenhouse\.io/i, name: "Greenhouse" },
  { match: /lever\.co/i, name: "Lever" },
  { match: /workday\.|myworkdayjobs/i, name: "Workday" },
  { match: /ashbyhq\.com/i, name: "Ashby" },
  { match: /smartrecruiters\./i, name: "SmartRecruiters" },
  { match: /glassdoor\./i, name: "Glassdoor" },
  { match: /dice\.com/i, name: "Dice" },
  { match: /upwork\.com/i, name: "Upwork" },
  { match: /bdjobs\.com/i, name: "BDJobs" },
  { match: /himalayas\.app/i, name: "Himalayas" },
  { match: /remoteok\.com/i, name: "RemoteOK" },
  { match: /weworkremotely\.com/i, name: "We Work Remotely" },
];

function decodeEntities(input: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    ndash: "–",
    mdash: "—",
    rsquo: "’",
    lsquo: "‘",
    ldquo: "“",
    rdquo: "”",
    hellip: "…",
    bull: "•",
  };

  return input
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[String(name).toLowerCase()] ?? match);
}

/** Convert raw HTML into readable plain text suitable for LLM extraction. */
export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<head[\s\S]*?<\/head>/gi, " ")
      .replace(/<\/(p|div|li|h[1-6]|tr|section|article|header|footer|blockquote)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\r/g, "")
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/g, "");
}

export function detectPortal(url: string): string {
  for (const portal of PORTAL_HOSTS) {
    if (portal.match.test(url)) return portal.name;
  }
  return "Company Site";
}

export function originOf(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}
