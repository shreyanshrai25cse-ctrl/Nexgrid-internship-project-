import useSWR from "swr"
import type { DashboardStats, InventoryMovement, Product } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface DashboardData {
  stats: DashboardStats
  alerts: {
    lowStock: Array<{ product: Product; stock: number }>
    outOfStock: Array<{ product: Product }>
  }
  recentMovements: Array<
    InventoryMovement & {
      productName: string
      productSku: string
      fromWarehouseName: string | null
      toWarehouseName: string | null
    }
  >
  chartData: Array<{
    month: string
    receipts: number
    deliveries: number
  }>
}

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: DashboardData }>(
    "/api/dashboard",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )

  return {
    data: data?.data,
    isLoading,
    isError: error || (data && !data.success),
    mutate,
  }
}

export function useInventoryHistory(filters?: {
  type?: string
  status?: string
  warehouseId?: string
  startDate?: string
  endDate?: string
}) {
  const params = new URLSearchParams()
  if (filters?.type && filters.type !== "all") params.set("type", filters.type)
  if (filters?.status && filters.status !== "all") params.set("status", filters.status)
  if (filters?.warehouseId && filters.warehouseId !== "all") params.set("warehouseId", filters.warehouseId)
  if (filters?.startDate) params.set("startDate", filters.startDate)
  if (filters?.endDate) params.set("endDate", filters.endDate)

  const url = `/api/inventory/history${params.toString() ? `?${params.toString()}` : ""}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 30000,
  })

  return {
    movements: data?.data?.movements || [],
    total: data?.data?.total || 0,
    isLoading,
    isError: error || (data && !data.success),
    mutate,
  }
}

export function useProducts(search?: string, category?: string) {
  const params = new URLSearchParams()
  if (search) params.set("q", search)
  if (category && category !== "all") params.set("category", category)

  const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    products: data?.data || [],
    isLoading,
    isError: error || (data && !data.success),
    mutate,
  }
}

export function useWarehouses() {
  const { data, error, isLoading, mutate } = useSWR("/api/warehouses", fetcher)

  return {
    warehouses: data?.data || [],
    isLoading,
    isError: error || (data && !data.success),
    mutate,
  }
}
