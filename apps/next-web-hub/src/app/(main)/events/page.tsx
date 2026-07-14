import { Metadata } from 'next';
import { HomePage } from "@/features/home/pages/HomePage";

export const metadata: Metadata = {
  title: "Community Events & Gatherings | VKC",
  description: "Stay updated on upcoming summits, training workshops, and heritage celebrations organized by the Vishwakarma Knowledge Centre.",
  keywords: ["Events", "VKC Events", "Artisan Workshops", "Community Summits", "Decennial Celebrations"],
};

export default function Page() {
  return <HomePage />;
}
