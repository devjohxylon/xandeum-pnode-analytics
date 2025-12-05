import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { TopPerformersTable } from "@/components/dashboard/top-performers-table";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive network metrics and node performance analytics
          </p>
        </div>

        {/* Overview Cards */}
        <DashboardOverview />

        {/* Charts Section */}
        <DashboardCharts />

        {/* Top Performers Table */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Top Performing Nodes
            </h2>
            <p className="text-sm text-muted-foreground">
              Sort, search, and analyze the best performing pNodes
            </p>
          </div>
          <TopPerformersTable />
        </div>
      </div>
    </main>
  );
}

