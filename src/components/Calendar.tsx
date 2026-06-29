export type ContributionDay = {
  date: string; // Format: YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type NativeLedgerProps = {
  contributions: ContributionDay[];
};

export default function Calendar({ contributions }: NativeLedgerProps) {
  if (!contributions || contributions.length === 0) return null;

  const firstDateStr = contributions[0].date.split("-");
  const firstDate = new Date(Date.UTC(+firstDateStr[0], +firstDateStr[1] - 1, +firstDateStr[2]));
  const startDayOfWeek = firstDate.getUTCDay();

  const emptyCells = Array.from({ length: startDayOfWeek }).map((_, i) => (
    <div key={`empty-${i}`} className="w-2 h-2 bg-transparent shrink-0" />
  ));

  const monthLabels: { label: string; colIndex: number }[] = [];
  let currentMonth = -1;

  contributions.forEach((day, index) => {
    const parts = day.date.split("-");
    const month = parseInt(parts[1], 10) - 1;

    if (month !== currentMonth && index > 0) {
      const colIndex = Math.floor((index + startDayOfWeek) / 7);
      
      const dateObj = new Date(Date.UTC(+parts[0], month, +parts[2]));
      monthLabels.push({
        label: dateObj.toLocaleString("default", { month: "short", timeZone: "UTC" }),
        colIndex,
      });
      currentMonth = month;
    } else if (index === 0) {
      currentMonth = month;
    }
  });

  const getLevelClass = (level: number) => {
    switch (level) {
      case 4: return "bg-terminal-green";
      case 3: return "bg-[#16A34A]/80";
      case 2: return "bg-[#16A34A]/50";
      case 1: return "bg-[#16A34A]/30";
      default: return "bg-muted/50"; 
    }
  };

  return (
    <div className="mt-6 sm:mt-10 border border-border bg-background px-2 py-1 relative w-full max-w-full sm:max-w-3xl">
      
      <div className="absolute -top-2.5 right-2 sm:right-4 bg-background px-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        Contributions
      </div>

      <div className="w-full max-w-full overflow-x-auto pt-6 pb-2 pl-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        
        <div className="flex gap-2 min-w-max">
          
          <div className="flex flex-col gap-0.75 text-[10px] text-muted-foreground font-mono shrink-0">
            <div className="h-2"></div> {/* Sun */}
            <div className="h-2 leading-2">Mon</div> 
            <div className="h-2"></div> {/* Tue */}
            <div className="h-2 leading-2">Wed</div> 
            <div className="h-2"></div> {/* Thu */}
            <div className="h-2 leading-2">Fri</div>
            <div className="h-2"></div> {/* Sat */}
          </div>

          <div className="flex flex-col relative shrink-0">
            
            <div className="absolute -top-5 left-0 w-full h-5 text-[10px] text-muted-foreground font-mono">
              {monthLabels.map((m, i) => (
                <span 
                  key={i} 
                  className="absolute" 
                  style={{ left: m.colIndex * 13.5 }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-0.75 p-px">
              {emptyCells}
              
              {contributions.map((day) => (
                <div
                  key={day.date}
                  title={`${day.count} contributions on ${day.date}`}
                  className={`w-2 h-2 shrink-0 transition-colors hover:ring-1 hover:ring-terminal-fg hover:ring-offset-1 hover:ring-offset-background ${getLevelClass(day.level)}`}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}