/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'output: export' को हटा दिया गया है क्योंकि Vercel पर SSR/ISR default होता है।
  // 'distDir: out' भी हटा दिया गया है।
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // 'unoptimized: true' और custom loader settings हटा दिए गए हैं।
    // Vercel पर Next.js की built-in image optimization काम करती है।
  },
  // 'experimental.optimizeCss' हटा दिया गया है।
  // Disable telemetry
  telemetry: false,
  // Vercel के "x-powered-by" header को हटाने के लिए यह setting अभी भी रख सकते हैं।
  poweredByHeader: false,
  // Custom headers (optional)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Powered-By',
            value: 'SmartSaathi',
          },
        ],
      },
    ]
  },
}

export default nextConfig
