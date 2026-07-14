import type { 
  DeveloperProfile, 
  ContributionDay, 
  ContributionLevel, 
  DeveloperStats, 
  LanguageStat, 
  RepositoryData, 
  SocialLinks, 
} from "../types/github";
import { fmtNum } from "./utils/fmtNum";
import { extractSocialLinks } from "./socialProvider";
import { SiGithub } from "react-icons/si";
import { Globe } from "lucide-react";

export function forgeProfile(rawData: any): DeveloperProfile {
  const user = rawData.user;
  const website = user.websiteUrl?.startsWith("http") 
    ? user.websiteUrl 
    : `https://${user.websiteUrl}`;

  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    company: user.company,
    location: user.location,
    bio: user.bio,
    createdAt: new Date(user.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).replace(',', ''),    
    website: website,
    followersCount: fmtNum(user.followers.totalCount),
    followingCount: fmtNum(user.following.totalCount),
    socialLinks: forgeSocialLinks(rawData),
  };
}

export function forgeContributions(rawData: any): ContributionDay[] {
  const weeks = (rawData.user.recentActivity || rawData.user.contributionsCollection)?.contributionCalendar?.weeks || [];
  const days: ContributionDay[] = [];

  weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      let level: ContributionLevel = 0;
      switch (day.contributionLevel) {
        case "NONE": level = 0; break;
        case "FIRST_QUARTILE": level = 1; break;
        case "SECOND_QUARTILE": level = 2; break;
        case "THIRD_QUARTILE": level = 3; break;
        case "FOURTH_QUARTILE": level = 4; break;
      }

      days.push({
        date: day.date,
        count: day.contributionCount,
        level: level,
      });
    });
  });

  return days;
}

export function computeStreaks(
  days: ContributionDay[]
): { currentStreak: number; longestStreak: number } {
  const MS_PER_DAY = 86_400_000;
  
  const activeDates = days
    .filter(day => day.count > 0)
    .map(day => day.date)
    .sort();

  if (activeDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < activeDates.length; i++) {
    const curr = new Date(activeDates[i]).getTime();
    const prev = new Date(activeDates[i - 1]).getTime();
    const diffDays = Math.round((curr - prev) / MS_PER_DAY);

    if (diffDays === 1) {
      run++;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 1;
    }
  }

  let currentStreak = 1;
  for (let i = activeDates.length - 1; i > 0; i--) {
    const curr = new Date(activeDates[i]).getTime();
    const prev = new Date(activeDates[i - 1]).getTime();
    const diffDays = Math.round((curr - prev) / MS_PER_DAY);

    if (diffDays === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDate = new Date(activeDates[activeDates.length - 1]);
  lastDate.setHours(0, 0, 0, 0);
  
  const diffFromToday = Math.round((today.getTime() - lastDate.getTime()) / MS_PER_DAY);
  
  if (diffFromToday > 1) {
    currentStreak = 0; 
  }

  return { currentStreak, longestStreak };
}

export function forgeStats(rawData: any): DeveloperStats {
  const user = rawData.user;

  const totalStars = user.repositories.nodes.reduce(
    (acc: number, repo: any) => acc + repo.stargazerCount, 
    0
  );

  const allDays = forgeContributions(rawData);
  const { currentStreak, longestStreak } = computeStreaks(allDays);

  const totalCommits = (user.yearlyStats || user.contributionsCollection)?.contributionCalendar?.totalContributions || 0;

  return {
    totalRepos: fmtNum(user.repositories.totalCount),
    contributions: fmtNum(totalCommits),
    totalStars: fmtNum(totalStars),
    currentStreak,
    longestStreak,
  };
}


export function forgeLanguages(rawData: any): LanguageStat[] {
  const MARKUP_LANGS = new Set(["HTML", "CSS", "SCSS", "Sass", "Less", "Makefile", "Dockerfile"]);
  const nodes = rawData?.user?.repositories?.nodes || [];
  const langMap: Record<string, { score: number; color: string }> = {};
  let totalGlobalScore = 0;

  nodes.forEach((repo: any) => {
    const edges = repo?.languages?.edges;
    if (!edges || edges.length === 0) return;

    let validEdges = edges.filter((e: any) => e?.node?.name && !MARKUP_LANGS.has(e.node.name));
    
    if (validEdges.length === 0) {
      validEdges = edges.filter((e: any) => e?.node?.name);
    }

    const repoTotalBytes = validEdges.reduce((sum: number, e: any) => sum + (e.size || 0), 0);
    if (repoTotalBytes === 0) return;

    const stars = repo.stargazerCount || 0;
    const repoImportanceMultiplier = 1 + Math.min(stars, 20) * 0.5;

    validEdges.forEach((edge: any) => {
      const { name, color } = edge.node;
      const byteShare = (edge.size || 0) / repoTotalBytes;
      const weightedScore = byteShare * repoImportanceMultiplier;

      if (!langMap[name]) {
        langMap[name] = { score: 0, color: color || "#8b949e" };
      }
      
      langMap[name].score += weightedScore;
      totalGlobalScore += weightedScore;
    });
  });

  if (totalGlobalScore === 0) return [];

return Object.entries(langMap)
  .map(([name, data]) => ({
    lang: name,
    percent: Math.round((data.score / totalGlobalScore) * 100),
    color: data.color,
  }))
  .filter(stat => stat.percent >= 1)
  .sort((a, b) => b.percent - a.percent)
  .slice(0, 6);
}

export function forgeRepositories(rawData: any): RepositoryData[] {
  const nodes = rawData?.user?.repositories?.nodes || [];

  const mappedRepos: RepositoryData[] = nodes.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.url,
    website: repo.homepageUrl,
    stargazerCount: repo.stargazerCount || 0,
    forksCount: repo.forkCount || 0,
    pushedAt: repo.pushedAt,
    primaryLanguage: repo.primaryLanguage 
      ? { name: repo.primaryLanguage.name, color: repo.primaryLanguage.color }
      : null,
  }));

  return mappedRepos
    .sort((a, b) => {
      if (b.stargazerCount !== a.stargazerCount) {
        return b.stargazerCount - a.stargazerCount;
      }
      const timeA = a.pushedAt ? new Date(a.pushedAt).getTime() : 0;
      const timeB = b.pushedAt ? new Date(b.pushedAt).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 6);
}

export function forgeSocialLinks(rawData: any): SocialLinks[] {
  const user = rawData?.user || {};
  const username = user.login || user.username; 
  const website = user.websiteUrl 
    ? (user.websiteUrl.startsWith("http") ? user.websiteUrl : `https://${user.websiteUrl}`) 
    : undefined;  
  
  const socialNodes = user.socialAccounts?.nodes || [];
  const links: SocialLinks[] = [];

  if (username) {
    links.push({
      provider: "GitHub",
      Icon: SiGithub,
      color: undefined,
      handle: `@${username}`,
      url: `https://github.com/${username}`,
    });
  }

  if (website) {
    links.push({
      provider: "Website",
      Icon: Globe,
      color: undefined,
      handle: website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      url: website,
    });
  }

  const rawUrls: string[] = socialNodes
    .map((node: any) => node.url)
    .filter(Boolean);

  if (rawUrls.length > 0) {
    links.push(...rawUrls.map(extractSocialLinks));
  }

  return links;
}

export function getCounts(rawData: any) {
  return {
    totalStars: rawData?.repository?.stargazerCount ?? 0,
  };
}