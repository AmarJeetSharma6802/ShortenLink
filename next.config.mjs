/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["static.nike.com", "google.com", "localhost,/vercel.com","m.media-amazon.com"], 
  },
};

export default nextConfig;
