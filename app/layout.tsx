import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Barlow_Condensed, Mulish } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  subsets: ["latin"],
});

const mulish = Mulish({
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legalite.ai — Automate your UK company compliance",
  description:
    "Instant risk scores, deadline tracking, and automated reminders for every Companies House filing. Free for UK founders, directors, and accountants.",
  keywords: [
    "Companies House deadline",
    "UK company accounts deadline",
    "confirmation statement due",
    "Companies House filing reminder",
    "UK company compliance",
    "late filing penalty UK",
  ],
  openGraph: {
    title: "Legalite.ai",
    description: "Automate your UK company compliance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${barlowCondensed.variable} ${mulish.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VME96B6VMJ"
        />
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VME96B6VMJ');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
