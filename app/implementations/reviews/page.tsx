import type { Metadata } from "next";
import { ImplementationReviewExplorer } from "@/components/implementation-review-explorer";
import { implementationUpstreamReviews } from "@/lib/implementation-upstream-reviews";
import { implementations } from "@/lib/implementations";

export const metadata: Metadata = {
  title: "Implementation Upstream Reviews",
  description: "Inspect append-only decisions about upstream implementation movement without changing immutable evidence pins automatically.",
};

export default function ImplementationReviewsPage() {
  return <ImplementationReviewExplorer reviews={implementationUpstreamReviews} implementations={implementations} />;
}