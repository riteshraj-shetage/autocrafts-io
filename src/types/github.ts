// src/types/github.ts

import type { ComponentType, CSSProperties } from "react";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface DeveloperProfile {
  login: string;
  name?: string;
  avatarUrl?: string;
  company?: string;
  location?: string;
  bio?: string;
  website?: string;
  createdAt: string;
  followersCount: number | string;
  followingCount: number | string;
  socialLinks?: SocialLinks[];
}

export interface DeveloperStats {
  totalRepos: number | string;
  contributions: number | string;
  totalStars: number | string;
  currentStreak: number;
  longestStreak: number;
}

export interface LanguageStat {
  lang: string;
  percent: number;
  color: string;
}

export interface RepositoryData {
  id: string;
  name: string;
  description: string | null;
  url: string;
  website: string | null;
  stargazerCount: number;
  forksCount: number;
  pushedAt: string;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

export interface SocialLinks {
  provider: string;
  handle: string;
  url: string;
  Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string | undefined; 
}