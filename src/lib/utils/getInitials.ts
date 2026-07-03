export function initials(name?: string | null) {
  if (!name) return "??";
  return name
    .split(/[\s_-]+/)
    .map((segment) => segment[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
