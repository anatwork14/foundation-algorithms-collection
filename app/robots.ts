import type { MetadataRoute } from "next";
import { siteUrlFromEnvironment } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrlFromEnvironment(process.env);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", `${base}/`).toString(),
    host: base,
  };
}
