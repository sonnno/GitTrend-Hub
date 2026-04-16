import { format, subDays, differenceInDays } from "date-fns";
import { prisma } from "./prisma";
import type { TrendCategory, GitHubRepo, GitHubSearchResponse, Project, ProjectWithCollection } from "@/types";

export type GrowthBadge = "rocket" | "trending" | "sparkle" | "fire" | null;

export interface ProjectWithBadge extends ProjectWithCollection {
  badge: GrowthBadge;
  growthRate: number;
}

function buildSearchQuery(category: TrendCategory): string {
  const today = new Date();
  
  switch (category) {
    case "all-time":
      return "stars:>20000&sort=stars&order=desc";
    case "monthly":
      const monthlyDate = format(subDays(today, 30), "yyyy-MM-dd");
      return `created:>${monthlyDate}&sort=stars&order=desc`;
    case "active":
      const activeDate = format(subDays(today, 7), "yyyy-MM-dd");
      return `pushed:>${activeDate}&sort=updated&order=desc`;
    case "rising":
      const risingDate = format(subDays(today, 14), "yyyy-MM-dd");
      return `created:>${risingDate}&sort=stars&order=desc`;
    default:
      return "stars:>20000&sort=stars&order=desc";
  }
}

function transformGitHubRepo(repo: GitHubRepo): Omit<Project, "id" | "isCollected"> {
  return {
    githubId: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count,
    language: repo.language,
    ownerLogin: repo.owner.login,
    ownerAvatarUrl: repo.owner.avatar_url,
    createdAt: new Date(repo.created_at),
    updatedAt: new Date(repo.updated_at),
    pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
  };
}

function calculateGrowthBadge(project: Project): { badge: GrowthBadge; growthRate: number } {
  const now = new Date();
  const createdDate = new Date(project.createdAt);
  const daysSinceCreation = Math.max(1, differenceInDays(now, createdDate));
  const starsPerDay = project.stargazersCount / daysSinceCreation;
  
  if (project.stargazersCount >= 100000) {
    return { badge: "fire", growthRate: starsPerDay };
  }
  
  if (daysSinceCreation <= 30 && project.stargazersCount >= 1000) {
    return { badge: "rocket", growthRate: starsPerDay };
  }
  
  if (starsPerDay >= 100) {
    return { badge: "trending", growthRate: starsPerDay };
  }
  
  if (daysSinceCreation <= 7 && project.stargazersCount >= 100) {
    return { badge: "sparkle", growthRate: starsPerDay };
  }
  
  return { badge: null, growthRate: starsPerDay };
}

async function fetchFromGitHub(category: TrendCategory): Promise<Project[]> {
  const query = buildSearchQuery(category);
  const url = `https://api.github.com/search/repositories?q=${query}&per_page=20`;
  
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitTrend-Hub",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubSearchResponse = await response.json();
    
    const projects: Project[] = data.items.map((repo) => ({
      id: 0,
      ...transformGitHubRepo(repo),
    }));

    for (const project of projects) {
      await prisma.project.upsert({
        where: { githubId: project.githubId },
        update: {
          stargazersCount: project.stargazersCount,
          forksCount: project.forksCount,
          description: project.description,
          updatedAt: project.updatedAt,
          pushedAt: project.pushedAt,
        },
        create: {
          githubId: project.githubId,
          name: project.name,
          fullName: project.fullName,
          description: project.description,
          htmlUrl: project.htmlUrl,
          stargazersCount: project.stargazersCount,
          forksCount: project.forksCount,
          language: project.language,
          ownerLogin: project.ownerLogin,
          ownerAvatarUrl: project.ownerAvatarUrl,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          pushedAt: project.pushedAt,
        },
      });
    }

    return projects;
  } catch (error) {
    console.error("Failed to fetch from GitHub:", error);
    return [];
  }
}

async function getLocalCache(category: TrendCategory): Promise<Project[]> {
  const today = new Date();
  
  let projects;
  
  switch (category) {
    case "all-time":
      projects = await prisma.project.findMany({
        where: { stargazersCount: { gte: 20000 } },
        orderBy: { stargazersCount: "desc" },
        take: 20,
      });
      break;
    case "monthly":
      const monthlyDate = subDays(today, 30);
      projects = await prisma.project.findMany({
        where: { createdAt: { gte: monthlyDate } },
        orderBy: { stargazersCount: "desc" },
        take: 20,
      });
      break;
    case "active":
      const activeDate = subDays(today, 7);
      projects = await prisma.project.findMany({
        where: { pushedAt: { gte: activeDate } },
        orderBy: { updatedAt: "desc" },
        take: 20,
      });
      break;
    case "rising":
      const risingDate = subDays(today, 14);
      projects = await prisma.project.findMany({
        where: { createdAt: { gte: risingDate } },
        orderBy: [
          { stargazersCount: "desc" },
          { createdAt: "desc" },
        ],
        take: 20,
      });
      break;
    default:
      projects = await prisma.project.findMany({
        orderBy: { stargazersCount: "desc" },
        take: 20,
      });
  }

  return projects.map((p) => ({
    id: p.id,
    githubId: p.githubId,
    name: p.name,
    fullName: p.fullName,
    description: p.description,
    htmlUrl: p.htmlUrl,
    stargazersCount: p.stargazersCount,
    forksCount: p.forksCount,
    language: p.language,
    ownerLogin: p.ownerLogin,
    ownerAvatarUrl: p.ownerAvatarUrl,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    pushedAt: p.pushedAt,
  }));
}

export async function fetchGitHubTrends(category: TrendCategory): Promise<ProjectWithBadge[]> {
  let projects = await fetchFromGitHub(category);
  
  if (projects.length === 0) {
    projects = await getLocalCache(category);
  }

  const collections = await prisma.collection.findMany({
    select: { githubId: true },
  });
  const collectedIds = new Set(collections.map((c) => c.githubId));

  return projects.map((project) => {
    const { badge, growthRate } = calculateGrowthBadge(project);
    return {
      ...project,
      isCollected: collectedIds.has(project.githubId),
      badge,
      growthRate,
    };
  });
}

export async function toggleCollection(githubId: number): Promise<{ isCollected: boolean }> {
  const existing = await prisma.collection.findUnique({
    where: { githubId },
  });

  if (existing) {
    await prisma.collection.delete({
      where: { githubId },
    });
    return { isCollected: false };
  }

  const project = await prisma.project.findUnique({
    where: { githubId },
  });

  if (project) {
    await prisma.collection.create({
      data: { githubId },
    });
    return { isCollected: true };
  }

  return { isCollected: false };
}

export async function getCollections(): Promise<ProjectWithBadge[]> {
  const collections = await prisma.collection.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  return collections.map((c) => {
    const { badge, growthRate } = calculateGrowthBadge({
      id: c.project.id,
      githubId: c.project.githubId,
      name: c.project.name,
      fullName: c.project.fullName,
      description: c.project.description,
      htmlUrl: c.project.htmlUrl,
      stargazersCount: c.project.stargazersCount,
      forksCount: c.project.forksCount,
      language: c.project.language,
      ownerLogin: c.project.ownerLogin,
      ownerAvatarUrl: c.project.ownerAvatarUrl,
      createdAt: c.project.createdAt,
      updatedAt: c.project.updatedAt,
      pushedAt: c.project.pushedAt,
    });
    
    return {
      id: c.project.id,
      githubId: c.project.githubId,
      name: c.project.name,
      fullName: c.project.fullName,
      description: c.project.description,
      htmlUrl: c.project.htmlUrl,
      stargazersCount: c.project.stargazersCount,
      forksCount: c.project.forksCount,
      language: c.project.language,
      ownerLogin: c.project.ownerLogin,
      ownerAvatarUrl: c.project.ownerAvatarUrl,
      createdAt: c.project.createdAt,
      updatedAt: c.project.updatedAt,
      pushedAt: c.project.pushedAt,
      isCollected: true,
      badge,
      growthRate,
    };
  });
}
