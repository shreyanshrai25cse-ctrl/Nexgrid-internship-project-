"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useWarehouses, useProducts, useDashboard } from "@/hooks/use-dashboard"

export function DeliveryModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({ productId: "", warehouseId: "", quantity: "" })
  const { warehouses } = useWarehouses()
  const { products } = useProducts()
  const { mutate } = useDashboard()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true); setError(null); setSuccess(null)
    try {
      const res = await fetch("/api/inventory/delivery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: form.productId, warehouseId: form.warehouseId, quantity: parseInt(form.quantity), userId: "user-1" }) })
      const data = await res.json()
      if (!data.success) { setError(data.error || "Failed"); return }
      setSuccess(`Delivery processed! Reference: ${data.data?.reference}`)
      mutate(); setForm({ productId: "", warehouseId: "", quantity: "" })
      setTimeout(() => onOpenChange(false), 1500)
    } catch { setError("An error occurred") } finally { setIsSubmitting(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader><DialogTitle>🚚 New Delivery — Outgoing Stock</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            {success && <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">{success}</div>}
            <div className="grid gap-2">
              <Label>Product</Label>
              <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })} required>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{products.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Source Warehouse</Label>
              <Select value={form.warehouseId} onValueChange={(v) => setForm({ ...form, warehouseId: v })} required>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                <SelectContent>{warehouses.map((w: any) => <SelectItem key={w.id} value={w.id}>{w.name} — {w.location}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Quantity to Deliver</Label>
              <Input type="number" min="1" placeholder="Enter quantity" className="bg-secondary" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Spinner className="mr-2" />}Process Delivery</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
