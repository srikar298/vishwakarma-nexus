import { Metadata } from 'next';
import { KnowledgePage } from "@/features/heritage/pages/KnowledgePage";

export const metadata: Metadata = {
  title: "Knowledge Base & Shastra Archives | VKC",
  description: "Browse the digital library of Vishwakarma architectural manuals, ancient scriptures, and research papers on structural sciences, metallurgy, and traditional crafting techniques.",
  keywords: ["Knowledge Base", "Shastra Vault", "Metallurgy", "Vedic Science", "Artisan Manuals", "Ancient Manuscripts"],
};

export default function Page() {
  return <KnowledgePage />;
}
