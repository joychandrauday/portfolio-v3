/**
 * Read-only snapshot of published posts, committed to the repo so the public blog
 * still renders when no writable database is configured (serverless deployments).
 * The ops console always reads live rows from the database first; this is the fallback.
 */

export type StaticPost = {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  contentEn: string;
  contentBn: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt: string | null;
};

export const staticPosts: StaticPost[] = [
  {
    "id": "post-1",
    "slug": "building-scalable-web-systems-nextjs-nodejs",
    "titleEn": "Architecting High-Throughput Web Applications with Next.js and Node.js",
    "titleBn": "Next.js এবং Node.js দিয়ে হাই-থ্রুপুট ওয়েব অ্যাপ্লিকেশন আর্কিটেকচার",
    "excerptEn": "A deep dive into caching strategies, concurrency control, and clean architecture patterns when designing scalable web systems.",
    "excerptBn": "স্কেলেবল ওয়েব সিস্টেম ডিজাইন করার সময় ক্যাশিং স্ট্র্যাটেজি, কনকারেন্সি কন্ট্রোল এবং ক্লিন আর্কিটেকচারের প্রয়োজনীয় গাইড।",
    "contentEn": "When building applications destined to handle tens of thousands of concurrent users, standard boilerplate MVC architectures begin to show severe bottlenecks.\n\n### 1. Database Connection Pooling & Edge Boundaries\nIn serverless environments like Next.js App Router or Vercel, opening unmanaged database connections on every incoming request quickly exhausts connection pools. Utilizing lightweight connection proxies like LibSQL/Turso or connection pools like PgBouncer ensures zero idle overhead.\n\n### 2. Strategic Layering: Cache First, Compute Second\nEvery expensive computation or database lookup must evaluate its cache invalidation lifecycle:\n- Stale-While-Revalidate (SWR) headers\n- Tag-based revalidation in Next.js Server Components\n- Atomic Redis writes for volatile session metadata\n\n### 3. Asynchronous Task Delegation\nOffloading heavy I/O operations (PDF generation, bulk notification emails, AI inference) to background job queues ensures that API response latencies remain strictly below 100ms.",
    "contentBn": "যখন হাজার হাজার সক্রিয় ব্যবহারকারীর জন্য ওয়েব প্ল্যাটফর্ম তৈরি করা হয়, তখন সাধারণ আর্কিটেকচারে পারফরম্যান্সের ঘাটতি দেখা দেয়।\n\n### ১. ডেটাবেস কানেকশন পুলিং\nNext.js অ্যাপ রাউটার বা সার্ভারলেস প্ল্যাটফর্মে প্রতি রিকোয়েস্টে নতুন ডেটাবেস কানেকশন খোলা হলে কানেকশন লিমিট শেষ হয়ে যেতে পারে। LibSQL কিংবা কানেকশন পুল প্রক্সি ব্যবহার করে এই সমস্যা দূর করা যায়।\n\n### ২. ক্যাশিং স্ট্র্যাটেজি\nযেসব ডেটা ঘন ঘন পরিবর্তিত হয় না, সেগুলোর জন্য মেমরি ক্যাশ এবং Next.js এর ট্যাগ-ভিত্তিক রিভ্যালিডেশন ব্যবহার করা উচিত।\n\n### ৩. ব্যাকগ্রাউন্ড প্রসেসিং\nভারী কাজ (যেমন ইমেইল পাঠানো, পিডিএফ জেনারেশন বা এআই প্রম্পটিং) সরাসরি মূল রিকোয়েস্টে না রেখে অ্যাসিনক্রোনাস ব্যাকগ্রাউন্ড কিউতে হস্তান্তর করা উচিত।",
    "tags": [
      "Architecture",
      "Next.js",
      "Node.js",
      "Performance"
    ],
    "readingTimeMinutes": 5,
    "publishedAt": "2026-10-26T06:04:05.455Z"
  },
  {
    "id": "post-2",
    "slug": "mastering-rest-and-realtime-sockets",
    "titleEn": "From REST to Real-Time: Implementing Robust Event Streaming with WebSockets",
    "titleBn": "REST থেকে রিয়েল-টাইম: ওয়েবসকেটের মাধ্যমে ইভেন্ট স্ট্রিমিং বাস্তবায়ন",
    "excerptEn": "Understanding when polling falls short and how bi-directional WebSocket pipelines transform telemetry and collaborative applications.",
    "excerptBn": "কখন পোলিং যথেষ্ট নয় এবং কীভাবে দ্বিমুখী ওয়েবসকেট পাইপলাইন ডেটা স্ট্রিমিং ও লাইভ মনিটরিংকে বদলে দেয়।",
    "contentEn": "Polling intervals waste network bandwidth and introduce latency spikes that degrade user trust. For platforms like health monitors, financial tickers, and live chat, WebSockets provide uninterrupted bidirectional duplex channels.\n\n### Handling Disconnections Gracefully\nA production-ready socket architecture must include:\n- Heartbeat / ping-pong pingers\n- Exponential backoff reconnection routines on the client\n- Idempotency tokens on transmitted messages to prevent duplicate state mutations",
    "contentBn": "নিয়মিত ব্যবধানে সার্ভার পোল করা ব্যান্ডউইথ নষ্ট করে এবং সিস্টেমে ল্যাটেন্সি বাড়ায়। লাইভ হেলথ ট্র্যাকার কিংবা আর্থিক লেনদেনের ক্ষেত্রে ওয়েবসকেট তাৎক্ষণিক দ্বিমুখী যোগাযোগ নিশ্চিত করে।\n\n### সংযোগ বিচ্ছিন্নতা সামলানো\nপ্রোডাকশন-গ্রেড সকেট সিস্টেমে অবশ্যই হার্টবিট চেক, ক্লায়েন্টে এক্সপোনেনশিয়াল ব্যাকঅফ এবং ডুপ্লিকেট মেসেজ রোধ করার জন্য আইডেমপোটেন্সি টোকেন থাকা আবশ্যক।",
    "tags": [
      "WebSockets",
      "Node.js",
      "Real-Time",
      "Backend"
    ],
    "readingTimeMinutes": 4,
    "publishedAt": "2026-10-26T06:04:05.455Z"
  }
];

export function getStaticPost(slug: string): StaticPost | undefined {
  return staticPosts.find((post) => post.slug === slug);
}

/** Renders stored timestamps as "Oct 2026" while passing through human-written labels. */
export function formatPostMonth(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
