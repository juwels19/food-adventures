/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
  // env: {
  //   GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  // },
};

export default nextConfig;
