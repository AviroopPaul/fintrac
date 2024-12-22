/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't run ESLint during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
