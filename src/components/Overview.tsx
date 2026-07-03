import { Building2, MapPin, Users } from "lucide-react";
import ContributionUptime from "./Uptime";
import type { DeveloperProfile, ContributionDay } from "../types/github";
import { initials } from "../lib/utils/getInitials";

type OverviewProps = {
  profile: DeveloperProfile;
  contributions: ContributionDay[];
};

export default function Overview({ profile, contributions }: OverviewProps) {
  const displayName = profile.name || profile.login;
  const fallbackInitials = initials(profile.name || profile.login);

  return (
    <div className="border border-border p-4 md:py-6 md:px-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch bg-background min-w-0">
        
      <div className="md:col-span-3 flex flex-row md:flex-col items-start md:items-stretch gap-3 min-w-0">
        
        <div className="relative shrink-0 self-start md:self-auto">
          <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-46 md:w-46 border border-border flex items-center justify-center font-mono text-xl md:text-2xl font-bold text-muted-foreground shrink-0 overflow-hidden bg-background">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <span>{fallbackInitials}</span>
            )}
          </div>
        </div>

        <dl className="flex-1 md:w-full text-[12px] sm:text-[13px] divide-y divide-border min-w-0 overflow-hidden">
          
          {profile.socialLinks.map(({ handle, url, Icon }) => (
            <div key={url} className="flex font-mono items-center gap-1.5 sm:gap-2 py-1 sm:py-1.5 min-w-0">
              <dt className="flex items-center text-muted-foreground shrink-0">
                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              </dt>
              <dd className="text-foreground truncate min-w-0">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline focus:outline-none focus:ring-1 focus:ring-border truncate block"
                  title={url}
                >
                  {handle}
                </a>
              </dd>
            </div>
          ))}

          <div className="flex flex-row flex-wrap items-center py-1.5 sm:py-2 text-[12px] sm:text-[13px]">
            
            <a 
              href={`https://github.com/${profile.login}?tab=followers`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 shrink-0"
            >
              <Users className="w-3 h-3 text-muted-foreground shrink-0 mr-1" />
              <span className="text-foreground font-semibold tabular-nums">
                {profile.followersCount}
              </span>
              <span className="text-muted-foreground hover:underline hover:text-foreground/80 whitespace-nowrap">
                followers
              </span>
            </a>
            
            <a 
              href={`https://github.com/${profile.login}?tab=following`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 shrink-0"
            >
              <span className="w-3 h-3 shrink-0 mr-1" aria-hidden="true" />
              <span className="text-foreground font-semibold tabular-nums">
                {profile.followingCount}
              </span>
              <span className="text-muted-foreground hover:underline hover:text-foreground/80 whitespace-nowrap">
                following
              </span>
            </a>
            
          </div>
        </dl>
      </div>

      <div className="md:col-span-9 flex flex-col h-full min-w-0 overflow-hidden">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <div className="flex-1 min-w-0">
            <h1 className="py-1 text-2xl sm:text-3xl font-bold text-foreground leading-[0.95] tracking-tight md:text-4xl truncate">
              {displayName}
            </h1>
            
            <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-4 font-mono text-[11px] sm:text-xs text-muted-foreground">
              {profile.company && (
                <span className="text-terminal-fg flex items-center min-w-0">
                  <Building2 size={15} className="text-muted-foreground mr-1.5 shrink-0"/>
                  <span className="truncate">{profile.company}</span>
                </span>
              )}
              
              {profile.location && (
                <span className="text-terminal-fg flex items-center min-w-0">
                  <MapPin size={15} className="text-muted-foreground mr-1.5 shrink-0"/>
                  <span className="truncate">{profile.location}</span>
                </span>
              )}
            </div>

            {profile.bio && (
              <div className="mt-4 border border-border p-2 sm:p-3">
                <p className="font-mono text-[12px] sm:text-xs text-muted-foreground leading-relaxed w-full max-w-3xl line-clamp-3">
                  <span className="text-terminal-green font-bold mr-2">&gt;</span>
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-auto min-w-0">
          <ContributionUptime contributions={contributions} />
        </div>
      </div>

    </div>
  );
}