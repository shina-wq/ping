/** Derives up to two initials from a full name. e.g. "Aiko Tanaka" → "AT" */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Returns a Tailwind color class based on a score percentage. */
export function getScoreClass(score: number, maxScore: number): string {
  const pct = (score / maxScore) * 100;
  if (pct >= 90) return "text-emerald-600";
  if (pct >= 75) return "text-primary";
  if (pct >= 60) return "text-orange-500";
  return "text-rose-500";
}
