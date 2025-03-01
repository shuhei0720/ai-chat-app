/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        // port: '',
        // pathname: '/account123/**',
        search: '',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint の警告を無視
  },
};

export default nextConfig;
