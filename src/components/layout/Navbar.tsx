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
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative shrink-0 opacity-80 hover:opacity-100 transition-opacity" 
            aria-label="riteshraj-shetage"
          >
            <img src="/favicon.svg" alt="riteshraj-shetage" className="h-5 w-5 sm:h-6 sm:w-6" />
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
                className="w-full bg-transparent border-b border-transparent py-0.5 text-foreground focus:outline-none transition-colors truncate tracking-wider font-bold text-xs sm:text-sm placeholder:text-muted-foreground/40"
              />
            </div>
          </form>

        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <a
            href="https://github.com/riteshraj-shetage/autocrafts-io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center border border-border font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all"
            title="Give a star to 'autocrafts-io' on GitHub"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 bg-muted px-2 py-1 sm:px-3 sm:py-1.5 group hover:bg-muted hover:text-foreground transition-colors">
              <Star className="w-3.5 h-3.5 text-muted-foreground group-hover:text-amber-400 group-hover:fill-amber-400" />
              <span className="hidden sm:inline">Star</span>
            </div>
            
            <div className="border-l border-border bg-muted/50 px-2 py-1 sm:px-3 sm:py-1.5 font-bold text-foreground/80 transition-colors">
              {starsCount}
            </div>
          </a>

          <a
            href="https://github.com/riteshraj-shetage/autocrafts-io/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center border border-border font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all"
            title="Create a fork of 'autocrafts-io'"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 bg-muted px-2 py-1 sm:px-3 sm:py-1.5 group hover:bg-muted hover:text-foreground transition-colors">
              <GitFork className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
              <span className="hidden sm:inline">Fork</span>
            </div>
            
            <div className="border-l border-border bg-muted/50 px-2 py-1 sm:px-3 sm:py-1.5 font-bold text-foreground/80 transition-colors">
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