import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import "./system.css";
import "./research-surfaces.css";
import "./research-refinements.css";
import "./research-evidence.css";
import "./research-evidence-links.css";
import "./implementation-registry.css";
import "./experiment-registry.css";
import "./evidence-hub.css";
import { SiteHeader } from "@/components/site-header";
import { getAllDocuments } from "@/lib/content";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Foundation Algorithms — Research Archive",
    template: "%s — Foundation Algorithms",
  },
  description:
    "A living research archive of foundational algorithms across computer science, AI/ML, quantum computing, cybersecurity, and cross-field research.",
  metadataBase: new URL("https://github.com/anatwork14/foundation-algorithms-collection"),
  icons: {
    icon: "/foundation-algorithms-mark.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const documents = getAllDocuments();

  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${plexMono.variable}`}>
        <SiteHeader documents={documents} />
        {children}
        <footer className="site-footer">
          <div className="shell footer-inner">
            <div>
              <strong>Foundation Algorithms</strong>
              <p>Keep the fundamentals close. Use them to invent what comes next.</p>
            </div>
            <div className="footer-links">
              <a href="https://github.com/anatwork14/foundation-algorithms-collection" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://github.com/anatwork14/foundation-algorithms-collection/tree/main/docs" target="_blank" rel="noreferrer">Markdown source</a>
              <a href="https://github.com/anatwork14/foundation-algorithms-collection/issues" target="_blank" rel="noreferrer">Research ideas</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
