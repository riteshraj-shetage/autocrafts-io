import { ArrowUpRight, Globe } from "lucide-react";
import { extractSocialIdentity, type SocialIdentity } from "../lib/socialProvider";
import type { SocialLink } from "../types/github";
import { SiGithub } from "react-icons/si";
import { isColorDark } from "../lib/isColorDark";

type ConnectProps = {
  username: string;
  website?: string | null;
  socialLinks: SocialLink[];
};

export default function ConnectSec({ username, website, socialLinks }: ConnectProps) {
  
  const links: SocialIdentity[] = [];

  links.push({
    provider: "GitHub",
    Icon: SiGithub,
    color: undefined,
    handle: `@${username}`,
    url: `https://github.com/${username}`,
  });
  
  if (website) {
    links.push({
      provider: "Website",
      Icon: Globe,
      color: undefined,
      handle: website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      url: website,
    });
  }

  const rawUrls: string[] = [];
  socialLinks.forEach(link => rawUrls.push(link.url));

  links.push(...rawUrls.map(extractSocialIdentity));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
      {links.map(({ provider, handle, url, Icon, color }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-background p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-muted transition-colors border border-border -mr-px -mb-px"
        >
          <div 
            className="flex items-center justify-center w-8 h-8 border border-muted-foreground/80 transition-colors shrink-0 bg-background"
             style={color ? { ...(!isColorDark(color) ? { borderColor: color } : {}), backgroundColor: color + "50" } : undefined}
          >
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {provider}
            </span>
            <span className="font-mono text-xs sm:text-sm text-foreground truncate mt-0.5 sm:mt-1">
              {handle}
            </span>
          </div>
          
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" />
        </a>
      ))}
      
      {links.length % 2 === 1 && (
        <div className="bg-background hidden md:block border border-border -mr-px -mb-px" aria-hidden />
      )}
    </div>
  );
}