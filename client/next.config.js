/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/graphql',
  },
  images: {
    domains: [], // Add allowed image domains here if needed
  },
};

module.exports = nextConfig;
