import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vishwakarma-k-c/shared", "@vishwakarma-k-c/db"],
  env: {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || "",
    VITE_APPS_SCRIPT_URL: process.env.VITE_APPS_SCRIPT_URL || "",
  }
};

export default nextConfig;
