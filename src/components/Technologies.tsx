import type { LanguageStat } from "../types/github";

type TechnologiesProps = {
  languageData: LanguageStat[];
};

export default function TechnologiesSec({ languageData }: TechnologiesProps) {
  if (!languageData || languageData.length === 0) return null;

  return (
    <div className="border border-border bg-background">
      
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="mb-3 font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
          Top Languages
        </div>
        
        <div className="flex h-2.5 w-full border border-border overflow-hidden bg-muted">
          {languageData.map(({ lang, percent, color }) => (
            <div
              key={lang}
              style={{ flex: `${percent} 0 0%`, backgroundColor: color }}
              role="img"
              aria-label={`${lang} ${Math.round(percent)}%`}
              title={`${lang} ${Math.round(percent)}%`}
              className="transition-opacity hover:opacity-80 cursor-default"
            />
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
          {languageData.map(({ lang, percent, color }) => (
            <div 
              key={lang} 
              className="group flex items-center justify-between gap-4 sm:gap-6 px-2 py-1.5 -mx-2 hover:bg-muted transition-colors cursor-default"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span 
                  className="w-2 h-2 shrink-0" 
                  style={{ backgroundColor: color }} 
                />
                <span className="font-mono text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {lang}
                </span>
              </div>
              <span className="font-mono text-xs sm:text-sm tabular-nums text-muted-foreground group-hover:text-foreground transition-colors">
                {String(Math.round(percent)).padStart(2, "0")}%
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}