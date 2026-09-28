import type { Metadata } from "next";
import { AtlasExplorer } from "@/components/atlas-explorer";
import { algorithms } from "@/lib/algorithms";

export const metadata: Metadata = {
  title: "Atlas",
  description: "Explore curated relationships among foundational algorithms, assumptions, and research mechanisms.",
};

export default function AtlasPage() {
  return <AtlasExplorer algorithms={algorithms} />;
}
