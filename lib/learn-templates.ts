/**
 * Curated starting points for the Learning Flow.
 *
 * Each template is a pre-ordered module list with realistic time estimates,
 * so a new track is useful the moment it is created instead of being an
 * empty shell. Everything is editable afterwards.
 */

export type LearnTemplateModule = {
  title: string;
  estimateMinutes: number;
  resourceUrl?: string;
};

export type LearnTemplate = {
  key: string;
  /** Short name used on the template chips. */
  label: string;
  title: string;
  domain: string;
  level: "beginner" | "intermediate" | "advanced";
  color: string;
  goal: string;
  weeklyGoalMinutes: number;
  modules: LearnTemplateModule[];
};

export const LEARN_DOMAINS = [
  "DSA",
  "Backend",
  "Frontend",
  "DevOps",
  "Databases",
  "Systems",
  "AI & ML",
  "Language",
  "Career",
  "General",
] as const;

export const TRACK_COLORS = [
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ef4444",
  "#06b6d4",
  "#eab308",
  "#ec4899",
] as const;

export const TRACK_STATUSES = ["planned", "active", "paused", "done"] as const;
export const MODULE_STATUSES = ["todo", "doing", "done"] as const;

export const LEARN_TEMPLATES: LearnTemplate[] = [
  {
    key: "dsa",
    label: "DSA",
    title: "Data Structures & Algorithms",
    domain: "DSA",
    level: "intermediate",
    color: "#f59e0b",
    goal: "Solve medium-level problems fluently and pass a technical interview loop.",
    weeklyGoalMinutes: 420,
    modules: [
      { title: "Arrays, strings & two pointers", estimateMinutes: 90, resourceUrl: "https://neetcode.io/roadmap" },
      { title: "Hashing & frequency maps", estimateMinutes: 60 },
      { title: "Sliding window patterns", estimateMinutes: 90 },
      { title: "Stack & monotonic stack", estimateMinutes: 90 },
      { title: "Binary search & boundary conditions", estimateMinutes: 90 },
      { title: "Linked lists & in-place rewiring", estimateMinutes: 75 },
      { title: "Recursion & backtracking", estimateMinutes: 120 },
      { title: "Trees: traversals, BFS/DFS", estimateMinutes: 120 },
      { title: "BST, heaps & priority queues", estimateMinutes: 90 },
      { title: "Graphs: BFS/DFS + topological sort", estimateMinutes: 150 },
      { title: "Union-Find (disjoint sets)", estimateMinutes: 60 },
      { title: "DP I: 1D states & transitions", estimateMinutes: 120 },
      { title: "DP II: 2D grids & subsequences", estimateMinutes: 150 },
      { title: "Greedy & interval scheduling", estimateMinutes: 90 },
      { title: "Timed mock interview set", estimateMinutes: 120 },
    ],
  },
  {
    key: "docker",
    label: "Docker",
    title: "Docker & Containers",
    domain: "DevOps",
    level: "beginner",
    color: "#3b82f6",
    goal: "Ship any service as a small, reproducible container and run it with compose.",
    weeklyGoalMinutes: 240,
    modules: [
      { title: "Containers vs VMs: images & layers", estimateMinutes: 30, resourceUrl: "https://docs.docker.com/get-started/" },
      { title: "Install & run your first container", estimateMinutes: 45 },
      { title: "Dockerfile anatomy & build cache", estimateMinutes: 60 },
      { title: "Volumes & bind mounts", estimateMinutes: 45 },
      { title: "Networking, ports & service names", estimateMinutes: 60 },
      { title: "docker compose: multi-service stacks", estimateMinutes: 75 },
      { title: "Env vars & secret hygiene", estimateMinutes: 30 },
      { title: "Multi-stage builds & image size diet", estimateMinutes: 60 },
      { title: "Debugging: logs, exec, inspect", estimateMinutes: 45 },
      { title: "Push to a registry + CI pipeline", estimateMinutes: 60 },
    ],
  },
  {
    key: "system-design",
    label: "System Design",
    title: "System Design & Scale",
    domain: "Systems",
    level: "advanced",
    color: "#a855f7",
    goal: "Design a production system end-to-end and defend the trade-offs.",
    weeklyGoalMinutes: 300,
    modules: [
      { title: "Requirements, SLOs & capacity math", estimateMinutes: 60 },
      { title: "Load balancing & reverse proxies", estimateMinutes: 60 },
      { title: "Caching layers & invalidation", estimateMinutes: 75 },
      { title: "SQL vs NoSQL: access-pattern driven choice", estimateMinutes: 75 },
      { title: "Indexing, sharding & partitioning", estimateMinutes: 90 },
      { title: "Replication & consistency models", estimateMinutes: 90 },
      { title: "Queues, backpressure & idempotency", estimateMinutes: 75 },
      { title: "Rate limiting & circuit breakers", estimateMinutes: 60 },
      { title: "Observability: logs, metrics, traces", estimateMinutes: 60 },
      { title: "Case study: feed / chat / payments", estimateMinutes: 120 },
      { title: "Design a URL shortener on the whiteboard", estimateMinutes: 90 },
      { title: "Mock design interview + written review", estimateMinutes: 90 },
    ],
  },
  {
    key: "postgres",
    label: "SQL",
    title: "SQL & PostgreSQL Performance",
    domain: "Databases",
    level: "intermediate",
    color: "#22c55e",
    goal: "Read an EXPLAIN plan and fix slow queries without guessing.",
    weeklyGoalMinutes: 240,
    modules: [
      { title: "Relational model & normal forms", estimateMinutes: 45 },
      { title: "Joins, subqueries & CTEs", estimateMinutes: 75 },
      { title: "Window functions", estimateMinutes: 60 },
      { title: "Indexes: B-tree, composite, partial", estimateMinutes: 90 },
      { title: "EXPLAIN ANALYZE: reading the plan", estimateMinutes: 90 },
      { title: "Transactions, isolation levels & locking", estimateMinutes: 75 },
      { title: "N+1 queries & ORM pitfalls", estimateMinutes: 60 },
      { title: "Vacuum, bloat & autovacuum tuning", estimateMinutes: 60 },
      { title: "Partitioning large tables", estimateMinutes: 75 },
      { title: "Backups, PITR & migration safety", estimateMinutes: 75 },
    ],
  },
  {
    key: "typescript",
    label: "TypeScript",
    title: "TypeScript Deep Dive",
    domain: "Language",
    level: "intermediate",
    color: "#06b6d4",
    goal: "Model real domains in types and stop fighting the compiler.",
    weeklyGoalMinutes: 180,
    modules: [
      { title: "Structural typing & inference rules", estimateMinutes: 45 },
      { title: "Unions, narrowing & discriminated unions", estimateMinutes: 60 },
      { title: "Generics & constraints", estimateMinutes: 60 },
      { title: "Utility & mapped types", estimateMinutes: 60 },
      { title: "Conditional types + infer", estimateMinutes: 75 },
      { title: "Template literal types", estimateMinutes: 45 },
      { title: "Declaration files & module augmentation", estimateMinutes: 60 },
      { title: "Runtime validation at the boundary (zod)", estimateMinutes: 60 },
      { title: "Migrating a JS codebase safely", estimateMinutes: 90 },
    ],
  },
  {
    key: "networking",
    label: "Networking",
    title: "Networking Fundamentals",
    domain: "Systems",
    level: "beginner",
    color: "#ec4899",
    goal: "Explain what happens between typing a URL and seeing the page.",
    weeklyGoalMinutes: 180,
    modules: [
      { title: "OSI & TCP/IP models in practice", estimateMinutes: 45 },
      { title: "DNS resolution & records", estimateMinutes: 45 },
      { title: "TCP handshake, flow & congestion control", estimateMinutes: 75 },
      { title: "TLS 1.3 handshake & certificates", estimateMinutes: 60 },
      { title: "HTTP/1.1 vs HTTP/2 vs HTTP/3", estimateMinutes: 60 },
      { title: "Load balancers, proxies & CDNs", estimateMinutes: 60 },
      { title: "Timeouts, retries & connection pools", estimateMinutes: 45 },
      { title: "Packet-level debugging with tcpdump", estimateMinutes: 75 },
      { title: "WebSockets, SSE & long polling", estimateMinutes: 60 },
    ],
  },
  {
    key: "os",
    label: "Operating Systems",
    title: "Operating Systems & Linux Internals",
    domain: "Systems",
    level: "advanced",
    color: "#ef4444",
    goal: "Reason about processes, memory and I/O like the kernel does.",
    weeklyGoalMinutes: 240,
    modules: [
      { title: "Processes, threads & scheduling", estimateMinutes: 75 },
      { title: "Virtual memory & page tables", estimateMinutes: 75 },
      { title: "File systems & inodes", estimateMinutes: 60 },
      { title: "Syscalls & the user/kernel boundary", estimateMinutes: 60 },
      { title: "I/O models: blocking, epoll, io_uring", estimateMinutes: 90 },
      { title: "Concurrency primitives & futexes", estimateMinutes: 75 },
      { title: "cgroups & namespaces (containers from scratch)", estimateMinutes: 90 },
      { title: "Signals, zombies & process lifecycle", estimateMinutes: 45 },
      { title: "Performance tooling: top, perf, strace", estimateMinutes: 60 },
    ],
  },
  {
    key: "kubernetes",
    label: "Kubernetes",
    title: "Kubernetes Operations",
    domain: "DevOps",
    level: "advanced",
    color: "#f59e0b",
    goal: "Deploy, debug and scale a real workload on a cluster.",
    weeklyGoalMinutes: 240,
    modules: [
      { title: "Architecture: control plane & kubelet", estimateMinutes: 60, resourceUrl: "https://kubernetes.io/docs/concepts/" },
      { title: "Pods, ReplicaSets & Deployments", estimateMinutes: 60 },
      { title: "Services, Ingress & DNS", estimateMinutes: 75 },
      { title: "ConfigMaps, Secrets & env injection", estimateMinutes: 45 },
      { title: "Resource requests, limits & QoS", estimateMinutes: 60 },
      { title: "Probes, rollouts & rollbacks", estimateMinutes: 60 },
      { title: "Persistent volumes & stateful sets", estimateMinutes: 75 },
      { title: "Debugging: describe, logs, exec, events", estimateMinutes: 75 },
    ],
  },
  {
    key: "react",
    label: "React/Next",
    title: "React & Next.js Craft",
    domain: "Frontend",
    level: "intermediate",
    color: "#22c55e",
    goal: "Build fast, accessible interfaces without accidental re-renders.",
    weeklyGoalMinutes: 240,
    modules: [
      { title: "Rendering model & reconciliation", estimateMinutes: 60 },
      { title: "State: local, lifted, derived", estimateMinutes: 60 },
      { title: "Effects: when not to use useEffect", estimateMinutes: 60 },
      { title: "Memoization & render profiling", estimateMinutes: 75 },
      { title: "Server vs client components", estimateMinutes: 75 },
      { title: "Data fetching, caching & streaming", estimateMinutes: 75 },
      { title: "Routing, layouts & loading states", estimateMinutes: 60 },
      { title: "Accessibility & keyboard flows", estimateMinutes: 60 },
      { title: "Core Web Vitals budget", estimateMinutes: 45 },
      { title: "Ship a feature end-to-end", estimateMinutes: 120 },
    ],
  },
  {
    key: "llm",
    label: "AI/LLM",
    title: "LLM Application Engineering",
    domain: "AI & ML",
    level: "intermediate",
    color: "#a855f7",
    goal: "Build a reliable RAG feature with evals instead of vibes.",
    weeklyGoalMinutes: 240,
    modules: [
      { title: "Tokens, context windows & pricing math", estimateMinutes: 45 },
      { title: "Prompt patterns & structured output", estimateMinutes: 60 },
      { title: "Tool / function calling", estimateMinutes: 60 },
      { title: "Embeddings & vector search basics", estimateMinutes: 75 },
      { title: "Chunking & retrieval quality", estimateMinutes: 75 },
      { title: "RAG pipeline end-to-end", estimateMinutes: 120 },
      { title: "Evals: golden sets & regression gates", estimateMinutes: 90 },
      { title: "Latency, caching & cost control", estimateMinutes: 60 },
      { title: "Guardrails, PII & failure modes", estimateMinutes: 60 },
    ],
  },
];

export const LEARN_TEMPLATE_BY_KEY: Record<string, LearnTemplate> = Object.fromEntries(
  LEARN_TEMPLATES.map((t) => [t.key, t])
);
