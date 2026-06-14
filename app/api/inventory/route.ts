import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse } from "@/lib/types"

// GET /api/inventory - Get all inventory with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const warehouseId = searchParams.get("warehouseId")
    const productId = searchParams.get("productId")
    const lowStockOnly = searchParams.get("lowStock") === "true"

    let inventory = [...db.inventory]

    // Filter by warehouse
    if (warehouseId && warehouseId !== "all") {
      inventory = inventory.filter((inv) => inv.warehouseId === warehouseId)
    }

    // Filter by product
    if (productId) {
      inventory = inventory.filter((inv) => inv.productId === productId)
    }

    // Enrich with product and warehouse details
    let enrichedInventory = inventory.map((inv) => {
      const product = db.products.find((p) => p.id === inv.productId)
      const warehouse = db.warehouses.find((w) => w.id === inv.warehouseId)

      return {
        ...inv,
        productName: product?.name || "Unknown",
        productSku: product?.sku || "Unknown",
        productCategory: product?.category || "Unknown",
        reorderLevel: product?.reorderLevel || 0,
        warehouseName: warehouse?.name || "Unknown",
        isLowStock: product ? inv.quantity <= product.reorderLevel && inv.quantity > 0 : false,
        isOutOfStock: inv.quantity === 0,
      }
    })

    // Filter low stock only
    if (lowStockOnly) {
      enrichedInventory = enrichedInventory.filter(
        (inv) => inv.isLowStock || inv.isOutOfStock
      )
    }

    return NextResponse.json<ApiResponse<typeof enrichedInventory>>({
      success: true,
      data: enrichedInventory,
    })
  } catch (error) {
    console.error("Get inventory error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
