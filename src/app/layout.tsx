import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GitTrend Hub - GitHub 趋势探索平台',
  description: '发现最热门的 GitHub 开源项目，多维排名，实时更新',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
