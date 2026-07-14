import { Metadata } from 'next';
import { HeritagePage } from "@/features/heritage/pages/HeritagePage";

export const metadata: Metadata = {
  title: "Divine CMS & Sacred Architecture Heritage | VKC",
  description: "Explore the ancient scriptures, engineering secrets, and sacred architecture of the Vishwakarma community. Uncover the roots of Pancha Kula arts and traditional engineering legacies.",
  keywords: ["Divine CMS", "Sacred Architecture", "Pancha Kula", "Shastras", "Artisan Heritage", "Traditional Engineering"],
};

export default function Page() {
  return <HeritagePage />;
}
