import type { Metadata } from "next";
import { Inter, Outfit, Ramaraja, Rozha_One, NTR, Sahitya, Anek_Telugu } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const ramaraja = Ramaraja({
  variable: "--font-ramaraja",
  weight: "400",
  subsets: ["latin"],
});

const rozhaOne = Rozha_One({
  variable: "--font-rozha",
  weight: "400",
  subsets: ["latin"],
});

const ntr = NTR({
  variable: "--font-ntr",
  weight: "400",
  subsets: ["latin"],
});

const sahitya = Sahitya({
  variable: "--font-sahitya",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const anekTelugu = Anek_Telugu({
  variable: "--font-anek-telugu",
  subsets: ["telugu", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vishwakarmaknowledgecentre.org'),
  title: {
    default: "Vishwakarma Knowledge Centre | Preserving Heritage, Powering Futures",
    template: "%s | Vishwakarma Knowledge Centre",
  },
  description: "Dedicated to the recognition, skill upgradation, and holistic support of traditional artisans in Andhra Pradesh and Telangana. Join the mission to empower the Vishwakarma community.",
  keywords: [
    "Vishwakarma Knowledge Centre",
    "VKC",
    "Vishwakarma",
    "PM Vishwakarma",
    "Traditional Artisans",
    "Andhra Pradesh",
    "Telangana",
    "Hyderabad",
    "Traditional Crafts",
    "Heritage",
    "Skill Development",
    "Pancha Kula",
    "Shastras",
    "Artisan Registry"
  ],
  authors: [{ name: "Vishwakarma Knowledge Centre", url: "https://vishwakarmaknowledgecentre.org" }],
  creator: "Vishwakarma Knowledge Centre",
  publisher: "Vishwakarma Knowledge Centre",
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Vishwakarma Knowledge Centre | Preserving Heritage, Powering Futures",
    description: "Dedicated to the recognition, skill upgradation, and holistic support of traditional artisans in Andhra Pradesh and Telangana. Join the mission to empower the Vishwakarma community.",
    url: "https://vishwakarmaknowledgecentre.org",
    siteName: "Vishwakarma Knowledge Centre",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vishwakarma Knowledge Centre Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishwakarma Knowledge Centre | Preserving Heritage, Powering Futures",
    description: "Dedicated to the recognition, skill upgradation, and holistic support of traditional artisans in Andhra Pradesh and Telangana. Join the mission to empower the Vishwakarma community.",
    creator: "@VishwakarmaKno1",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "google831f8179f7bf3287",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${ramaraja.variable} ${rozhaOne.variable} ${ntr.variable} ${sahitya.variable} ${anekTelugu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-stone-800 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
