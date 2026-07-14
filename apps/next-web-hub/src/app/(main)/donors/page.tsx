import { Suspense } from 'react';
import { DonorsPage } from "@/features/community/pages/DonorsPage";

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
