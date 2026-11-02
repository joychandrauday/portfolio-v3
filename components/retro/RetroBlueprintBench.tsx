"use client";

import React, { useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  ArrowRight,
  Code2,
  Cpu,
  Fingerprint,
  Repeat,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

type Primitive = {
  id: string;
  specNo: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  icon: React.ElementType;
  equation: string;
  invariant: string;
  invariantBn: string;
  idea: string;
  ideaBn: string;
  sharpEdge: string;
  sharpEdgeBn: string;
  breaks: string;
  breaksBn: string;
  costs: string;
  costsBn: string;
  skip: string;
  skipBn: string;
};

export default function RetroBlueprintBench() {
  const { isBn } = useLanguage();
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const primitives: Primitive[] = [
    {
      id: "append-only-ledger",
      specNo: "SPEC. NO. 01",
      title: "Append-Only Ledger",
      titleBn: "অ্যাপেন্ড-অনলি লেজার",
      subtitle: "State as a derived fold, never a mutable number",
      subtitleBn: "স্টেট হলো হিসাবের ফলাফল — পরিবর্তনশীল কোনো সংখ্যা নয়",
      icon: Cpu,
      equation: "onHand = Σ(inward_movements) − Σ(outward_movements)",
      invariant:
        "INVARIANT: Written history is immutable. A balance is only ever a projection over signed movements.",
      invariantBn:
        "মূল বৈশিষ্ট্য: লিখিত ইতিহাস অপরিবর্তনীয়। ব্যালেন্স কেবল স্বাক্ষরিত মুভমেন্টের ওপর হিসাব করা একটি প্রজেকশন।",
      idea:
        "The instinct is UPDATE qty = qty - 1. It works right up until two requests read the same row at the same moment. Record a signed movement instead and derive the total; every number then traces back to the event that caused it, and reconciliation becomes arithmetic rather than detective work.",
      ideaBn:
        "সহজ পথ হলো UPDATE qty = qty - 1। কিন্তু দুটি রিকোয়েস্ট একই রো একসঙ্গে পড়লে সেটি ব্যর্থ হয়। এর বদলে প্রতিটি পরিবর্তনকে স্বাক্ষরিত মুভমেন্ট হিসেবে লিখে রাখলে ব্যালেন্স হয় হিসাবের ফল — প্রতিটি সংখ্যার পেছনে থাকে নির্দিষ্ট ইভেন্ট, আর মিলকরণ হয় সাধারণ যোগ-বিয়োগ।",
      sharpEdge:
        "Derive-on-read stops being free somewhere past a few million rows. The pattern is finished only when you add snapshot rows and a read model on top.",
      sharpEdgeBn:
        "কয়েক মিলিয়ন রো পেরোলে প্রতিবার হিসাব করা খরচ ডেকে আনে। প্যাটার্নটি সম্পূর্ণ হয় কেবল তখনই, যখন স্ন্যাপশট ও রিড-মডেল যোগ করা হয়।",
      breaks:
        "Balance reads degrade into full scans once the movement table grows past the point where a single index still covers it.",
      breaksBn:
        "মুভমেন্ট টেবিল বড় হলে প্রতিটি ব্যালেন্স রিড ধীরে ধীরে ফুল স্ক্যানে পরিণত হয়।",
      costs:
        "One extra write per mutation, plus snapshot maintenance and a periodic reconciliation pass.",
      costsBn:
        "প্রতিটি পরিবর্তনে অতিরিক্ত একটি রাইট, সাথে স্ন্যাপশট রক্ষণাবেক্ষণ ও পর্যায়ক্রমিক মিলকরণ।",
      skip:
        "The domain is single-writer and nobody needs an audit trail. A plain column is still the right answer there.",
      skipBn:
        "যদি ডোমেইনে একজনই লিখে এবং অডিট ট্রেইলের দরকার না থাকে — সেখানে সাধারণ কলামই সঠিক সমাধান।",
    },
    {
      id: "idempotent-effects",
      specNo: "SPEC. NO. 02",
      title: "Idempotent Effects",
      titleBn: "আইডেমপোটেন্ট ইফেক্ট",
      subtitle: "Exactly-once outcomes on top of at-least-once delivery",
      subtitleBn: "অ্যাট-লিস্ট-ওয়ান্স ডেলিভারিতে এক্সাক্টলি-ওয়ান্স আউটকাম",
      icon: Fingerprint,
      equation: "effect(e) = 1 ⟺ (source, event_id) ∉ commit_log",
      invariant:
        "INVARIANT: The deduplication key comes from the event itself, never from the attempt.",
      invariantBn:
        "মূল বৈশিষ্ট্য: ডিডুপ্লিকেশন কী সবসময় ইভেন্ট থেকে আসে, কোনোভাবেই অ্যাটেম্পট থেকে নয়।",
      idea:
        "Webhooks retry, queues redeliver, and people double-click. Assume every message will arrive twice and prove that the second arrival is a no-op. Enforce the tuple with a unique constraint written in the same transaction as the side effect, so the two cannot drift apart.",
      ideaBn:
        "ওয়েবহুক রিট্রাই করে, কিউ আবার ডেলিভার করে, মানুষ দুইবার ক্লিক করে। ধরে নিন প্রতিটি মেসেজ দুবার আসবে — এবং প্রমাণ করুন দ্বিতীয়টি কিছুই করে না। সাইড-ইফেক্টের সাথে একই ট্রানজ্যাকশনে ইউনিক কনস্ট্রেইন্ট বসান, যেন দুটি কখনো আলাদা না হয়।",
      sharpEdge:
        "Derive the key from a payload hash and legitimate retries carrying a fresh timestamp will slip straight through. Use the sender's stable identifier.",
      sharpEdgeBn:
        "পেলোড হ্যাশ থেকে কী বানালে নতুন টাইমস্ট্যাম্পসহ বৈধ রিট্রাইও ঢুকে যাবে। ব্যবহার করুন প্রেরকের স্থিতিশীল আইডেন্টিফায়ার।",
      breaks:
        "Sloppy key derivation. Two genuinely different events collapse into one, and you quietly lose work.",
      breaksBn:
        "দুর্বল কী ডেরিভেশন। দুইটি ভিন্ন ইভেন্ট এক হয়ে যায় এবং কাজ নীরবে হারিয়ে যায়।",
      costs:
        "A unique index per dedupe domain, plus a retention policy — the log cannot grow forever.",
      costsBn:
        "প্রতিটি ডিডুপ্লিকেশন ডোমেইনের জন্য ইউনিক ইনডেক্স, সাথে রিটেনশন পলিসি — লগ অসীম বাড়তে পারে না।",
      skip:
        "The operation is naturally idempotent (absolute PUT, upsert) or nobody cares if analytics counts twice.",
      skipBn:
        "অপারেশনটি স্বাভাবিকভাবেই আইডেমপোটেন্ট হলে, অথবা অ্যানালিটিক্সে দুবার গণনা ক্ষতিকর না হলে।",
    },
    {
      id: "untrusted-boundary",
      specNo: "SPEC. NO. 03",
      title: "Untrusted Boundary",
      titleBn: "আনট্রাস্টেড বাউন্ডারি",
      subtitle: "Treat the document as hostile and the model as unverified",
      subtitleBn: "ডকুমেন্টকে শত্রু ভাবুন, মডেলকে অযাচাইকৃত ধরুন",
      icon: ShieldCheck,
      equation: "payload = sanitize(doc) ▸ schema-constrained model ▸ validate ▸ human(τ)",
      invariant:
        "INVARIANT: Both ends of an extraction pipeline are untrusted. Only field-level scoring against labelled ground truth counts as proof.",
      invariantBn:
        "মূল বৈশিষ্ট্য: এক্সট্রাকশন পাইপলাইনের দুই প্রান্তই অনির্ভরযোগ্য। লেবেলযুক্ত গ্রাউন্ড ট্রুথের সাথে ফিল্ড-লেভেল স্কোরই একমাত্র প্রমাণ।",
      idea:
        "A PDF is user input, and user input can contain instructions. The model is an untrusted dependency that can invent fields that were never in the document. So: strip and delimit inbound text, force output through a typed schema, score every field against a labelled set, and send anything below threshold to a human instead of pretending.",
      ideaBn:
        "পিডিএফ হলো ব্যবহারকারীর ইনপুট, আর ইনপুটে নির্দেশনা লুকানো থাকতে পারে। মডেলও অনির্ভরযোগ্য — ডকুমেন্টে না থাকা ফিল্ডও সে বানিয়ে দিতে পারে। তাই: ইনবাউন্ড টেক্সট স্যানিটাইজ ও ডিলিমিট করুন, আউটপুটকে টাইপড স্কিমায় বাধ্য করুন, প্রতিটি ফিল্ড লেবেলযুক্ত ডেটার সাথে যাচাই করুন, আর থ্রেশহোল্ডের নিচে হলে মানুষকে দিন।",
      sharpEdge:
        "The labelled evaluation set is the actual product. Without it you can only tell whether output looks plausible, which is exactly the failure mode AI demos hide.",
      sharpEdgeBn:
        "আসল পণ্য হলো লেবেলযুক্ত ইভালুয়েশন সেট। এটি ছাড়া বোঝা যায় না আউটপুট সঠিক, নাকি শুধু বিশ্বাসযোগ্য দেখাচ্ছে — এটাই সেই ফাঁদ যা এআই ডেমো লুকিয়ে রাখে।",
      breaks:
        "Skipping sanitisation. One line of injected text in a supplier invoice is enough to redirect the whole extraction.",
      breaksBn:
        "স্যানিটাইজেশন বাদ দিলে। সরবরাহকারীর ইনভয়েসে এক লাইন ইনজেক্টেড টেক্সটই পুরো এক্সট্রাকশন ঘুরিয়ে দিতে যথেষ্ট।",
      costs:
        "Labelled data, schema upkeep, a review queue UI, and the honesty to measure F1 before shipping.",
      costsBn:
        "লেবেলযুক্ত ডেটা, স্কিমা রক্ষণাবেক্ষণ, রিভিউ কিউ ইন্টারফেস এবং শিপিংয়ের আগে এফ১ মাপার সততা।",
      skip:
        "Output is human-facing prose only and no downstream automation acts on it automatically.",
      skipBn:
        "যদি আউটপুট শুধু মানুষের পড়ার টেক্সট হয় এবং কোনো অটোমেশন সরাসরি সেটির ওপর কাজ না করে।",
    },
    {
      id: "failure-as-state",
      specNo: "SPEC. NO. 04",
      title: "Failure As State",
      titleBn: "ব্যর্থতাকে স্টেট হিসেবে ধরা",
      subtitle: "Retries, backoff and dead letters as first-class data",
      subtitleBn: "রিট্রাই, ব্যাকঅফ ও ডেড লেটার — সবই প্রথম শ্রেণীর ডেটা",
      icon: Repeat,
      equation: "attempt(n+1) = delay · 2ⁿ · jitter  |  n > max ⇒ dead_letter",
      invariant:
        "INVARIANT: Step state is committed before the side effect runs, so a crash is a resume point rather than a lost cause.",
      invariantBn:
        "মূল বৈশিষ্ট্য: সাইড-ইফেক্ট চালানোর আগেই স্টেপ স্টেট সেভ হয়, ফলে ক্র্যাশ মানে কাজ হারানো নয় — নতুন করে শুরু করার বিন্দু।",
      idea:
        "Any multi-step job will be interrupted mid-flight eventually. Persist the transition first, then call the outside world. Retry with exponential backoff and jitter, put a circuit breaker in front of saturated dependencies, and park exhausted jobs in a dead-letter store that a human can actually inspect and replay.",
      ideaBn:
        "বহু-ধাপের যেকোনো কাজ একসময় মাঝপথে বাধাগ্রস্ত হবে। তাই আগে ট্রানজিশন সেভ করুন, পরে বাইরের দুনিয়াকে কল করুন। এক্সপোনেনশিয়াল ব্যাকঅফ ও জিটারসহ রিট্রাই করুন, ক্লান্ত নির্ভরতার সামনে সার্কিট ব্রেকার রাখুন, এবং ব্যর্থ কাজ ডেড-লেটার স্টোরে রাখুন যেখান থেকে মানুষ দেখে পুনরায় চালাতে পারে।",
      sharpEdge:
        "Jitter is not decoration. Without it every failed worker retries in lockstep and turns an outage into a thundering herd.",
      sharpEdgeBn:
        "জিটার সাজসজ্জা নয়। এটি ছাড়া সব ব্যর্থ ওয়ার্কার একসাথে রিট্রাই করে এবং সাময়িক সমস্যাকে বড় আকারের দুর্ঘটনায় পরিণত করে।",
      breaks:
        "No dead-letter store. Failures vanish into log files and nobody notices until a customer asks.",
      breaksBn:
        "ডেড-লেটার স্টোর না থাকলে ব্যর্থতা লগ ফাইলে হারিয়ে যায়, আর গ্রাহক জিজ্ঞাসা করার আগ পর্যন্ত কেউ টের পায় না।",
      costs:
        "More state transitions, an operational surface: replay tooling, queue depth dashboards, alerting.",
      costsBn:
        "বেশি স্টেট ট্রানজিশন এবং পরিচালনার বাড়তি কাজ: রিপ্লে টুলিং, কিউ মনিটরিং, অ্যালার্টিং।",
      skip:
        "The call is cheap, idempotent and latency-tolerant. Let it fail loudly and retry on the next request.",
      skipBn:
        "কলটি সস্তা, আইডেমপোটেন্ট ও বিলম্ব সহনশীল হলে — ব্যর্থ হতে দিন এবং পরের রিকোয়েস্টে আবার চেষ্টা হোক।",
    },
  ];

  const current = primitives[activeTab];
  const CurrentIcon = current.icon;

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % primitives.length
        : (index - 1 + primitives.length) % primitives.length;
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="workbench" className="py-12 sm:py-20 border-b border-border/70 scroll-mt-6">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>[ SECTION II // PRIMITIVES BENCH ]</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal">
              {isBn ? "যে আর্কিটেকচারাল নীতিগুলো আমি বারবার ফিরে আসি" : "Architectural Primitives I Keep Returning To"}
            </h3>
          </div>
          <span className="font-mono text-xs text-text-muted">
            {isBn ? "৪টি ফিল্ড নোট · কোনো সাজানো বেঞ্চমার্ক নয়" : "4 Field Notes · No Mock Benchmarks"}
          </span>
        </div>

        {/* Vintage Index Card Tabs */}
        <div
          role="tablist"
          aria-label={isBn ? "আর্কিটেকচারাল প্রিমিটিভ" : "Architectural primitives"}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs"
        >
          {primitives.map((prim, idx) => {
            const Icon = prim.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={prim.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                role="tab"
                id={`primitive-tab-${prim.id}`}
                aria-selected={isActive}
                aria-controls={`primitive-panel-${prim.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(idx)}
                onKeyDown={(e) => onTabKeyDown(e, idx)}
                className={`p-3 rounded-sm border text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-bg-surface border-text-primary text-text-primary shadow-xs"
                    : "bg-bg/40 border-border/70 text-text-muted hover:border-border hover:text-text-primary hover:bg-bg-surface/50"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] pb-1 border-b border-border/40">
                  <span className={isActive ? "text-accent font-semibold" : "opacity-60"}>
                    {prim.specNo}
                  </span>
                  <span>[0{idx + 1}]</span>
                </div>
                <div className="pt-2 flex items-center gap-1.5 truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-accent" : "opacity-50"}`} />
                  <span className="font-serif text-xs sm:text-sm font-semibold truncate">
                    {isBn ? prim.titleBn : prim.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Blueprint Plate Display */}
        <div
          role="tabpanel"
          id={`primitive-panel-${current.id}`}
          aria-labelledby={`primitive-tab-${current.id}`}
          className="p-6 sm:p-8 rounded-sm border border-border bg-bg-surface space-y-6 font-mono text-xs"
        >
          {/* Header of Active Blueprint */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CurrentIcon className="w-4 h-4 text-accent" />
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-text-primary">
                  {isBn ? current.titleBn : current.title}
                </h4>
              </div>
              <p
                className={`text-text-secondary text-xs font-sans ${
                  isBn ? "font-bengali text-sm" : ""
                }`}
              >
                {isBn ? current.subtitleBn : current.subtitle}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border/80 text-text-muted text-[11px] self-start sm:self-auto font-mono font-semibold tracking-wide">
              {isBn ? "প্যাটার্ন · পণ্য নয়" : "PATTERN NOTE · NOT A PRODUCT"}
            </span>
          </div>

          {/* Invariant Box */}
          <div className="p-4 rounded-sm bg-bg border border-border/80 space-y-2">
            <div className="text-[10px] text-text-muted tracking-widest uppercase flex items-center gap-1.5">
              <Code2 className="w-3 h-3 text-accent" />
              <span>// ARCHITECTURAL INVARIANT</span>
            </div>
            <div className="text-xs sm:text-sm text-text-primary font-semibold overflow-x-auto py-1">
              <code>{current.equation}</code>
            </div>
            <div
              className={`text-[11px] text-accent font-sans pt-1 border-t border-border/40 ${
                isBn ? "font-bengali text-xs leading-relaxed" : ""
              }`}
            >
              {isBn ? current.invariantBn : current.invariant}
            </div>
          </div>

          {/* Editorial Technical Summary */}
          <div className="text-sm text-text-secondary leading-relaxed font-serif pt-1 space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted not-italic">
              {isBn ? "মূল ধারণা" : "The Idea"}
            </p>
            <p className={isBn ? "font-bengali text-base leading-relaxed" : ""}>
              {isBn ? current.ideaBn : current.idea}
            </p>
          </div>

          {/* Sharp Edge Callout — the honest caveat */}
          <div className="p-4 rounded-sm bg-bg border border-amber-600/25 flex gap-3">
            <TriangleAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-text-muted">
                {isBn ? "সতর্কতা · যেখানে প্যাটার্নটি ভাঙে" : "Sharp Edge · Where It Breaks"}
              </p>
              <p
                className={`text-[11px] text-text-secondary leading-relaxed font-sans ${
                  isBn ? "font-bengali text-xs" : ""
                }`}
              >
                {isBn ? current.sharpEdgeBn : current.sharpEdge}
              </p>
            </div>
          </div>

          {/* Trade-off Grid */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-border/60">
            {[
              {
                label: isBn ? "কী ভাঙে" : "What Breaks",
                value: isBn ? current.breaksBn : current.breaks,
              },
              {
                label: isBn ? "কী খরচ হয়" : "What It Costs",
                value: isBn ? current.costsBn : current.costs,
              },
              {
                label: isBn ? "কখন বাদ দেব" : "When To Skip It",
                value: isBn ? current.skipBn : current.skip,
              },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-bg/50 border border-border/60 rounded-xs space-y-1.5">
                <div className="text-[10px] text-text-muted uppercase tracking-wider">
                  {item.label}
                </div>
                <p
                  className={`text-[11px] leading-relaxed text-text-secondary font-sans ${
                    isBn ? "font-bengali text-xs" : ""
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Footnote */}
          <p className="text-[10px] text-text-muted leading-relaxed pt-1 border-t border-border/40 font-mono">
            {isBn
              ? "// এই প্যাটার্নগুলো বাস্তব কোডবেসে ব্যবহার করা হয়, আলাদা চারটি পণ্য নয়। ইচ্ছাকৃতভাবে কোনো বেঞ্চমার্ক সংখ্যা নেই।"
              : "// These patterns are applied inside production codebases, not shipped as four separate products. Benchmarks are deliberately absent."}
          </p>
        </div>

        {/* Cross-link to Section III */}
        <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-text-muted">
          <span>{isBn ? "প্যাটার্নগুলো কোথায় কাজে লেগেছে —" : "See where these patterns show up —"}</span>
          <a
            href="#works"
            className="inline-flex items-center gap-1.5 text-text-primary hover:text-accent transition-colors font-semibold"
          >
            <span>{isBn ? "বিভাগ III · প্রদর্শনী" : "SECTION III · EXHIBITION"}</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
