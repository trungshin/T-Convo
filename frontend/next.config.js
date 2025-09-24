/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**'
      }
      // thêm các hostname khác nếu bạn dùng (CDN, S3,...)
    ]
  },
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'https://t-convo.onrender.com/api',
    //NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'
  }
};

module.exports = nextConfig;


// import type { NextConfig } from "next";


// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns:  [new URL('https://images.unsplash.com/')],
//   },
//   env: {
//     NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api',
//     //NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'
//   }
// };

// export default nextConfig;
