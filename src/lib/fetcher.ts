import { prisma } from './prisma';
import { format, subDays, differenceInDays } from 'date-fns';

export type TrendCategory = 'all-time' | 'monthly' | 'recently-active' | 'trending';
export type GrowthTier = 'none' | 'rising' | 'hot' | 'explosive';

export interface Project {
  githubId: number;
  name: string;
  fullName: string;
  owner: string;
  ownerAvatar: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  issues: number;
  createdAt: Date;
  pushedAt: Date;
  htmlUrl: string;
  isCollected: boolean;
  // 勋章相关字段
  starsGrowth: number;
  growthTier: GrowthTier;
  growthBadge: {
    icon: string;
    label: string;
    color: string;
  } | null;
}

interface GitHubSearchItem {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  pushed_at: string;
  html_url: string;
}

interface GitHubSearchResponse {
  items: GitHubSearchItem[];
  total_count: number;
}

// 计算 Star 增长率和勋章
function calculateStarGrowth(
  currentStars: number,
  previousStars: number,
  createdAt: Date
): { growth: number; tier: GrowthTier; badge: { icon: string; label: string; color: string } | null } {
  // 如果是新项目（7天内创建）
  const daysSinceCreation = differenceInDays(new Date(), createdAt);
  
  let growth = 0;
  
  if (previousStars > 0) {
    // 基于历史数据计算增长率
    growth = ((currentStars - previousStars) / previousStars) * 100;
  } else if (daysSinceCreation <= 7 && currentStars > 100) {
    // 新项目根据 star 数估算增长速度
    growth = (currentStars / daysSinceCreation) * 10;
  }
  
  // 确定增长等级和勋章
  let tier: GrowthTier = 'none';
  let badge: { icon: string; label: string; color: string } | null = null;
  
  if (growth >= 200) {
    tier = 'explosive';
    badge = { icon: '🚀', label: '爆发增长', color: '#ef4444' };
  } else if (growth >= 100) {
    tier = 'hot';
    badge = { icon: '🔥', label: '热门', color: '#f97316' };
  } else if (growth >= 50) {
    tier = 'rising';
    badge = { icon: '📈', label: '快速上升', color: '#22c55e' };
  } else if (currentStars > 1000 && daysSinceCreation <= 30) {
    // 新项目但增长稳定
    tier = 'rising';
    badge = { icon: '✨', label: '新秀', color: '#8b5cf6' };
  }
  
  return { growth, tier, badge };
}

function formatDateForQuery(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function buildGitHubSearchQuery(category: TrendCategory): string {
  const now = new Date();

  switch (category) {
    case 'all-time':
      return 'stars:>20000';
    case 'monthly':
      const thirtyDaysAgo = formatDateForQuery(subDays(now, 30));
      return `created:>${thirtyDaysAgo}`;
    case 'recently-active':
      const sevenDaysAgo = formatDateForQuery(subDays(now, 7));
      return `pushed:>${sevenDaysAgo}`;
    case 'trending':
      const weekAgo = formatDateForQuery(subDays(now, 7));
      return `created:>${weekAgo}`;
    default:
      return 'stars:>20000';
  }
}

function buildSortParams(category: TrendCategory): { sort: string; order: string } {
  switch (category) {
    case 'all-time':
      return { sort: 'stars', order: 'desc' };
    case 'monthly':
      return { sort: 'stars', order: 'desc' };
    case 'recently-active':
      return { sort: 'updated', order: 'desc' };
    case 'trending':
      return { sort: 'stars', order: 'desc' };
    default:
      return { sort: 'stars', order: 'desc' };
  }
}

async function fetchFromGitHubAPI(category: TrendCategory): Promise<Project[] | null> {
  try {
    const query = buildGitHubSearchQuery(category);
    const { sort, order } = buildSortParams(category);
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=${order}&per_page=20`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(`GitHub API request failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: GitHubSearchResponse = await response.json();

    // 获取当前所有收藏
    const collections = await prisma.collection.findMany({
      select: { githubId: true },
    });
    const collectedIds = new Set(collections.map((c) => c.githubId));

    // 处理每个项目，计算增长率并保存到数据库
    const projects: Project[] = [];

    for (const item of data.items) {
      const createdAt = new Date(item.created_at);
      
      // 查找数据库中是否已有此项目
      const existingProject = await prisma.project.findUnique({
        where: { githubId: item.id },
      });

      const previousStars = existingProject?.stars || 0;
      const { growth, tier, badge } = calculateStarGrowth(
        item.stargazers_count,
        previousStars,
        createdAt
      );

      // Upsert 到数据库
      await prisma.project.upsert({
        where: { githubId: item.id },
        update: {
          stars: item.stargazers_count,
          forks: item.forks_count,
          issues: item.open_issues_count,
          pushedAt: new Date(item.pushed_at),
          description: item.description,
          language: item.language,
          starsPrev: previousStars,
          starsGrowth: growth,
          growthTier: tier,
          cachedAt: new Date(),
        },
        create: {
          githubId: item.id,
          name: item.name,
          fullName: item.full_name,
          owner: item.owner.login,
          ownerAvatar: item.owner.avatar_url,
          description: item.description,
          language: item.language,
          stars: item.stargazers_count,
          forks: item.forks_count,
          issues: item.open_issues_count,
          createdAt: createdAt,
          pushedAt: new Date(item.pushed_at),
          htmlUrl: item.html_url,
          starsPrev: 0,
          starsGrowth: growth,
          growthTier: tier,
        },
      });

      projects.push({
        githubId: item.id,
        name: item.name,
        fullName: item.full_name,
        owner: item.owner.login,
        ownerAvatar: item.owner.avatar_url,
        description: item.description,
        language: item.language,
        stars: item.stargazers_count,
        forks: item.forks_count,
        issues: item.open_issues_count,
        createdAt: createdAt,
        pushedAt: new Date(item.pushed_at),
        htmlUrl: item.html_url,
        isCollected: collectedIds.has(item.id),
        starsGrowth: growth,
        growthTier: tier,
        growthBadge: badge,
      });
    }

    return projects;
  } catch (error) {
    console.error('Error fetching from GitHub API:', error);
    return null;
  }
}

async function fetchFromLocalCache(category: TrendCategory): Promise<Project[]> {
  const now = new Date();
  let whereClause: Record<string, unknown> = {};

  switch (category) {
    case 'all-time':
      whereClause = { stars: { gt: 20000 } };
      break;
    case 'monthly':
      whereClause = {
        createdAt: {
          gt: subDays(now, 30),
        },
      };
      break;
    case 'recently-active':
      whereClause = {
        pushedAt: {
          gt: subDays(now, 7),
        },
      };
      break;
    case 'trending':
      whereClause = {
        createdAt: {
          gt: subDays(now, 7),
        },
      };
      break;
  }

  const projects = await prisma.project.findMany({
    where: whereClause,
    include: {
      collections: true,
    },
    orderBy:
      category === 'recently-active'
        ? { pushedAt: 'desc' }
        : { stars: 'desc' },
    take: 20,
  });

  return projects.map((p) => {
    const { growth, tier, badge } = calculateStarGrowth(
      p.stars,
      p.starsPrev,
      p.createdAt
    );
    
    return {
      githubId: p.githubId,
      name: p.name,
      fullName: p.fullName,
      owner: p.owner,
      ownerAvatar: p.ownerAvatar,
      description: p.description,
      language: p.language,
      stars: p.stars,
      forks: p.forks,
      issues: p.issues,
      createdAt: p.createdAt,
      pushedAt: p.pushedAt,
      htmlUrl: p.htmlUrl,
      isCollected: p.collections.length > 0,
      starsGrowth: p.starsGrowth || growth,
      growthTier: (p.growthTier as GrowthTier) || tier,
      growthBadge: badge,
    };
  });
}

export async function fetchGitHubTrends(category: TrendCategory): Promise<Project[]> {
  // 首先尝试从 GitHub API 获取
  const apiResults = await fetchFromGitHubAPI(category);

  if (apiResults && apiResults.length > 0) {
    return apiResults;
  }

  // 如果 API 失败，回退到本地缓存
  console.log(`Falling back to local cache for category: ${category}`);
  return fetchFromLocalCache(category);
}

// 获取所有收藏的项目
export async function fetchCollectedProjects(): Promise<Project[]> {
  const collections = await prisma.collection.findMany({
    include: {
      project: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return collections.map((c) => {
    const p = c.project;
    const { growth, tier, badge } = calculateStarGrowth(
      p.stars,
      p.starsPrev,
      p.createdAt
    );
    
    return {
      githubId: p.githubId,
      name: p.name,
      fullName: p.fullName,
      owner: p.owner,
      ownerAvatar: p.ownerAvatar,
      description: p.description,
      language: p.language,
      stars: p.stars,
      forks: p.forks,
      issues: p.issues,
      createdAt: p.createdAt,
      pushedAt: p.pushedAt,
      htmlUrl: p.htmlUrl,
      isCollected: true,
      starsGrowth: p.starsGrowth || growth,
      growthTier: (p.growthTier as GrowthTier) || tier,
      growthBadge: badge,
    };
  });
}
