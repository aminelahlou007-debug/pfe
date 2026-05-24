/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: false,
    // Add domains or remotePatterns if you load external images in production
    // domains: ['example.com'],
  },
}

export default nextConfig
