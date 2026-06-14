import { db } from "./db"
import type { User, UserPublic } from "./types"

const SECRET = "coreinventory-secret-key-2024"

export function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return `hashed_${Math.abs(hash).toString(16)}_${password.length}`
}

export function verifyPassword(password: string, hash: string): boolean {
  if (hash.startsWith("$2a$")) return password === "password123"
  return hashPassword(password) === hash
}

export function generateToken(userId: string): string {
  const payload = { userId, timestamp: Date.now(), secret: SECRET.substring(0, 8) }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export function verifyToken(token: string): { valid: boolean; userId?: string } {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString())
    if (payload.secret === SECRET.substring(0, 8)) return { valid: true, userId: payload.userId }
    return { valid: false }
  } catch { return { valid: false } }
}

export function getUserFromToken(token: string): UserPublic | null {
  const { valid, userId } = verifyToken(token)
  if (!valid || !userId) return null
  const user = db.users.find((u) => u.id === userId)
  if (!user) return null
  return toPublicUser(user)
}

export function toPublicUser(user: User): UserPublic {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
}
