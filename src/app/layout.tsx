import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import { RootMotionConfig } from "@/components/motion/root-motion-config";
import "./globals.css";

const serif = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NOIRÉ — Contemporary Ready-to-Wear",
    template: "%s | NOIRÉ",
  },
  description:
    "Contemporary essentials designed for everyday movement. Clean silhouettes, considered materials and pieces made to move with you.",
  applicationName: "NOIRÉ",
  openGraph: {
    title: "NOIRÉ — Contemporary Ready-to-Wear",
    description:
      "Contemporary essentials designed for everyday movement. Clean silhouettes, considered materials and pieces made to move with you.",
    siteName: "NOIRÉ",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOIRÉ — Contemporary Ready-to-Wear",
    description:
      "Contemporary essentials designed for everyday movement.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <RootMotionConfig>{children}</RootMotionConfig>
      </body>
    </html>
  );
}
