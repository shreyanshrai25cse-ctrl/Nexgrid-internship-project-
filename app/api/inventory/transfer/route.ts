import { NextResponse } from "next/server"
import { processTransfer } from "@/lib/stock-utils"
import type { ApiResponse, InventoryMovement } from "@/lib/types"

// POST /api/inventory/transfer - Process internal transfer
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.productId || !body.fromWarehouse || !body.toWarehouse || !body.quantity) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Product ID, from warehouse, to warehouse, and quantity are required" },
        { status: 400 }
      )
    }

    // Validate warehouses are different
    if (body.fromWarehouse === body.toWarehouse) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Source and destination warehouses must be different" },
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

    // Process transfer
    const result = processTransfer(
      body.productId,
      body.fromWarehouse,
      body.toWarehouse,
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
        message: "Transfer processed successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Process transfer error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
