"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNetworkMetrics } from "@/hooks/use-network-metrics";
import { ArrowRight, BarChart3, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";
import { formatPercentage } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const { data: metrics } = useNetworkMetrics();

  const actions = [
    {
      title: "Compare pNodes",
      description: "Analyze and compare node performance metrics",
      icon: BarChart3,
      href: "/nodes",
      gradientClass: "from-blue-600 to-cyan-600",
      bgClass: "from-blue-600/20 to-cyan-600/20",
    },
    {
      title: "View Top Performers",
      description: "See the highest performing nodes in the network",
      icon: TrendingUp,
      href: "/nodes",
      gradientClass: "from-purple-600 to-pink-600",
      bgClass: "from-purple-600/20 to-pink-600/20",
    },
  ];

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-400";
    if (health >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getHealthGlow = (health: number) => {
    if (health >= 90) return "shadow-[0_0_20px_rgba(34,197,94,0.5)]";
    if (health >= 70) return "shadow-[0_0_20px_rgba(234,179,8,0.5)]";
    return "shadow-[0_0_20px_rgba(239,68,68,0.5)]";
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 animate-fade-in">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.title} href={action.href}>
            <Card
              className={cn(
                "group relative overflow-hidden border-0 bg-gradient-to-br shadow-xl transition-smooth hover:scale-105 cursor-pointer hover-glow",
                action.bgClass,
                "hover:shadow-2xl"
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-smooth group-hover:opacity-100",
                  action.gradientClass
                )}
              />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "rounded-lg bg-gradient-to-br p-3 transition-smooth group-hover:scale-110",
                      action.gradientClass
                    )}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-smooth group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-smooth">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-smooth">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}

      {/* Network Status Indicator */}
      <Card
        className={cn(
          "relative overflow-hidden border-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm shadow-xl",
          metrics && getHealthGlow(metrics.networkHealth)
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 p-3">
              <Activity className="h-6 w-6 text-white" />
            </div>
            {metrics && (
              <div className="text-right">
                <div
                  className={cn(
                    "text-2xl font-bold mb-1",
                    getHealthColor(metrics.networkHealth)
                  )}
                >
                  {formatPercentage(metrics.networkHealth)}
                </div>
                <div className="text-xs text-muted-foreground">Health Score</div>
              </div>
            )}
          </div>
          <h3 className="text-lg font-bold mb-2">Network Status</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {metrics
              ? `${metrics.onlineNodes} nodes online • ${metrics.offlineNodes} offline`
              : "Loading network status..."}
          </p>
          {metrics && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium">
                  {formatPercentage(metrics.averageUptime)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Response Time</span>
                <span className="font-medium">
                  {metrics.averageResponseTime.toFixed(1)} ms
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

