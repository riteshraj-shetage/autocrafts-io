import { useState, type ReactNode, type ComponentType, useEffect } from "react";
import { ChartLine, Code2, CornerDownLeft, FolderOpen, Link2, User } from "lucide-react";

import Layout from "../components/layout/Layout";
import Overview from "../components/Overview";
import Statistics from "../components/Statistics";
import Repositories from "../components/Repositories";
import Technologies from "../components/Technologies";
import Connect from "../components/Connect"; 

import { useDeveloper } from "../hooks/useDeveloper";

import {
  forgeProfile,
  forgeStats,
  forgeContributions,
  forgeLanguages,
  forgeRepositories,
  forgeSocialLinks,
  getCounts
} from "../lib/forge";

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
  const [searchedUser, setSearchedUser] = useState<string | null>(null);
  const { rawTelemetry, loading, error } = useDeveloper(searchedUser);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const urlUser = params.get("u");
      setSearchedUser(urlUser ? urlUser.trim() : null);
    };

    handleUrlChange();

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const handleSearch = (username: string) => {
    setSearchedUser(username);
    window.history.pushState({}, "", `/?u=${username}`);
  };

  const handleReset = () => {
    setSearchedUser(null);
    window.history.pushState({}, "", "/");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs text-muted-foreground tracking-widest bg-background">
        <div className="flex items-center gap-3 border border-border px-4 py-3">
          <div className="w-2 h-2 bg-terminal-green animate-ping" />
          <span>Loading @{searchedUser}</span>
        </div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center font-mono text-xs bg-background p-4">
      <div className="border border-border p-6 max-w-sm w-full text-left">
        <div className="flex items-center justify-start gap-2 border-b border-border pb-3 mb-3">
          <span className="h-1.5 w-1.5 bg-red-500 inline-block" />
          <span className="uppercase tracking-widest font-bold text-foreground">ERR // REQUEST_FAILED</span>
        </div>
        <p className="text-muted-foreground text-[12px] leading-relaxed mb-6">
          {error}
        </p>
        <button 
          onClick={handleReset}
          className="w-full py-2 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors uppercase tracking-widest text-xs font-bold"
        >
          Return 
          <CornerDownLeft className="inline-block w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  );
}

  const profile = forgeProfile(rawTelemetry);
  const contributions = forgeContributions(rawTelemetry);
  const stats = forgeStats(rawTelemetry);
  const repositories = forgeRepositories(rawTelemetry);
  const languages = forgeLanguages(rawTelemetry);
  const socialLinks = forgeSocialLinks(rawTelemetry);
  const { totalStars } = getCounts(rawTelemetry);

  return (
    <Layout 
      username={profile.login} 
      starsCount={totalStars} 
      onSearch={handleSearch}
      onReset={handleReset}
    >
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