import { ArrowUpRight, Star, GitFork } from "lucide-react";
import type { RepositoryData } from "../types/github";
import { fmtNum } from "../lib/utils/fmtNum";

type RepositoriesProps = {
  repositories: RepositoryData[];
};

export default function Repositories({ repositories }: RepositoriesProps) {
  if (!repositories || repositories.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
      {repositories.map((repo) => {
        const topLangName = repo.primaryLanguage?.name;
        const topLangColor = repo.primaryLanguage?.color; 
        
        return (
          <a
            key={repo.id}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-background p-3 sm:p-4 group hover:bg-muted transition-colors flex flex-col justify-between border border-border -mr-px -mb-px"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 
                className="font-mono text-sm font-bold text-foreground line-clamp-2" 
                title={repo.name}
              >
                {repo.name}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" />
            </div>

            {repo.description && (
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                {repo.description}
              </p>
            )}

            <div className="mt-4 flex items-center gap-4 sm:gap-6 font-mono text-[11px] sm:text-xs text-muted-foreground flex-wrap">
              {topLangName && 
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 shrink-0"
                    style={{ backgroundColor: topLangColor || 'transparent' }}
                  />
                  <span className="truncate max-w-25 sm:max-w-38">{topLangName}</span>
                </span>
              }

              {repo.stargazerCount > 0 && (
                <span className="flex items-center"><Star className="w-3 h-3 mb-0.5 mr-1 shrink-0"/>{fmtNum(repo.stargazerCount)}</span>
              )}

              {repo.forksCount > 0 && (
                <span className="flex items-center"><GitFork className="w-3 h-3 mb-0.5 mr-1 shrink-0"/>{fmtNum(repo.forksCount)}</span>
              )}
            </div>
          </a>
        );
      })}
      {repositories.length % 2 === 1 && (
        <div className="bg-background hidden md:block -mr-px -mb-px" aria-hidden />
      )}
    </div>
  );
}