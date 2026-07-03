import { ArrowUpRight } from "lucide-react";
import type { SocialLinks } from "../types/github";
import { isColorDark } from "../lib/utils/isColorDark";

type ConnectProps = {
  socialLinks: SocialLinks[];
};

export default function ConnectSec({ socialLinks }: ConnectProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
      {socialLinks.map(({ provider, handle, url, Icon, color }) => (
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
      
      {socialLinks.length % 2 === 1 && (
        <div className="bg-background hidden md:block -mr-px -mb-px" aria-hidden />
      )}
    </div>
  );
}