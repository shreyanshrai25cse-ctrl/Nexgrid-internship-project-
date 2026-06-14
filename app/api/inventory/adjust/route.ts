import { NextResponse } from "next/server"
import { processAdjustment } from "@/lib/stock-utils"
import type { ApiResponse, InventoryMovement } from "@/lib/types"

// POST /api/inventory/adjust - Process stock adjustment
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.productId || !body.warehouseId || body.countedQuantity === undefined) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Product ID, warehouse ID, and counted quantity are required" },
        { status: 400 }
      )
    }

    // Validate quantity
    if (body.countedQuantity < 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Counted quantity cannot be negative" },
        { status: 400 }
      )
    }

    // Process adjustment
    const result = processAdjustment(
      body.productId,
      body.warehouseId,
      body.countedQuantity,
      body.userId || "system"
    )

    if (!result.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json<ApiResponse<{ movement: InventoryMovement; difference: number }>>(
      {
        success: true,
        data: {
          movement: result.movement!,
          difference: result.difference!,
        },
        message: `Adjustment processed. Difference: ${result.difference! > 0 ? "+" : ""}${result.difference}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Process adjustment error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
