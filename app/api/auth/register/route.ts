import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword, generateToken, toPublicUser } from "@/lib/auth"
import type { RegisterRequest, ApiResponse, AuthResponse } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body: RegisterRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = db.users.find((u) => u.email === body.email)
    if (existingUser) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Email already registered" },
        { status: 409 }
      )
    }

    // Validate password length
    if (body.password.length < 6) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = {
      id: db.generateId("user"),
      name: body.name,
      email: body.email,
      password: hashPassword(body.password),
      role: body.role || ("staff" as const),
      createdAt: new Date(),
    }

    db.users.push(newUser)

    // Generate token
    const token = generateToken(newUser.id)

    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        data: {
          user: toPublicUser(newUser),
          token,
        },
        message: "Registration successful",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
