type StatisticsProps = {
  totalRepos: number | string;
  contributions: number | string;
  totalStars: number | string;
  currentStreak: number | string;
};

export default function Statistics({
  totalRepos,
  contributions,
  totalStars,
  currentStreak,
}: StatisticsProps) {
  const isAllZero = [totalRepos, contributions, totalStars, currentStreak].every(
    (val) => Number(val) === 0 || !val
  );

  if (isAllZero) return null;
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4">
  {[
    { label: "Total Contributions", value: contributions.toLocaleString(), accent: "text-terminal-green" },
    { label: "Repositories [Public]", value: totalRepos, accent: "text-foreground" },
    { label: "Stars Earned", value: totalStars.toLocaleString(), accent: "text-terminal-amber" },
    { label: "Current Streak", value: currentStreak, accent: "text-foreground" },
  ].map(({ label, value, accent }) => (
    <div 
      key={label} 
      className="border border-border hover:bg-terminal-bg transition-colors px-3 py-3 sm:px-4 sm:py-4 -mr-px -mb-px flex flex-col justify-between group"
    >
      <p className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider leading-tight sm:leading-normal">
        {label}
      </p>
      <p className={`font-mono text-xl sm:text-2xl font-bold mt-2 sm:mt-3 ${accent}`}>
        {value}
      </p>
    </div>
  ))}
</div>
    </div>
  );
}