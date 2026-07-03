import { type ReactNode, type ComponentType, Activity } from "react";
import { ChartLine, Code2, FolderOpen, Link2, User } from "lucide-react";

import Layout from "../components/layout/Layout";
import Overview from "../components/Overview";
import Statistics from "../components/Statistics";
import Repositories from "../components/Repositories";
import Technologies from "../components/Technologies";
import Connect from "../components/Connect"; 

import rawTelemetry from "../data/sourced.json";

import {
  forgeProfile,
  forgeStats,
  forgeContributions,
  forgeLanguages,
  forgeRepositories,
  forgeSocialLinks,
  getCounts
} from "../lib/forge";
import ActivityPulse from "../components/Uptime";

function ProfileSection({ icon: Icon, title, children }: { icon: ComponentType<{ className?: string }>; title: string; children: ReactNode }) {
  return (
    <section className="mt-10 sm:mt-16">
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="h-px flex-1 bg-border" />
        <h2 className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-foreground shrink-0 text-right">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function Profile() {
  const profile = forgeProfile(rawTelemetry);
  const contributions = forgeContributions(rawTelemetry);
  const stats = forgeStats(rawTelemetry);
  const repositories = forgeRepositories(rawTelemetry);
  const languages = forgeLanguages(rawTelemetry);
  const socialLinks = forgeSocialLinks(rawTelemetry);
  const { totalStars, totalForks } = getCounts(rawTelemetry);

  return (
    <Layout username={profile.login} starsCount={totalStars} forkCount={totalForks}>
      <div className="pb-10 sm:pb-16">
        <ProfileSection icon={User} title="Overview">
          <Overview 
          profile={profile} 
          contributions={contributions}
        />
        </ProfileSection>

        <ProfileSection icon={ChartLine} title="Stats">
          <Statistics
            totalRepos={stats.totalRepos}
            contributions={stats.contributions}
            totalStars={stats.totalStars}
            currentStreak={stats.currentStreak}
          />
        </ProfileSection>

        <ProfileSection icon={FolderOpen} title="Signature Work">
          <Repositories repositories={repositories} />
        </ProfileSection>

        <ProfileSection icon={Code2} title="Tech Stack">
          <Technologies languageData={languages} />
        </ProfileSection>
        
        <ProfileSection icon={Link2} title="Connect">
          <Connect socialLinks={socialLinks} />
        </ProfileSection>

      </div>
    </Layout>
  );
}