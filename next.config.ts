import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/club-rules",
        destination: "/rules",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
