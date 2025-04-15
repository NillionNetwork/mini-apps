/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['images.unsplash.com', 'i.scdn.co', 'i.postimg.cc', 'github.com'], // Allow images from Unsplash in our sample data
  },
};

module.exports = nextConfig;
