"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNodes } from "@/hooks/use-nodes";
import { PNode } from "@/types";
import { formatTB, formatPercentage, formatNumber } from "@/lib/utils";
import { validateSearchQuery, sanitizeInput, validateNodeId } from "@/lib/validation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SortField = "health" | "uptime_percentage" | "total_rewards_earned" | "latency_ms" | "stake_amount";
type SortDirection = "asc" | "desc";

export function TopPerformersTable() {
  const { data: nodes, isLoading } = useNodes();
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("health");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "degraded" | "offline">("all");

  const sortedNodes = useMemo(() => {
    if (!nodes) return [];

    let filtered = nodes;

    if (searchQuery && validateSearchQuery(searchQuery)) {
      const query = sanitizeInput(searchQuery).toLowerCase();
      filtered = nodes.filter(
        (node) =>
          node.node_id.toLowerCase().includes(query) ||
          node.geographic_location.city.toLowerCase().includes(query) ||
          node.geographic_location.country.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((node) => node.status === statusFilter);
    }
    const sorted = [...filtered].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case "health":
          aValue = a.health || 0;
          bValue = b.health || 0;
          break;
        case "uptime_percentage":
          aValue = a.uptime_percentage;
          bValue = b.uptime_percentage;
          break;
        case "total_rewards_earned":
          aValue = a.total_rewards_earned;
          bValue = b.total_rewards_earned;
          break;
        case "latency_ms":
          aValue = a.latency_ms;
          bValue = b.latency_ms;
          break;
        case "stake_amount":
          aValue = a.stake_amount;
          bValue = b.stake_amount;
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue - bValue;
      }
      return bValue - aValue;
    });

    return sorted.slice(0, 10); // Top 10
  }, [nodes, sortField, sortDirection, searchQuery, statusFilter]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  }, [sortField, sortDirection]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setSearchQuery(value);
    }
  }, []);

  const handleStatusFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "all" | "online" | "degraded" | "offline";
    setStatusFilter(value);
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (validateNodeId(nodeId)) {
      router.push(`/nodes/${encodeURIComponent(nodeId)}`);
    }
  }, [router]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "degraded":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "offline":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="border-b border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Top Performers
          </CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              aria-label="Filter nodes by status"
              className="px-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="degraded">Degraded</option>
              <option value="offline">Offline</option>
            </select>
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search nodes by ID, city, or country"
              maxLength={100}
              className="px-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary flex-1 sm:flex-initial sm:w-48"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Node ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  <SortButton field="health">Health</SortButton>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  <SortButton field="uptime_percentage">Uptime</SortButton>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  <SortButton field="latency_ms">Latency</SortButton>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Storage
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  <SortButton field="stake_amount">Staked</SortButton>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  <SortButton field="total_rewards_earned">Rewards</SortButton>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedNodes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">
                    No nodes found
                  </td>
                </tr>
              ) : (
                sortedNodes.map((node) => (
                  <tr
                    key={node.node_id}
                    className="border-b border-border hover:bg-accent/50 transition-smooth cursor-pointer hover-glow"
                    onClick={() => handleNodeClick(node.node_id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNodeClick(node.node_id);
                      }
                    }}
                    aria-label={`View details for node ${node.node_id}`}
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/nodes/${node.node_id}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {node.node_id}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          node.status
                        )} transition-smooth`}
                      >
                        {(node.status === "online" || node.status === "degraded") && (
                          <span className="relative flex h-2 w-2 mr-1.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${node.status === "online" ? "bg-green-400" : "bg-yellow-400"}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${node.status === "online" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                          </span>
                        )}
                        {node.status === "offline" && (
                          <span className="h-2 w-2 mr-1.5 rounded-full bg-red-500"></span>
                        )}
                        {!node.status && (
                          <span className="h-2 w-2 mr-1.5 rounded-full bg-gray-500"></span>
                        )}
                        {node.status || "unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatPercentage(node.health || 0)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatPercentage(node.uptime_percentage)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {node.latency_ms.toFixed(1)} ms
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatTB(node.storage_used_tb)} / {formatTB(node.storage_capacity_tb)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatNumber(node.stake_amount)} XAND
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatNumber(node.total_rewards_earned)} XAND
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {node.geographic_location.city}, {node.geographic_location.country}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

