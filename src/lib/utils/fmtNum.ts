export function fmtNum(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";

  if (abs >= 1_000_000) return `${sign}${Number((abs / 1_000_000).toFixed(1))}M`;
  if (abs >= 1_000) return `${sign}${Number((abs / 1_000).toFixed(1))}k`;
  
  return String(n);
}