import { Clock, SquareCheckBig, Zap, WifiOff, Coffee, SquareCheck } from "lucide-react";

export type ContributionDay = {
  date: string; // Format: YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type NativeLedgerProps = {
  contributions: ContributionDay[];
};

export default function ContributionUptime({ contributions }: NativeLedgerProps) {
  if (!contributions || contributions.length === 0) return null;

  const recent90 = contributions.slice(-90);
  
  const totalDays = recent90.length;
  const activeDays = recent90.filter(day => day.count > 0).length;
  const uptime = parseFloat(totalDays > 0 ? ((activeDays / totalDays) * 100).toFixed(2) : "0.00");

  const getStatus = (u: number) => {
    if (u >= 90) return { label: "Committed", Icon: SquareCheckBig };
    if (u >= 80) return { label: "Active", Icon: SquareCheck };
    if (u >= 70) return { label: "Frequent", Icon: Zap };
    if (u >= 60) return { label: "Working", Icon: Coffee };
    if (u == 0) return { label: "Offline", Icon: WifiOff };
    return { label: "Rare", Icon: Clock };
  };

  const status = getStatus(uptime);

  const getLevelClass = (level: number) => {
    switch (level) {
      case 4: return "bg-terminal-green"; 
      case 3: return "bg-terminal-green/80";
      case 2: return "bg-terminal-green/50";
      case 1: return "bg-terminal-green/30";
      default: return "bg-muted"; 
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div className="w-full max-w-3xl flex flex-col gap-3 mt-6 sm:mt-10">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono">
          <h2 className="text-foreground uppercase tracking-widest text-[12px] sm:text-xs">
            Contributions
          </h2>
        </div>
        <div className="flex items-center gap-2" title={`Status: ${status.label}`}>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-foreground/80 font-bold">
            {status.label}
          </span>
          <status.Icon
            className={`w-3 h-3 sm:w-4 sm:h-4 ${status.label === "Committed" ? "text-terminal-green" : "text-muted-foreground/80"}`}          />
        </div>
      </div>

      <div className="flex w-full h-8 gap-px sm:gap-0.5">
        {recent90.map((day) => (
          <div
            key={day.date}
            title={`${day.count} commits on ${formatDate(day.date)}`}
            className={`flex-1 transition-opacity hover:opacity-50 ${getLevelClass(day.level)}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
        <span className="whitespace-nowrap">90 days ago</span>
        <div className="flex-1 h-px bg-muted"></div>
        <span className="whitespace-nowrap font-medium text-foreground">{uptime} % uptime</span>
        <div className="flex-1 h-px bg-muted"></div>
        <span className="whitespace-nowrap">Today</span>
      </div>

    </div>
  );
}