import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@vishwakarma-k-c/shared", 
    "@vishwakarma-k-c/db",
    "react-i18next",
    "i18next",
    "framer-motion"
  ],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    NEXT_PUBLIC_APPS_SCRIPT_URL: process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "",
  },
  async redirects() {
    return [
      {
        source: '/donors/brahmasri-kammari-palli-mallikharjuna-kiran-kumar',
        destination: '/donors/brahmasri-kammaripalli-mallikharjuna-kiran-kumar',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
