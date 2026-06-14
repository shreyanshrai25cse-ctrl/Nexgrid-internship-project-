import { NextResponse } from "next/server"
import { otpStore } from "@/lib/otp-store"
import type { ApiResponse } from "@/lib/types"

// POST /api/auth/verify-otp
// Verifies OTP and returns a reset token
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Email and OTP are required" },
        { status: 400 }
      )
    }

    const result = otpStore.verify(email, otp)
    if (!result.valid) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Generate a short-lived reset token (base64 email + timestamp)
    const resetToken = Buffer.from(JSON.stringify({ email, ts: Date.now(), type: "reset" })).toString("base64")

    return NextResponse.json<ApiResponse<{ resetToken: string }>>({
      success: true,
      data: { resetToken },
      message: "OTP verified. You can now reset your password.",
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
