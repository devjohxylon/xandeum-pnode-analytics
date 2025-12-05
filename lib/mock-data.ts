import { PNode, NetworkMetrics, HistoricalData } from "@/types";
import { computeNodeHealth, getNodeStatus } from "@/lib/utils";

// Realistic city/country combinations for geographic distribution
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
];

const NODE_VERSIONS = [
  "1.2.3",
  "1.2.4",
  "1.2.5",
  "1.3.0",
  "1.3.1",
];

// Generate a random number between min and max
function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Generate a random integer between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random element from an array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate realistic node ID
function generateNodeId(index: number): string {
  const prefix = "XN";
  const padded = String(index + 1).padStart(4, "0");
  return `${prefix}-${padded}`;
}

// Generate mock pNode data
export function generateMockNodes(count: number = 25): PNode[] {
  const nodes: PNode[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const location = randomElement(LOCATIONS);
    
    // Vary uptime - most nodes should be high, some lower
    const uptimePercentage = i < 20 
      ? random(85, 99.9) 
      : random(50, 85);
    
    // Storage capacity varies from 10TB to 500TB
    const storageCapacityTb = random(10, 500);
    
    // Storage utilization varies - some nodes more full than others
    const utilizationRatio = random(0.15, 0.95);
    const storageUsedTb = storageCapacityTb * utilizationRatio;
    const storageAvailableTb = storageCapacityTb - storageUsedTb;
    
    // Latency varies by location (lower is better)
    const baseLatency = location.country === "United States" || location.country === "United Kingdom"
      ? random(10, 50)
      : random(20, 150);
    const latencyMs = baseLatency + random(-5, 5);
    
    // Bandwidth varies from 100 Mbps to 10 Gbps
    const bandwidthMbps = random(100, 10000);
    
    // Redundancy factor typically 2-5
    const dataRedundancyFactor = random(2, 5);
    
    // Staked amount varies significantly
    const stakeAmount = random(10000, 500000);
    
    // Rewards earned (correlates with stake and performance)
    const performanceMultiplier = (uptimePercentage / 100) * (1 - latencyMs / 200);
    const totalRewardsEarned = stakeAmount * random(0.05, 0.25) * performanceMultiplier;
    
    // Success rate (most nodes high, some lower)
    const successRatePercentage = i < 22
      ? random(95, 99.9)
      : random(80, 95);
    
    // Failed operations (inversely related to success rate)
    const totalOperations = random(10000, 100000);
    const failedOperationsCount = Math.round(totalOperations * (1 - successRatePercentage / 100));
    
    // Data served (correlates with storage used and uptime)
    const dataServedTb = storageUsedTb * random(0.5, 3) * (uptimePercentage / 100);
    
    // Last seen timestamp (most recent, some older)
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
    
    // Compute derived fields
    node.health = computeNodeHealth(node);
    node.status = getNodeStatus(node);
    
    nodes.push(node);
  }
  
  // Sort by health/performance for more realistic distribution
  return nodes.sort((a, b) => (b.health || 0) - (a.health || 0));
}

// Calculate network-wide metrics from nodes
export function calculateNetworkMetrics(nodes: PNode[]): NetworkMetrics {
  const onlineNodes = nodes.filter(n => n.status === "online").length;
  const offlineNodes = nodes.filter(n => n.status === "offline").length;
  
  // Convert TB to bytes (1 TB = 1024^4 bytes)
  const TB_TO_BYTES = 1024 ** 4;
  const totalStorage = nodes.reduce((sum, n) => sum + n.storage_capacity_tb * TB_TO_BYTES, 0);
  const usedStorage = nodes.reduce((sum, n) => sum + n.storage_used_tb * TB_TO_BYTES, 0);
  
  const totalStaked = nodes.reduce((sum, n) => sum + n.stake_amount, 0);
  
  const averageUptime = nodes.reduce((sum, n) => sum + n.uptime_percentage, 0) / nodes.length;
  const averageResponseTime = nodes.reduce((sum, n) => sum + n.latency_ms, 0) / nodes.length;
  const averageRedundancy = nodes.reduce((sum, n) => sum + n.data_redundancy_factor, 0) / nodes.length;
  
  // Network health is average of node health scores
  const networkHealth = nodes.reduce((sum, n) => sum + (n.health || 0), 0) / nodes.length;
  
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

// Generate historical data for charts
export function generateHistoricalData(
  hours: number,
  initialValue: number,
  variance: number = 0.1
): HistoricalData[] {
  const data: HistoricalData[] = [];
  const now = new Date();
  let currentValue = initialValue;
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    // Add some random variance
    const change = (Math.random() - 0.5) * variance * initialValue;
    currentValue = Math.max(0, currentValue + change);
    
    data.push({
      timestamp,
      value: Math.round(currentValue * 100) / 100,
    });
  }
  
  return data;
}

