"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetworkMetrics } from "@/hooks/use-network-metrics";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { formatTB, formatNumber, formatPercentage } from "@/lib/utils";
import { Server, HardDrive, TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroMetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  delay?: number;
  isAnimated?: boolean;
}

function HeroMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  delay = 0,
  isAnimated = false,
}: HeroMetricCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 bg-gradient-to-br shadow-2xl transition-smooth hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover-glow",
        gradient
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />
      
      {/* Content */}
      <CardContent className="relative p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80 mb-2">{title}</p>
            <div className="text-4xl font-bold text-white mb-2">
              {isAnimated && typeof value === "number" ? (
                <AnimatedCounter value={value} />
              ) : (
                value
              )}
            </div>
            <p className="text-sm text-white/70">{subtitle}</p>
          </div>
          <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function HeroMetrics() {
  const { data: metrics, isLoading } = useNetworkMetrics();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 bg-card/50">
            <CardContent className="p-8">
              <Skeleton className="h-12 w-32 mb-4" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const TB_TO_BYTES = 1024 ** 4;
  const totalStorageTb = metrics.totalStorage / TB_TO_BYTES;
  const usedStorageTb = metrics.usedStorage / TB_TO_BYTES;
  const storageUtilization = (metrics.usedStorage / metrics.totalStorage) * 100;

  const heroCards: HeroMetricCardProps[] = [
    {
      title: "Total Nodes",
      value: metrics.totalNodes,
      subtitle: `${metrics.onlineNodes} online • ${metrics.offlineNodes} offline`,
      icon: Server,
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      delay: 0,
      isAnimated: true,
    },
    {
      title: "Network Health",
      value: `${metrics.networkHealth.toFixed(1)}%`,
      subtitle: `${formatPercentage(metrics.averageUptime)} avg uptime`,
      icon: Activity,
      gradient: "from-purple-600 via-purple-500 to-pink-500",
      delay: 100,
      isAnimated: false,
    },
    {
      title: "Total Storage",
      value: formatTB(totalStorageTb),
      subtitle: `${formatPercentage(storageUtilization)} utilized`,
      icon: HardDrive,
      gradient: "from-cyan-600 via-cyan-500 to-blue-500",
      delay: 200,
      isAnimated: false,
    },
    {
      title: "Total Staked",
      value: `${formatNumber(metrics.totalStaked)} XAND`,
      subtitle: "Across all nodes",
      icon: TrendingUp,
      gradient: "from-indigo-600 via-indigo-500 to-purple-500",
      delay: 300,
      isAnimated: false,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      {heroCards.map((card, index) => (
        <HeroMetricCard key={card.title} {...card} />
      ))}
    </div>
  );
}

