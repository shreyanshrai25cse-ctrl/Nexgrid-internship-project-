import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword, generateToken, toPublicUser } from "@/lib/auth"
import type { ApiResponse, AuthResponse } from "@/lib/types"

// POST /api/auth/reset-password
// Resets password using verified reset token
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { resetToken, newPassword } = body

    if (!resetToken || !newPassword) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Reset token and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Decode and validate reset token
    let payload: { email: string; ts: number; type: string }
    try {
      payload = JSON.parse(Buffer.from(resetToken, "base64").toString())
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid reset token" },
        { status: 400 }
      )
    }

    if (payload.type !== "reset") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid reset token" },
        { status: 400 }
      )
    }

    // Token valid for 15 minutes
    if (Date.now() - payload.ts > 15 * 60 * 1000) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Reset token has expired. Please request a new OTP." },
        { status: 400 }
      )
    }

    // Find user
    const user = db.users.find((u) => u.email === payload.email)
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Update password
    user.password = hashPassword(newPassword)

    // Auto-login after reset
    const token = generateToken(user.id)

    return NextResponse.json<ApiResponse<AuthResponse>>({
      success: true,
      data: { user: toPublicUser(user), token },
      message: "Password reset successfully. You are now logged in.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
