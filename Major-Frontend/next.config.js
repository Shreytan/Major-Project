/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  // Disable server-side features that don't work with static export
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
