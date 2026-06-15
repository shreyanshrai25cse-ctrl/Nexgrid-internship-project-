import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { ApiResponse, Warehouse } from "@/lib/types"

// GET /api/warehouses/:id - Get a single warehouse
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const warehouse = db.warehouses.find((w) => w.id === id)

    if (!warehouse) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      )
    }

    // Get inventory for this warehouse
    const inventoryItems = db.inventory.filter(
      (inv) => inv.warehouseId === warehouse.id
    )

    const productsInStock = inventoryItems.map((inv) => {
      const product = db.products.find((p) => p.id === inv.productId)
      return {
        productId: inv.productId,
        productName: product?.name || "Unknown",
        sku: product?.sku || "Unknown",
        quantity: inv.quantity,
      }
    })

    const enrichedWarehouse = {
      ...warehouse,
      totalStock: inventoryItems.reduce((sum, inv) => sum + inv.quantity, 0),
      productCount: productsInStock.length,
      productsInStock,
    }

    return NextResponse.json<ApiResponse<typeof enrichedWarehouse>>({
      success: true,
      data: enrichedWarehouse,
    })
  } catch (error) {
    console.error("Get warehouse error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/warehouses/:id - Update a warehouse
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const warehouseIndex = db.warehouses.findIndex((w) => w.id === id)
    if (warehouseIndex === -1) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      )
    }

    // Update warehouse
    const updatedWarehouse: Warehouse = {
      ...db.warehouses[warehouseIndex],
      name: body.name ?? db.warehouses[warehouseIndex].name,
      location: body.location ?? db.warehouses[warehouseIndex].location,
      description: body.description ?? db.warehouses[warehouseIndex].description,
    }

    db.warehouses[warehouseIndex] = updatedWarehouse

    return NextResponse.json<ApiResponse<Warehouse>>({
      success: true,
      data: updatedWarehouse,
      message: "Warehouse updated successfully",
    })
  } catch (error) {
    console.error("Update warehouse error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/warehouses/:id - Delete a warehouse
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const warehouseIndex = db.warehouses.findIndex((w) => w.id === id)

    if (warehouseIndex === -1) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Warehouse not found" },
        { status: 404 }
      )
    }

    // Check if warehouse has inventory
    const hasInventory = db.inventory.some(
      (inv) => inv.warehouseId === id && inv.quantity > 0
    )
    if (hasInventory) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Cannot delete warehouse with existing inventory",
        },
        { status: 400 }
      )
    }

    // Remove warehouse
    db.warehouses.splice(warehouseIndex, 1)

    // Remove any inventory records
    db.inventory = db.inventory.filter((inv) => inv.warehouseId !== id)

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Warehouse deleted successfully",
    })
  } catch (error) {
    console.error("Delete warehouse error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
