import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Anek_Bangla, Noto_Serif_Bengali, Newsreader } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPWA from "@/components/InstallPWA";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  variable: "--font-anek-bangla",
  display: "swap",
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-bn",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#141312" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://joychandrauday.vercel.app"),
  applicationName: "Joy Chandra Uday",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Joy Uday",
    statusBarStyle: "black-translucent",
  },
  title: {
    default: "Joy Chandra Uday — Software Engineer & Systems Builder",
    template: "%s | Joy Chandra Uday",
  },
  description:
    "Software Engineer at garirhat.com, previously at G2G Digital, and Founder of OwlPrep (growwithowl.com). Architecting scalable backends, platform infrastructure, and high-concurrency systems.",
  keywords: [
    "Joy Chandra Uday",
    "Joy Chandra Uday Software Engineer",
    "Joy Chandra Uday G2G Digital",
    "Joy Chandra Uday author",
    "Joy Chandra Uday technology writer",
    "g2gdigital.com/author/joychandrauday",
    "Joy Chandra Uday articles",
    "Joy Chandra Uday garirhat",
    "garirhat",
    "garirhat.com",
    "Joy Chandra Uday Portfolio",
    "Joy Chandra Uday Bangladesh",
    "g2gdigital",
    "g2gdigital.com",
    "G2G Digital Joy Chandra Uday",
    "OwlPrep",
    "growwithowl",
    "growwithowl.com",
    "StockFlow",
    "FlowBridge",
    "DocuPilot",
    "Software Engineer Bangladesh",
    "Distributed Systems",
    "Platform Architecture",
    "Concurrency Control",
    "System Design",
    "Artificial Intelligence",
    "Algorithms and Digital Products",
  ],
  authors: [
    { name: "Joy Chandra Uday", url: "https://joychandrauday.vercel.app" },
    { name: "Joy Chandra Uday (G2G Digital Author Archive)", url: "http://g2gdigital.com/author/joychandrauday" },
  ],
  creator: "Joy Chandra Uday",
  publisher: "Joy Chandra Uday",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://joychandrauday.vercel.app",
    languages: {
      "en-US": "https://joychandrauday.vercel.app",
      "bn-BD": "https://joychandrauday.vercel.app",
    },
  },
  openGraph: {
    title: "Joy Chandra Uday — Software Engineer & Systems Builder",
    description:
      "Software Engineer at garirhat.com, previously at G2G Digital, and Founder of OwlPrep. Building resilient distributed backends, immutable ledgers, and platform architectures.",
    url: "https://joychandrauday.vercel.app",
    siteName: "Joy Chandra Uday — Engineering Dossier",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "https://joychandrauday.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Joy Chandra Uday — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joy Chandra Uday — Software Engineer",
    description:
      "Software Engineer at garirhat.com, previously at G2G Digital, and Founder of OwlPrep. Architecting scalable backends and resilient platform systems.",
    creator: "@joychandrauday",
    images: ["https://joychandrauday.vercel.app/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Rich JSON-LD Structured Data for Google Search Knowledge Graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://joychandrauday.vercel.app/#person",
        name: "Joy Chandra Uday",
        alternateName: ["জয় চন্দ্র উদয়", "joychandrauday"],
        jobTitle: "Software Engineer & Systems Builder",
        description:
          "Software Engineer from Bangladesh building scalable applications, immutable ledgers, and distributed systems. Software Engineer at garirhat.com, previously Full-Stack Engineer at G2G Digital, and Founder of OwlPrep.",
        url: "https://joychandrauday.vercel.app",
        email: "mailto:joychandraud@gmail.com",
        nationality: "Bangladeshi",
        worksFor: [
          {
            "@type": "Organization",
            name: "Garirhat",
            url: "https://garirhat.com",
          },
          {
            "@type": "Organization",
            name: "G2G Digital",
            url: "https://g2gdigital.com",
            sameAs: "http://g2gdigital.com/author/joychandrauday",
          },
          {
            "@type": "Organization",
            name: "Grow With Owl",
            url: "https://growwithowl.com",
          },
        ],
        sameAs: [
          "http://g2gdigital.com/author/joychandrauday",
          "https://g2gdigital.com/author/joychandrauday",
          "https://github.com/joychandrauday",
          "https://linkedin.com/in/joychandrauday",
          "https://twitter.com/joychandrauday",
          "https://joychandrauday-nexus.vercel.app",
        ],
        knowsAbout: [
          "Software Engineering",
          "Artificial Intelligence (AI)",
          "Algorithms and Digital Products",
          "Distributed Systems",
          "Platform Architecture",
          "Data Storage Engines",
          "Concurrency Control",
          "System Design",
          "Reliability Engineering",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://joychandrauday.vercel.app/#website",
        url: "https://joychandrauday.vercel.app",
        name: "Joy Chandra Uday — Software Engineer",
        description: "Official portfolio and engineering telemetry of Joy Chandra Uday.",
        publisher: { "@id": "https://joychandrauday.vercel.app/#person" },
        inLanguage: ["en", "bn"],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} ${anekBangla.variable} ${notoSerifBengali.variable} ${newsreader.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-text-primary antialiased selection:bg-accent selection:text-black min-h-screen">
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <ServiceWorkerRegister />
            <InstallPWA />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
