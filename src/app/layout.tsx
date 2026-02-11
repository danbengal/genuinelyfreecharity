import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genuinelyfreecharity.com"),
  title: "genuinelyfreecharity.com — Daily Poll, Real Impact",
  description: "Answer a daily poll. Ad revenue supports charities. Full transparency, always.",
  keywords: ["charity", "poll", "ad revenue", "transparency", "donation", "nonprofit"],
  authors: [{ name: "genuinelyfreecharity.com" }],
  openGraph: {
    type: "website",
    url: "https://genuinelyfreecharity.com",
    title: "genuinelyfreecharity.com — Daily Poll, Real Impact",
    description: "Answer a daily poll. Ad revenue supports charities. Full transparency, always.",
    siteName: "genuinelyfreecharity.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "genuinelyfreecharity.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "genuinelyfreecharity.com — Daily Poll, Real Impact",
    description: "Answer a daily poll. Ad revenue supports charities. Full transparency, always.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6540797109919231"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
