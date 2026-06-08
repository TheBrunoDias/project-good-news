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
          <div className="mx-auto max-w-117.5 px-4 flex items-center justify-between h-12">
            <a href="/" className="font-bold text-base tracking-tight text-ink">
              Daily Good News
            </a>
            <a href="/about" className="text-xs text-ink-muted hover:text-ink transition-colors">
              About
            </a>
          </div>
        </header>
        {children}
        <footer className="border-t border-hairline mt-16">
          <div className="mx-auto max-w-117.5 px-4 py-6 text-center">
            <span className="text-xs text-ink-faint">Curated daily with AI · Only good news</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
