import { NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth"
import type { ApiResponse, UserPublic } from "@/lib/types"

export async function GET(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "No token provided" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const user = getUserFromToken(token)

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse<UserPublic>>({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
