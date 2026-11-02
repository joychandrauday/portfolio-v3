// scripts/import-bd-career-pages.ts
// Run with: npx tsx scripts/import-bd-career-pages.ts
// Requires: GEMINI_API_KEY or GROQ_API_KEY in .env.local

import { parseJobPosting } from "@/lib/ai";
import { prisma } from "@/lib/db";

const BD_TOP_COMPANIES = [
  {
    name: "Brain Station 23",
    careerPage: "https://brainstation-23.easy.jobs",
    altUrls: [
      "https://erp.bs-23.com/jobs",
      "https://brainstation-23.com/careers"
    ]
  },
  {
    name: "BJIT",
    careerPage: "https://bjitgroup.com/career",
    altUrls: ["https://bjitgroup.com/career-apply/"]
  },
  {
    name: "Vivasoft",
    careerPage: "https://vivasoftltd.com/career/",
    altUrls: ["https://vivasoft.com.np/career/"]
  },
  {
    name: "Therap BD",
    careerPage: "https://therapbd.com/",
    // Career sections: /business-analysis/, /software-development/, /web-design-development/, /it-operations/, /training-and-content/, /database-administration/, /system-operations/
    altUrls: [
      "https://therapbd.com/business-analysis/",
      "https://therapbd.com/software-development/",
      "https://therapbd.com/web-design-development/",
      "https://therapbd.com/it-operations/",
      "https://therapbd.com/database-administration/",
      "https://therapbd.com/system-operations/"
    ]
  },
  {
    name: "Cefalo",
    careerPage: "https://career.cefalo.com/",
    altUrls: ["https://career.cefalo.com/open-application"]
  },
  {
    name: "Selise",
    careerPage: "https://ats.hirebee.ai/en/company/jobs/selise-bangladesh-ltd",
    altUrls: ["https://selisegroup.com/job-application/"]
  },
  {
    name: "Next Venture",
    careerPage: "https://nextventure.com.bd/careers",
    altUrls: []
  },
  {
    name: "ITclan BD",
    careerPage: "https://itclanbd.com/careers",
    altUrls: []
  },
  {
    name: "Ollyo",
    careerPage: "https://ollyo.com/careers",
    altUrls: []
  },
  {
    name: "Startise",
    careerPage: "https://startise.com/careers",
    altUrls: []
  },
];

async function fetchPageContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CareerBot/1.0; +https://joychandrauday.vercel.app)'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err);
    return "";
  }
}

function extractJobLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  const patterns = [
    /href="(https?:\/\/[^"]*(?:job|career|position|opening|apply)[^"]*)"/gi,
    /href="(https?:\/\/[^"]*(?:jobs?|careers?)[^"]*)"/gi,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      try {
        const url = new URL(match[1], baseUrl).href;
        if (!links.includes(url)) links.push(url);
      } catch {}
    }
  }
  return links;
}

async function processCompany(company: typeof BD_TOP_COMPANIES[0]) {
  console.log(`\n🔍 Processing ${company.name}...`);
  
  // Check if company already exists in KB
  const existingCompany = await prisma.company.findUnique({
    where: { name: company.name }
  });
  
  if (existingCompany?.careerPageUrl) {
    console.log(`  ✓ Already in KB: ${existingCompany.careerPageUrl}`);
  } else {
    // Upsert company with career page URL
    await prisma.company.upsert({
      where: { name: company.name },
      update: { careerPageUrl: company.careerPage },
      create: { 
        name: company.name, 
        careerPageUrl: company.careerPage,
        industry: "Software Development",
        companySize: "200-500"
      }
    });
    console.log(`  ✅ Added to Company KB with career page: ${company.careerPage}`);
  }

  // Fetch career page to discover job links
  const html = await fetchPageContent(company.careerPage);
  if (!html) {
    console.log(`  ⚠️ Could not fetch career page`);
    return;
  }

  const jobLinks = extractJobLinks(html, company.careerPage);
  console.log(`  🔗 Found ${jobLinks.length} potential job links`);

  // Process first few job links (limit to avoid rate limits)
  for (const link of jobLinks.slice(0, 5)) {
    try {
      console.log(`    📄 Parsing: ${link}`);
      const jobHtml = await fetchPageContent(link);
      if (!jobHtml) continue;

      // Strip HTML to text (basic)
      const text = jobHtml
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 8000);

      if (text.length < 200) continue;

      // Parse with AI
      const parsed = await parseJobPosting({ 
        jobDescription: text, 
        sourceUrl: link 
      });

      if (!parsed.company || !parsed.role) continue;

      console.log(`      → ${parsed.company} | ${parsed.role} | ${parsed.salaryRaw || "No salary"}`);
      console.log(`      → Match: ${parsed.matchScore}% | Tech: ${parsed.techStack.slice(0, 5).join(", ")}`);

      // Save to DB
      const companyId = await prisma.company.upsert({
        where: { name: parsed.company },
        update: {
          website: parsed.companyWebsite,
          careerPageUrl: parsed.careerPageUrl,
          industry: parsed.companyIndustry,
          companySize: parsed.companySize,
        },
        create: {
          name: parsed.company,
          website: parsed.companyWebsite,
          careerPageUrl: parsed.careerPageUrl,
          industry: parsed.companyIndustry,
          companySize: parsed.companySize,
        }
      });

      await prisma.jobApplication.create({
        data: {
          company: parsed.company,
          role: parsed.role,
          location: parsed.location,
          workMode: parsed.workMode,
          employmentType: parsed.employmentType,
          seniority: parsed.seniority,
          department: parsed.department,
          status: "wishlist",
          salaryRange: parsed.salaryRaw,
          salaryMin: parsed.salaryMin,
          salaryMax: parsed.salaryMax,
          salaryCurrency: parsed.salaryCurrency,
          salaryPeriod: parsed.salaryPeriod,
          sourcePortal: parsed.sourcePortal,
          sourceUrl: parsed.sourceUrl,
          companyWebsite: parsed.companyWebsite,
          careerPageUrl: parsed.careerPageUrl,
          companyIndustry: parsed.companyIndustry,
          companySize: parsed.companySize,
          techStack: parsed.techStack,
          requirements: parsed.requirements,
          responsibilities: parsed.responsibilities,
          benefits: parsed.benefits,
          tags: parsed.tags,
          contactName: parsed.contactName,
          contactRole: parsed.contactRole,
          contactEmail: parsed.contactEmail,
          contactLinkedIn: parsed.contactLinkedIn,
          matchScore: parsed.matchScore,
          matchReasons: parsed.matchReasons,
          gaps: parsed.gaps,
          aiSummary: parsed.aiSummary,
          priority: parsed.priority,
          postedAt: parsed.postedAt ? new Date(parsed.postedAt) : null,
          deadline: parsed.deadline ? new Date(parsed.deadline) : null,
          jobDescription: text,
          companyId: companyId.id,
        }
      });
      console.log(`      ✅ Saved to pipeline`);
      
      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (err) {
      console.error(`      ❌ Error processing ${link}:`, err);
    }
  }
}

async function main() {
  console.log("🚀 Starting Bangladesh Top 10 Software Companies Career Page Import");
  console.log("=====================================================================");
  
  for (const company of BD_TOP_COMPANIES) {
    await processCompany(company);
    // Delay between companies
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log("\n✅ Import complete!");
  console.log("Check /ops/jobs and /ops/companies to see results.");
  
  await prisma.$disconnect();
}

main().catch(console.error);