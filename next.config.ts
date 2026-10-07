import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/tutorials',
  assetPrefix: '/tutorials/',
  trailingSlash: true,
  reactStrictMode: true,
  // turbopack: { root: PROJECT_ROOT },
};

export default nextConfig;
