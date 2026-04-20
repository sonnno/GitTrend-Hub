import { Suspense } from 'react';
import { fetchGitHubTrends, TrendCategory } from '@/lib/fetcher';
import { HomePageClient } from '@/components/HomePageClient';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function validateCategory(category: string | undefined): TrendCategory {
  const validCategories: TrendCategory[] = [
    'all-time',
    'monthly',
    'recently-active',
    'trending',
  ];
  return validCategories.includes(category as TrendCategory)
    ? (category as TrendCategory)
    : 'all-time';
}

async function ProjectListContainer({ category }: { category: TrendCategory }) {
  const projects = await fetchGitHubTrends(category);
  return <HomePageClient initialProjects={projects} initialCategory={category} />;
}

export default async function HomePage({ searchParams }: PageProps) {
  // Next.js 15+ 要求 await searchParams
  const params = await searchParams;
  const category = validateCategory(params.category as string);

  return (
    <main className="main-container">
      <div className="hero-section">
        <h1 className="hero-title">
          <span className="gradient-text">GitTrend</span> Hub
        </h1>
        <p className="hero-subtitle">
          探索 GitHub 上最热门的开源项目，发现下一个改变世界的代码
        </p>
      </div>

      <Suspense
        fallback={
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>正在加载项目...</p>
          </div>
        }
      >
        <ProjectListContainer category={category} />
      </Suspense>
    </main>
  );
}
