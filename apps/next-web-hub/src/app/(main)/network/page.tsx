"use client";

import React, { Suspense } from "react";
import { NetworkHub } from "@/features/network/pages/NetworkHub";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin" /></div>}>
      <NetworkHub />
    </Suspense>
  );
}
