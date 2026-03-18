// src/compoants/Form.jsx
import React, { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { registerUser, loginUser, verifyUser, resendCode, forgotPassword, resetPassword } from "../api"

function AuthForm({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: ""
  })

  const [verificationCode, setVerificationCode] = useState("")
  const [forgotEmail, setForgotEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
    setSuccess("")
  }

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all fields")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    setError("")
    try {
      await registerUser(formData.name, formData.email, formData.password)
      setSuccess("Account created! Check your email for the verification code.")
      setShowVerify(true)
    } catch (err) {
      if (err.message.includes("Email already in use")) {
        setError("This email is already registered. Please sign in.")
      } else {
        setError(err.message || "Registration failed. Try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill all fields")
      return
    }
    setLoading(true)
    setError("")
    try {
      const data = await loginUser(formData.email, formData.password)
      localStorage.setItem("token", data.token)
      localStorage.setItem("userInfo", JSON.stringify({ email: formData.email }))
      onLoginSuccess()
    } catch (err) {
      if (err.message.includes("User not found")) {
        setError("No account found with this email")
      } else if (err.message.includes("Account not verified")) {
        setError("Account not verified. Please verify your account.")
        setShowVerify(true) // ← ينقله لصفحة التحقق
      } else if (err.message.includes("Bad credentials")) {
        setError("Wrong email or password")
      } else {
        setError(err.message || "Login failed. Try again.")
      }
      setIsLogin(true) // ← يبقى على Sign In دائماً عند الخطأ ←
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setError("Please enter the 6-digit code")
      return
    }
    setLoading(true)
    setError("")
    try {
      await verifyUser(formData.email, verificationCode)
      setSuccess("Account verified successfully!")
      setTimeout(() => {
        setShowVerify(false)
        setIsLogin(true)
        setSuccess("")
        setError("")
      }, 1500)
    } catch (err) {
      if (err.message.includes("expired")) {
        setError("Code has expired. Please request a new one.")
      } else {
        setError("Invalid code. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError("")
    try {
      await resendCode(formData.email)
      setSuccess("New code sent!")
    } catch (err) {
      setError(err.message || "Failed to resend code")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setError("Please enter your email")
      return
    }
    setLoading(true)
    setError("")
    try {
      await forgotPassword(forgotEmail)
      setSuccess("Reset token sent! Check IntelliJ Console.")
      setShowReset(true)
      setShowForgot(false)
    } catch (err) {
      if (err.message.includes("User not found")) {
        setError("No account found with this email")
      } else {
        setError(err.message || "Failed to send reset code")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      setError("Please fill all fields")
      return
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    setError("")
    try {
      await resetPassword(resetToken, newPassword)
      setSuccess("Password reset successfully!")
      setTimeout(() => {
        setShowReset(false)
        setIsLogin(true)
        setSuccess("")
        setError("")
      }, 1500)
    } catch (err) {
      if (err.message.includes("expired")) {
        setError("Token has expired. Please request a new one.")
      } else {
        setError("Invalid token. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) handleLogin()
    else handleSignup()
  }

  // ======= شاشة التحقق =======
  if (showVerify) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Verify Your Account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter the 6-digit code sent to <strong>{formData.email}</strong>
          </p>
          {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">{success}</p>}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => { setVerificationCode(e.target.value); setError("") }}
              className="w-full border rounded-lg px-4 py-2.5 text-center text-xl tracking-widest focus:outline-none focus:border-violet-500"
              maxLength={6}
            />
            <button onClick={handleVerify} disabled={loading}
              className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 disabled:opacity-50">
              {loading ? "Verifying..." : "Verify Account"}
            </button>
            <button onClick={handleResend} disabled={loading}
              className="w-full text-violet-600 text-sm hover:underline">
              Resend Code
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ======= شاشة Forgot Password =======
  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your email to reset your password</p>
          {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">{success}</p>}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => { setForgotEmail(e.target.value); setError("") }}
                className="w-full border rounded-lg pl-10 py-2.5 focus:outline-none focus:border-violet-500"
              />
            </div>
            <button onClick={handleForgotPassword} disabled={loading}
              className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Token"}
            </button>
            <button onClick={() => { setShowForgot(false); setError(""); setSuccess("") }}
              className="w-full text-gray-500 text-sm hover:underline">
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ======= شاشة Reset Password =======
  // ======= شاشة Reset Password =======
if (showReset) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit code from IntelliJ Console and your new password
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">{success}</p>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={resetToken}
            onChange={(e) => { setResetToken(e.target.value); setError("") }}
            className="w-full border rounded-lg px-4 py-2.5 text-center text-xl tracking-widest focus:outline-none focus:border-violet-500"
            maxLength={6}
          />

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setError("") }}
              className="w-full border rounded-lg pl-10 py-2.5 focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            onClick={() => { setShowForgot(true); setShowReset(false); setError("") }}
            className="w-full text-violet-600 text-sm hover:underline"
          >
            Resend Code
          </button>
        </div>

      </div>
    </div>
  )
}
  // ======= شاشة التسجيل / الدخول =======
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isLogin ? "Login to your account" : "Join our marketplace"}
        </p>
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input type="text" name="name" placeholder="Enter your full name"
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 py-2.5 focus:outline-none focus:border-violet-500" required/>
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18}/>
            <input type="email" name="email" placeholder="Enter your email"
              onChange={handleChange}
              className="w-full border rounded-lg pl-10 py-2.5 focus:outline-none focus:border-violet-500" required/>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
            <input type={showPassword ? "text" : "password"} name="password"
              placeholder="Enter password" onChange={handleChange}
              className="w-full border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-violet-500" required/>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input type="password" name="confirmPassword" placeholder="Confirm password"
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 py-2.5 focus:outline-none focus:border-violet-500" required/>
            </div>
          )}

          {/* Forgot Password Link */}
          {isLogin && (
            <div className="text-right">
              <span onClick={() => { setShowForgot(true); setError(""); setSuccess("") }}
                className="text-sm text-violet-600 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 disabled:opacity-50 transition">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
          <p className="text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess("") }}
              className="text-violet-600 cursor-pointer ml-1 hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default AuthForm