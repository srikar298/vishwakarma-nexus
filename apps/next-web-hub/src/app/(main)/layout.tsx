import React from "react";
import { Layout } from "@/shared/components/Layout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
