import { Suspense } from 'react';
import { Metadata } from 'next';
import { DonorsPage } from "@/features/community/pages/DonorsPage";

export const metadata: Metadata = {
  title: "Supporters Registry & Sponsor Leaderboard | VKC",
  description: "View the leaderboard of sponsors, honorary patrons, and community members supporting the digital transformation and preservation of traditional artisan legacy.",
  keywords: ["Sponsors", "Donor Registry", "Honorary Patrons", "Leaderboard", "Artisan Fund", "VKC Supporters"],
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 font-black text-xs uppercase tracking-widest animate-pulse">Loading Leaderboard...</div>
      </div>
    }>
      <DonorsPage />
    </Suspense>
  );
}
