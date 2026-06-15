"use client"
import * as React from "react"
import { useInventoryHistory } from "@/hooks/use-dashboard"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { MovementStatus, MovementType } from "@/lib/types"

const statusStyles: Record<MovementStatus, string> = {
  draft: "bg-muted text-muted-foreground", waiting: "bg-yellow-500/20 text-yellow-600",
  ready: "bg-blue-500/20 text-blue-600", done: "bg-green-500/20 text-green-600", canceled: "bg-red-500/20 text-red-600",
}

export function HistoryView() {
  const [type, setType] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const { movements, total, isLoading } = useInventoryHistory({ type, status })

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Move History</h1><p className="text-muted-foreground">Complete audit trail of all stock movements ({total} total)</p></div>
      <div className="flex gap-3">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-44 bg-secondary"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="receipt">Receipts</SelectItem>
            <SelectItem value="delivery">Deliveries</SelectItem>
            <SelectItem value="transfer">Transfers</SelectItem>
            <SelectItem value="adjustment">Adjustments</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 bg-secondary"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Date</TableHead><TableHead>Reference</TableHead><TableHead>Type</TableHead>
              <TableHead>Product</TableHead><TableHead>From</TableHead><TableHead>To</TableHead>
              <TableHead className="text-right">Qty</TableHead><TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={8}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : movements.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No movements found</TableCell></TableRow>
            ) : movements.map((m: any) => (
              <TableRow key={m.id} className="border-border hover:bg-secondary/50">
                <TableCell className="text-sm">{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="font-mono text-sm text-primary">{m.reference}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{m.type}</Badge></TableCell>
                <TableCell><div className="font-medium">{m.productName}</div><div className="text-xs text-muted-foreground">{m.productSku}</div></TableCell>
                <TableCell className="text-sm text-muted-foreground">{m.fromWarehouseName ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{m.toWarehouseName ?? "—"}</TableCell>
                <TableCell className="text-right font-medium">{m.quantity > 0 && m.type === "adjustment" ? "+" : ""}{m.quantity}</TableCell>
                <TableCell><Badge variant="secondary" className={cn("capitalize", statusStyles[m.status as MovementStatus])}>{m.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
