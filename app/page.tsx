import { ResearchHub } from "@/components/research-hub";
import { getAllDocuments } from "@/lib/content";

export default function HomePage() {
  return <ResearchHub documents={getAllDocuments()} />;
}
