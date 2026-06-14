import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getTotalStock, getStockAlerts } from "@/lib/stock-utils"
import type { ApiResponse, DashboardStats } from "@/lib/types"

// GET /api/dashboard - Get dashboard statistics
export async function GET() {
  try {
    // Calculate total stock across all products
    const totalStock = db.products.reduce((sum, product) => {
      return sum + getTotalStock(product.id)
    }, 0)

    // Get stock alerts
    const alerts = getStockAlerts()

    // Count pending operations by type
    const pendingReceipts = db.movements.filter(
      (m) => m.type === "receipt" && (m.status === "waiting" || m.status === "draft")
    ).length

    const pendingDeliveries = db.movements.filter(
      (m) => m.type === "delivery" && (m.status === "waiting" || m.status === "ready")
    ).length

    const internalTransfers = db.movements.filter(
      (m) => m.type === "transfer" && (m.status === "waiting" || m.status === "draft")
    ).length

    const stats: DashboardStats = {
      totalProducts: db.products.length,
      totalStock,
      lowStockItems: alerts.lowStock.length,
      outOfStockItems: alerts.outOfStock.length,
      pendingReceipts,
      pendingDeliveries,
      internalTransfers,
    }

    // Get recent movements for activity feed
    const recentMovements = db.movements
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((movement) => {
        const product = db.products.find((p) => p.id === movement.productId)
        const fromWarehouse = movement.fromWarehouse
          ? db.warehouses.find((w) => w.id === movement.fromWarehouse)
          : null
        const toWarehouse = movement.toWarehouse
          ? db.warehouses.find((w) => w.id === movement.toWarehouse)
          : null

        return {
          ...movement,
          productName: product?.name || "Unknown",
          productSku: product?.sku || "Unknown",
          fromWarehouseName: fromWarehouse?.name || null,
          toWarehouseName: toWarehouse?.name || null,
        }
      })

    // Get stock movement data for chart (last 12 months)
    const chartData = generateChartData()

    return NextResponse.json<
      ApiResponse<{
        stats: DashboardStats
        alerts: typeof alerts
        recentMovements: typeof recentMovements
        chartData: typeof chartData
      }>
    >({
      success: true,
      data: {
        stats,
        alerts,
        recentMovements,
        chartData,
      },
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Generate chart data for stock movements (mock data for demo)
function generateChartData() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  // Generate realistic looking data
  return months.map((month, index) => {
    const baseReceipts = 150 + Math.floor(Math.random() * 100)
    const baseDeliveries = 120 + Math.floor(Math.random() * 80)
    
    // Add seasonal variation
    const seasonalFactor = index >= 9 || index <= 1 ? 1.3 : 1 // Higher in Q4/Q1
    
    return {
      month,
      receipts: Math.floor(baseReceipts * seasonalFactor),
      deliveries: Math.floor(baseDeliveries * seasonalFactor),
    }
  })
}
