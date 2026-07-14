import { Metadata } from 'next';
import { DirectoryPage } from "@/features/directory/pages/DirectoryPage";

export const metadata: Metadata = {
  title: "Master Artisans & Professionals Directory | VKC",
  description: "Discover the finest Vishwakarma craftsmen. From sacred architecture and traditional carpentry to intricate metalwork and jewelry, find verified professionals in our master directory.",
  keywords: ["Artisan Directory", "Vishwakarma Directory", "Traditional Craftsmen", "Blacksmiths", "Goldsmiths", "Carpenters", "Sculptors", "Sacred Architecture"],
};

export default function Page() {
  return <DirectoryPage />;
}
