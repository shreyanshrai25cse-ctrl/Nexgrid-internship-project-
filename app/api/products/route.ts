import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getTotalStock, isLowStock, isOutOfStock } from "@/lib/stock-utils"
import type { ApiResponse, Product } from "@/lib/types"

// GET /api/products - Get all products with optional search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase()
    const category = searchParams.get("category")

    let products = [...db.products]

    // Filter by search query
    if (query) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (category && category !== "all") {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Enrich with stock info
    const enrichedProducts = products.map((product) => ({
      ...product,
      totalStock: getTotalStock(product.id),
      isLowStock: isLowStock(product),
      isOutOfStock: isOutOfStock(product),
    }))

    return NextResponse.json<ApiResponse<typeof enrichedProducts>>({
      success: true,
      data: enrichedProducts,
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.sku || !body.category || !body.unit) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Name, SKU, category, and unit are required" },
        { status: 400 }
      )
    }

    // Check for duplicate SKU
    const existingProduct = db.products.find(
      (p) => p.sku.toLowerCase() === body.sku.toLowerCase()
    )
    if (existingProduct) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "SKU already exists" },
        { status: 409 }
      )
    }

    // Create new product
    const newProduct: Product = {
      id: db.generateId("prod"),
      name: body.name,
      sku: body.sku,
      category: body.category,
      unit: body.unit,
      reorderLevel: body.reorderLevel || 10,
      createdAt: new Date(),
    }

    db.products.push(newProduct)

    // If initial stock is provided, create inventory
    if (body.initialStock && body.warehouseId) {
      const warehouse = db.warehouses.find((w) => w.id === body.warehouseId)
      if (warehouse) {
        db.inventory.push({
          id: db.generateId("inv"),
          productId: newProduct.id,
          warehouseId: body.warehouseId,
          quantity: body.initialStock,
        })
      }
    }

    return NextResponse.json<ApiResponse<Product>>(
      {
        success: true,
        data: newProduct,
        message: "Product created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
