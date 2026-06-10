import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Daily Good News",
    short_name: "Good News",
    description: "Curated positive news, every day.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    icons: [
      { src: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { src: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
