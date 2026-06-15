import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse, Warehouse } from "@/lib/types"

// GET /api/warehouses - Get all warehouses
export async function GET() {
  try {
    // Enrich with inventory counts
    const enrichedWarehouses = db.warehouses.map((warehouse) => {
      const inventoryItems = db.inventory.filter(
        (inv) => inv.warehouseId === warehouse.id
      )
      const totalStock = inventoryItems.reduce((sum, inv) => sum + inv.quantity, 0)
      const productCount = new Set(inventoryItems.map((inv) => inv.productId)).size

      return {
        ...warehouse,
        totalStock,
        productCount,
      }
    })

    return NextResponse.json<ApiResponse<typeof enrichedWarehouses>>({
      success: true,
      data: enrichedWarehouses,
    })
  } catch (error) {
    console.error("Get warehouses error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/warehouses - Create a new warehouse
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.location) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Name and location are required" },
        { status: 400 }
      )
    }

    // Create new warehouse
    const newWarehouse: Warehouse = {
      id: db.generateId("wh"),
      name: body.name,
      location: body.location,
      description: body.description || "",
      createdAt: new Date(),
    }

    db.warehouses.push(newWarehouse)

    return NextResponse.json<ApiResponse<Warehouse>>(
      {
        success: true,
        data: newWarehouse,
        message: "Warehouse created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create warehouse error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
