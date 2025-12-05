"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNodes } from "@/hooks/use-nodes";
import { useNetworkMetrics } from "@/hooks/use-network-metrics";
import { generateHistoricalData } from "@/lib/mock-data";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatTB, formatPercentage } from "@/lib/utils";
import { format } from "date-fns";

export function DashboardCharts() {
  const { data: nodes, isLoading: nodesLoading } = useNodes();
  const { data: networkMetrics, isLoading: metricsLoading } = useNetworkMetrics();

  const isLoading = nodesLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="border bg-card/50">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Generate 30 days of data
  const hours = 30 * 24;

  // Network Uptime Chart
  const avgUptime = nodes
    ? nodes.reduce((sum, n) => sum + n.uptime_percentage, 0) / nodes.length
    : 0;
  const uptimeData = generateHistoricalData(hours, avgUptime, 0.05).map(
    (item) => ({
      timestamp: item.timestamp.getTime(),
      value: item.value,
    })
  );

  // Storage Utilization Chart
  const TB_TO_BYTES = 1024 ** 4;
  const initialUsedTb = networkMetrics
    ? networkMetrics.usedStorage / TB_TO_BYTES
    : 0;
  const initialTotalTb = networkMetrics
    ? networkMetrics.totalStorage / TB_TO_BYTES
    : 0;
  const usedData = generateHistoricalData(hours, initialUsedTb, 0.1);
  const totalData = generateHistoricalData(hours, initialTotalTb, 0.05);
  const storageData = usedData.map((item, i) => ({
    timestamp: item.timestamp.getTime(),
    used: item.value,
    total: totalData[i].value,
    utilization: (item.value / totalData[i].value) * 100,
  }));

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return format(date, "MMM dd");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
      {/* Network Uptime Chart */}
      <Card className="border-0 bg-gradient-to-br from-blue-950/50 to-cyan-950/50 backdrop-blur-sm shadow-xl transition-smooth hover-glow">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Network Uptime
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uptimeData}>
              <defs>
                <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(217, 91%, 60%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(217, 91%, 60%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                tickFormatter={(v) => `${v.toFixed(1)}%`}
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelFormatter={(value) => format(new Date(value), "PPpp")}
                formatter={(value: number) => [
                  `${value.toFixed(2)}%`,
                  "Uptime",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={3}
                fill="url(#uptimeGradient)"
                dot={false}
                activeDot={{ r: 6, fill: "hsl(217, 91%, 60%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Storage Utilization Chart */}
      <Card className="border-0 bg-gradient-to-br from-purple-950/50 to-pink-950/50 backdrop-blur-sm shadow-xl transition-smooth hover-glow">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Storage Utilization
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={storageData}>
              <defs>
                <linearGradient id="usedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(280, 100%, 70%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(280, 100%, 70%)"
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(280, 50%, 50%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(280, 50%, 50%)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                tickFormatter={(v) => formatTB(v)}
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelFormatter={(value) => format(new Date(value), "PPpp")}
                formatter={(value: number, name: string) => {
                  if (name === "used") return [formatTB(value), "Used"];
                  if (name === "total") return [formatTB(value), "Total"];
                  return [formatTB(value), name];
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="total"
                stackId="1"
                stroke="hsl(280, 50%, 50%)"
                fill="url(#totalGradient)"
                name="Total Storage"
              />
              <Area
                type="monotone"
                dataKey="used"
                stackId="1"
                stroke="hsl(280, 100%, 70%)"
                fill="url(#usedGradient)"
                name="Used Storage"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

