import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitTrend Hub - Discover Trending GitHub Repositories",
  description: "Explore trending GitHub repositories with beautiful visualizations and smart ranking logic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
