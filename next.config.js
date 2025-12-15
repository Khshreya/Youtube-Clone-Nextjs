/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // force webpack in dev
  },
};

module.exports = nextConfig;
