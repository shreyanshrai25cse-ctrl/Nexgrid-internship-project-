/**
 * In-memory OTP store
 * Stores OTPs with expiry (5 minutes)
 */

interface OTPRecord {
  otp: string
  email: string
  expiresAt: number
  attempts: number
}

class OTPStore {
  private store: Map<string, OTPRecord> = new Map()

  generate(email: string): string {
    // 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    this.store.set(email, {
      otp,
      email,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
    })
    return otp
  }

  verify(email: string, otp: string): { valid: boolean; error?: string } {
    const record = this.store.get(email)
    if (!record) return { valid: false, error: "No OTP found. Please request a new one." }
    if (Date.now() > record.expiresAt) {
      this.store.delete(email)
      return { valid: false, error: "OTP has expired. Please request a new one." }
    }
    record.attempts++
    if (record.attempts > 5) {
      this.store.delete(email)
      return { valid: false, error: "Too many attempts. Please request a new OTP." }
    }
    if (record.otp !== otp) return { valid: false, error: "Invalid OTP. Please try again." }
    this.store.delete(email) // OTP used, remove it
    return { valid: true }
  }

  getOTP(email: string): string | null {
    return this.store.get(email)?.otp ?? null
  }
}

// Singleton
declare global { var _otpStore: OTPStore | undefined }
export const otpStore = global._otpStore ?? (global._otpStore = new OTPStore())
