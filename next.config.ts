import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: '/blast-code-challenge-2025/',
  basePath: '/blast-code-challenge-2025',
  output: 'export'
};

export default nextConfig;
