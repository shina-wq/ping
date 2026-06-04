export type GreetingStyle = "time-of-day" | "neutral";

/** Morning before noon, afternoon before 5pm, otherwise evening (local time). */
export function getTimeOfDayGreeting(date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getGreetingPrefix(style: GreetingStyle = "time-of-day", date = new Date()): string {
  if (style === "neutral") return "Hello";
  return getTimeOfDayGreeting(date);
}

export function formatGreeting(
  name: string,
  style: GreetingStyle = "time-of-day",
  date = new Date()
): string {
  return `${getGreetingPrefix(style, date)}, ${name}`;
}
