import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "test-appoinment-app-bucket-chris.s3.eu-north-1.amazonaws.com",
  }
    ]
  }
};

export default nextConfig;
