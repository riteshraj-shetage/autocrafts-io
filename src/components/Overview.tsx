import { Building2, CalendarDays, MapPin, Users } from "lucide-react";
import Calendar from "./Calendar";
import type { DeveloperProfile, ContributionDay } from "../types/github";

type OverviewProps = {
  profile: DeveloperProfile;
  contributions: ContributionDay[];
};

export default function Overview({ profile, contributions }: OverviewProps) {
  const displayName = profile.name || profile.login;
  const fallbackInitials = profile.login.substring(0, 2).toUpperCase();

  return (
    <section className="relative pt-4 sm:pt-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch">
        
        <div className="md:col-span-3 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
          
          <div className="relative shrink-0">
            
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-muted-foreground z-10" />
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-muted-foreground z-10" />
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-muted-foreground z-10" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-muted-foreground z-10" />

            <div 
              className="h-28 w-28 md:h-44 md:w-44 flex items-center justify-center font-mono text-xl md:text-2xl font-bold text-muted-foreground shrink-0 overflow-hidden bg-background"
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={displayName} className="h-full w-full object-cover grayscale" />
              ) : (
                <span>{fallbackInitials}</span>
              )}
            </div>
          </div>

          <dl className="flex-1 md:w-full md:mt-4 font-mono text-[10px] sm:text-[11px] divide-y divide-border border-b border-border">
            <div className="flex items-center justify-between py-1.5 sm:py-2">
              <dt className="flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
                <CalendarDays className="w-3 h-3 hidden sm:block" />
                Joined
              </dt>
              <dd className="text-foreground font-bold">{profile.createdAt}</dd>
            </div>

            <div className="flex items-center justify-between py-1.5 sm:py-2">
              <dt className="flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
                <Users className="w-3 h-3 hidden sm:block" />
                Followers
              </dt>
              <dd className="text-foreground font-bold">{profile.followersCount}</dd>
            </div>
            
            <div className="flex items-center justify-between py-1.5 sm:py-2">
              <dt className="flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
                <Users className="w-3 h-3 opacity-0 hidden sm:block" /> 
                Following
              </dt>
              <dd className="text-foreground font-bold">{profile.followingCount}</dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-9 flex flex-col h-full min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-[0.95] tracking-tight md:text-4xl truncate">
                {displayName}
              </h1>
              
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-y-1 gap-x-2 font-mono text-[11px] sm:text-xs text-muted-foreground">
                <span className="text-terminal-fg">@{profile.login}</span>
                
                {profile.company && (
                  <>
                    <span className="text-border font-bold hidden sm:inline">/</span>
                    <span className="text-terminal-fg flex items-center">
                      <Building2 size={14} className="text-muted-foreground mr-1 sm:mr-1.5 sm:w-[18px] sm:h-[18px]"/>
                      {profile.company}
                    </span>
                  </>
                )}
                
                {profile.location && (
                  <>
                    <span className="text-border font-bold hidden sm:inline">/</span>
                    <span className="text-terminal-fg flex items-center">
                      <MapPin size={14} className="text-muted-foreground mr-1 sm:mr-1.5 sm:w-[18px] sm:h-[18px]"/>
                      {profile.location}
                    </span>
                  </>
                )}
              </div>

              {profile.bio && (
                <p className="mt-3 sm:mt-4 border-l-2 border-border pl-2.5 py-0.5 text-[11px] sm:text-xs font-mono text-muted-foreground leading-relaxed w-full max-w-3xl line-clamp-3">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-auto w-full pt-4 sm:pt-0">
            <Calendar contributions={contributions} />
          </div>
        </div>

      </div>
    </section>
  );
}