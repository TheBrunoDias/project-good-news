import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Daily Good News",
  description: "Curated positive news, every day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-canvas-soft text-ink antialiased">
        <header className="sticky top-0 z-10 bg-canvas border-b border-hairline">
          <div className="mx-auto max-w-5xl px-6 flex items-center justify-between h-14">
            <a href="/" className="font-bold text-base tracking-tight text-ink">
              Daily Good News
            </a>
            <span className="text-sm text-ink-faint hidden sm:block">
              Good things happening in the world
            </span>
          </div>
        </header>
        {children}
        <footer className="bg-canvas-soft border-t border-hairline mt-24">
          <div className="mx-auto max-w-5xl px-6 py-8 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-secondary">Daily Good News</span>
            <span className="text-xs text-ink-faint">
              Curated daily with AI · Only good news
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
