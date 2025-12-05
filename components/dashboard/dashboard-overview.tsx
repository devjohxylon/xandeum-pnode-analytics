"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetworkMetrics } from "@/hooks/use-network-metrics";
import { useNodes } from "@/hooks/use-nodes";
import { formatTB, formatNumber, formatPercentage } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  Server,
  HardDrive,
  Activity,
  Zap,
  TrendingUp,
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string;
  numericValue?: number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
  };
  color?: "blue" | "purple" | "cyan" | "green" | "yellow" | "indigo" | "red";
  useAnimatedCounter?: boolean;
}

function OverviewCard({
  title,
  value,
  numericValue,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
  useAnimatedCounter = false,
}: OverviewCardProps) {
  const colorClasses = {
    blue: "from-blue-600/20 to-cyan-600/20 border-blue-500/30",
    purple: "from-purple-600/20 to-pink-600/20 border-purple-500/30",
    cyan: "from-cyan-600/20 to-blue-600/20 border-cyan-500/30",
    green: "from-green-600/20 to-emerald-600/20 border-green-500/30",
    yellow: "from-yellow-600/20 to-orange-600/20 border-yellow-500/30",
    indigo: "from-indigo-600/20 to-purple-600/20 border-indigo-500/30",
    red: "from-red-600/20 to-orange-600/20 border-red-500/30",
  };

  const iconColorClasses = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    cyan: "text-cyan-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    indigo: "text-indigo-400",
    red: "text-red-400",
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <ArrowUp className="h-4 w-4 text-green-400" />;
    if (trend.value < 0) return <ArrowDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.value > 0) return "text-green-400";
    if (trend.value < 0) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <Card
      className={cn(
        "border bg-gradient-to-br backdrop-blur-sm transition-smooth hover:scale-105 hover:shadow-xl hover-glow",
        colorClasses[color]
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("rounded-lg bg-background/50 p-2", iconColorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {useAnimatedCounter && numericValue !== undefined ? (
            <AnimatedCounter
              value={numericValue}
              decimals={value.includes(".") ? 1 : 0}
              suffix={value.includes("XAND") ? " XAND" : value.includes("TB") ? " TB" : value.includes("%") ? "%" : ""}
            />
          ) : (
            value
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
        )}
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
            {getTrendIcon()}
            <span>
              {trend.value > 0 ? "+" : ""}
              {trend.value.toFixed(1)}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const { data: metrics, isLoading: metricsLoading } = useNetworkMetrics();
  const { data: nodes, isLoading: nodesLoading } = useNodes();

  const isLoading = metricsLoading || nodesLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border bg-card/50">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics || !nodes) return null;

  const TB_TO_BYTES = 1024 ** 4;
  const totalStorageTb = metrics.totalStorage / TB_TO_BYTES;
  const usedStorageTb = metrics.usedStorage / TB_TO_BYTES;
  const storageUtilization = metrics.totalStorage > 0
    ? (metrics.usedStorage / metrics.totalStorage) * 100
    : 0;

  const totalRewards = nodes.reduce(
    (sum, n) => sum + (n.total_rewards_earned || 0),
    0
  );

  const mockTrend = (value: number) => ({
    value,
    label: "vs last period",
  });

  const getHealthColor = (health: number): OverviewCardProps["color"] => {
    if (health >= 90) return "green";
    if (health >= 70) return "yellow";
    return "red";
  };

  const cards: OverviewCardProps[] = [
    {
      title: "Total Nodes",
      value: formatNumber(metrics.totalNodes),
      numericValue: metrics.totalNodes,
      subtitle: `${metrics.onlineNodes} online, ${metrics.offlineNodes} offline`,
      icon: Server,
      trend: mockTrend(2.5),
      color: "blue",
      useAnimatedCounter: true,
    },
    {
      title: "Total Storage",
      value: formatTB(totalStorageTb),
      numericValue: totalStorageTb,
      subtitle: `${formatPercentage(storageUtilization)} utilized`,
      icon: HardDrive,
      trend: mockTrend(5.2),
      color: "cyan",
      useAnimatedCounter: true,
    },
    {
      title: "Network Health",
      value: formatPercentage(metrics.networkHealth),
      numericValue: metrics.networkHealth,
      subtitle: `${formatPercentage(metrics.averageUptime)} avg uptime`,
      icon: Activity,
      color: getHealthColor(metrics.networkHealth),
      useAnimatedCounter: true,
    },
    {
      title: "Avg Latency",
      value: `${metrics.averageResponseTime.toFixed(1)} ms`,
      numericValue: metrics.averageResponseTime,
      subtitle: `Data redundancy: ${metrics.dataRedundancy.toFixed(1)}x`,
      icon: Zap,
      trend: mockTrend(-3.1),
      color: "purple",
      useAnimatedCounter: true,
    },
    {
      title: "Total Staked",
      value: `${formatNumber(metrics.totalStaked)} XAND`,
      numericValue: metrics.totalStaked,
      subtitle: `Across ${metrics.totalNodes} nodes`,
      icon: TrendingUp,
      trend: mockTrend(8.7),
      color: "indigo",
      useAnimatedCounter: true,
    },
    {
      title: "Total Rewards",
      value: `${formatNumber(totalRewards)} XAND`,
      numericValue: totalRewards,
      subtitle: "Earned across network",
      icon: Award,
      trend: mockTrend(12.3),
      color: "yellow",
      useAnimatedCounter: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {cards.map((card) => (
        <OverviewCard key={card.title} {...card} />
      ))}
    </div>
  );
}

