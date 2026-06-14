import { db } from "./db"
import type { Product, Inventory, InventoryMovement } from "./types"

export function getTotalStock(productId: string): number {
  return db.inventory.filter((inv) => inv.productId === productId).reduce((sum, inv) => sum + inv.quantity, 0)
}

export function getWarehouseStock(productId: string, warehouseId: string): number {
  return db.inventory.find((inv) => inv.productId === productId && inv.warehouseId === warehouseId)?.quantity ?? 0
}

export function isLowStock(product: Product): boolean {
  const total = getTotalStock(product.id)
  return total > 0 && total <= product.reorderLevel
}

export function isOutOfStock(product: Product): boolean {
  return getTotalStock(product.id) === 0
}

export function getLowStockProducts(): Product[] {
  return db.products.filter((p) => isLowStock(p))
}

export function getOutOfStockProducts(): Product[] {
  return db.products.filter((p) => isOutOfStock(p))
}

export function increaseStock(productId: string, warehouseId: string, quantity: number): Inventory {
  const existing = db.inventory.find((inv) => inv.productId === productId && inv.warehouseId === warehouseId)
  if (existing) { existing.quantity += quantity; return existing }
  const newInv: Inventory = { id: db.generateId("inv"), productId, warehouseId, quantity }
  db.inventory.push(newInv)
  return newInv
}

export function decreaseStock(productId: string, warehouseId: string, quantity: number): Inventory | null {
  const inv = db.inventory.find((i) => i.productId === productId && i.warehouseId === warehouseId)
  if (!inv || inv.quantity < quantity) return null
  inv.quantity -= quantity
  return inv
}

export function createMovement(type: InventoryMovement["type"], productId: string, quantity: number, options: { fromWarehouse?: string | null; toWarehouse?: string | null; status?: InventoryMovement["status"]; createdBy?: string } = {}): InventoryMovement {
  const movement: InventoryMovement = {
    id: db.generateId("mov"), type, productId,
    fromWarehouse: options.fromWarehouse ?? null,
    toWarehouse: options.toWarehouse ?? null,
    quantity, status: options.status ?? "done",
    createdBy: options.createdBy ?? "system",
    createdAt: new Date(), reference: db.generateReference(type),
  }
  db.movements.push(movement)
  return movement
}

export function processReceipt(productId: string, warehouseId: string, quantity: number, userId: string) {
  if (!db.products.find((p) => p.id === productId)) return { success: false, error: "Product not found" }
  if (!db.warehouses.find((w) => w.id === warehouseId)) return { success: false, error: "Warehouse not found" }
  increaseStock(productId, warehouseId, quantity)
  return { success: true, movement: createMovement("receipt", productId, quantity, { toWarehouse: warehouseId, status: "done", createdBy: userId }) }
}

export function processDelivery(productId: string, warehouseId: string, quantity: number, userId: string) {
  if (!db.products.find((p) => p.id === productId)) return { success: false, error: "Product not found" }
  if (!db.warehouses.find((w) => w.id === warehouseId)) return { success: false, error: "Warehouse not found" }
  const result = decreaseStock(productId, warehouseId, quantity)
  if (!result) return { success: false, error: "Insufficient stock" }
  return { success: true, movement: createMovement("delivery", productId, quantity, { fromWarehouse: warehouseId, status: "done", createdBy: userId }) }
}

export function processTransfer(productId: string, fromWarehouseId: string, toWarehouseId: string, quantity: number, userId: string) {
  if (!db.products.find((p) => p.id === productId)) return { success: false, error: "Product not found" }
  if (!db.warehouses.find((w) => w.id === fromWarehouseId) || !db.warehouses.find((w) => w.id === toWarehouseId)) return { success: false, error: "Warehouse not found" }
  if (!decreaseStock(productId, fromWarehouseId, quantity)) return { success: false, error: "Insufficient stock in source warehouse" }
  increaseStock(productId, toWarehouseId, quantity)
  return { success: true, movement: createMovement("transfer", productId, quantity, { fromWarehouse: fromWarehouseId, toWarehouse: toWarehouseId, status: "done", createdBy: userId }) }
}

export function processAdjustment(productId: string, warehouseId: string, countedQuantity: number, userId: string) {
  if (!db.products.find((p) => p.id === productId)) return { success: false, error: "Product not found" }
  if (!db.warehouses.find((w) => w.id === warehouseId)) return { success: false, error: "Warehouse not found" }
  const currentStock = getWarehouseStock(productId, warehouseId)
  const difference = countedQuantity - currentStock
  let inv = db.inventory.find((i) => i.productId === productId && i.warehouseId === warehouseId)
  if (inv) { inv.quantity = countedQuantity } else { db.inventory.push({ id: db.generateId("inv"), productId, warehouseId, quantity: countedQuantity }) }
  return { success: true, movement: createMovement("adjustment", productId, difference, { toWarehouse: warehouseId, status: "done", createdBy: userId }), difference }
}

export function getStockAlerts() {
  const lowStock: Array<{ product: Product; stock: number }> = []
  const outOfStock: Array<{ product: Product }> = []
  for (const product of db.products) {
    const stock = getTotalStock(product.id)
    if (stock === 0) outOfStock.push({ product })
    else if (stock <= product.reorderLevel) lowStock.push({ product, stock })
  }
  return { lowStock, outOfStock }
}
