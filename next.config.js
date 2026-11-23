/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Optimize images
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Allow dev origins for preview
  allowedDevOrigins: [
    'localhost',
    '*.preview.same-app.com',
  ],
  // Compress responses
  compress: true,
  // Power by header removal
  poweredByHeader: false,
  // Generate ETags for better caching
  generateEtags: true,
  // Strict mode for better development
  reactStrictMode: true,

  // Add security headers for thank-you page
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'no-cache' }],
      },
      {
        source: '/projekte/:path*.webp',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=86400' }],
      },
      {
        source: '/thank-you',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
