import { Metadata } from 'next';
import { HomePage } from "@/features/home/pages/HomePage";

export const metadata: Metadata = {
  title: "Media Gallery & Event Highlights | VKC",
  description: "Browse images, video highlights, and press coverage of Vishwakarma Knowledge Centre (VKC) decennial events, artisan meets, and traditional craftsmanship galleries.",
  keywords: ["Gallery", "Media highlights", "VKC Events", "Decennial Celebrations", "Artisan photos"],
};

export default function Page() {
  return <HomePage />;
}
