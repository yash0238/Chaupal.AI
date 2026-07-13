import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Krishivaani — Farm Decision Intelligence",
    template: "%s · Krishivaani",
  },
  description:
    "AI-powered farm decision intelligence for climate-resilient agriculture: crop disease diagnosis, farm risk scoring, weather intelligence, and a multilingual assistant for farmers.",
  keywords: [
    "AI agriculture",
    "crop disease diagnosis",
    "climate resilience",
    "farm risk score",
    "agri-tech",
    "Gemini AI",
    "smart farming",
    "multilingual farming assistant",
  ],
  authors: [{ name: "Krishivaani" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Krishivaani — Farm Decision Intelligence",
    description:
      "Snap a crop photo, share your location, ask a question — get instant, explainable, multilingual farming decisions powered by AI.",
    type: "website",
    siteName: "Krishivaani",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishivaani — Farm Decision Intelligence",
    description:
      "AI-powered, climate-resilient farm decisions: diagnosis, risk, weather, and a multilingual assistant.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#22c55e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
