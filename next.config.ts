import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
