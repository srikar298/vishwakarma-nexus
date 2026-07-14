import { Metadata } from 'next';
import { LegendsPage } from "@/features/heritage/pages/LegendsPage";

export const metadata: Metadata = {
  title: "Legends, Historians & Scholars | VKC",
  description: "Celebrate the prominent scholars, sculptors, and historians who have chronicled the contribution of the Vishwakarma community to global engineering, arts, and literature.",
  keywords: ["Vishwakarma Legends", "Historians", "Sculptors", "Community Scholars", "Legacy of Art", "National Awardees"],
};

export default function Page() {
  return <LegendsPage />;
}
