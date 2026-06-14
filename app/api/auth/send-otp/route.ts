import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { otpStore } from "@/lib/otp-store"
import type { ApiResponse } from "@/lib/types"

// POST /api/auth/send-otp
// Sends OTP to user's email for password reset
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = db.users.find((u) => u.email === email)
    if (!user) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json<ApiResponse<{ message: string }>>({
        success: true,
        data: { message: "If this email exists, an OTP has been sent." },
      })
    }

    // Generate OTP
    const otp = otpStore.generate(email)

    // In production: send via email (Nodemailer, SendGrid, Resend, etc.)
    // For demo: log to console and return in response (DEV ONLY)
    console.log(`\n🔐 OTP for ${email}: ${otp}\n`)

    return NextResponse.json<ApiResponse<{ message: string; otp?: string }>>({
      success: true,
      data: {
        message: "OTP sent successfully. Check console (dev mode).",
        otp, // ⚠️ REMOVE IN PRODUCTION — only for demo/hackathon
      },
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
