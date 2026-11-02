/**
 * Structured roadmap data model for dynamic fetching.
 * This replaces hardcoded roadmaps in /learn page with a scalable data model.
 */

export type RoadmapDifficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type RoadmapLanguage = "en" | "bn";

export interface RoadmapStep {
  slug: string;
  title: string;
  description: string;
  resources: string[];
  myNotes?: string;
  estimatedMinutes?: number;
}

export interface RoadmapPhase {
  slug: string;
  title: string;
  duration: string;
  description: string;
  steps: RoadmapStep[];
}

export interface Roadmap {
  slug: string;
  title: Record<RoadmapLanguage, string>;
  description: Record<RoadmapLanguage, string>;
  estimatedHours: number;
  difficulty: RoadmapDifficulty;
  icon?: string;
  tags: string[];
  phases: RoadmapPhase[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapSummary {
  slug: string;
  title: Record<RoadmapLanguage, string>;
  description: Record<RoadmapLanguage, string>;
  estimatedHours: number;
  difficulty: RoadmapDifficulty;
  icon?: string;
  tags: string[];
  totalPhases: number;
  totalSteps: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get localized title/description for a roadmap
 */
export function getRoadmapTitle(roadmap: RoadmapSummary, language: RoadmapLanguage): string {
  return roadmap.title[language] || roadmap.title.en;
}

export function getRoadmapDescription(roadmap: RoadmapSummary, language: RoadmapLanguage): string {
  return roadmap.description[language] || roadmap.description.en;
}

/**
 * Get localized title/description for a phase
 */
export function getPhaseTitle(phase: RoadmapPhase, language: RoadmapLanguage): string {
  return phase.title;
}

export function getPhaseDescription(phase: RoadmapPhase, language: RoadmapLanguage): string {
  return phase.description;
}

/**
 * Convert Roadmap to RoadmapSummary
 */
export function toRoadmapSummary(roadmap: Roadmap): RoadmapSummary {
  return {
    slug: roadmap.slug,
    title: roadmap.title,
    description: roadmap.description,
    estimatedHours: roadmap.estimatedHours,
    difficulty: roadmap.difficulty,
    icon: roadmap.icon,
    tags: roadmap.tags,
    totalPhases: roadmap.phases.length,
    totalSteps: roadmap.phases.reduce((acc, p) => acc + p.steps.length, 0),
    createdAt: roadmap.createdAt,
    updatedAt: roadmap.updatedAt,
  };
}

/**
 * Difficulty label mapping
 */
export const DIFFICULTY_LABELS: Record<RoadmapDifficulty, Record<RoadmapLanguage, string>> = {
  beginner: { en: "Beginner", bn: "শুরুবোক্তা" },
  intermediate: { en: "Intermediate", bn: "মধ্যবর্তী" },
  advanced: { en: "Advanced", bn: "উন্নত" },
  expert: { en: "Expert", bn: "বিশেষজ্ঞ" },
};

/**
 * Sample roadmaps data - in production this could come from a CMS or database
 */
export const ROADMAPS: Roadmap[] = [
  {
    slug: "linux-roadmap",
    title: {
      en: "Linux Mastery",
      bn: "লিনাক্স মাস্টারি",
    },
    description: {
      en: "From file system fundamentals to containerization - the complete path to Linux mastery",
      bn: "ফাইল সিস্টেমের মৌলিক বিষয় থেকে শুরু করে কন্টেইনারাইজেশন পর্যন্ত - লিনাক্স দক্ষতা অর্জনের সম্পূর্ণ পথ",
    },
    estimatedHours: 200,
    difficulty: "intermediate",
    icon: "terminal",
    tags: ["linux", "devops", "system-admin", "docker", "shell"],
    phases: [
      {
        slug: "foundation",
        title: "Foundation & Navigation",
        duration: "1-2 weeks",
        description: "File system basics, terminal navigation, package management",
        steps: [
          {
            slug: "file-system",
            title: "File System Navigation",
            description: "Understand how Linux organizes files and directories",
            resources: [
              "https://linuxhint.com/linux-file-system/",
              "https://www.gnu.org/software/coreutils/manual/html_node/index.html",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "permissions",
            title: "File Permissions & Ownership",
            description: "Read/write/execute permissions, chmod, chown, chgrp",
            resources: [
              "https://www.linux.com/training/tutorials/understanding-linux-file-permissions/",
              "https://www.geeksforgeeks.org/chmod-command-in-linux/",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "package-management",
            title: "Package Management",
            description: "Install, remove, and manage software packages",
            resources: [
              "https://www.linux.com/training/tutorials/package-management-basics/",
              "https://wiki.archlinux.org/index.php/Pacman/Packaging_Guidelines",
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "shell",
        title: "Shell Programming & Automation",
        duration: "2-3 weeks",
        description: "Bash scripting, automation, development workflow",
        steps: [
          {
            slug: "bash-basics",
            title: "Bash Basics",
            description: "Variables, loops, conditionals, and basic shell scripting",
            resources: [
              "https://ryanstutorials.net/linuxtutorial/bash.php",
              "https://www.shellscript.sh/",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "automation",
            title: "Automation & Cron Jobs",
            description: "Automate repetitive tasks with cron and scripts",
            resources: [
              "https://www.digitalocean.com/community/tutorials/how-to-use-cron-to-automate-tasks-ubuntu-1804",
              "https://crontab.guru/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "system-admin",
        title: "System Administration",
        duration: "3-4 weeks",
        description: "Systemd services, firewall, user management, backups",
        steps: [
          {
            slug: "systemd-services",
            title: "Systemd Services",
            description: "Create, manage, and debug systemd services",
            resources: [
              "https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files",
              "https://www.freedesktop.org/software/systemd/man/systemd.service.html",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "user-management",
            title: "User Management",
            description: "Users, groups, sudo, and access control",
            resources: [
              "https://www.linux.com/training/tutorials/user-and-group-management-linux/",
              "https://www.sudo.ws/docs/man/1.8.31/sudoers.man/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "security",
        title: "Security & Hardening",
        duration: "2-3 weeks",
        description: "SSH, sudo permissions, firewalls, secure configuration",
        steps: [
          {
            slug: "ssh-configuration",
            title: "SSH Configuration",
            description: "Secure remote access with SSH keys and configuration",
            resources: [
              "https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server",
              "https://www.ssh.com/ssh/config",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "firewall",
            title: "Firewall & Network Security",
            description: "UFW, iptables, and network security fundamentals",
            resources: [
              "https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands",
              "https://www.kernel.org/doc/html/latest/networking/iptables.html",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "containerization",
        title: "Containerization",
        duration: "2-3 weeks",
        description: "Docker fundamentals, container lifecycle, orchestration",
        steps: [
          {
            slug: "docker-basics",
            title: "Docker Basics",
            description: "Containers, images, and Docker fundamentals",
            resources: [
              "https://docs.docker.com/get-started/",
              "https://www.docker.com/what-is-docker/",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "docker-compose",
            title: "Docker Compose",
            description: "Multi-container applications with Docker Compose",
            resources: [
              "https://docs.docker.com/compose/",
              "https://github.com/compose-spec/compose-spec",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
    ],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    slug: "react-nextjs-roadmap",
    title: {
      en: "React & Next.js Craft",
      bn: "রিএক্ট ও নেক্সট জেএস শিল্প",
    },
    description: {
      en: "Build fast, accessible interfaces without accidental re-renders - from fundamentals to production patterns",
      bn: "দ্রুত, অ্যাক্সেসিবল ইন্টারফেস তৈরি করুন অনিচ্ছাকৃত রি-রেন্ডারের ছাড়া - মৌলিক থেকে প্রোডাকশন প্যাটার্ন পর্যন্ত",
    },
    estimatedHours: 150,
    difficulty: "intermediate",
    icon: "code",
    tags: ["react", "nextjs", "frontend", "typescript", "performance"],
    phases: [
      {
        slug: "fundamentals",
        title: "React Fundamentals",
        duration: "2-3 weeks",
        description: "Rendering model, state, effects, and component composition",
        steps: [
          {
            slug: "rendering-model",
            title: "Rendering Model & Reconciliation",
            description: "How React renders, virtual DOM, and fiber architecture",
            resources: [
              "https://react.dev/learn/rendering-lists",
              "https://github.com/acdlite/react-fiber-architecture",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "state-management",
            title: "State: Local, Lifted, Derived",
            description: "useState, useReducer, and when to lift state",
            resources: [
              "https://react.dev/learn/state-a-components-memory",
              "https://kentcdodds.com/blog/how-to-optimize-context-with-usememo-and-usecallback",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "effects",
            title: "Effects: When Not to Use useEffect",
            description: "Synchronization, data fetching, and effect alternatives",
            resources: [
              "https://react.dev/learn/synchronizing-with-effects",
              "https://www.robinwieruch.de/react-useeffect-explanation/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "performance",
        title: "Performance & Optimization",
        duration: "2-3 weeks",
        description: "Memoization, profiling, and Core Web Vitals",
        steps: [
          {
            slug: "memoization",
            title: "Memoization & Render Profiling",
            description: "React.memo, useMemo, useCallback, and React DevTools Profiler",
            resources: [
              "https://react.dev/learn/optimizing-performance",
              "https://kentcdodds.com/blog/usememo-and-usecallback",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "core-web-vitals",
            title: "Core Web Vitals Budget",
            description: "LCP, FID, CLS optimization for React apps",
            resources: [
              "https://web.dev/vitals/",
              "https://calibreapp.com/blog/core-web-vitals",
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "nextjs",
        title: "Next.js App Router",
        duration: "3-4 weeks",
        description: "Server components, streaming, data fetching, and caching",
        steps: [
          {
            slug: "server-components",
            title: "Server vs Client Components",
            description: "When to use each, boundaries, and composition patterns",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
              "https://nextjs.org/docs/app/building-your-application/rendering/client-components",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "data-fetching",
            title: "Data Fetching, Caching & Streaming",
            description: "fetch, unstable_cache, Suspense, and streaming responses",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/data-fetching",
              "https://nextjs.org/docs/app/building-your-application/rendering/streaming",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "routing",
            title: "Routing, Layouts & Loading States",
            description: "File-system routing, parallel routes, intercepting routes",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/routing",
              "https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "production",
        title: "Production Patterns",
        duration: "2-3 weeks",
        description: "Auth, internationalization, testing, and deployment",
        steps: [
          {
            slug: "accessibility",
            title: "Accessibility & Keyboard Flows",
            description: "ARIA, semantic HTML, focus management, and testing",
            resources: [
              "https://www.w3.org/WAI/ARIA/apg/",
              "https://testing-library.com/docs/react-testing-library/intro/",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "deployment",
            title: "Ship a Feature End-to-End",
            description: "CI/CD, preview deployments, and monitoring",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/deploying",
              "https://vercel.com/docs/concepts/deployments/overview",
            ],
            estimatedMinutes: 120,
          },
        ],
      },
    ],
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    slug: "system-design-roadmap",
    title: {
      en: "System Design & Scale",
      bn: "সিস্টেম ডিজাইন ও স্কেল",
    },
    description: {
      en: "Design production systems end-to-end and defend the trade-offs - from requirements to observability",
      bn: "প্রোডাকশন সিস্টেম এন্ড-টু-এন্ড ডিজাইন করুন এবং ট্রেড-অফস রক্ষা করুন - প্রয়োজনীয়তা থেকে পর্যবেক্ষণযোগ্যতা পর্যন্ত",
    },
    estimatedHours: 180,
    difficulty: "advanced",
    icon: "database",
    tags: ["system-design", "architecture", "scalability", "distributed-systems", "databases"],
    phases: [
      {
        slug: "requirements",
        title: "Requirements & Capacity Planning",
        duration: "1-2 weeks",
        description: "Functional/non-functional requirements, SLOs, capacity math",
        steps: [
          {
            slug: "requirements-slos",
            title: "Requirements, SLOs & Capacity Math",
            description: "Gather requirements, define SLOs, calculate capacity",
            resources: [
              "https://sre.google/sre-book/service-level-objectives/",
              "https://github.com/donnemartin/system-design-primer",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "data-layer",
        title: "Data Layer Design",
        duration: "3-4 weeks",
        description: "SQL vs NoSQL, indexing, sharding, replication, consistency",
        steps: [
          {
            slug: "sql-nosql",
            title: "SQL vs NoSQL: Access-Pattern Driven Choice",
            description: "Choose the right database for your access patterns",
            resources: [
              "https://www.cockroachlabs.com/blog/sql-vs-nosql/",
              "https://aws.amazon.com/nosql/",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "indexing",
            title: "Indexing, Sharding & Partitioning",
            description: "B-tree, composite, partial indexes; horizontal scaling strategies",
            resources: [
              "https://use-the-index-luke.com/",
              "https://www.citusdata.com/blog/2016/10/12/sharding-postgres/",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "replication",
            title: "Replication & Consistency Models",
            description: "Leader-follower, multi-leader, consensus (Raft/Paxos)",
            resources: [
              "https://martin.kleppmann.com/2015/05/11/replication.html",
              "https://raft.github.io/",
            ],
            estimatedMinutes: 120,
          },
        ],
      },
      {
        slug: "messaging",
        title: "Messaging & Resilience",
        duration: "2-3 weeks",
        description: "Queues, backpressure, idempotency, rate limiting, circuit breakers",
        steps: [
          {
            slug: "queues",
            title: "Queues, Backpressure & Idempotency",
            description: "Message queues, consumer patterns, exactly-once semantics",
            resources: [
              "https://www.rabbitmq.com/tutorials.html",
              "https://kafka.apache.org/documentation/",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "resilience",
            title: "Rate Limiting & Circuit Breakers",
            description: "Token bucket, leaky bucket, Hystrix/Resilience4j patterns",
            resources: [
              "https://martinfowler.com/bliki/CircuitBreaker.html",
              "https://github.com/resilience4j/resilience4j",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "observability",
        title: "Observability",
        duration: "2-3 weeks",
        description: "Logs, metrics, traces, and debugging production systems",
        steps: [
          {
            slug: "observability",
            title: "Observability: Logs, Metrics, Traces",
            description: "Structured logging, Prometheus, OpenTelemetry, distributed tracing",
            resources: [
              "https://opentelemetry.io/docs/",
              "https://prometheus.io/docs/introduction/overview/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "case-studies",
        title: "Case Studies & Mock Interviews",
        duration: "2-3 weeks",
        description: "Design real systems: feed, chat, payments, URL shortener",
        steps: [
          {
            slug: "case-study",
            title: "Case Study: Feed / Chat / Payments",
            description: "End-to-end design of complex systems",
            resources: [
              "https://github.com/donnemartin/system-design-primer",
              "https://www.hellointerview.com/learn/system-design",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "mock-interview",
            title: "Mock Design Interview + Written Review",
            description: "Practice with feedback loop",
            resources: [
              "https://www.systemdesigninterview.com/",
              "https://bytebytego.com/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
    ],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    slug: "dsa-roadmap",
    title: {
      en: "Data Structures & Algorithms",
      bn: "ডেটা স্ট্রাকচার ও অ্যালগরিদম",
    },
    description: {
      en: "Solve medium-level problems fluently and pass a technical interview loop",
      bn: "মিডিয়াম-লেভেল সমস্যা সমাধান করুন সহজে এবং টেকনিক্যাল ইন্টারভিউ লুপ পার করুন",
    },
    estimatedHours: 200,
    difficulty: "intermediate",
    icon: "git-branch",
    tags: ["dsa", "algorithms", "interview-prep", "leetcode", "neetcode"],
    phases: [
      {
        slug: "arrays-strings",
        title: "Arrays, Strings & Two Pointers",
        duration: "1-2 weeks",
        description: "Array manipulation, sliding window, two-pointer techniques",
        steps: [
          {
            slug: "arrays-strings",
            title: "Arrays, Strings & Two Pointers",
            description: "Array manipulation, sliding window, two-pointer techniques",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/two-pointers/",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "hashing",
            title: "Hashing & Frequency Maps",
            description: "Hash maps, sets, frequency counting",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/hash-table/",
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "sliding-window",
            title: "Sliding Window Patterns",
            description: "Fixed/variable window, character counts, subarray sums",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/sliding-window/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "stacks-queues",
        title: "Stacks, Queues & Monotonic Stack",
        duration: "1-2 weeks",
        description: "Stack/queue fundamentals, monotonic stack, next greater element",
        steps: [
          {
            slug: "stack-basics",
            title: "Stack & Monotonic Stack",
            description: "LIFO operations, monotonic patterns, histogram problems",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/stack/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "trees-graphs",
        title: "Trees & Graphs",
        duration: "3-4 weeks",
        description: "BFS/DFS, topological sort, union-find, shortest paths",
        steps: [
          {
            slug: "tree-traversals",
            title: "Trees: Traversals, BFS/DFS",
            description: "Pre/in/post-order, level-order, recursive & iterative",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/breadth-first-search/",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "graph-algorithms",
            title: "Graphs: BFS/DFS + Topological Sort",
            description: "Adjacency list/matrix, cycle detection, topological ordering",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/depth-first-search/",
            ],
            estimatedMinutes: 150,
          },
        ],
      },
      {
        slug: "dynamic-programming",
        title: "Dynamic Programming",
        duration: "3-4 weeks",
        description: "1D/2D DP, subsequences, grid problems, optimization",
        steps: [
          {
            slug: "dp-1d",
            title: "DP I: 1D States & Transitions",
            description: "Fibonacci, climbing stairs, house robber, coin change",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/dynamic-programming/",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "dp-2d",
            title: "DP II: 2D Grids & Subsequences",
            description: "LCS, edit distance, matrix path, knapsack variants",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/dynamic-programming/",
            ],
            estimatedMinutes: 150,
          },
        ],
      },
      {
        slug: "interview-prep",
        title: "Interview Preparation",
        duration: "2-3 weeks",
        description: "Mock interviews, timed sets, system design basics",
        steps: [
          {
            slug: "mock-interview",
            title: "Timed Mock Interview Set",
            description: "Full interview simulation with time constraints",
            resources: [
              "https://neetcode.io/roadmap",
              "https://www.techinterviewhandbook.org/",
            ],
            estimatedMinutes: 120,
          },
        ],
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
];

/**
 * Get all roadmaps as summaries
 */
export function getAllRoadmaps(): RoadmapSummary[] {
  return ROADMAPS.map(toRoadmapSummary);
}

/**
 * Get a roadmap by slug
 */
export function getRoadmapBySlug(slug: string): Roadmap | undefined {
  return ROADMAPS.find((r) => r.slug === slug);
}

/**
 * Get roadmap summary by slug
 */
export function getRoadmapSummaryBySlug(slug: string): RoadmapSummary | undefined {
  const roadmap = getRoadmapBySlug(slug);
  return roadmap ? toRoadmapSummary(roadmap) : undefined;
}

/**
 * Get phases for a roadmap
 */
export function getRoadmapPhases(slug: string): RoadmapPhase[] {
  const roadmap = getRoadmapBySlug(slug);
  return roadmap?.phases ?? [];
}

/**
 * Get a specific phase
 */
export function getPhaseBySlug(roadmapSlug: string, phaseSlug: string): RoadmapPhase | undefined {
  const roadmap = getRoadmapBySlug(roadmapSlug);
  return roadmap?.phases.find((p) => p.slug === phaseSlug);
}

/**
 * Get a specific step
 */
export function getStepBySlug(
  roadmapSlug: string,
  phaseSlug: string,
  stepSlug: string
): RoadmapStep | undefined {
  const phase = getPhaseBySlug(roadmapSlug, phaseSlug);
  return phase?.steps.find((s) => s.slug === stepSlug);
}

/**
 * Convert roadmap to Learning Track template format
 */
export function roadmapToLearnTemplate(roadmap: Roadmap): {
  key: string;
  label: string;
  title: string;
  domain: string;
  level: "beginner" | "intermediate" | "advanced";
  color: string;
  goal: string;
  weeklyGoalMinutes: number;
  modules: { title: string; estimateMinutes: number; resourceUrl?: string }[];
} {
  const modules = roadmap.phases.flatMap((phase) =>
    phase.steps.map((step) => ({
      title: `${phase.title}: ${step.title}`,
      estimateMinutes: step.estimatedMinutes ?? 60,
      resourceUrl: step.resources[0],
    }))
  );

  const difficultyMap: Record<string, "beginner" | "intermediate" | "advanced"> = {
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
    expert: "advanced",
  };

  const colorMap: Record<string, string> = {
    "linux-roadmap": "#22c55e",
    "react-nextjs-roadmap": "#06b6d4",
    "system-design-roadmap": "#a855f7",
    "dsa-roadmap": "#f59e0b",
  };

  return {
    key: roadmap.slug,
    label: roadmap.slug.replace(/-/g, " ").toUpperCase(),
    title: roadmap.title.en,
    domain: roadmap.tags[0]?.toUpperCase() || "GENERAL",
    level: difficultyMap[roadmap.difficulty] || "intermediate",
    color: colorMap[roadmap.slug] || "#f59e0b",
    goal: roadmap.description.en,
    weeklyGoalMinutes: 300,
    modules,
  };
}