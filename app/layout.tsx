import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SentiScope – Real-Time Social Media Sentiment & Intelligence Platform",
  description:
    "Monitor public sentiment, detect emerging trends, identify root causes, and generate AI-powered insights from live social media discussions in real-time.",
  keywords: ["Sentiment Analysis", "Social Media Monitoring", "AI Insights", "Data Analytics Dashboard", "SentiScope"],
  authors: [{ name: "SentiScope Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-background font-sans text-foreground flex flex-col">
        {children}
      </body>
    </html>
  );
}
