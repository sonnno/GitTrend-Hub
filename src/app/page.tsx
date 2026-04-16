import { Suspense } from 'react';
import { Category, fetchGitHubTrends } from '@/lib/fetcher';
import { TrendTabs } from '@/components/TrendTabs';
import { RepoCard } from '@/components/RepoCard';
import { AnimateWrap } from '@/components/AnimateWrap';

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export const dynamic = 'force-dynamic';

async function TrendContent({ category }: { category: Category }) {
  const repos = await fetchGitHubTrends(category);

  if (repos.length === 0) {
    return (
      <div className="loading">
        <p>暂无数据，请稍后重试...</p>
      </div>
    );
  }

  if (category === 'all-time') {
    const heroRepo = repos[0];
    const remainingRepos = repos.slice(1);

    return (
      <AnimateWrap>
        <div key={category}>
          <div className="hero-grid">
            <RepoCard repo={heroRepo} variant="hero" layoutId={`repo-${heroRepo.githubId}`} />
          </div>
          <div className="bento-grid">
            {remainingRepos.map((repo) => (
              <RepoCard
                key={repo.githubId}
                repo={repo}
                variant="bento"
                layoutId={`repo-${repo.githubId}`}
              />
            ))}
          </div>
        </div>
      </AnimateWrap>
    );
  }

  return (
    <AnimateWrap>
      <div className="bento-grid" key={category}>
        {repos.map((repo) => (
          <RepoCard
            key={repo.githubId}
            repo={repo}
            variant="bento"
            layoutId={`repo-${repo.githubId}`}
          />
        ))}
      </div>
    </AnimateWrap>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { category } = resolvedSearchParams;

  const activeCategory = (category as Category) || 'all-time';
  const validCategories: Category[] = ['all-time', 'monthly', 'weekly', 'active'];
  const finalCategory = validCategories.includes(activeCategory) ? activeCategory : 'all-time';

  return (
    <main className="container">
      <header className="header">
        <h1>GitTrend Hub</h1>
        <p>发现最热门的 GitHub 开源项目 · 多维排名 · 实时更新</p>
      </header>

      <TrendTabs activeCategory={finalCategory} />

      <Suspense fallback={<div className="loading">加载中...</div>}>
        <TrendContent category={finalCategory} />
      </Suspense>
    </main>
  );
}
