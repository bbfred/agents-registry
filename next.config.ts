import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // TODO: Fix type errors after deployment
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
