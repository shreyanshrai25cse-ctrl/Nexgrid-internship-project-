"use client"
import { useWarehouses } from "@/hooks/use-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Warehouse, Package, BarChart3 } from "lucide-react"

export function WarehousesView() {
  const { warehouses, isLoading } = useWarehouses()

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Warehouses</h1><p className="text-muted-foreground">Overview of all warehouse locations</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />) :
          warehouses.map((w: any) => (
            <Card key={w.id} className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Warehouse className="h-4 w-4 text-primary" /></div>
                  {w.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{w.location}</p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1"><Package className="h-3 w-3" /><span className="text-xs">Products</span></div>
                  <div className="text-2xl font-bold text-foreground">{w.productCount ?? 0}</div>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1"><BarChart3 className="h-3 w-3" /><span className="text-xs">Total Stock</span></div>
                  <div className="text-2xl font-bold text-foreground">{w.totalStock?.toLocaleString() ?? 0}</div>
                </div>
                {w.description && <div className="col-span-2 text-xs text-muted-foreground italic">{w.description}</div>}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
