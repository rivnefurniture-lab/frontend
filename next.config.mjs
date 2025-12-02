/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Docker deployment
  
  // Image optimization
  images: {
    domains: ['dummyimage.com'],
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
