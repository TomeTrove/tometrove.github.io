/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
console.log("NextJS Basepath:", basePath)

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
