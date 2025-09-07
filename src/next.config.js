// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL('https://fra.cloud.appwrite.io/v1/storage/**'),
      // If you also use other Appwrite regions, add them here too:
      // new URL('https://sgp.cloud.appwrite.io/v1/storage/**'),
    ],
  },
};

module.exports = nextConfig;
