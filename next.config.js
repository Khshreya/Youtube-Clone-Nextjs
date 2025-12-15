// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    enabled: false, // use Webpack in dev
  },
};

module.exports = nextConfig;
