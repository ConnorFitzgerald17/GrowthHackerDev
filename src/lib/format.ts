import { format } from "date-fns";

export function formatPublishDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  return format(date, "MMM d, yyyy");
}
