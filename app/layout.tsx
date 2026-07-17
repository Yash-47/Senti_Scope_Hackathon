import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased light"
      style={{ colorScheme: "light" }}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground flex flex-col">
        {children}
      </body>
    </html>
  );
}
