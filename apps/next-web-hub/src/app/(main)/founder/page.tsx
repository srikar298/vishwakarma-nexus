import { Metadata } from 'next';
import { FounderPage } from "@/features/home/pages/FounderPage";

export const metadata: Metadata = {
  title: "Our Founder & Legacy | Vishwakarma Knowledge Centre",
  description: "Discover the journey, achievements, and legacy of our founder, Brahmasri Kondoju Praveen Kumar Chary. Read about his lifelong dedication to restoring dignity and digital sovereignty to traditional artisans.",
  keywords: ["VKC Founder", "Kondoju Praveen Kumar Chary", "Artisan Advocate", "Vishwakarma Legacy", "Welfare Leader"],
};

export default function Page() {
  return <FounderPage />;
}
