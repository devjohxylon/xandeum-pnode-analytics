"use client";

import { useQuery } from "@tanstack/react-query";
import { NetworkMetrics } from "@/types";
import { generateMockNodes, calculateNetworkMetrics } from "@/lib/mock-data";

export function useNetworkMetrics() {
  return useQuery<NetworkMetrics>({
    queryKey: ["network-metrics"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const nodes = generateMockNodes(25);
      return calculateNetworkMetrics(nodes);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

