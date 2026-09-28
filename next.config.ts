import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/getting-started",
        destination: "/ladder",
        permanent: true,
      },
      {
        source: "/club-rules",
        destination: "/club/rules",
        permanent: true,
      },
      {
        source: "/rules",
        destination: "/club/rules",
        permanent: true,
      },
      {
        source: "/judges",
        destination: "/club/judges",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
