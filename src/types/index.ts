export type TrendCategory = "all-time" | "monthly" | "active" | "rising";

export interface GitHubOwner {
  login: string;
  avatar_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: GitHubOwner;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export interface Project {
  id: number;
  githubId: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stargazersCount: number;
  forksCount: number;
  language: string | null;
  ownerLogin: string;
  ownerAvatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date | null;
  isCollected?: boolean;
}

export interface ProjectWithCollection extends Project {
  isCollected: boolean;
}

export type GrowthBadge = "rocket" | "trending" | "sparkle" | "fire" | null;

export interface ProjectWithBadge extends ProjectWithCollection {
  badge: GrowthBadge;
  growthRate: number;
}
