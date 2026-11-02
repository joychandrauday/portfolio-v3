import fetch from "node-fetch"; // or native fetch in Node 18+
import fs from "fs";

const companies = [
  {
    name: "Brain Station 23",
    careerUrl: "https://brainstation-23.com/career/",
    website: "https://brainstation-23.com",
    industry: "Enterprise Software & Cloud",
  },
  {
    name: "BJIT Limited",
    careerUrl: "https://bjitgroup.com/career",
    website: "https://bjitgroup.com",
    industry: "Global Software Services & R&D",
  },
  {
    name: "Therap (BD) Ltd",
    careerUrl: "https://therapbd.com/careers/",
    website: "https://therapbd.com",
    industry: "Healthcare SaaS",
  },
  {
    name: "Cefalo Bangladesh",
    careerUrl: "https://career.cefalo.com/",
    website: "https://cefalo.com",
    industry: "Nordic Product Engineering",
  },
  {
    name: "Enosis Solutions",
    careerUrl: "https://www.enosisbd.com/careers/",
    website: "https://www.enosisbd.com",
    industry: "US Enterprise & Cloud Software",
  },
  {
    name: "Kona Software Lab",
    careerUrl: "https://konasl.com/careers",
    website: "https://konasl.com",
    industry: "Fintech & Digital Security",
  },
  {
    name: "Dynamic Solution Innovators (DSi)",
    careerUrl: "https://dsinnovators.com/careers",
    website: "https://dsinnovators.com",
    industry: "Enterprise Application Development",
  },
  {
    name: "SELISE Digital Platforms",
    careerUrl: "https://selisegroup.com/careers/",
    website: "https://selisegroup.com",
    industry: "Swiss Digital Platforms",
  },
  {
    name: "bKash Limited",
    careerUrl: "https://www.bkash.com/career",
    website: "https://www.bkash.com",
    industry: "Fintech & Mobile Financial Services",
  },
  {
    name: "Kaz Software",
    careerUrl: "https://kaz.com.bd/careers",
    website: "https://kaz.com.bd",
    industry: "Bespoke Web & Mobile Products",
  },
];

async function testScrape() {
  const results = [];
  for (const c of companies) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(c.careerUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      clearTimeout(timeout);
      const text = await res.text();
      results.push({
        name: c.name,
        status: res.status,
        length: text.length,
        hasOpenings: /opening|job|position|apply|career|developer|engineer/i.test(text),
        sample: text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 300),
      });
    } catch (e) {
      results.push({
        name: c.name,
        status: "ERROR",
        error: e.message,
      });
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

testScrape();
