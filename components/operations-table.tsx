"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowDownToLine, Truck, ArrowLeftRight, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboard } from "@/hooks/use-dashboard"
import type { MovementType, MovementStatus } from "@/lib/types"

const statusStyles: Record<MovementStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  waiting: "bg-warning/20 text-warning",
  ready: "bg-primary/20 text-primary",
  done: "bg-success/20 text-success",
  canceled: "bg-destructive/20 text-destructive",
}

const typeIcons: Record<MovementType, typeof ArrowDownToLine> = {
  receipt: ArrowDownToLine,
  delivery: Truck,
  transfer: ArrowLeftRight,
  adjustment: ClipboardList,
}

const typeLabels: Record<MovementType, string> = {
  receipt: "Receipt",
  delivery: "Delivery",
  transfer: "Transfer",
  adjustment: "Adjustment",
}

function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function OperationsTable() {
  const { data, isLoading } = useDashboard()
  const movements = data?.recentMovements || []

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">Recent Operations</h2>
          <p className="text-sm text-muted-foreground">Track all recent stock movements</p>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-card-foreground">Recent Operations</h2>
        <p className="text-sm text-muted-foreground">Track all recent stock movements</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground">Reference ID</TableHead>
            <TableHead className="text-muted-foreground">Type</TableHead>
            <TableHead className="text-muted-foreground">Product / SKU</TableHead>
            <TableHead className="text-muted-foreground text-right">Quantity</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                No recent operations found
              </TableCell>
            </TableRow>
          ) : (
            movements.map((movement) => {
              const TypeIcon = typeIcons[movement.type] || ClipboardList
              return (
                <TableRow key={movement.id} className="border-border hover:bg-secondary/50">
                  <TableCell className="text-card-foreground">
                    {formatDate(movement.createdAt)}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-primary">
                    {movement.reference}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-card-foreground">{typeLabels[movement.type]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-card-foreground">{movement.productName}</span>
                      <span className="text-xs text-muted-foreground">{movement.productSku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-card-foreground">
                    {movement.type === "adjustment" && movement.quantity > 0 && "+"}
                    {Math.abs(movement.quantity).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("font-medium", statusStyles[movement.status])}
                    >
                      {capitalizeFirst(movement.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
