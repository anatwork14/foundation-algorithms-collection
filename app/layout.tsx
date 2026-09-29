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
import "./archive-discovery.css";
import "./citation-graph.css";
import "./evidence-profile.css";
import "./search-passages.css";
import "./passage-provenance.css";
import "./claim-provenance.css";
import { DialogFocusManager } from "@/components/dialog-focus-manager";
import { SiteHeader } from "@/components/site-header";
import { getAllDocuments } from "@/lib/content";
import { assertResearchIntegrity } from "@/lib/research-integrity";
import { siteUrlFromEnvironment } from "@/lib/site-url";

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

const siteTitle = "Foundation Algorithms — Research Archive";
const siteDescription =
  "A living research archive of foundational algorithms across computer science, AI/ML, quantum computing, cybersecurity, and cross-field research.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s — Foundation Algorithms",
  },
  description: siteDescription,
  metadataBase: new URL(siteUrlFromEnvironment(process.env)),
  icons: {
    icon: "/foundation-algorithms-mark.svg",
  },
  openGraph: {
    type: "website",
    title: siteTitle,
    description: siteDescription,
    siteName: "Foundation Algorithms",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const documents = getAllDocuments();
  assertResearchIntegrity(documents);

  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${plexMono.variable}`}>
        <DialogFocusManager />
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
