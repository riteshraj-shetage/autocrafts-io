import { GitFork, Star, Check, Share2 } from "lucide-react";
import { useState, useEffect, type SubmitEvent } from "react";

type NavbarProps = {
  username: string;
  starsCount?: string | number;
  forkCount?: string | number;
  onSearch?: (username: string) => void;
  onReset?: () => void;
};

export default function Navbar({ username, starsCount, forkCount, onSearch }: NavbarProps) {
  const [copied, setCopied] = useState(false);
  const [inputValue, setInputValue] = useState(username);

  useEffect(() => {
    setInputValue(username);
  }, [username]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleSearchSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && onSearch && trimmed !== username) {
      onSearch(trimmed);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3 gap-3">
        
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-sm sm:text-base tracking-tight shrink-0 flex-1 min-w-0">
          <a 
            href="/"
            className="group relative shrink-0 text-white opacity-80 hover:opacity-100 transition-opacity" 
            aria-label="riteshraj-shetage"
          >
            <svg viewBox="10 51 100 100" className="h-5 w-5 sm:h-6 sm:w-6 fill-current">
              <path d="M80,100L76,100L76,114L72,114L72,120L68,120L68,124L64,124L64,140L68,140L68,144L60,144L60,132L56,132L56,128L52,128L52,132L48,132L48,136L44,136L44,140L48,140L48,144L40,144L40,128L36,128L36,124L32,124L32,120L28,120L28,116L24,116L24,112L20,112L20,88L24,88L24,96L28,96L28,100L32,100L32,104L40,104L40,100L44,100L44,96L50,96L50,92L56,92L56,88L60,88L60,62L64,62L64,58L96,58L96,62L100,62L100,80L80,80L80,84L92,84L92,88L76,88L76,96L84,96L84,104L80,104L80,100Z M68,64L68,68L72,68L72,64L68,64Z"/>
            </svg>
          </a>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1 min-w-0 flex-1">
            <span className="text-foreground/80 select-none font-bold">@</span>
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                placeholder="github-username"
                spellCheck={false}
                className="bg-transparent border-b border-muted py-0.5 text-foreground focus:outline-none focus:border-terminal-green transition-colors truncate tracking-wider font-bold text-xs sm:text-sm placeholder:text-muted-foreground/40"
              />
            </div>
          </form>

        </div>

        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <a
            href="https://github.com/riteshraj-shetage/autocrafts-io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center border border-border font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all"
          >
            <div className="flex items-center gap-1.5 bg-muted px-2 py-1.5 group hover:bg-muted hover:text-foreground transition-colors">
              <Star className="w-3.5 h-3.5 text-muted-foreground group-hover:text-amber-400 group-hover:fill-amber-400" />
              <span className="hidden sm:inline">Star</span>
            </div>
            <div className="hidden sm:flex border-l border-border bg-muted/50 px-3 py-1.5 font-bold text-foreground/80">
              {starsCount}
            </div>
          </a>

          <a
            href="https://github.com/riteshraj-shetage/autocrafts-io/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center border border-border font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all"
          >
            <div className="flex items-center gap-1.5 bg-muted px-2 py-1.5 hover:text-foreground">
              <GitFork className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fork</span>
            </div>
            <div className="hidden sm:flex border-l border-border bg-muted/50 px-3 py-1.5 font-bold text-foreground/80">
              {forkCount}
            </div>
          </a>
          
          <button
            onClick={handleCopy}
            className="inline-flex items-center font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 sm:py-1.5 shrink-0 hover:cursor-pointer"
            title="Copy link"
          >
            <div className="group relative">
              {copied ? <Check className="w-4 h-4 text-terminal-green" /> : <Share2 className="w-4 h-4" />}
            </div>
          </button>
        </div>

      </div>
    </nav>
  );
}