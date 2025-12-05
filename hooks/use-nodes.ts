"use client";

import { useQuery } from "@tanstack/react-query";
import { PNode } from "@/types";
import { generateMockNodes } from "@/lib/mock-data";

export function useNodes() {
  return useQuery<PNode[]>({
    queryKey: ["nodes"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return generateMockNodes(25);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useNode(nodeId: string) {
  return useQuery<PNode | null>({
    queryKey: ["node", nodeId],
    queryFn: async () => {
      const nodes = generateMockNodes(25);
      return nodes.find((n) => n.node_id === nodeId) || null;
    },
    enabled: !!nodeId,
  });
}

