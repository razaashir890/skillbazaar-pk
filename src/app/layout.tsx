import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillBazaar PK — Har Hunar, Har Jagah Becho",
  description:
    "Pakistan's First Freelance Marketplace Built for Local Talent. Connect with businesses, showcase your skills, and earn with local payments.",
  keywords: [
    "SkillBazaar",
    "Pakistan",
    "freelance",
    "marketplace",
    "Pakistani freelancers",
    "JazzCash",
    "EasyPaisa",
    "gigs",
    "hunar",
  ],
  authors: [{ name: "SkillBazaar PK Team" }],
  openGraph: {
    title: "SkillBazaar PK — Har Hunar, Har Jagah Becho",
    description:
      "Pakistan's First Freelance Marketplace Built for Local Talent.",
    url: "https://skillbazaar.pk",
    siteName: "SkillBazaar PK",
    type: "website",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillBazaar PK — Har Hunar, Har Jagah Becho",
    description:
      "Pakistan's First Freelance Marketplace Built for Local Talent.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
