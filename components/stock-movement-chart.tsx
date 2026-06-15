"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useDashboard } from "@/hooks/use-dashboard"

const chartConfig = {
  receipts: {
    label: "Receipts (Incoming)",
    color: "var(--color-chart-1)",
  },
  deliveries: {
    label: "Deliveries (Outgoing)",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

export function StockMovementChart() {
  const { data, isLoading } = useDashboard()
  const chartData = data?.chartData || []

  const totalReceipts = chartData.reduce((sum, item) => sum + item.receipts, 0)
  const totalDeliveries = chartData.reduce((sum, item) => sum + item.deliveries, 0)
  const netMovement = totalReceipts - totalDeliveries

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Stock Movement Overview
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Comparing incoming receipts vs outgoing deliveries over time
              </CardDescription>
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Stock Movement Overview
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Comparing incoming receipts vs outgoing deliveries over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-xs text-muted-foreground">Total In</p>
              <p className="text-lg font-semibold text-primary">
                {totalReceipts.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Out</p>
              <p className="text-lg font-semibold text-chart-2">
                {totalDeliveries.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Change</p>
              <p className={`text-lg font-semibold ${netMovement >= 0 ? "text-primary" : "text-destructive"}`}>
                {netMovement >= 0 ? "+" : ""}{netMovement.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillReceipts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillDeliveries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
              />
              <ChartTooltip
                cursor={{ stroke: "var(--color-muted-foreground)", strokeWidth: 1 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="receipts"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#fillReceipts)"
              />
              <Area
                type="monotone"
                dataKey="deliveries"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                fill="url(#fillDeliveries)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
