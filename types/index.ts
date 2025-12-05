export interface PNode {
  node_id: string;
  uptime_percentage: number; // 0-100
  storage_capacity_tb: number; // total storage in TB
  storage_used_tb: number; // used storage in TB
  storage_available_tb: number; // available storage in TB
  latency_ms: number; // network response time in milliseconds
  bandwidth_mbps: number; // current bandwidth in Mbps
  data_redundancy_factor: number; // replication level
  total_rewards_earned: number; // in XAND tokens
  stake_amount: number; // tokens staked
  last_seen_timestamp: Date;
  geographic_location: {
    city: string;
    country: string;
  };
  node_version: string; // software version
  success_rate_percentage: number; // 0-100
  failed_operations_count: number;
  data_served_tb: number; // total data served in TB
  // Computed/derived fields for UI
  status?: "online" | "offline" | "degraded";
  health?: number; // 0-100, computed from various metrics
}

export interface NetworkMetrics {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  totalStorage: number; // bytes
  usedStorage: number; // bytes
  totalStaked: number; // tokens
  averageUptime: number; // percentage
  averageResponseTime: number; // milliseconds
  networkHealth: number; // 0-100
  dataRedundancy: number; // average redundancy factor
}

export interface HistoricalData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface TimeRange {
  label: string;
  value: "1h" | "24h" | "7d" | "30d" | "90d" | "all";
  hours: number;
}

