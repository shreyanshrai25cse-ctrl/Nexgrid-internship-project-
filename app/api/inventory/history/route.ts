import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse, InventoryMovement, MovementType, MovementStatus } from "@/lib/types"

// GET /api/inventory/history - Get movement history with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as MovementType | null
    const status = searchParams.get("status") as MovementStatus | null
    const warehouseId = searchParams.get("warehouseId")
    const productId = searchParams.get("productId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    let movements = [...db.movements]

    // Filter by type
    if (type && type !== "all") {
      movements = movements.filter((m) => m.type === type)
    }

    // Filter by status
    if (status && status !== "all") {
      movements = movements.filter((m) => m.status === status)
    }

    // Filter by warehouse
    if (warehouseId && warehouseId !== "all") {
      movements = movements.filter(
        (m) => m.fromWarehouse === warehouseId || m.toWarehouse === warehouseId
      )
    }

    // Filter by product
    if (productId) {
      movements = movements.filter((m) => m.productId === productId)
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate)
      movements = movements.filter((m) => new Date(m.createdAt) >= start)
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      movements = movements.filter((m) => new Date(m.createdAt) <= end)
    }

    // Sort by date descending
    movements.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Get total count before pagination
    const total = movements.length

    // Apply pagination
    movements = movements.slice(offset, offset + limit)

    // Enrich with product and warehouse names
    const enrichedMovements = movements.map((movement) => {
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

    return NextResponse.json<
      ApiResponse<{
        movements: typeof enrichedMovements
        total: number
        limit: number
        offset: number
      }>
    >({
      success: true,
      data: {
        movements: enrichedMovements,
        total,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error("Get history error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
