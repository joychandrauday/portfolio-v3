// scripts/scrape-top10.ts
// Scrapes career pages of Bangladesh's top software companies
// Run: npx tsx scripts/scrape-top10.ts

import { prisma } from "@/lib/db";

const COMPANIES = [
  { name: "Brain Station 23", careerUrl: "https://brainstation-23.easy.jobs", industry: "Software Development" },
  { name: "BJIT", careerUrl: "https://bjitgroup.com/career", industry: "Software Services" },
  { name: "Vivasoft", careerUrl: "https://vivasoftltd.com/career/", industry: "Software Development" },
  { name: "Therap BD", careerUrl: "https://therapbd.com/", industry: "Healthcare SaaS" },
  { name: "Cefalo", careerUrl: "https://career.cefalo.com/", industry: "Product Engineering" },
  { name: "Selise", careerUrl: "https://ats.hirebee.ai/en/company/jobs/selise-bangladesh-ltd", industry: "Digital Platforms" },
  { name: "Next Venture", careerUrl: "https://nextventure.com.bd/careers", industry: "FinTech" },
  { name: "ITclan BD", careerUrl: "https://itclanbd.com/careers", industry: "Software Development" },
  { name: "Ollyo", careerUrl: "https://ollyo.com/careers", industry: "Software Development" },
  { name: "Startise", careerUrl: "https://startise.com/careers", industry: "Web Solutions" },
];

async function fetchPageContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err);
    return "";
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  console.log("Scraping Bangladesh Top Software Companies Career Pages...\n");
  
  for (const company of COMPANIES) {
    console.log(`🔍 ${company.name} — ${company.careerUrl}`);
    
    const html = await fetchPageContent(company.careerUrl);
    const text = stripHtml(html);
    
    const cleanText = text.replace(/[^a-zA-Z0-9\s&%$#@.,-]/g, "").trim();
    
    const jobPatterns = [
      /software (engineer|developer|architect|intern)/i,
      /senior (software|frontend|backend|full.?stack|devops)/i,
      /frontend (developer|engineer)/i,
      /backend (developer|engineer)/i,
      /full.?stack (developer|engineer)/i,
      /devops (engineer|developer)/i,
      /python (developer|engineer)/i,
      /java (developer|engineer)/i,
      /golang (developer|engineer)/i,
      /node\.?js (developer|engineer)/i,
      /react (developer|engineer)/i,
      /quality assurance|qa engineer|testing engineer/i,
      /cloud (engineer|developer)/i,
      /mobile (developer|engineer)/i,
      /data (engineer|scientist)/i,
      /product manager|project manager/i,
    ];
    
    const foundJobs: string[] = [];
    for (const pat of jobPatterns) {
      const match = cleanText.match(pat);
      if (match && match[0]) {
        foundJobs.push(match[0]);
      }
    }
    
    const preview = cleanText.slice(0, 200);
    
    console.log(`   Status: OK | Clean length: ${cleanText.length}`);
    console.log(`   Job patterns matched: ${foundJobs.length}`);
    foundJobs.slice(0, 5).forEach(j => console.log(`     • ${j}`));
    console.log(`   Preview: ${preview}`);
    console.log("");
    
    // Upsert company
    await prisma.company.upsert({
      where: { name: company.name },
      update: { careerPageUrl: company.careerUrl, industry: company.industry },
      create: { name: company.name, careerPageUrl: company.careerUrl, industry: company.industry },
    });
    
    await new Promise(r => setTimeout(r, 1000));
  }
}

main().catch(console.error);
