/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Docker deployment
  
  // Skip ESLint during production builds (we lint in CI separately)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Skip TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    domains: [
      'dummyimage.com',
      'cryptologos.cc',
      'static.coingecko.com',
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  },
  
  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
// Force redeploy Sun Dec 14 18:50:00 EET 2025 - fix percentage formatting
