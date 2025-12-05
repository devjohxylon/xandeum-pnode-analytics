"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetworkMetrics } from "@/hooks/use-network-metrics";
import { formatTB, formatNumber, formatPercentage, formatMbps } from "@/lib/utils";
import {
  Server,
  HardDrive,
  TrendingUp,
  Activity,
  Zap,
  Shield,
} from "lucide-react";

export function OverviewCards() {
  const { data: metrics, isLoading } = useNetworkMetrics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const storageUtilization = (metrics.usedStorage / metrics.totalStorage) * 100;
  const TB_TO_BYTES = 1024 ** 4;
  const totalStorageTb = metrics.totalStorage / TB_TO_BYTES;
  const usedStorageTb = metrics.usedStorage / TB_TO_BYTES;

  const cards = [
    {
      title: "Total Nodes",
      value: formatNumber(metrics.totalNodes),
      subtitle: `${metrics.onlineNodes} online, ${metrics.offlineNodes} offline`,
      icon: Server,
      trend: null,
    },
    {
      title: "Total Storage",
      value: formatTB(totalStorageTb),
      subtitle: `${formatPercentage(storageUtilization)} utilized`,
      icon: HardDrive,
      trend: null,
    },
    {
      title: "Total Staked",
      value: `${formatNumber(metrics.totalStaked)} XAND`,
      subtitle: `Across ${metrics.totalNodes} nodes`,
      icon: TrendingUp,
      trend: null,
    },
    {
      title: "Network Health",
      value: formatPercentage(metrics.networkHealth),
      subtitle: `Avg uptime: ${formatPercentage(metrics.averageUptime)}`,
      icon: Activity,
      trend: metrics.networkHealth > 90 ? "up" : metrics.networkHealth > 70 ? "neutral" : "down",
    },
    {
      title: "Avg Response Time",
      value: `${metrics.averageResponseTime.toFixed(1)} ms`,
      subtitle: `Data redundancy: ${metrics.dataRedundancy.toFixed(1)}x`,
      icon: Zap,
      trend: metrics.averageResponseTime < 50 ? "up" : metrics.averageResponseTime < 100 ? "neutral" : "down",
    },
    {
      title: "Storage Used",
      value: formatTB(usedStorageTb),
      subtitle: `Available: ${formatTB(totalStorageTb - usedStorageTb)}`,
      icon: Shield,
      trend: null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

