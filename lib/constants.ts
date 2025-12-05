import { TimeRange } from "@/types";

export const TIME_RANGES: TimeRange[] = [
  { label: "1 Hour", value: "1h", hours: 1 },
  { label: "24 Hours", value: "24h", hours: 24 },
  { label: "7 Days", value: "7d", hours: 168 },
  { label: "30 Days", value: "30d", hours: 720 },
  { label: "90 Days", value: "90d", hours: 2160 },
  { label: "All Time", value: "all", hours: Infinity },
];

export const DEFAULT_TIME_RANGE: TimeRange["value"] = "24h";

export const REFRESH_INTERVALS = {
  realtime: 5000, // 5 seconds
  fast: 30000, // 30 seconds
  normal: 60000, // 1 minute
  slow: 300000, // 5 minutes
} as const;

