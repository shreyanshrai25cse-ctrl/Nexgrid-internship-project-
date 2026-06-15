"use client"
import * as React from "react"
import { Package, Eye, EyeOff, Mail, Lock, KeyRound, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

type AuthMode = "login" | "forgot" | "verify-otp" | "reset-password" | "register"

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [mode, setMode] = React.useState<AuthMode>("login")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [otpDisplayed, setOtpDisplayed] = React.useState<string | null>(null)
  const [resetToken, setResetToken] = React.useState("")
  const [otpEmail, setOtpEmail] = React.useState("")
  const [countdown, setCountdown] = React.useState(0)

  const [loginForm, setLoginForm] = React.useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = React.useState({ name: "", email: "", password: "", role: "staff" })
  const [forgotEmail, setForgotEmail] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [resetForm, setResetForm] = React.useState({ password: "", confirm: "" })

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  const clearMessages = () => { setError(null); setSuccess(null) }

  // ── LOGIN ──────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages(); setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginForm) })
      const data = await res.json()
      if (!data.success) { setError(data.error); return }
      localStorage.setItem("auth_token", data.data.token)
      onLoginSuccess()
    } catch { setError("Connection error. Try again.") } finally { setIsLoading(false) }
  }

  // ── REGISTER ───────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages(); setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(registerForm) })
      const data = await res.json()
      if (!data.success) { setError(data.error); return }
      localStorage.setItem("auth_token", data.data.token)
      onLoginSuccess()
    } catch { setError("Connection error. Try again.") } finally { setIsLoading(false) }
  }

  // ── SEND OTP ───────────────────────────────────────────
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages(); setIsLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: forgotEmail }) })
      const data = await res.json()
      if (!data.success) { setError(data.error); return }
      setOtpEmail(forgotEmail)
      setOtpDisplayed(data.data?.otp ?? null) // demo only
      setSuccess("OTP sent! Check below (demo mode).")
      setCountdown(60)
      setMode("verify-otp")
    } catch { setError("Connection error. Try again.") } finally { setIsLoading(false) }
  }

  // ── VERIFY OTP ─────────────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages(); setIsLoading(true)
    try {
      const res = await fetch("/api/auth/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: otpEmail, otp }) })
      const data = await res.json()
      if (!data.success) { setError(data.error); return }
      setResetToken(data.data.resetToken)
      setSuccess("OTP verified!")
      setTimeout(() => setMode("reset-password"), 800)
    } catch { setError("Connection error. Try again.") } finally { setIsLoading(false) }
  }

  // ── RESET PASSWORD ─────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages()
    if (resetForm.password !== resetForm.confirm) { setError("Passwords do not match"); return }
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resetToken, newPassword: resetForm.password }) })
      const data = await res.json()
      if (!data.success) { setError(data.error); return }
      localStorage.setItem("auth_token", data.data.token)
      setSuccess("Password reset! Logging you in...")
      setTimeout(() => onLoginSuccess(), 1000)
    } catch { setError("Connection error. Try again.") } finally { setIsLoading(false) }
  }

  // ── RESEND OTP ─────────────────────────────────────────
  const handleResendOTP = async () => {
    if (countdown > 0) return
    setIsLoading(true); clearMessages()
    try {
      const res = await fetch("/api/auth/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: otpEmail }) })
      const data = await res.json()
      if (!data.success) { setError(data.error); return }
      setOtpDisplayed(data.data?.otp ?? null)
      setSuccess("New OTP sent!"); setCountdown(60)
    } catch { setError("Connection error.") } finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Package className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">CoreInventory</h1>
            <p className="text-sm text-muted-foreground">Warehouse Management System</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-card-foreground">Welcome back</h2>
                <p className="text-sm text-muted-foreground">Sign in to your account</p>
              </div>
              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="manager@coreinventory.com" className="pl-9 bg-secondary" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" onClick={() => { setMode("forgot"); setForgotEmail(loginForm.email) }} className="text-xs text-primary hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-9 bg-secondary" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2" />}Sign In
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button type="button" onClick={() => { setMode("register"); clearMessages() }} className="text-primary hover:underline font-medium">Register</button>
              </p>
              <div className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>📧 manager@coreinventory.com</p>
                <p>🔑 password123</p>
              </div>
            </form>
          )}

          {/* ── REGISTER ── */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setMode("login"); clearMessages() }} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></button>
                <div><h2 className="text-xl font-semibold">Create Account</h2><p className="text-sm text-muted-foreground">Join CoreInventory</p></div>
              </div>
              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Manager" className="bg-secondary" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="you@company.com" className="pl-9 bg-secondary" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" className="pl-9 pr-9 bg-secondary" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm" value={registerForm.role} onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}>
                  <option value="staff">Warehouse Staff</option>
                  <option value="manager">Inventory Manager</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && <Spinner className="mr-2" />}Create Account</Button>
              <p className="text-center text-sm text-muted-foreground">Already have an account?{" "}
                <button type="button" onClick={() => { setMode("login"); clearMessages() }} className="text-primary hover:underline font-medium">Sign in</button>
              </p>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {mode === "forgot" && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setMode("login"); clearMessages() }} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></button>
                <div><h2 className="text-xl font-semibold">Reset Password</h2><p className="text-sm text-muted-foreground">We'll send an OTP to your email</p></div>
              </div>
              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600">{success}</div>}
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="your@email.com" className="pl-9 bg-secondary" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && <Spinner className="mr-2" />}<KeyRound className="mr-2 h-4 w-4" />Send OTP</Button>
            </form>
          )}

          {/* ── VERIFY OTP ── */}
          {mode === "verify-otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setMode("forgot"); clearMessages() }} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></button>
                <div><h2 className="text-xl font-semibold">Enter OTP</h2><p className="text-sm text-muted-foreground">Sent to {otpEmail}</p></div>
              </div>
              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{success}</div>}

              {/* OTP Display (demo) */}
              {otpDisplayed && (
                <div className="rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">🔐 Demo Mode — Your OTP:</p>
                  <p className="text-3xl font-bold font-mono tracking-widest text-primary">{otpDisplayed}</p>
                  <p className="text-xs text-muted-foreground mt-1">Valid for 5 minutes</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>6-Digit OTP</Label>
                <Input placeholder="000000" className="bg-secondary text-center text-2xl tracking-widest font-mono" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>{isLoading && <Spinner className="mr-2" />}Verify OTP</Button>
              <div className="text-center">
                <button type="button" onClick={handleResendOTP} disabled={countdown > 0 || isLoading} className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline flex items-center gap-1 mx-auto">
                  <RefreshCw className="h-3 w-3" />{countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* ── RESET PASSWORD ── */}
          {mode === "reset-password" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div><h2 className="text-xl font-semibold">New Password</h2><p className="text-sm text-muted-foreground">Choose a strong password</p></div>
              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{success}</div>}
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" className="pl-9 pr-9 bg-secondary" value={resetForm.password} onChange={(e) => setResetForm({ ...resetForm, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} placeholder="Repeat password" className="pl-9 bg-secondary" value={resetForm.confirm} onChange={(e) => setResetForm({ ...resetForm, confirm: e.target.value })} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && <Spinner className="mr-2" />}Reset Password & Login</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
