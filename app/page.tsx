import { HeroMetrics } from "@/components/dashboard/hero-metrics";
import { FeaturedCharts } from "@/components/dashboard/featured-charts";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TopPerformersTable } from "@/components/dashboard/top-performers-table";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] -z-10" />
      
      <div className="container mx-auto px-4 py-12 space-y-12 relative z-10">
        {/* Hero Section */}
        <div className="space-y-6 animate-fade-in">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Xandeum pNode Analytics
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time monitoring and analytics for Xandeum storage nodes.
              <br />
              Make informed delegation decisions with comprehensive network insights.
            </p>
          </div>

          {/* Hero Metrics */}
          <HeroMetrics />
        </div>

        {/* Featured Charts Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Network Performance Trends
            </h2>
            <p className="text-muted-foreground">
              Track network health and storage utilization over time
            </p>
          </div>
          <FeaturedCharts />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <p className="text-muted-foreground">
              Explore nodes, compare performance, and analyze network data
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Top Performers Table */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Top Performing Nodes
            </h2>
            <p className="text-muted-foreground">
              Discover the highest performing pNodes in the network
            </p>
          </div>
          <TopPerformersTable />
        </div>
      </div>
    </main>
  );
}

