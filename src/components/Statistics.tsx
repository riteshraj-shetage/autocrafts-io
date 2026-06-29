type StatisticsProps = {
  totalRepos: number;
  contributions: number;
  totalStars: number;
  since: number;
};

export default function Statistics({
  totalRepos,
  contributions,
  totalStars,
  since,
}: StatisticsProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {[
          { label: "Total Contributions", value: contributions.toLocaleString() },
          { label: "Repositories [Public]", value: totalRepos },
          { label: "Stars Earned", value: totalStars.toLocaleString() },
          { label: "Building Since", value: since },
        ].map(({ label, value }) => (
          <div 
            key={label} 
            className="border border-border hover:bg-terminal-bg transition-colors px-3 py-3 sm:px-4 sm:py-4 -mr-px -mb-px flex flex-col justify-between"
          >
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider leading-tight sm:leading-normal">
              {label}
            </p>
            <p className="font-mono text-xl sm:text-2xl font-bold text-foreground mt-2 sm:mt-3">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}