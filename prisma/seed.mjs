// Prisma seed script (run with: node prisma/seed.mjs)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    slug: "stockflow",
    title: "StockFlow",
    summaryEn:
      "High-concurrency inventory engine with an immutable append-only ledger (onHand = Σ movements).",
    summaryBn:
      "অ্যাপেন্ড-অনলি লেজার ভিত্তিক উচ্চ-কনকারেন্সি ইনভেন্টরি ইঞ্জিন।",
    contentEn: "",
    contentBn: "",
    category: "Distributed Systems & DB",
    techStack: ["TypeScript", "PostgreSQL", "Prisma", "Next.js"],
    liveUrl: null,
    repoUrl: null,
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "owlprep",
    title: "OwlPrep",
    summaryEn:
      "Adaptive learning platform combining cognitive spaced repetition with structured training modules.",
    summaryBn:
      "স্পেসড রিপিটিশন ও স্ট্রাকচার্ড ট্রেনিং মডিউল সমন্বিত অ্যাডাপ্টিভ লার্নিং প্ল্যাটফর্ম।",
    contentEn: "",
    contentBn: "",
    category: "AI Systems",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "AI"],
    liveUrl: null,
    repoUrl: null,
    featured: true,
    sortOrder: 2,
  },
];

const learnings = [
  {
    title: "PostgreSQL Indexing Basics",
    category: "Database",
    status: "learned",
    content: "Understanding B-tree indexes, covering indexes, and when to avoid over-indexing.",
    takeaways: ["Use covering indexes for read-heavy workloads", "Avoid SELECT * for index efficiency", "Monitor index usage with pg_stat_user_indexes"],
    resources: ["PostgreSQL Docs: Indexes", "Use the `EXPLAIN ANALYZE` command"],
    isPublic: true,
    progress: 1.0,
  },
  {
    title: "Docker & Container Best Practices",
    category: "DevOps",
    status: "learning",
    content: "Building optimized Dockerfiles, multi-stage builds, and minimal base images.",
    takeaways: ["Use multi-stage builds to reduce image size", "Pin dependency versions", "Prefer `alpine` or `debian slim` bases"],
    resources: ["Docker Best Practices Guide", "Multi-stage build demo"],
    isPublic: true,
    progress: 0.7,
  },
  {
    title: "TypeScript Patterns for SWE",
    category: "Engineering",
    status: "learning",
    content: "Advanced type patterns, utility types, and domain modeling with TypeScript.",
    takeaways: ["Use utility types like `Partial`, `Required`, `Pick`", "Domain modeling with intersection types", "Avoid `any` — use typed configs instead"],
    resources: ["TS Handbook: Utility Types", "Typed CSS with styled-components"],
    isPublic: true,
    progress: 0.5,
  },
  {
    title: "Prisma Migrations in Production",
    category: "ORM",
    status: "learning",
    content: "Managing schema changes safely with Prisma Migrate, seeding, and rollbacks.",
    takeaways: ["Always `prisma migrate make` before changing prod", "Use `prisma migrate reset` with caution", "Backup data before destructive migrations"],
    resources: ["Prisma Migrate Docs", "Production migration checklist"],
    isPublic: true,
    progress: 0.3,
  },
];

async function main() {
  console.log("Seeding projects…");
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log(`✔ Seeded ${projects.length} projects.`);

  console.log("Seed learnings…");
  for (const l of learnings) {
    const existing = await prisma.learning.findFirst({ where: { title: l.title } });
    if (existing) {
      await prisma.learning.update({ where: { id: existing.id }, data: l });
    } else {
      await prisma.learning.create({ data: l });
    }
  }
  console.log(`✔ Seeded ${learnings.length} learnings.`);

  // Seed companies from the ChatGPT share data
  console.log("Seeding companies from ChatGPT share data…");
  const companies = [
    {
      name: "Optimizely",
      website: "https://www.optimizely.com",
      industry: "SaaS - Digital Experience Platform",
      companySize: "51-200",
      notes: "Global A/B testing & experimentation platform",
    },
    {
      name: "Field Nation",
      website: "https://www.fieldnation.com",
      industry: "Work marketplace platform",
      companySize: "201-500",
      notes: "Connects companies with service professionals globally",
    },
    {
      name: "Bevy Commerce",
      website: null,
      industry: "E-commerce / OTA systems",
      companySize: null,
      notes: "Remote-first full-stack engineering team",
    },
    {
      name: "CoreWeave",
      website: "https://www.coreweave.com",
      industry: "AI Infrastructure / Cloud Computing",
      companySize: "51-200",
      notes: "GPU-accelerated cloud platform for AI workloads",
    },
    {
      name: "Zalando Lounge",
      website: "https://www.zalando.de",
      industry: "E-commerce / Fashion",
      companySize: "201-500",
      notes: "Berlin-based online retailer with hybrid roles",
    },
    {
      name: "Maximaze",
      website: "https://www.maximaze.com",
      industry: "Employer of Record (EOR)",
      companySize: "1-10",
      notes: "Boston-based EOR hiring from emerging markets",
    },
    {
      name: "ZeuZ (Automation Solutionz)",
      website: null,
      industry: "AI, Automation, Data Engineering",
      companySize: null,
      notes: "Bangladesh-based remote team, data engineering focus",
    },
    {
      name: "Wenexus",
      website: null,
      industry: "Shopify apps / Custom e-commerce",
      companySize: null,
      notes: "Builds custom Shopify apps for merchants",
    },
    {
      name: "Hosting.com",
      website: null,
      industry: "Web hosting / Cloud services",
      companySize: null,
      notes: "Bangladesh office, mid-senior backend roles",
    },
    {
      name: "Brain Station 23",
      website: "https://brainstation23.com",
      industry: "Software development company",
      companySize: "51-200",
      notes: "Dhaka-based, multiple tech roles",
    },
    {
      name: "Plug & Solve",
      website: "https://plugandsolve.com",
      industry: "Full-stack TypeScript development",
      companySize: "1-10",
      notes: "Remote-first, 3+ years exp, BDT 60K-110K/mo",
    },
    {
      name: "WebWhiz Tech",
      website: null,
      industry: "Next.js / React development",
      companySize: null,
      notes: "Strong technical match for SWE profile",
    },
    {
      name: "Wixnova",
      website: null,
      industry: "Remote web development",
      companySize: null,
      notes: "Night shift, 6 days/week, BDT 25K-30K/mo",
    },
  ];

  for (const c of companies) {
    await prisma.company.upsert({
      where: { name: c.name },
      update: c,
      create: c,
    });
  }
  console.log(`✔ Seeded ${companies.length} companies.`);

  // Seed sample job applications from the ChatGPT share analysis
  console.log("Seed sample job applications…");
  const jobs = [
    {
      company: "Optimizely",
      role: "Software Engineer I",
      status: "applied",
      location: "Remote",
      salaryRange: "$150k - $200k per year",
      jobUrl: "https://www.optimizely.com/careers",
      jobDescription: "Software Engineer I on the Campaign Team at Optimizely. Building digital experience platform features.",
      contactName: null,
      contactEmail: null,
      coverLetter: null,
      notes: "Very strong match - global SaaS company, excellent signal job",
      matchScore: 92,
      appliedAt: new Date("2026-06-15"),
      followUpAt: new Date("2026-06-22"),
      sourcePortal: "LinkedIn",
      sourceUrl: "https://www.linkedin.com/jobs/view/senior-software-backend-engineer-lounge-by-zalando-all-genders-1?utm_source=chatgpt.com",
      employmentType: "Full-time",
      workMode: "Hybrid",
      seniority: "Mid",
      department: "Engineering",
      techStack: ["React", "TypeScript", "Node.js", "Express", "SQL", "Prisma"],
      requirements: ["3+ years experience", "React expertise", "TypeScript"],
      responsibilities: ["Build campaign features", "A/B testing infrastructure", "Digital analytics"],
      benefits: ["Equity", "Health insurance", "Remote flexibility"],
      tags: ["SaaS", "A/B Testing", "Experimentation"],
      priority: "high",
      aiSummary: "Senior Software Engineer role at global SaaS company, strong alignment with current skill stack.",
      matchReasons: ["React + TypeScript match", "SaaS domain familiarity", "Campaign team exposure"],
      gaps: ["Large-scale production experience", "A/B testing infrastructure design"],
      postedAt: new Date("2026-05-01"),
      deadline: new Date("2026-06-30"),
      lastContactedAt: new Date("2026-06-15"),
      nextActionAt: new Date("2026-06-29"),
      companyWebsite: "https://www.optimizely.com",
      companyIndustry: "SaaS - Digital Experience Platform",
      companySize: "51-200",
    },
    {
      company: "Field Nation",
      role: "Senior Software Engineer",
      status: "interview",
      location: "Dhaka / Hybrid",
      salaryRange: "BDT 240,000 - 305,000 per month",
      jobUrl: "https://www.fieldnation.com",
      jobDescription: "Staff Platform Engineer / Infrastructure role at Field Nation, a work marketplace platform.",
      contactName: null,
      contactEmail: null,
      coverLetter: null,
      notes: "Excellent benchmark job for career goals - marketplace platform",
      matchScore: 88,
      appliedAt: new Date("2026-06-10"),
      followUpAt: new Date("2026-06-17"),
      sourcePortal: "ChatGPT Share",
      sourceUrl: "https://chatgpt.com/share/6ae24bbf-af94-83ec-869f-bc1eff3ed281",
      employmentType: "Full-time",
      workMode: "Hybrid",
      seniority: "Senior",
      department: "Engineering",
      techStack: ["JavaScript", "TypeScript", "React", "Node.js", "SQL", "AWS", "Docker", "Kubernetes"],
      requirements: ["5+ years CI/CD", "Ansible/Jenkins/GitHub Actions", "GitOps experience"],
      responsibilities: ["Design infrastructure platform", "CI/CD pipeline design", "Multi-cloud operations"],
      benefits: ["Competitive salary", "Remote flexibility", "Learning budget"],
      tags: ["Marketplace", "Infrastructure", "CI/CD"],
      priority: "high",
      aiSummary: "Staff Platform Engineer at marketplace platform - well above current level but excellent career indicator.",
      matchReasons: ["JavaScript/TypeScript match", "AWS/Docker/Kubernetes exposure", "Infrastructure focus"],
      gaps: ["5+ years hands-on CI/CD", "Ansible/Jenkins/GitHub Actions depth", "Multi-cloud operations"],
      postedAt: new Date("2026-04-15"),
      deadline: new Date("2026-05-15"),
      lastContactedAt: new Date("2026-06-10"),
      nextActionAt: new Date("2026-06-24"),
      companyWebsite: "https://www.fieldnation.com",
      companyIndustry: "Work marketplace platform",
      companySize: "201-500",
    },
    {
      company: "Bevy Commerce",
      role: "Senior Software Engineer L5",
      status: "wishlist",
      location: "100% Remote",
      salaryRange: "Not specified",
      jobUrl: "https://www.bevycommerce.com/careers",
      jobDescription: "Senior Full-Stack Software Engineer (L5) - nearly perfectly aligned with SWE goals.",
      contactName: null,
      contactEmail: null,
      coverLetter: null,
      notes: "Almost perfectly aligned with long-term Software Engineer goals",
      matchScore: 95,
      appliedAt: null,
      followUpAt: null,
      sourcePortal: "ChatGPT Share",
      sourceUrl: "https://chatgpt.com/share/6ae24bbf-af94-83ec-869f-bc1eff3ed281",
      employmentType: "Full-time",
      workMode: "Remote",
      seniority: "L5",
      department: "Engineering",
      techStack: ["Node.js", "TypeScript", "React", "Next.js", "SQL", "Prisma", "Git", "CI/CD"],
      requirements: ["Strong full-stack skills", "Cloud architecture knowledge", "AI-assisted development"],
      responsibilities: ["Full-stack feature development", "System architecture", "AI-assisted workflows"],
      benefits: ["100% remote", "Equity", "Learning stipend"],
      tags: ["Full-stack", "Remote", "AI-assisted"],
      priority: "high",
      aiSummary: "L5 Full-Stack role at Bevy Commerce - nearly perfect alignment with SWE trajectory.",
      matchReasons: ["Stack match: Node/TS/React/Prisma/SQL", "L5 level aligns with career goals", "Remote-first"],
      gaps: ["5+ years seniority expectation", "Deep cloud architecture experience"],
      postedAt: new Date("2026-06-01"),
      deadline: null,
      lastContactedAt: null,
      nextActionAt: new Date("2026-06-20"),
      companyWebsite: null,
      companyIndustry: "E-commerce / OTA systems",
      companySize: null,
    },
    {
      company: "CoreWeave",
      role: "Senior Software Engineer, DevX",
      status: "applied",
      location: "Sunnyvale, CA",
      salaryRange: "$165k - $242k annually",
      jobUrl: "https://www.coreweave.com/careers",
      jobDescription: "Senior Software Engineer in Developer Experience at CoreWeave, GPU-accelerated cloud platform.",
      contactName: null,
      contactEmail: null,
      coverLetter: null,
      notes: "AI/cloud infrastructure role - high compensation, top tier",
      matchScore: 82,
      appliedAt: new Date("2026-07-01"),
      followUpAt: new Date("2026-07-08"),
      sourcePortal: "Built In SF",
      sourceUrl: "https://builtin.sanfrancisco.com/companies/coreweave/jobs/senior-software-engineer-developer-experience/9243621?utm_source=chatgpt.com",
      employmentType: "Full-time",
      workMode: "Office",
      seniority: "Senior",
      department: "Engineering",
      techStack: ["TypeScript", "React", "Node.js", "Python", "Firebase", "AWS"],
      requirements: ["5+ years software engineering", "Full-stack experience", "Developer tooling"],
      responsibilities: ["Build developer experience tools", "API design", "Documentation"],
      benefits: ["$165k-242k", "Stock options", "AI/ML projects"],
      tags: ["AI", "Cloud", "Developer Experience"],
      priority: "high",
      aiSummary: "Senior DevX at CoreWeave - AI/cloud infrastructure, high compensation package.",
      matchReasons: ["TypeScript/React match", "AI/ML exposure", "High compensation"],
      gaps: ["GPU/cloud infrastructure experience", "Large-scale system design"],
      postedAt: new Date("2026-06-05"),
      deadline: new Date("2026-07-20"),
      lastContactedAt: new Date("2026-07-01"),
      nextActionAt: new Date("2026-07-15"),
      companyWebsite: "https://www.coreweave.com",
      companyIndustry: "AI Infrastructure / Cloud Computing",
      companySize: "51-200",
    },
  ];

  for (const j of jobs) {
    await prisma.jobApplication.create({ data: j });
  }
  console.log(`✔ Seeded ${jobs.length} job applications.`);

  // ── Digital Document Folders & Documents ────────────────────────────
  const certFolder = await prisma.documentFolder.upsert({
    where: { slug: "certifications" },
    update: {},
    create: {
      name: "Certifications & Credentials",
      slug: "certifications",
      icon: "file-badge",
      color: "#10B981",
      description: "Verified engineering credentials and professional certifications.",
      sortOrder: 1,
    },
  });

  const resumeFolder = await prisma.documentFolder.upsert({
    where: { slug: "resume-and-bio" },
    update: {},
    create: {
      name: "Resume & Professional Bio",
      slug: "resume-and-bio",
      icon: "file-text",
      color: "#FFB44B",
      description: "Current curriculum vitae editions and executive summaries.",
      sortOrder: 2,
    },
  });

  const rfcFolder = await prisma.documentFolder.upsert({
    where: { slug: "architecture-rfcs" },
    update: {},
    create: {
      name: "Architecture Specs & RFCs",
      slug: "architecture-rfcs",
      icon: "cpu",
      color: "#6366F1",
      description: "Distributed systems RFCs, invariants, and design documents.",
      sortOrder: 3,
    },
  });

  const cheatFolder = await prisma.documentFolder.upsert({
    where: { slug: "cheatsheets" },
    update: {},
    create: {
      name: "Cheatsheets & Guides",
      slug: "cheatsheets",
      icon: "terminal",
      color: "#3B82F6",
      description: "Quick reference guides for Linux, PostgreSQL, and Docker.",
      sortOrder: 4,
    },
  });

  const initialDocs = [
    {
      title: "Joy Chandra Uday — Master Curriculum Vitae (2026)",
      description: "Complete engineering dossier highlighting distributed systems, append-only ledgers, and platform architecture.",
      folderId: resumeFolder.id,
      fileType: "pdf",
      fileUrl: "/resume",
      fileSize: "2.4 MB · PDF",
      tags: ["Resume", "CV", "Software Engineer"],
      isPublic: true,
      pinned: true,
      issuedAt: new Date("2026-10-01"),
    },
    {
      title: "AWS Certified Solutions Architect Associate",
      description: "Architecting highly available, cost-efficient, fault-tolerant distributed systems on AWS.",
      folderId: certFolder.id,
      fileType: "pdf",
      fileUrl: "https://aws.amazon.com/certification/",
      fileSize: "Credential ID: AWS-849204",
      tags: ["AWS", "Cloud", "Architecture"],
      isPublic: true,
      pinned: true,
      issuedAt: new Date("2025-11-15"),
    },
    {
      title: "RFC 001: Append-Only Ledger & Concurrency Correctness",
      description: "Design specification for StockFlow's transaction lock model and double-spending prevention.",
      folderId: rfcFolder.id,
      fileType: "markdown",
      content: "# RFC 001: Append-Only Ledger Invariants\n\n1. State is never mutated in-place.\n2. OnHand balance is computed as onHand = Σ movements.\n3. Row locks use SELECT ... FOR UPDATE within strict ACID transaction boundaries.",
      fileSize: "RFC Spec · Markdown",
      tags: ["Distributed Systems", "RFC", "PostgreSQL"],
      isPublic: true,
      pinned: false,
      issuedAt: new Date("2026-05-10"),
    },
    {
      title: "Linux & Bash Production Cheatsheet",
      description: "Curated POSIX-compliant terminal one-liners, process management, and networking diagnostics.",
      folderId: cheatFolder.id,
      fileType: "code",
      content: "# Find and batch process without forking per file:\nfind . -type f -name '*.log' -exec rm {} +\n\n# Real-time socket connections:\nss -tulpn\n\n# Memory footprint by process:\nps aux --sort=-%mem | head -n 10",
      fileSize: "Terminal Guide",
      tags: ["Linux", "Bash", "CLI"],
      isPublic: true,
      pinned: false,
      issuedAt: new Date("2026-08-20"),
    },
  ];

  for (const doc of initialDocs) {
    const existing = await prisma.document.findFirst({ where: { title: doc.title } });
    if (!existing) {
      await prisma.document.create({ data: doc });
    }
  }
  console.log(`✔ Seeded digital document folders & documents.`);

  console.log("\n🌱 All seeding complete!");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
