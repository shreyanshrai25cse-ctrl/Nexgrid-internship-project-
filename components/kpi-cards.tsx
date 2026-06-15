"use client"

import { Package, AlertTriangle, ArrowDownToLine, Truck, ArrowLeftRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDashboard } from "@/hooks/use-dashboard"

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  variant?: "default" | "warning" | "critical"
  isLoading?: boolean
}

function KPICard({ title, value, icon, description, variant = "default", isLoading }: KPICardProps) {
  return (
    <Card
      className={cn(
        "border-border bg-card transition-all hover:border-primary/30",
        variant === "warning" && "border-warning/50 bg-warning/5",
        variant === "critical" && "border-destructive/60 bg-destructive/10 ring-1 ring-destructive/20"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle
          className={cn(
            "text-sm font-medium text-muted-foreground",
            variant === "warning" && "text-warning",
            variant === "critical" && "text-destructive"
          )}
        >
          {title}
        </CardTitle>
        <div
          className={cn(
            "rounded-lg p-2",
            variant === "default" && "bg-secondary",
            variant === "warning" && "bg-warning/20",
            variant === "critical" && "bg-destructive/20"
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <div
            className={cn(
              "text-3xl font-bold text-card-foreground",
              variant === "warning" && "text-warning",
              variant === "critical" && "text-destructive"
            )}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        )}
        {description && (
          <p className={cn(
            "mt-1 text-xs",
            variant === "critical" ? "text-destructive/80" : "text-muted-foreground"
          )}>{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function KPICards() {
  const { data, isLoading } = useDashboard()

  const stats = data?.stats
  const alerts = data?.alerts

  const totalAlerts = (alerts?.lowStock?.length || 0) + (alerts?.outOfStock?.length || 0)
  const outOfStockCount = alerts?.outOfStock?.length || 0
  const lowStockCount = alerts?.lowStock?.length || 0

  return (
    <div className="space-y-4">
      {/* Critical Alert Card - Prominent Out of Stock / Low Stock */}
      <Card className="border-destructive/60 bg-destructive/10 ring-1 ring-destructive/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/20">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-destructive">Requires Immediate Attention</p>
              {isLoading ? (
                <Skeleton className="h-9 w-32 bg-destructive/20" />
              ) : (
                <h3 className="text-3xl font-bold text-destructive">{totalAlerts} Items</h3>
              )}
              <p className="text-sm text-destructive/80">Out of Stock or Low Stock</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <div className="text-right">
              {isLoading ? (
                <Skeleton className="h-8 w-12 bg-destructive/20" />
              ) : (
                <p className="text-2xl font-bold text-destructive">{outOfStockCount}</p>
              )}
              <p className="text-xs text-muted-foreground">Out of Stock</p>
            </div>
            <div className="h-12 w-px bg-destructive/30" />
            <div className="text-right">
              {isLoading ? (
                <Skeleton className="h-8 w-12 bg-warning/20" />
              ) : (
                <p className="text-2xl font-bold text-warning">{lowStockCount}</p>
              )}
              <p className="text-xs text-muted-foreground">Low Stock</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Products in Stock"
          value={stats?.totalStock || 0}
          icon={<Package className="h-5 w-5 text-primary" />}
          description={`${stats?.totalProducts || 0} unique products`}
          isLoading={isLoading}
        />
        <KPICard
          title="Pending Receipts"
          value={stats?.pendingReceipts || 0}
          icon={<ArrowDownToLine className="h-5 w-5 text-primary" />}
          description="Awaiting processing"
          isLoading={isLoading}
        />
        <KPICard
          title="Pending Deliveries"
          value={stats?.pendingDeliveries || 0}
          icon={<Truck className="h-5 w-5 text-primary" />}
          description="Ready for shipment"
          isLoading={isLoading}
        />
        <KPICard
          title="Internal Transfers"
          value={stats?.internalTransfers || 0}
          icon={<ArrowLeftRight className="h-5 w-5 text-primary" />}
          description="Scheduled transfers"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
