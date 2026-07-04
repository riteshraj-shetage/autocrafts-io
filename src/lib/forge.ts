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
  const nodes = rawData.user?.repositories?.nodes || [];
  const langMap: Record<string, { score: number; color: string }> = {};
  let totalScore = 0;

  const IGNORED_LANGUAGES = new Set(["HTML", "CSS", "JavaScript", "SCSS", "Sass", "Less"]);

  nodes.forEach((repo: any) => {
    if (!repo.languages || !repo.languages.edges) return;

    const sortedEdges = [...repo.languages.edges].sort((a: any, b: any) => b.size - a.size);
    const validEdges = sortedEdges.filter((edge: any) => !IGNORED_LANGUAGES.has(edge.node.name));

    validEdges.forEach((edge: any, index: number) => {
      const name = edge.node.name;
      const color = edge.node.color;

      const weight = 1 / Math.pow(2, index); 

      if (!langMap[name]) {
        langMap[name] = { score: 0, color: color };
      }
      
      langMap[name].score += weight;
      totalScore += weight;
    });
  });

  if (totalScore === 0) return [];

  const stats: LanguageStat[] = Object.keys(langMap)
    .map(name => ({
      lang: name,
      percent: (langMap[name].score / totalScore) * 100,
      color: langMap[name].color
    }))
    .sort((a, b) => b.percent - a.percent);

  return stats.slice(0, 6);
}

export function forgeRepositories(rawData: any): RepositoryData[] {
  const nodes = rawData.user.repositories.nodes;

  return nodes.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.url,
    website: repo.homepageUrl,
    stargazerCount: repo.stargazerCount,
    forksCount: repo.forkCount,
    pushedAt: repo.pushedAt,
    primaryLanguage: repo.primaryLanguage 
      ? { name: repo.primaryLanguage.name, color: repo.primaryLanguage.color }
      : null,
  }));
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