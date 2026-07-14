import { Metadata } from 'next';
import { VisionPage } from "@/features/home/pages/VisionPage";

export const metadata: Metadata = {
  title: "Our Vision & Mission | Vishwakarma Knowledge Centre",
  description: "Learn about the mission, goals, and core values of the Vishwakarma Knowledge Centre (VKC). Read about our strategic objectives for empowering and mapping traditional artisans in India.",
  keywords: ["VKC Vision", "Mission", "Traditional Artisans", "Artisan Welfare", "Vedic Architecture", "VKC Strategic Goals"],
};

export default function Page() {
  return <VisionPage />;
}
