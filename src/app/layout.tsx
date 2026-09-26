import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/content/site";

const title = `${site.firstName} ${site.lastName} — Developer`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  openGraph: {
    title,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.firstName} ${site.lastName}` }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description: site.description, images: ["/og.jpg"] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0c0b09",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
