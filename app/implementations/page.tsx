import type { Metadata } from "next";
import { ImplementationExplorer } from "@/components/implementation-explorer";
import { algorithms } from "@/lib/algorithm-catalog";
import { assertValidImplementations } from "@/lib/implementation-validation";
import { implementations } from "@/lib/implementations";

export const metadata: Metadata = {
  title: "Implementations",
  description: "Browse curated implementation repositories linked to foundational algorithm entities.",
};

export default function ImplementationsPage() {
  assertValidImplementations(implementations, algorithms);
  return <ImplementationExplorer records={implementations} />;
}
