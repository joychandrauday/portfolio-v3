import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const TOP_10_BD_SOFTWARE_COMPANIES = [
  {
    name: "Brain Station 23",
    website: "https://brainstation-23.com",
    careerPageUrl: "https://brainstation-23.com/career/",
    headquarters: "8th Floor, 2 Bir Uttam AK Khandakar Road, Mohakhali C/A, Dhaka 1212",
    industry: "Enterprise Software, Fintech & Cloud",
    companySize: "700+ Engineers",
    notes:
      "Largest IT exporter in Bangladesh. Premier AWS, Microsoft, and Google Cloud partner. Hires extensively across Node.js, React, .NET Core, Java, Python, and Mobile (Flutter/iOS/Android).",
    salaryBenchmark: "BDT 50,000 - 280,000 / month ($600 - $2,500 USD)",
    salaryMin: 600000,
    salaryMax: 3360000,
    activeRoles: [
      {
        role: "Senior Full-Stack Engineer (Node.js / React)",
        workMode: "Hybrid",
        location: "Dhaka (Mohakhali)",
        salaryRange: "BDT 140,000 - 240,000 / month",
        techStack: ["TypeScript", "Node.js", "React", "PostgreSQL", "AWS", "Docker"],
        matchScore: 94,
        jobUrl: "https://brainstation-23.com/career/",
        contactEmail: "career@brainstation-23.com",
        jobDescription:
          "Brain Station 23 is seeking a Senior Full-Stack Engineer with strong mastery over TypeScript, Next.js/React, and distributed Node.js microservices. Experience with PostgreSQL database tuning, caching with Redis, and cloud-native architecture.",
      },
      {
        role: "DevOps & Cloud Systems Engineer",
        workMode: "Hybrid",
        location: "Dhaka",
        salaryRange: "BDT 120,000 - 200,000 / month",
        techStack: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Linux"],
        matchScore: 88,
        jobUrl: "https://brainstation-23.com/career/",
        contactEmail: "career@brainstation-23.com",
        jobDescription:
          "Responsible for architecting resilient CI/CD pipelines, container orchestration with Kubernetes, infrastructure as code with Terraform, and zero-downtime deployment telemetry.",
      },
    ],
  },
  {
    name: "BJIT Limited",
    website: "https://bjitgroup.com",
    careerPageUrl: "https://bjitgroup.com/career",
    headquarters: "H-2275, 2279 Pachkhula, Satarkul, Badda, Dhaka 1212",
    industry: "Offshore R&D, AI & Global Enterprise Solutions",
    companySize: "800+ Engineers",
    notes:
      "Joint venture with Japanese enterprise partners. Specializes in embedded systems, AI/ML, automotive software, enterprise web, and fintech. Known for extensive campus recruitment and global relocation to Tokyo/Singapore.",
    salaryBenchmark: "BDT 45,000 - 260,000 / month",
    salaryMin: 540000,
    salaryMax: 3120000,
    activeRoles: [
      {
        role: "Senior Software Engineer (Backend & Architecture)",
        workMode: "Hybrid",
        location: "Dhaka (Badda)",
        salaryRange: "BDT 130,000 - 220,000 / month",
        techStack: ["Node.js", "Python", "Java", "PostgreSQL", "System Design"],
        matchScore: 91,
        jobUrl: "https://bjitgroup.com/career",
        contactEmail: "recruitment@bjitgroup.com",
        jobDescription:
          "Seeking seasoned backend engineers for international client deliveries. Candidates must demonstrate deep knowledge of transactional integrity, asynchronous queuing, and concurrency control.",
      },
    ],
  },
  {
    name: "Therap (BD) Ltd.",
    website: "https://therapbd.com",
    careerPageUrl: "https://therap.trakstar.com",
    headquarters: "House 47, Road 4, Block C, Banani, Dhaka 1213",
    industry: "Healthcare SaaS (US Market)",
    companySize: "400+ Engineers",
    notes:
      "US healthcare software powerhouse with primary development center in Dhaka. Renowned for engineering rigor, high compensation packages, comprehensive employee benefits, and stable Java/React enterprise architecture.",
    salaryBenchmark: "BDT 60,000 - 320,000 / month ($700 - $3,000 USD)",
    salaryMin: 720000,
    salaryMax: 3840000,
    activeRoles: [
      {
        role: "Software Engineer — Platform & Distributed Web",
        workMode: "Onsite / Hybrid",
        location: "Dhaka (Banani)",
        salaryRange: "BDT 110,000 - 180,000 / month",
        techStack: ["Java", "React", "TypeScript", "Oracle", "PostgreSQL", "REST APIs"],
        matchScore: 90,
        jobUrl: "https://therap.trakstar.com",
        contactEmail: "hr@therapbd.com",
        jobDescription:
          "Engineers develop mission-critical medical records and compliance tracking systems used across 50 US states. Requires strong algorithmic fundamentals, relational database mastery, and robust API development.",
      },
    ],
  },
  {
    name: "Cefalo Bangladesh",
    website: "https://cefalo.com",
    careerPageUrl: "https://career.cefalo.com/",
    headquarters: "House 12, Road 12, Dhanmondi, Dhaka 1209",
    industry: "Nordic Product Engineering & Media Tech",
    companySize: "200+ Engineers",
    notes:
      "Norwegian software company with a flat, transparent Scandinavian culture. Strong focus on work-life balance, high engineer autonomy, Codeforces-style assessment, and modern tech stacks (React, Node.js, .NET, Python).",
    salaryBenchmark: "BDT 70,000 - 350,000 / month ($800 - $3,200 USD)",
    salaryMin: 840000,
    salaryMax: 4200000,
    activeRoles: [
      {
        role: "Senior Full-Stack Engineer (Scandinavian Media Platform)",
        workMode: "Hybrid / Flexible",
        location: "Dhaka (Dhanmondi)",
        salaryRange: "BDT 160,000 - 280,000 / month",
        techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "GCP"],
        matchScore: 96,
        jobUrl: "https://career.cefalo.com/",
        contactEmail: "jobs@cefalo.com",
        jobDescription:
          "Collaborate with Norwegian engineering teams on real-time news publishing engines, event stream processing, and sub-100ms web delivery. Excellent communication and clean code architecture required.",
      },
    ],
  },
  {
    name: "Enosis Solutions",
    website: "https://www.enosisbd.com",
    careerPageUrl: "https://www.enosisbd.com/careers/",
    headquarters: "House 27, Road 11, Block F, Banani, Dhaka 1213",
    industry: "US Enterprise & Cloud Software",
    companySize: "350+ Engineers",
    notes:
      "One of the most competitive recruiting destinations for computer science graduates. Works exclusively with US startups and mid-market tech enterprises. Known for problem-solving written tests and solid engineering disciplines.",
    salaryBenchmark: "BDT 55,000 - 260,000 / month",
    salaryMin: 660000,
    salaryMax: 3120000,
    activeRoles: [
      {
        role: "Senior Software Engineer (Full Stack)",
        workMode: "Hybrid",
        location: "Dhaka (Banani)",
        salaryRange: "BDT 140,000 - 230,000 / month",
        techStack: ["Node.js", "React", "TypeScript", "AWS", "SQL Server / PostgreSQL"],
        matchScore: 93,
        jobUrl: "https://www.enosisbd.com/careers/",
        contactEmail: "jobs@enosisbd.com",
        jobDescription:
          "Build scalable enterprise web applications for Silicon Valley and US East Coast clients. Requires solid algorithmic foundation, asynchronous design patterns, and clean architecture.",
      },
    ],
  },
  {
    name: "Kona Software Lab (Kona SL)",
    website: "https://konasl.com",
    careerPageUrl: "https://konasl.com/careers",
    headquarters: "Police Plaza Concord, Tower A, Gulshan-1, Dhaka 1212",
    industry: "Fintech, Digital Security & Smart Card OS",
    companySize: "250+ Engineers",
    notes:
      "R&D center of KONA I (South Korea). Pioneers in EMV payment chips, cryptography, NFC mobile payment platforms, and PKI security infrastructure. Demands deep fundamentals in data structures, algorithms, and secure coding.",
    salaryBenchmark: "BDT 60,000 - 300,000 / month",
    salaryMin: 720000,
    salaryMax: 3600000,
    activeRoles: [
      {
        role: "Backend Systems Engineer (FinTech & Cryptography)",
        workMode: "Onsite / Hybrid",
        location: "Dhaka (Gulshan-1)",
        salaryRange: "BDT 130,000 - 220,000 / month",
        techStack: ["Java", "C++", "Node.js", "Cryptography", "PostgreSQL", "Linux"],
        matchScore: 89,
        jobUrl: "https://konasl.com/careers",
        contactEmail: "career@konasl.com",
        jobDescription:
          "Design high-throughput, low-latency financial transaction switches and cryptographic hardware interfaces. Focus on ACID properties, socket communication, and military-grade encryption.",
      },
    ],
  },
  {
    name: "Dynamic Solution Innovators (DSi)",
    website: "https://www.dsinnovators.com",
    careerPageUrl: "https://app.hrythmic.com/recruit/openings/company/dsinnovators/",
    headquarters: "House 177, Lane 2, Eastern Road, New DOHS Mohakhali, Dhaka 1206",
    industry: "Enterprise Application Development & Applied AI",
    companySize: "250+ Engineers",
    notes:
      "Established in 2001. Trusted engineering partner for European and American telecom, healthcare, and enterprise clients. Uses HRythmic recruitment engine. Fast-growing applied AI and cloud architecture practices.",
    salaryBenchmark: "BDT 50,000 - 250,000 / month",
    salaryMin: 600000,
    salaryMax: 3000000,
    activeRoles: [
      {
        role: "Lead / Senior Backend Engineer",
        workMode: "Hybrid",
        location: "Dhaka (DOHS Mohakhali)",
        salaryRange: "BDT 150,000 - 240,000 / month",
        techStack: ["TypeScript", "Node.js", "PostgreSQL", "Docker", "Microservices"],
        matchScore: 92,
        jobUrl: "https://app.hrythmic.com/recruit/openings/company/dsinnovators/",
        contactEmail: "career@dsinnovators.com",
        jobDescription:
          "Lead a core engineering squad delivering high-availability microservices. Responsibilities include database optimization, query tuning, and code review mentorship.",
      },
    ],
  },
  {
    name: "SELISE Digital Platforms",
    website: "https://selisegroup.com",
    careerPageUrl: "https://selisegroup.com/careers/",
    headquarters: "House 24, Road 130, Gulshan 1, Dhaka 1212",
    industry: "Swiss Digital Platforms & Cloud Ecosystems",
    companySize: "300+ Engineers",
    notes:
      "Swiss-owned digital platform engineering company with development hubs in Dhaka, Zurich, and Dubai. Known for sleek modern offices, continuous learning, and multi-tenant SaaS platforms.",
    salaryBenchmark: "BDT 55,000 - 270,000 / month",
    salaryMin: 660000,
    salaryMax: 3240000,
    activeRoles: [
      {
        role: "Senior Frontend / Full-Stack Engineer",
        workMode: "Hybrid",
        location: "Dhaka (Gulshan 1)",
        salaryRange: "BDT 140,000 - 230,000 / month",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js"],
        matchScore: 95,
        jobUrl: "https://selisegroup.com/careers/",
        contactEmail: "talent@selisegroup.com",
        jobDescription:
          "Craft premium user experiences and high-performance design system interfaces for Swiss enterprise customers. Heavy emphasis on Next.js App Router, responsive state machines, and API optimization.",
      },
    ],
  },
  {
    name: "bKash Limited",
    website: "https://www.bkash.com",
    careerPageUrl: "https://www.bkash.com/career",
    headquarters: "Shadhinata Bhaban, 8 Bir Sreshtho Shaheed Jahangir Gate, Dhaka Cantonment, Dhaka 1206",
    industry: "FinTech & Mobile Financial Services",
    companySize: "2000+ Employees (300+ Tech & Product)",
    notes:
      "The undisputed pioneer of mobile money in Bangladesh. Handles tens of millions of real-time transactions daily with strict zero-loss ledger guarantees. Tier-1 compensation, institutional benefits, and high engineering prestige.",
    salaryBenchmark: "BDT 80,000 - 400,000+ / month ($1,000 - $3,800 USD)",
    salaryMin: 960000,
    salaryMax: 4800000,
    activeRoles: [
      {
        role: "Senior Software Engineer (Core Ledger & Transactions)",
        workMode: "Onsite / Hybrid",
        location: "Dhaka (Dhaka Cantonment)",
        salaryRange: "BDT 170,000 - 300,000 / month",
        techStack: ["Java", "Go", "Kafka", "PostgreSQL", "Oracle", "High Concurrency"],
        matchScore: 94,
        jobUrl: "https://www.bkash.com/career",
        contactEmail: "talent@bkash.com",
        jobDescription:
          "Work on the high-concurrency payment engine powering millions of daily financial transactions. Responsibilities include race-condition elimination, append-only ledgers, low latency messaging queues, and audit trails.",
      },
    ],
  },
  {
    name: "Kaz Software",
    website: "https://kaz.com.bd",
    careerPageUrl: "https://kaz.trakstar.com",
    headquarters: "35/5 Shantinagar, Dhaka 1217",
    industry: "Bespoke Web & Mobile Products",
    companySize: "120+ Engineers",
    notes:
      "Pioneer software engineering firm operating since 2004. Known for engineering craftsmanship, high code quality standards, and alumni who went on to top tech firms worldwide. Uses Trakstar Hire ATS.",
    salaryBenchmark: "BDT 50,000 - 240,000 / month",
    salaryMin: 600000,
    salaryMax: 2880000,
    activeRoles: [
      {
        role: "Senior Software Engineer (TypeScript & Node.js)",
        workMode: "Hybrid / Flexible",
        location: "Dhaka (Shantinagar)",
        salaryRange: "BDT 130,000 - 210,000 / month",
        techStack: ["TypeScript", "Node.js", "React", "PostgreSQL", "Cloud APIs"],
        matchScore: 92,
        jobUrl: "https://kaz.trakstar.com",
        contactEmail: "jobs@kaz.com.bd",
        jobDescription:
          "Develop custom web and cloud applications for European and US clients. Looking for engineers who write testable, maintainable code with strong relational database principles.",
      },
    ],
  },
];

async function seedToDatabase() {
  console.log(`Starting ingest of ${TOP_10_BD_SOFTWARE_COMPANIES.length} top Bangladesh tech companies...`);

  let companiesCount = 0;
  let jobsCount = 0;

  for (const c of TOP_10_BD_SOFTWARE_COMPANIES) {
    // 1. Upsert Company
    const companyRecord = await prisma.company.upsert({
      where: { name: c.name },
      update: {
        website: c.website,
        careerPageUrl: c.careerPageUrl,
        industry: c.industry,
        companySize: c.companySize,
        headquarters: c.headquarters,
        notes: c.notes,
      },
      create: {
        name: c.name,
        website: c.website,
        careerPageUrl: c.careerPageUrl,
        industry: c.industry,
        companySize: c.companySize,
        headquarters: c.headquarters,
        notes: c.notes,
      },
    });
    companiesCount++;

    // 2. Insert active opportunities
    for (const j of c.activeRoles) {
      const existing = await prisma.jobApplication.findFirst({
        where: {
          company: c.name,
          role: j.role,
        },
      });

      if (!existing) {
        await prisma.jobApplication.create({
          data: {
            company: c.name,
            role: j.role,
            status: "wishlist",
            location: j.location,
            workMode: j.workMode,
            salaryRange: j.salaryRange,
            salaryMin: c.salaryMin,
            salaryMax: c.salaryMax,
            salaryCurrency: "BDT",
            jobUrl: j.jobUrl,
            sourcePortal: "Direct Career Portal",
            sourceUrl: j.jobUrl,
            companyWebsite: c.website,
            careerPageUrl: c.careerPageUrl,
            companyIndustry: c.industry,
            companySize: c.companySize,
            techStack: j.techStack,
            requirements: [
              "Strong algorithmic fundamentals and data structures",
              "Production experience in high-concurrency systems",
              "Relational database optimization (PostgreSQL / MySQL)",
            ],
            priority: "high",
            matchScore: j.matchScore,
            contactEmail: j.contactEmail,
            aiSummary: `Matched with Joy's systems stack (TypeScript, Next.js, Node.js, PostgreSQL, Concurrency Ledgers). ${c.name} offers strong engineering culture and solid compensation.`,
            jobDescription: j.jobDescription,
            companyId: companyRecord.id,
          },
        });
        jobsCount++;
      }
    }
  }

  console.log(`✓ Ingest complete! Upserted ${companiesCount} companies and ${jobsCount} opportunities.`);
}

seedToDatabase()
  .catch((e) => {
    console.error("Database seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
