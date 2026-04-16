import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GitTrend Hub - 探索 GitHub 热门开源项目',
  description: '发现 GitHub 上最热门的开源项目，追踪技术趋势，收藏你感兴趣的项目',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body>{children}</body>
    </html>
  );
}
