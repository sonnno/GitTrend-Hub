import { subDays, formatISO } from 'date-fns';
import { prisma } from './prisma';
import type { Prisma } from '@prisma/client';

export type Category = 'all-time' | 'monthly' | 'weekly' | 'active';

export interface Repo {
  githubId: number;
  name: string;
  fullName: string;
  owner: string;
  avatarUrl: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date;
  isCollected: boolean;
  starGrowth: number;
  dailyGrowth: string;
}

type CollectionIdResult = Prisma.CollectionGetPayload<{
  select: { githubId: true };
}>;

type ProjectResult = Prisma.ProjectGetPayload<{}>;

interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

interface GitHubApiResponse {
  items: GitHubRepoItem[];
}

function buildGitHubApiUrl(category: Category): string {
  const baseUrl = 'https://api.github.com/search/repositories';
  const params = new URLSearchParams();
  const now = new Date();

  switch (category) {
    case 'all-time':
      params.set('q', 'stars:>20000');
      params.set('sort', 'stars');
      params.set('order', 'desc');
      break;
    case 'monthly':
      params.set('q', `created:>${formatISO(subDays(now, 30)).split('T')[0]}`);
      params.set('sort', 'stars');
      params.set('order', 'desc');
      break;
    case 'weekly':
      params.set('q', `created:>${formatISO(subDays(now, 7)).split('T')[0]}`);
      params.set('sort', 'stars');
      params.set('order', 'desc');
      break;
    case 'active':
      params.set('q', `pushed:>${formatISO(subDays(now, 7)).split('T')[0]}`);
      params.set('sort', 'updated');
      params.set('order', 'desc');
      break;
  }

  params.set('per_page', '12');
  return `${baseUrl}?${params.toString()}`;
}

function calculateStarGrowth(stars: number, createdAt: Date): { growth: number; daily: string } {
  const now = new Date();
  const ageInDays = Math.max(1, Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
  const dailyGrowth = stars / ageInDays;
  
  let growthEmoji = '';
  if (dailyGrowth > 100) growthEmoji = '🚀';
  else if (dailyGrowth > 50) growthEmoji = '⬆️';
  else if (dailyGrowth > 10) growthEmoji = '📈';
  else growthEmoji = '✨';
  
  return {
    growth: Math.round(dailyGrowth),
    daily: `${growthEmoji} +${Math.round(dailyGrowth)}/天`,
  };
}

export async function fetchGitHubTrends(category: Category): Promise<Repo[]> {
  try {
    const url = buildGitHubApiUrl(category);
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error('GitHub API request failed');

    const data = (await response.json()) as GitHubApiResponse;
    const collections = await prisma.collection.findMany({ select: { githubId: true } });
    const collectedIds = new Set(collections.map((c: CollectionIdResult) => c.githubId));

    const repos: Repo[] = data.items.map((item: GitHubRepoItem) => {
      const createdAt = new Date(item.created_at);
      const { growth, daily } = calculateStarGrowth(item.stargazers_count, createdAt);
      
      return {
        githubId: item.id,
        name: item.name,
        fullName: item.full_name,
        owner: item.owner.login,
        avatarUrl: item.owner.avatar_url,
        htmlUrl: item.html_url,
        description: item.description,
        language: item.language,
        stars: item.stargazers_count,
        forks: item.forks_count,
        openIssues: item.open_issues_count,
        createdAt: createdAt,
        updatedAt: new Date(item.updated_at),
        pushedAt: new Date(item.pushed_at),
        isCollected: collectedIds.has(item.id),
        starGrowth: growth,
        dailyGrowth: daily,
      };
    });

    for (const repo of repos) {
      const { isCollected, starGrowth, dailyGrowth, ...repoData } = repo;
      await prisma.project.upsert({
        where: { githubId: repo.githubId },
        update: {
          ...repoData,
          category,
        },
        create: {
          ...repoData,
          category,
        },
      });
    }

    return repos;
  } catch (error) {
    console.error('Fetching from GitHub failed, using cache:', error);
    const projects = await prisma.project.findMany({
      where: { category },
      orderBy: category === 'active' ? { updatedAt: 'desc' } : { stars: 'desc' },
      take: 12,
    });

    const collections = await prisma.collection.findMany({ select: { githubId: true } });
    const collectedIds = new Set(collections.map((c: CollectionIdResult) => c.githubId));

    return projects.map((p: ProjectResult) => {
      const { growth, daily } = calculateStarGrowth(p.stars, p.createdAt);
      return {
        ...p,
        isCollected: collectedIds.has(p.githubId),
        starGrowth: growth,
        dailyGrowth: daily,
      };
    });
  }
}
