/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn.prod.website-files.com',
      'www.gastwerk.com',
      'res.cloudinary.com',
    ],
  },
};

module.exports = nextConfig;
