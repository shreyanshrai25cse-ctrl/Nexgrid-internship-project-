"use client"
import * as React from "react"
import { useProducts } from "@/hooks/use-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, AlertTriangle, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProductsView({ onAddProduct }: { onAddProduct: () => void }) {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const { products, isLoading } = useProducts(search, category)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Products</h1><p className="text-muted-foreground">Manage your product catalog</p></div>
        <Button onClick={onAddProduct}><Plus className="mr-2 h-4 w-4" />Add Product</Button>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, SKU, category..." className="pl-9 bg-secondary" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44 bg-secondary"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Furniture">Furniture</SelectItem>
            <SelectItem value="Stationery">Stationery</SelectItem>
            <SelectItem value="Clothing">Clothing</SelectItem>
            <SelectItem value="Food">Food & Beverage</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Total Stock</TableHead>
              <TableHead className="text-right">Reorder Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )) : products.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No products found</TableCell></TableRow>
            ) : products.map((p: any) => (
              <TableRow key={p.id} className="border-border hover:bg-secondary/50">
                <TableCell className="font-medium text-card-foreground">{p.name}</TableCell>
                <TableCell className="font-mono text-sm text-primary">{p.sku}</TableCell>
                <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{p.unit}</TableCell>
                <TableCell className="text-right font-medium">{p.totalStock?.toLocaleString() ?? 0}</TableCell>
                <TableCell className="text-right text-muted-foreground">{p.reorderLevel}</TableCell>
                <TableCell>
                  {p.isOutOfStock ? <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Out of Stock</Badge>
                    : p.isLowStock ? <Badge variant="secondary" className="gap-1 bg-yellow-500/20 text-yellow-600"><AlertTriangle className="h-3 w-3" />Low Stock</Badge>
                    : <Badge variant="secondary" className="bg-green-500/20 text-green-600">In Stock</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
