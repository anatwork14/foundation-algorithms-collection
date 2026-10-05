import type { MetadataRoute } from "next";
import { algorithms } from "@/lib/algorithm-catalog";
import { algorithmVariants } from "@/lib/algorithm-variants";
import { getAllDocuments } from "@/lib/content";
import { experiments } from "@/lib/experiments";
import { implementations } from "@/lib/implementations";
import { references } from "@/lib/references";
import { replications } from "@/lib/replications";
import { siteUrlFromEnvironment } from "@/lib/site-url";

function absoluteUrl(base: string, path: string) {
  return new URL(path, `${base}/`).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrlFromEnvironment(process.env);
  const staticPaths = [
    "/",
    "/archive",
    "/algorithms",
    "/variants",
    "/atlas",
    "/lab",
    "/evidence",
    "/evidence/gaps",
    "/claims",
    "/passages",
    "/references",
    "/references/graph",
    "/implementations",
    "/implementations/reviews",
    "/experiments",
    "/replications",
  ];

  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(base, path) })),
    ...getAllDocuments().map((document) => ({ url: absoluteUrl(base, `/archive/${document.slug}`) })),
    ...algorithms.map((algorithm) => ({ url: absoluteUrl(base, `/algorithms/${algorithm.id}`) })),
    ...algorithmVariants.map((variant) => ({
      url: absoluteUrl(base, `/algorithms/${variant.parentAlgorithmId}/variants/${variant.id}`),
    })),
    ...references.map((reference) => ({ url: absoluteUrl(base, `/references/${reference.id}`) })),
    ...implementations.map((implementation) => ({ url: absoluteUrl(base, `/implementations/${implementation.id}`) })),
    ...experiments.map((experiment) => ({ url: absoluteUrl(base, `/experiments/${experiment.id}`) })),
    ...replications.map((replication) => ({ url: absoluteUrl(base, `/replications/${replication.id}`) })),
  ];
}