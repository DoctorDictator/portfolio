/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "rgjaukmwlm.ufs.sh",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
