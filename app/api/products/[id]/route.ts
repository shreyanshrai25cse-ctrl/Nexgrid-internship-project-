import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getTotalStock, isLowStock, isOutOfStock } from "@/lib/stock-utils"
import type { ApiResponse, Product } from "@/lib/types"

// GET /api/products/:id - Get a single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = db.products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    // Get stock by warehouse
    const stockByWarehouse = db.inventory
      .filter((inv) => inv.productId === product.id)
      .map((inv) => {
        const warehouse = db.warehouses.find((w) => w.id === inv.warehouseId)
        return {
          warehouseId: inv.warehouseId,
          warehouseName: warehouse?.name || "Unknown",
          quantity: inv.quantity,
        }
      })

    const enrichedProduct = {
      ...product,
      totalStock: getTotalStock(product.id),
      isLowStock: isLowStock(product),
      isOutOfStock: isOutOfStock(product),
      stockByWarehouse,
    }

    return NextResponse.json<ApiResponse<typeof enrichedProduct>>({
      success: true,
      data: enrichedProduct,
    })
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/products/:id - Update a product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const productIndex = db.products.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    // Check for duplicate SKU (if changing)
    if (body.sku) {
      const existingProduct = db.products.find(
        (p) => p.sku.toLowerCase() === body.sku.toLowerCase() && p.id !== id
      )
      if (existingProduct) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "SKU already exists" },
          { status: 409 }
        )
      }
    }

    // Update product
    const updatedProduct: Product = {
      ...db.products[productIndex],
      name: body.name ?? db.products[productIndex].name,
      sku: body.sku ?? db.products[productIndex].sku,
      category: body.category ?? db.products[productIndex].category,
      unit: body.unit ?? db.products[productIndex].unit,
      reorderLevel: body.reorderLevel ?? db.products[productIndex].reorderLevel,
    }

    db.products[productIndex] = updatedProduct

    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/:id - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productIndex = db.products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    // Check if product has inventory
    const hasInventory = db.inventory.some(
      (inv) => inv.productId === id && inv.quantity > 0
    )
    if (hasInventory) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Cannot delete product with existing inventory",
        },
        { status: 400 }
      )
    }

    // Remove product
    db.products.splice(productIndex, 1)

    // Remove any inventory records
    db.inventory = db.inventory.filter((inv) => inv.productId !== id)

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
