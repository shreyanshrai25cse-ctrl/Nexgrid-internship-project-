import { NextResponse } from "next/server"
import { processDelivery } from "@/lib/stock-utils"
import type { ApiResponse, InventoryMovement } from "@/lib/types"

// POST /api/inventory/delivery - Process outgoing stock
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.productId || !body.warehouseId || !body.quantity) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Product ID, warehouse ID, and quantity are required" },
        { status: 400 }
      )
    }

    // Validate quantity
    if (body.quantity <= 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Quantity must be positive" },
        { status: 400 }
      )
    }

    // Process delivery
    const result = processDelivery(
      body.productId,
      body.warehouseId,
      body.quantity,
      body.userId || "system"
    )

    if (!result.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json<ApiResponse<InventoryMovement>>(
      {
        success: true,
        data: result.movement,
        message: "Delivery processed successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Process delivery error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
