import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";

import { Providers } from "@/app/providers";
import { Header, Footer } from "@/components/layout-shell";
import { themeInitScript } from "@/lib/theme";

import "@autoblogwriter/sdk/styles.css";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL?.startsWith("http")
      ? process.env.SITE_URL
      : `https://${process.env.SITE_URL ?? "growthhackerdev.com"}`
  ),
  title: { default: "GrowthHackerDev", template: "%s | GrowthHackerDev" },
  description:
    "Growth playbooks for technical builders using automation, AI workflows, and modern marketing tactics.",
  icons: {
    icon: [{ url: "/logo2.png", type: "image/png" }],
    shortcut: [{ url: "/logo2.png", type: "image/png" }],
    apple: [{ url: "/logo2.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "GrowthHackerDev",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@growthhackerdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "Ysys-HLoUNdahZFNBN7X5TalKL6X7wd9SHuZk3KVijA",
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
      data-theme="light"
      suppressHydrationWarning
    >
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} flex min-h-screen flex-col bg-background text-foreground`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
