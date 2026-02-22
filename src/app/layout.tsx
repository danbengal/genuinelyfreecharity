import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://genuinelyfreecharity.com"),
  title: "Genuinely Free Charity — Your Visit Supports Real Charities",
  description:
    "Answer a daily poll. We show ads. 100% of net revenue goes to verified charities like St. Jude, Doctors Without Borders, and Habitat for Humanity. No signup, no donations required.",
  keywords: [
    "charity",
    "free charity",
    "daily poll",
    "ad revenue charity",
    "transparency",
    "nonprofit support",
    "St. Jude",
    "Doctors Without Borders",
    "Habitat for Humanity",
  ],
  authors: [{ name: "genuinelyfreecharity.com" }],
  openGraph: {
    type: "website",
    url: "https://genuinelyfreecharity.com",
    title: "Genuinely Free Charity — Your Visit Supports Real Charities",
    description:
      "Answer a daily poll. We show ads. 100% of net revenue goes to verified charities. No signup, no donations required.",
    siteName: "Genuinely Free Charity",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Genuinely Free Charity" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Genuinely Free Charity — Your Visit Supports Real Charities",
    description:
      "Answer a daily poll. We show ads. 100% of net revenue goes to verified charities.",
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
  themeColor: "#ffffff",
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
