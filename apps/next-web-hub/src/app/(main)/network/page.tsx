import React, { Suspense } from "react";
import { Metadata } from 'next';
import { NetworkHub } from "@/features/network/pages/NetworkHub";

export const metadata: Metadata = {
  title: "Professional Network & Community Hub | VKC",
  description: "Connect with verified Vishwakarma professionals, community leaders, and access educational resources and matchmaking directories.",
  keywords: ["Community Hub", "Professional Network", "Matrimony Directory", "Artisan network", "VKC Nexus"],
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin" /></div>}>
      <NetworkHub />
    </Suspense>
  );
}
