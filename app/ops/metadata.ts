import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "JOY // OPS — Career Intelligence Engine",
    template: "%s | JOY // OPS",
  },
  description:
    "Automated job hunting CRM with JD extraction, company intelligence, salary search, and AI-powered application emails. Track applications, follow-ups, and deadlines in one dashboard.",
  keywords:
    "job hunting, CRM, job application tracker, salary search, company intelligence, AI email, dsa algorithms, groq, Gemini",
  authors: [
    {
      name: "Joy Chandra Uday",
    },
  ],
  creator: "Joy Chandra Uday",
  openGraph: {
    title: "JOY // OPS — Career Intelligence Engine",
    description:
      "Automated job hunting CRM with JD extraction, company intelligence, salary search, and AI-powered application emails.",
    images: [
      {
        url: "https://joychandrauday.vercel.app/ops-social.jpg",
        width: 1200,
        height: 630,
        alt: "JOY // OPS — Career Intelligence Engine",
      },
    ],
    siteName: "JOY // OPS",
  },
  twitter: {
    card: "summary_large_image",
    title: "JOY // OPS — Career Intelligence Engine",
    description:
      "Automated job hunting CRM with JD extraction, company intelligence, salary search, and AI-powered application emails.",
    images: [
      "https://joychandrauday.vercel.app/ops-social.jpg",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";
export const revalidate = 60;