import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* Cap Turbopack's heap so it garbage-collects instead of growing until the
     sandbox OOM-killer takes the dev server down (4GB cgroup, shared with
     headless Chrome). Value in MB. */
  experimental: {
    turbopackMemoryLimit: 1536,
  },
  /* config options here */
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
        // search omitted → any query string (e.g. ?v=2 cache-busting) is allowed
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
