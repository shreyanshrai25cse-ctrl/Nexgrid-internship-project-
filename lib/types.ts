// User types
export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "manager" | "staff"
  createdAt: Date
}

export interface UserPublic {
  id: string
  name: string
  email: string
  role: "manager" | "staff"
  createdAt: Date
}

// Product types
export interface Product {
  id: string
  name: string
  sku: string
  category: string
  unit: string
  reorderLevel: number
  createdAt: Date
}

// Warehouse types
export interface Warehouse {
  id: string
  name: string
  location: string
  description: string
  createdAt: Date
}

// Inventory types
export interface Inventory {
  id: string
  productId: string
  warehouseId: string
  quantity: number
}

// Movement types
export type MovementType = "receipt" | "delivery" | "transfer" | "adjustment"
export type MovementStatus = "draft" | "waiting" | "ready" | "done" | "canceled"

export interface InventoryMovement {
  id: string
  type: MovementType
  productId: string
  fromWarehouse: string | null
  toWarehouse: string | null
  quantity: number
  status: MovementStatus
  createdBy: string
  createdAt: Date
  reference: string
}

// Dashboard types
export interface DashboardStats {
  totalProducts: number
  totalStock: number
  lowStockItems: number
  outOfStockItems: number
  pendingReceipts: number
  pendingDeliveries: number
  internalTransfers: number
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: "manager" | "staff"
}

export interface AuthResponse {
  user: UserPublic
  token: string
}

// Filter types
export interface InventoryFilters {
  type?: MovementType
  status?: MovementStatus
  warehouseId?: string
  category?: string
  startDate?: string
  endDate?: string
}
