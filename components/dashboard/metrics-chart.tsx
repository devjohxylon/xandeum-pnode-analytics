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
import { formatTB, formatPercentage, formatNumber } from "@/lib/utils";
import { format } from "date-fns";

interface MetricsChartProps {
  title: string;
  metric: "uptime" | "storage" | "rewards" | "latency";
  hours?: number;
}

export function MetricsChart({ title, metric, hours = 24 }: MetricsChartProps) {
  const { data: nodes, isLoading: nodesLoading } = useNodes();
  const { data: networkMetrics, isLoading: metricsLoading } = useNetworkMetrics();

  const isLoading = nodesLoading || metricsLoading;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  let data: any[] = [];
  let lines: JSX.Element[] = [];
  let yAxisFormatter: (value: number) => string = (v) => v.toString();

  switch (metric) {
    case "uptime":
      if (nodes) {
        const avgUptime = nodes.reduce((sum, n) => sum + n.uptime_percentage, 0) / nodes.length;
        const historicalData = generateHistoricalData(hours, avgUptime, 0.05);
        data = historicalData.map((item) => ({
          timestamp: item.timestamp.getTime(),
          value: item.value,
        }));
        lines = [
          <Line
            key="uptime"
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name="Average Uptime"
          />,
        ];
        yAxisFormatter = (v) => `${v.toFixed(1)}%`;
      }
      break;

    case "storage":
      if (networkMetrics) {
        const TB_TO_BYTES = 1024 ** 4;
        const initialUsedTb = networkMetrics.usedStorage / TB_TO_BYTES;
        const initialTotalTb = networkMetrics.totalStorage / TB_TO_BYTES;
        const usedData = generateHistoricalData(hours, initialUsedTb, 0.1);
        const totalData = generateHistoricalData(hours, initialTotalTb, 0.05);
        data = usedData.map((item, i) => ({
          timestamp: item.timestamp.getTime(),
          used: item.value,
          total: totalData[i].value,
        }));
        lines = [
          <Area
            key="used"
            type="monotone"
            dataKey="used"
            stackId="1"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.6}
            name="Used Storage"
          />,
          <Area
            key="total"
            type="monotone"
            dataKey="total"
            stackId="1"
            stroke="hsl(var(--muted-foreground))"
            fill="hsl(var(--muted-foreground))"
            fillOpacity={0.3}
            name="Total Storage"
          />,
        ];
        yAxisFormatter = (v) => formatTB(v);
      }
      break;

    case "rewards":
      if (nodes) {
        const totalRewards = nodes.reduce((sum, n) => sum + n.total_rewards_earned, 0);
        const historicalData = generateHistoricalData(hours, totalRewards, 0.15);
        data = historicalData.map((item) => ({
          timestamp: item.timestamp.getTime(),
          value: item.value,
        }));
        lines = [
          <Line
            key="rewards"
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name="Total Rewards"
          />,
        ];
        yAxisFormatter = (v) => formatNumber(v);
      }
      break;

    case "latency":
      if (nodes) {
        const avgLatency = nodes.reduce((sum, n) => sum + n.latency_ms, 0) / nodes.length;
        const historicalData = generateHistoricalData(hours, avgLatency, 0.2);
        data = historicalData.map((item) => ({
          timestamp: item.timestamp.getTime(),
          value: item.value,
        }));
        lines = [
          <Line
            key="latency"
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name="Average Latency"
          />,
        ];
        yAxisFormatter = (v) => `${v.toFixed(1)} ms`;
      }
      break;
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    if (hours <= 24) {
      return format(date, "HH:mm");
    }
    return format(date, "MMM dd");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {metric === "storage" ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis tickFormatter={yAxisFormatter} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelFormatter={(value) => {
                  const date = typeof value === "number" ? new Date(value) : new Date(value);
                  return format(date, "PPpp");
                }}
                formatter={(value: number) => {
                  if (metric === "storage") {
                    return formatTB(value);
                  }
                  if (metric === "uptime") {
                    return `${value.toFixed(1)}%`;
                  }
                  if (metric === "rewards") {
                    return `${formatNumber(value)} XAND`;
                  }
                  return `${value.toFixed(1)} ms`;
                }}
              />
              <Legend />
              {lines}
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis tickFormatter={yAxisFormatter} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelFormatter={(value) => {
                  const date = typeof value === "number" ? new Date(value) : new Date(value);
                  return format(date, "PPpp");
                }}
                formatter={(value: number) => {
                  if (metric === "uptime") {
                    return `${value.toFixed(1)}%`;
                  }
                  if (metric === "rewards") {
                    return `${formatNumber(value)} XAND`;
                  }
                  return `${value.toFixed(1)} ms`;
                }}
              />
              <Legend />
              {lines}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

