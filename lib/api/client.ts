import { PNode, NetworkMetrics } from "@/types";

const RPC_URL = process.env.NEXT_PUBLIC_XANDEUM_RPC_URL || "";

interface RPCResponse<T> {
  data: T;
  error?: string;
}

export class XandeumRPCClient {
  private baseUrl: string;
  private requestCache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || RPC_URL;
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    retries = 3
  ): Promise<RPCResponse<T>> {
    const cacheKey = endpoint;
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return { data: cached.data as T };
    }

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        this.requestCache.set(cacheKey, { data, timestamp: Date.now() });
        return { data };
      } catch (error) {
        if (attempt === retries - 1) {
          return {
            data: [] as T,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    return { data: [] as T, error: "Request failed after retries" };
  }

  async getNodes(): Promise<PNode[]> {
    const response = await this.fetchWithRetry<PNode[]>("/nodes");
    return response.data || [];
  }

  async getNodeMetrics(nodeId: string): Promise<Partial<PNode> | null> {
    if (!nodeId || typeof nodeId !== "string") {
      return null;
    }
    const response = await this.fetchWithRetry<Partial<PNode>>(`/nodes/${nodeId}`);
    return response.data || null;
  }

  async getNetworkMetrics(): Promise<NetworkMetrics | null> {
    const response = await this.fetchWithRetry<NetworkMetrics>("/network/metrics");
    return response.data || null;
  }
}

export const rpcClient = new XandeumRPCClient();

