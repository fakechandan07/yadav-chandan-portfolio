import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: `npm run build` writes a deployable site to /out.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
