export const siteConfig = {
  name: "Joy Chandra Uday",
  role: "Software Engineer at garirhat.com, previously G2G Digital · Founder of OwlPrep",
  tagline: "Engineering automotive platform systems at garirhat.com, previously at G2G Digital, founder of OwlPrep, and author of open concurrency primitives.",
  motto: "Learn why before how. Understand systems instead of memorizing tools. See what others scroll past.",
  mottoBn: "কীভাবে (how) জানার আগেই জানো কেন (why)। টুলস মুখস্থ করার বদলে সিস্টেমের গভীর বোঝাপড়া তৈরি করো।",
  company: "garirhat.com",
  email: "joychandraud@gmail.com",
  location: "Dhaka, Bangladesh",
  github: "https://github.com/joychandrauday",
  linkedin: "https://linkedin.com/in/joychandrauday",
  x: "https://twitter.com/joychandrauday",
  portfolio: "https://joychandrauday-nexus.vercel.app",
  g2gAuthor: "http://g2gdigital.com/author/joychandrauday",
};

export interface Project {
  title: string;
  description: string;
  descriptionBn: string;
  tech: string[];
  category: string;
  link?: string;
  github?: string;
  signature?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "StockFlow",
    description:
      "High-concurrency inventory & order management engine with an immutable append-only ledger (onHand = Σ movements), SELECT ... FOR UPDATE transactions, and concurrency proof against double-spending.",
    descriptionBn:
      "উচ্চ-কনকারেন্সি ইনভেন্টরি ও অর্ডার ম্যানেজমেন্ট ইঞ্জিন। এতে রয়েছে ইমিউটেবল অ্যাপেন্ড-অনলি লেজার (onHand = Σ movements), ট্রানজ্যাকশন লক এবং ডাবল-স্পেন্ডিং রোধের কঠোর নিরাপত্তা।",
    tech: ["TypeScript", "Next.js", "PostgreSQL", "Prisma", "Vitest"],
    category: "Distributed Systems & DB",
    github: "https://github.com/joychandrauday",
    signature: "Immutable Ledger · Concurrency Correctness",
    featured: true,
  },
  {
    title: "FlowBridge",
    description:
      "Lead-to-action workflow automation engine with mini-CRM. Features trigger graphs, ordered steps with exponential backoff retries, delay steps surviving server restarts, and idempotent execution (workflowId, eventId).",
    descriptionBn:
      "অটোমেশন ওয়ার্কফ্লো ইঞ্জিন ও মিনি-সিআরএম। এতে রয়েছে ট্রিগার গ্রাফ, এক্সপোনেনশিয়াল ব্যাকঅফ রিট্রাই এবং সার্ভার রিস্টার্টের পরও নিরবচ্ছিন্ন এক্সিকিউশন সুবিধা।",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Zod"],
    category: "Workflow & Backend",
    github: "https://github.com/joychandrauday",
    signature: "Workflow Engine · Idempotent Retries",
    featured: true,
  },
  {
    title: "DocuPilot",
    description:
      "Production AI document extraction engine with human-in-the-loop review. Built with prompt-injection defense, field-level F1 evaluation harness, and untrusted document sanitization pipeline.",
    descriptionBn:
      "এআই ডকুমেন্ট এক্সট্রাকশন ইঞ্জিন। এতে রয়েছে হিউম্যান রিভিউ রাউটিং, প্রম্পট-ইনজেকশন ডিফেন্স এবং ফিল্ড-লেভেল এফ১ ইভালুয়েশন পাইপলাইন।",
    tech: ["Next.js", "TypeScript", "AI / LLM", "PostgreSQL", "Tailwind CSS"],
    category: "AI & Systems",
    github: "https://github.com/joychandrauday",
    signature: "Evaluation Harness · Prompt Injection Defense",
    featured: true,
  },
  {
    title: "Lifeline",
    description:
      "Webhook reliability and rescue toolkit. Durable inbox, chaos testing harness, circuit breakers, jittered retries, dead letter queues (DLQ), and single/bulk replay playbooks.",
    descriptionBn:
      "ওয়েবহুক নির্ভরযোগ্যতা ও রেসকিউ টুলকিট। ক্যাওস টেস্টিং, সার্কিট ব্রেকার, ডেড লেটার কিউ এবং এক ক্লিকে ইভেন্ট রিপ্লে সুবিধা।",
    tech: ["Node.js", "TypeScript", "PostgreSQL", "Vitest", "Docker"],
    category: "Distributed Systems & DB",
    github: "https://github.com/joychandrauday",
    signature: "Chaos Testing · Durable Inbox · Replay",
    featured: false,
  },
  {
    title: "G2G Knowledge Graph",
    description:
      "Personal editorial and mental model planning dashboard. Features interactive React Flow concept graphs, 10-point G2G quality gates, concept clusters, and keyboard-first command palette.",
    descriptionBn:
      "জ্ঞান ও চিন্তার কাঠামো পরিচালনার এডিটোরিয়াল ড্যাশবোর্ড। ইন্টারঅ্যাক্টিভ রিঅ্যাক্ট ফ্লো গ্রাফ, কনসেপ্ট ক্লাস্টার এবং কিবোর্ড-ফার্স্ট কমান্ড প্যালেট।",
    tech: ["Next.js 15", "TypeScript", "React Flow", "Prisma", "PostgreSQL"],
    category: "Full Stack",
    github: "https://github.com/joychandrauday",
    signature: "React Flow Visualization · Zod",
    featured: false,
  },
  {
    title: "Quick-Peek",
    description:
      "Open source developer utility built to inspect and streamline developer workflows, package introspection, and environment telemetry.",
    descriptionBn:
      "ওপেন সোর্স ডেভেলপার ইউটিলিটি টুল যা প্যাকেজ ইন্সপেকশন এবং এনভায়রনমেন্ট টেলিমেট্রি সহজ করে তোলে।",
    tech: ["TypeScript", "Node.js", "CLI Tools"],
    category: "Developer Tools",
    github: "https://github.com/joychandrauday/quick-peek",
    signature: "Open Source CLI Tool",
    featured: false,
  },
  {
    title: "DigiCash",
    description:
      "Digital Mobile Financial Service Platform featuring user KYC, multi-tier agent wallet system, admin management, and role-based access control.",
    descriptionBn:
      "ডিজিটাল মোবাইল ফিন্যান্সিয়াল সার্ভিস প্ল্যাটফর্ম। নিরাপদ ব্যবহারকারী নিবন্ধন, মাল্টি-টিয়ার এজেন্ট ওয়ালেট ও রোল-বেসড অ্যাক্সেস কন্ট্রোল।",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    category: "Full Stack",
    github: "https://github.com/joychandrauday/digicash",
    signature: "Atomic Financial Micro-transactions",
    featured: false,
  },
  {
    title: "OwlPrep (Grow With Owl)",
    description:
      "Gamified spaced repetition, 1-minute micro-capsules, smart question bank, and AI mentor platform for competitive exams.",
    descriptionBn:
      "গেমিফাইড স্পেসড রিপিটেশন, ১-মিনিট মাইক্রো-ক্যাপসুল ও এআই মেন্টর সমৃদ্ধ আধুনিক শিক্ষা প্ল্যাটফর্ম।",
    tech: ["Next.js", "NextAuth", "MongoDB", "Tailwind CSS"],
    category: "Full Stack",
    github: "https://github.com/joychandrauday",
    signature: "Spaced Repetition & AI Mentor",
    featured: false,
  },
];

export const skills = {
  languages: ["TypeScript", "JavaScript", "SQL", "C", "C++", "Python", "Bash"],
  frontend: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS", "React Flow", "Zod"],
  backend: ["Node.js", "Express.js", "NestJS", "Prisma ORM", "Drizzle ORM", "Socket.IO", "REST / GraphQL"],
  databases: ["PostgreSQL", "LibSQL / SQLite", "MongoDB", "Redis"],
  devops: ["Docker", "Linux", "Nginx", "GitHub Actions", "CI/CD", "AWS (Basics)"],
  learning: [
    "Distributed Consensus (Raft/Paxos)",
    "Database Internals & Storage Engines",
    "eBPF Kernel Telemetry",
    "High-Throughput Concurrency Models",
  ],
};
