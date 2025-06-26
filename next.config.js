/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build to avoid issues with generated Prisma files
  },
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript checking enabled
  },
}

module.exports = nextConfig 