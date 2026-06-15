import { NextResponse } from "next/server"
import { processReceipt } from "@/lib/stock-utils"
import type { ApiResponse, InventoryMovement } from "@/lib/types"

// POST /api/inventory/receipt - Process incoming stock
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

    // Process receipt
    const result = processReceipt(
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
        message: "Receipt processed successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Process receipt error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
