import { PNode, NetworkMetrics, HistoricalData } from "@/types";
import { computeNodeHealth, getNodeStatus } from "@/lib/utils";

const LOCATIONS = [
  { city: "New York", country: "United States" },
  { city: "San Francisco", country: "United States" },
  { city: "London", country: "United Kingdom" },
  { city: "Frankfurt", country: "Germany" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Tokyo", country: "Japan" },
  { city: "Singapore", country: "Singapore" },
  { city: "Sydney", country: "Australia" },
  { city: "Toronto", country: "Canada" },
  { city: "Paris", country: "France" },
  { city: "Stockholm", country: "Sweden" },
  { city: "Zurich", country: "Switzerland" },
  { city: "Seoul", country: "South Korea" },
  { city: "Hong Kong", country: "Hong Kong" },
  { city: "Dublin", country: "Ireland" },
  { city: "Mumbai", country: "India" },
  { city: "São Paulo", country: "Brazil" },
  { city: "Moscow", country: "Russia" },
  { city: "Dubai", country: "UAE" },
  { city: "Oslo", country: "Norway" },
] as const;

const NODE_VERSIONS = [
  "1.2.3",
  "1.2.4",
  "1.2.5",
  "1.3.0",
  "1.3.1",
] as const;

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateNodeId(index: number): string {
  const prefix = "XN";
  const padded = String(index + 1).padStart(4, "0");
  return `${prefix}-${padded}`;
}

export function generateMockNodes(count: number = 25): PNode[] {
  const nodes: PNode[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const location = randomElement(LOCATIONS);
    const uptimePercentage = i < 20 ? random(85, 99.9) : random(50, 85);
    const storageCapacityTb = random(10, 500);
    const utilizationRatio = random(0.15, 0.95);
    const storageUsedTb = storageCapacityTb * utilizationRatio;
    const storageAvailableTb = storageCapacityTb - storageUsedTb;
    const baseLatency = location.country === "United States" || location.country === "United Kingdom"
      ? random(10, 50)
      : random(20, 150);
    const latencyMs = Math.max(0, baseLatency + random(-5, 5));
    const bandwidthMbps = random(100, 10000);
    const dataRedundancyFactor = random(2, 5);
    const stakeAmount = random(10000, 500000);
    const performanceMultiplier = (uptimePercentage / 100) * Math.max(0, 1 - latencyMs / 200);
    const totalRewardsEarned = stakeAmount * random(0.05, 0.25) * performanceMultiplier;
    const successRatePercentage = i < 22 ? random(95, 99.9) : random(80, 95);
    const totalOperations = random(10000, 100000);
    const failedOperationsCount = Math.round(totalOperations * (1 - successRatePercentage / 100));
    const dataServedTb = storageUsedTb * random(0.5, 3) * (uptimePercentage / 100);
    const hoursAgo = i < 23 ? random(0, 2) : random(2, 48);
    const lastSeenTimestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    const node: PNode = {
      node_id: generateNodeId(i),
      uptime_percentage: Math.round(uptimePercentage * 10) / 10,
      storage_capacity_tb: Math.round(storageCapacityTb * 100) / 100,
      storage_used_tb: Math.round(storageUsedTb * 100) / 100,
      storage_available_tb: Math.round(storageAvailableTb * 100) / 100,
      latency_ms: Math.round(latencyMs * 10) / 10,
      bandwidth_mbps: Math.round(bandwidthMbps * 10) / 10,
      data_redundancy_factor: Math.round(dataRedundancyFactor * 10) / 10,
      total_rewards_earned: Math.round(totalRewardsEarned * 100) / 100,
      stake_amount: Math.round(stakeAmount * 100) / 100,
      last_seen_timestamp: lastSeenTimestamp,
      geographic_location: location,
      node_version: randomElement(NODE_VERSIONS),
      success_rate_percentage: Math.round(successRatePercentage * 10) / 10,
      failed_operations_count: failedOperationsCount,
      data_served_tb: Math.round(dataServedTb * 100) / 100,
    };
    
    node.health = computeNodeHealth(node);
    node.status = getNodeStatus(node);
    nodes.push(node);
  }
  
  return nodes.sort((a, b) => (b.health || 0) - (a.health || 0));
}

export function calculateNetworkMetrics(nodes: PNode[]): NetworkMetrics {
  const onlineNodes = nodes.filter(n => n.status === "online").length;
  const offlineNodes = nodes.filter(n => n.status === "offline").length;
  const TB_TO_BYTES = 1024 ** 4;
  const totalStorage = nodes.reduce((sum, n) => sum + n.storage_capacity_tb * TB_TO_BYTES, 0);
  const usedStorage = nodes.reduce((sum, n) => sum + n.storage_used_tb * TB_TO_BYTES, 0);
  const totalStaked = nodes.reduce((sum, n) => sum + n.stake_amount, 0);
  const averageUptime = nodes.length > 0
    ? nodes.reduce((sum, n) => sum + n.uptime_percentage, 0) / nodes.length
    : 0;
  const averageResponseTime = nodes.length > 0
    ? nodes.reduce((sum, n) => sum + n.latency_ms, 0) / nodes.length
    : 0;
  const averageRedundancy = nodes.length > 0
    ? nodes.reduce((sum, n) => sum + n.data_redundancy_factor, 0) / nodes.length
    : 0;
  const networkHealth = nodes.length > 0
    ? nodes.reduce((sum, n) => sum + (n.health || 0), 0) / nodes.length
    : 0;
  
  return {
    totalNodes: nodes.length,
    onlineNodes,
    offlineNodes,
    totalStorage: Math.round(totalStorage),
    usedStorage: Math.round(usedStorage),
    totalStaked: Math.round(totalStaked * 100) / 100,
    averageUptime: Math.round(averageUptime * 10) / 10,
    averageResponseTime: Math.round(averageResponseTime * 10) / 10,
    networkHealth: Math.round(networkHealth * 10) / 10,
    dataRedundancy: Math.round(averageRedundancy * 10) / 10,
  };
}

export function generateHistoricalData(
  hours: number,
  initialValue: number,
  variance: number = 0.1
): HistoricalData[] {
  const data: HistoricalData[] = [];
  const now = new Date();
  let currentValue = Math.max(0, initialValue);
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const change = (Math.random() - 0.5) * variance * initialValue;
    currentValue = Math.max(0, currentValue + change);
    
    data.push({
      timestamp,
      value: Math.round(currentValue * 100) / 100,
    });
  }
  
  return data;
}

