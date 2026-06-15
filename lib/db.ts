import type { User, Product, Warehouse, Inventory, InventoryMovement } from "./types"

class DataStore {
  users: User[] = []
  products: Product[] = []
  warehouses: Warehouse[] = []
  inventory: Inventory[] = []
  movements: InventoryMovement[] = []

  constructor() { this.seedData() }

  private seedData() {
    this.warehouses = [
      { id: "wh-1", name: "Warehouse A", location: "New York, NY", description: "Main distribution center", createdAt: new Date("2024-01-01") },
      { id: "wh-2", name: "Warehouse B", location: "Los Angeles, CA", description: "West coast hub", createdAt: new Date("2024-01-15") },
      { id: "wh-3", name: "Warehouse C", location: "Chicago, IL", description: "Midwest facility", createdAt: new Date("2024-02-01") },
    ]
    this.products = [
      { id: "prod-1", name: "Wireless Keyboard", sku: "KB-001", category: "Electronics", unit: "pcs", reorderLevel: 50, createdAt: new Date("2024-01-01") },
      { id: "prod-2", name: "USB-C Cable", sku: "CB-002", category: "Electronics", unit: "pcs", reorderLevel: 100, createdAt: new Date("2024-01-05") },
      { id: "prod-3", name: "Office Chair", sku: "CH-003", category: "Furniture", unit: "pcs", reorderLevel: 20, createdAt: new Date("2024-01-10") },
      { id: "prod-4", name: "Monitor Stand", sku: "MS-004", category: "Furniture", unit: "pcs", reorderLevel: 30, createdAt: new Date("2024-01-15") },
      { id: "prod-5", name: "Notebook Pack", sku: "NB-005", category: "Stationery", unit: "pack", reorderLevel: 200, createdAt: new Date("2024-01-20") },
      { id: "prod-6", name: "Wireless Mouse", sku: "MS-006", category: "Electronics", unit: "pcs", reorderLevel: 75, createdAt: new Date("2024-02-01") },
      { id: "prod-7", name: "Desk Lamp", sku: "DL-007", category: "Furniture", unit: "pcs", reorderLevel: 40, createdAt: new Date("2024-02-05") },
      { id: "prod-8", name: "Printer Paper", sku: "PP-008", category: "Stationery", unit: "ream", reorderLevel: 150, createdAt: new Date("2024-02-10") },
    ]
    this.inventory = [
      { id: "inv-1", productId: "prod-1", warehouseId: "wh-1", quantity: 120 },
      { id: "inv-2", productId: "prod-1", warehouseId: "wh-2", quantity: 85 },
      { id: "inv-3", productId: "prod-2", warehouseId: "wh-1", quantity: 250 },
      { id: "inv-4", productId: "prod-2", warehouseId: "wh-3", quantity: 45 },
      { id: "inv-5", productId: "prod-3", warehouseId: "wh-1", quantity: 35 },
      { id: "inv-6", productId: "prod-3", warehouseId: "wh-2", quantity: 12 },
      { id: "inv-7", productId: "prod-4", warehouseId: "wh-1", quantity: 28 },
      { id: "inv-8", productId: "prod-5", warehouseId: "wh-1", quantity: 180 },
      { id: "inv-9", productId: "prod-5", warehouseId: "wh-2", quantity: 220 },
      { id: "inv-10", productId: "prod-6", warehouseId: "wh-1", quantity: 65 },
      { id: "inv-11", productId: "prod-6", warehouseId: "wh-3", quantity: 30 },
      { id: "inv-12", productId: "prod-7", warehouseId: "wh-2", quantity: 18 },
      { id: "inv-13", productId: "prod-8", warehouseId: "wh-1", quantity: 320 },
      { id: "inv-14", productId: "prod-8", warehouseId: "wh-2", quantity: 140 },
      { id: "inv-15", productId: "prod-4", warehouseId: "wh-2", quantity: 5 },
      { id: "inv-16", productId: "prod-7", warehouseId: "wh-3", quantity: 0 },
    ]
    const now = new Date()
    this.movements = [
      { id: "mov-1", type: "receipt", productId: "prod-1", fromWarehouse: null, toWarehouse: "wh-1", quantity: 50, status: "done", createdBy: "user-1", createdAt: new Date(now.getTime() - 2*86400000), reference: "REC-2024-001" },
      { id: "mov-2", type: "delivery", productId: "prod-2", fromWarehouse: "wh-1", toWarehouse: null, quantity: 30, status: "done", createdBy: "user-1", createdAt: new Date(now.getTime() - 86400000), reference: "DEL-2024-001" },
      { id: "mov-3", type: "transfer", productId: "prod-3", fromWarehouse: "wh-1", toWarehouse: "wh-2", quantity: 10, status: "waiting", createdBy: "user-1", createdAt: new Date(now.getTime() - 12*3600000), reference: "TRF-2024-001" },
      { id: "mov-4", type: "receipt", productId: "prod-5", fromWarehouse: null, toWarehouse: "wh-2", quantity: 100, status: "waiting", createdBy: "user-1", createdAt: new Date(now.getTime() - 6*3600000), reference: "REC-2024-002" },
      { id: "mov-5", type: "delivery", productId: "prod-6", fromWarehouse: "wh-1", toWarehouse: null, quantity: 25, status: "ready", createdBy: "user-1", createdAt: new Date(now.getTime() - 3*3600000), reference: "DEL-2024-002" },
      { id: "mov-6", type: "adjustment", productId: "prod-8", fromWarehouse: null, toWarehouse: "wh-1", quantity: -15, status: "done", createdBy: "user-1", createdAt: new Date(now.getTime() - 4*86400000), reference: "ADJ-2024-001" },
      { id: "mov-7", type: "transfer", productId: "prod-1", fromWarehouse: "wh-1", toWarehouse: "wh-3", quantity: 20, status: "draft", createdBy: "user-1", createdAt: now, reference: "TRF-2024-002" },
      { id: "mov-8", type: "receipt", productId: "prod-7", fromWarehouse: null, toWarehouse: "wh-3", quantity: 40, status: "waiting", createdBy: "user-1", createdAt: now, reference: "REC-2024-003" },
    ]
    this.users = [
      { id: "user-1", name: "John Manager", email: "manager@coreinventory.com", password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC", role: "manager", createdAt: new Date("2024-01-01") },
      { id: "user-2", name: "Jane Staff", email: "staff@coreinventory.com", password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC", role: "staff", createdAt: new Date("2024-01-15") },
    ]
  }

  generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  generateReference(type: string): string {
    const year = new Date().getFullYear()
    const count = this.movements.filter((m) => m.type === type.toLowerCase()).length + 1
    const prefix = type.toUpperCase().substring(0, 3)
    return `${prefix}-${year}-${count.toString().padStart(3, "0")}`
  }
}

export const db = new DataStore()
