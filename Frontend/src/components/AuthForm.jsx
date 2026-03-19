import React, { useState } from "react"
import { registerUser, loginUser, verifyUser, resendCode, forgotPassword, resetPassword } from "../api"
import VerifyScreen from "./auth/VerifyScreen"
import ForgotPassword from "./auth/ForgotPassword"
import ResetPassword from "./auth/ResetPassword"
import LoginForm from "./auth/LoginForm"
import SignupForm from "./auth/SignupForm"

function AuthForm({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [verificationCode, setVerificationCode] = useState("")
  const [forgotEmail, setForgotEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(""); setSuccess("")
  }

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password) { setError("Please fill all fields"); return }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters"); return }
    setLoading(true); setError("")
    try {
      await registerUser(formData.name, formData.email, formData.password)
      setSuccess("Account created! Check your email for the verification code.")
      setShowVerify(true)
    } catch (err) {
      setError(err.message.includes("Email already in use") ? "This email is already registered. Please sign in." : err.message || "Registration failed. Try again.")
    } finally { setLoading(false) }
  }

  const handleLogin = async () => {
    if (!formData.email || !formData.password) { setError("Please fill all fields"); return }
    setLoading(true); setError("")
    try {
      const data = await loginUser(formData.email, formData.password)
      localStorage.setItem("token", data.token)
      localStorage.setItem("userInfo", JSON.stringify({ email: formData.email }))
      onLoginSuccess()
    } catch (err) {
      if (err.message.includes("User not found")) setError("No account found with this email")
      else if (err.message.includes("Account not verified")) { setError("Account not verified. Please verify your account."); setShowVerify(true) }
      else if (err.message.includes("Bad credentials")) setError("Wrong email or password")
      else setError(err.message || "Login failed. Try again.")
      setIsLogin(true)
    } finally { setLoading(false) }
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length < 6) { setError("Please enter the 6-digit code"); return }
    setLoading(true); setError("")
    try {
      await verifyUser(formData.email, verificationCode)
      setSuccess("Account verified successfully!")
      setTimeout(() => { setShowVerify(false); setIsLogin(true); setSuccess(""); setError("") }, 1500)
    } catch (err) {
      setError(err.message.includes("expired") ? "Code has expired. Please request a new one." : "Invalid code. Please try again.")
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    setLoading(true); setError("")
    try { await resendCode(formData.email); setSuccess("New code sent!") }
    catch (err) { setError(err.message || "Failed to resend code") }
    finally { setLoading(false) }
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) { setError("Please enter your email"); return }
    setLoading(true); setError("")
    try {
      await forgotPassword(forgotEmail)
      setSuccess("Reset token sent! Check IntelliJ Console.")
      setShowReset(true); setShowForgot(false)
    } catch (err) {
      setError(err.message.includes("User not found") ? "No account found with this email" : err.message || "Failed to send reset code")
    } finally { setLoading(false) }
  }

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) { setError("Please fill all fields"); return }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return }
    setLoading(true); setError("")
    try {
      await resetPassword(resetToken, newPassword)
      setSuccess("Password reset successfully!")
      setTimeout(() => { setShowReset(false); setIsLogin(true); setSuccess(""); setError("") }, 1500)
    } catch (err) {
      setError(err.message.includes("expired") ? "Token has expired. Please request a new one." : "Invalid token. Please try again.")
    } finally { setLoading(false) }
  }

  const handleSubmit = (e) => { e.preventDefault(); isLogin ? handleLogin() : handleSignup() }

  if (showVerify) return <VerifyScreen email={formData.email} verificationCode={verificationCode} setVerificationCode={(val) => { setVerificationCode(val); setError("") }} handleVerify={handleVerify} handleResend={handleResend} loading={loading} error={error} success={success} />

  if (showForgot) return <ForgotPassword forgotEmail={forgotEmail} setForgotEmail={(val) => { setForgotEmail(val); setError("") }} handleForgotPassword={handleForgotPassword} onBack={() => { setShowForgot(false); setError(""); setSuccess("") }} loading={loading} error={error} success={success} />

  if (showReset) return <ResetPassword resetToken={resetToken} setResetToken={(val) => { setResetToken(val); setError("") }} newPassword={newPassword} setNewPassword={(val) => { setNewPassword(val); setError("") }} handleResetPassword={handleResetPassword} onResend={() => { setShowForgot(true); setShowReset(false); setError("") }} loading={loading} error={error} success={success} />

  if (isLogin) return <LoginForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} showPassword={showPassword} setShowPassword={setShowPassword} onForgot={() => { setShowForgot(true); setError(""); setSuccess("") }} onSwitch={() => { setIsLogin(false); setError(""); setSuccess("") }} loading={loading} error={error} success={success} />

  return <SignupForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} onSwitch={() => { setIsLogin(true); setError(""); setSuccess("") }} loading={loading} error={error} success={success} />
}

export default AuthForm