import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "http://192.168.1.2:3000",
    "http://192.168.1.2:3001",
    "http://localhost:3000",
  ]
};

export default nextConfig;
