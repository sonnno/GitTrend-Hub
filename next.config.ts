import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 使用服务端渲染模式，支持数据库交互
  // 移除 output: 'export' 以启用完整的 Next.js 功能
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
