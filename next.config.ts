import path from 'path';
import type { NextConfig } from 'next';

const PROJECT_ROOT = '/Users/anmolthukral/projects/megamind';

const nextConfig: NextConfig = {
  basePath: '/tutorials',
  assetPrefix: '/tutorials/',
  trailingSlash: true,
  reactStrictMode: true,
  turbopack: { root: PROJECT_ROOT },
};

export default nextConfig;
