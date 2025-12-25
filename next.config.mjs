/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for better error handling
  reactStrictMode: true,

  // Enable SWC minification (faster builds)
  swcMinify: true,

  // Skip ESLint during builds (circular dependency in config)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip TypeScript errors temporarily for debugging
  typescript: {
    ignoreBuildErrors: true,
  },

  // Experimental features
  experimental: {
    // Enable server actions for forms
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },

  // Image optimization
  images: {
    // Use remotePatterns for wildcard support (domains doesn't support wildcards)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
    ]
  },
}

export default nextConfig
