import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyPassword, generateToken, toPublicUser } from "@/lib/auth"
import type { LoginRequest, ApiResponse, AuthResponse } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json()

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = db.users.find((u) => u.email === body.email)
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    if (!verifyPassword(body.password, user.password)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user.id)

    return NextResponse.json<ApiResponse<AuthResponse>>({
      success: true,
      data: {
        user: toPublicUser(user),
        token,
      },
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
