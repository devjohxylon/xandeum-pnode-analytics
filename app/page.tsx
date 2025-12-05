import { OverviewCards } from "@/components/dashboard/overview-cards";
import { TopPerformersTable } from "@/components/dashboard/top-performers-table";
import { MetricsChart } from "@/components/dashboard/metrics-chart";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Xandeum pNode Analytics</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and analytics for Xandeum storage nodes
          </p>
        </div>

        {/* Overview Cards */}
        <OverviewCards />

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <MetricsChart title="Network Uptime" metric="uptime" hours={24} />
          <MetricsChart title="Storage Utilization" metric="storage" hours={24} />
          <MetricsChart title="Total Rewards" metric="rewards" hours={24} />
          <MetricsChart title="Average Latency" metric="latency" hours={24} />
        </div>

        {/* Top Performers Table */}
        <TopPerformersTable />
      </div>
    </main>
  );
}

