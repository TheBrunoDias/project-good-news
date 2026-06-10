import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistrar from "./components/ServiceWorkerRegistrar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  themeColor: "#16a34a",
};

export const metadata: Metadata = {
  title: "Daily Good News",
  description: "Curated positive news, every day.",
  appleWebApp: {
    capable: true,
    title: "Daily Good News",
    statusBarStyle: "default",
  },
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
            <nav className="flex items-center gap-4">
              <a href="/news" className="text-xs text-ink-muted hover:text-ink transition-colors">
                News
              </a>
              <a href="/about" className="text-xs text-ink-muted hover:text-ink transition-colors">
                About
              </a>
            </nav>
          </div>
        </header>
        {children}
        <ServiceWorkerRegistrar />
        <footer className="border-t border-hairline mt-16">
          <div className="mx-auto max-w-117.5 px-4 py-6 text-center">
            <span className="text-xs text-ink-faint">Curated daily with AI · Only good news</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
