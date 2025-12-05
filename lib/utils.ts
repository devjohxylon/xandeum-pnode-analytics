import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatTB(tb: number, decimals = 2): string {
  if (tb === 0) return "0 TB";
  if (tb < 0.001) return `${(tb * 1000).toFixed(decimals)} GB`;
  if (tb < 1) return `${(tb * 1000).toFixed(decimals)} GB`;
  if (tb >= 1000) return `${(tb / 1000).toFixed(decimals)} PB`;
  return `${tb.toFixed(decimals)} TB`;
}

export function formatMbps(mbps: number, decimals = 1): string {
  if (mbps < 1) return `${(mbps * 1000).toFixed(decimals)} Kbps`;
  if (mbps >= 1000) return `${(mbps / 1000).toFixed(decimals)} Gbps`;
  return `${mbps.toFixed(decimals)} Mbps`;
}

export function computeNodeHealth(node: import("@/types").PNode): number {
  // Compute health score from various metrics (0-100)
  let health = 100;
  
  // Uptime contributes 30%
  health *= (node.uptime_percentage / 100) * 0.3;
  
  // Success rate contributes 25%
  health += (node.success_rate_percentage / 100) * 25;
  
  // Low latency contributes 20% (lower is better, max 100ms = 100 points)
  const latencyScore = Math.max(0, 100 - (node.latency_ms / 100) * 20);
  health += (latencyScore / 100) * 20;
  
  // Storage utilization contributes 15% (not too full, not too empty)
  const utilization = (node.storage_used_tb / node.storage_capacity_tb) * 100;
  const utilizationScore = utilization > 90 ? 0 : utilization < 10 ? 50 : 100;
  health += (utilizationScore / 100) * 15;
  
  // Recent activity contributes 10% (based on last_seen)
  const hoursSinceLastSeen = (Date.now() - node.last_seen_timestamp.getTime()) / (1000 * 60 * 60);
  const activityScore = hoursSinceLastSeen < 1 ? 100 : hoursSinceLastSeen < 24 ? 50 : 0;
  health += (activityScore / 100) * 10;
  
  return Math.round(Math.max(0, Math.min(100, health)));
}

export function getNodeStatus(node: import("@/types").PNode): "online" | "offline" | "degraded" {
  const hoursSinceLastSeen = (Date.now() - node.last_seen_timestamp.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceLastSeen > 24 || node.uptime_percentage < 50) {
    return "offline";
  }
  if (hoursSinceLastSeen > 1 || node.uptime_percentage < 95 || node.success_rate_percentage < 90) {
    return "degraded";
  }
  return "online";
}

