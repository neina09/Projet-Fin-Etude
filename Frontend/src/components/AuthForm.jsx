import React, { useState, useEffect } from "react"
import { forgotPassword, loginUser, registerUser, resendCode, resetPassword, verifyUser } from "../api"
import ForgotPassword from "./auth/ForgotPassword"
import LoginForm from "./auth/LoginForm"
import ResetPassword from "./auth/ResetPassword"
import SignupForm from "./auth/SignupForm"
import VerifyScreen from "./auth/VerifyScreen"

export default function AuthForm({ onLoginSuccess, onViewChange }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({ name: "", phone: "", password: "", confirmPassword: "", userType: "CLIENT" })
  const [verificationCode, setVerificationCode] = useState("")
  const [forgotPhone, setForgotPhone] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")

  // Sync internal state with parent view state
  useEffect(() => {
    if (!onViewChange) return;
    
    if (showVerify) onViewChange("verify")
    else if (showForgot) onViewChange("forgot")
    else if (showReset) onViewChange("reset")
    else if (isLogin) onViewChange("login")
    else onViewChange("signup")
  }, [isLogin, showVerify, showForgot, showReset, onViewChange])

  const clearMessages = () => {
    setError("")
    setSuccess("")
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    clearMessages()
  }

  const handleSignup = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      setError("يرجى ملء جميع الحقول.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.")
      return
    }
    if (formData.password.length < 6) {
      setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.")
      return
    }

    setLoading(true)
    clearMessages()

    try {
      await registerUser(formData.name, formData.phone, formData.password, formData.userType)
      setSuccess("تم إنشاء الحساب. أدخل رمز التحقق الذي وصلك عبر الهاتف.")
      setShowVerify(true)
    } catch (err) {
      setError(err.message.includes("Phone already in use") ? "رقم الهاتف مستخدم بالفعل." : (err.message || "فشل إنشاء الحساب."))
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!formData.phone || !formData.password) {
      setError("يرجى إدخال رقم الهاتف وكلمة المرور.")
      return
    }

    setLoading(true)
    clearMessages()

    try {
      const data = await loginUser(formData.phone, formData.password)
      localStorage.setItem("token", data.token)
      localStorage.setItem("userInfo", JSON.stringify({ phone: formData.phone }))
      onLoginSuccess(data.token)
    } catch (err) {
      if (err.message.includes("User not found")) {
        setError("لا يوجد حساب مرتبط بهذا الرقم.")
      } else if (err.message.includes("Account not verified")) {
        setError("الحساب غير مفعّل بعد. أكمل التحقق أولاً.")
        setShowVerify(true)
      } else if (err.message.includes("Bad credentials")) {
        setError("رقم الهاتف أو كلمة المرور غير صحيحين.")
      } else {
        setError(err.message || "فشل تسجيل الدخول.")
      }
      setIsLogin(true)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setError("أدخل رمز التحقق المكون من 6 أرقام.")
      return
    }

    setLoading(true)
    clearMessages()

    try {
      await verifyUser(formData.phone, verificationCode)
      setSuccess("تم تفعيل الحساب بنجاح.")
      setTimeout(() => {
        setShowVerify(false)
        setIsLogin(true)
        clearMessages()
      }, 1200)
    } catch (err) {
      setError(err.message.includes("expired") ? "انتهت صلاحية الرمز. اطلب رمزاً جديداً." : "رمز التحقق غير صحيح.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    clearMessages()
    try {
      await resendCode(formData.phone)
      setSuccess("تم إرسال رمز جديد بنجاح.")
    } catch (err) {
      setError(err.message || "تعذر إرسال رمز جديد.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotPhone) {
      setError("أدخل رقم الهاتف أولاً.")
      return
    }

    setLoading(true)
    clearMessages()
    try {
      await forgotPassword(forgotPhone)
      setSuccess("تم إرسال رمز الاستعادة إلى هاتفك.")
      setShowReset(true)
      setShowForgot(false)
    } catch (err) {
      setError(err.message || "تعذر إرسال رمز الاستعادة.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      setError("يرجى ملء جميع الحقول.")
      return
    }
    if (newPassword.length < 6) {
      setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.")
      return
    }

    setLoading(true)
    clearMessages()
    try {
      await resetPassword(resetToken, newPassword)
      setSuccess("تم تحديث كلمة المرور بنجاح.")
      setTimeout(() => {
        setShowReset(false)
        setIsLogin(true)
        clearMessages()
      }, 1200)
    } catch (err) {
      setError(err.message.includes("expired") ? "انتهت صلاحية الرمز. اطلب رمزاً جديداً." : "رمز الاستعادة غير صحيح.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event) => {
    if (event) event.preventDefault()
    if (isLogin) handleLogin()
    else handleSignup()
  }

  if (showVerify) {
    return (
      <VerifyScreen
        phone={formData.phone}
        verificationCode={verificationCode}
        setVerificationCode={(value) => {
          setVerificationCode(value)
          setError("")
        }}
        handleVerify={handleVerify}
        handleResend={handleResend}
        loading={loading}
        error={error}
        success={success}
      />
    )
  }

  if (showForgot) {
    return (
      <ForgotPassword
        forgotPhone={forgotPhone}
        setForgotPhone={(value) => {
          setForgotPhone(value)
          setError("")
        }}
        handleForgotPassword={handleForgotPassword}
        onBack={() => {
          setShowForgot(false)
          clearMessages()
        }}
        loading={loading}
        error={error}
        success={success}
      />
    )
  }

  if (showReset) {
    return (
      <ResetPassword
        resetToken={resetToken}
        setResetToken={(value) => {
          setResetToken(value)
          setError("")
        }}
        newPassword={newPassword}
        setNewPassword={(value) => {
          setNewPassword(value)
          setError("")
        }}
        handleResetPassword={handleResetPassword}
        onResend={() => {
          setShowForgot(true)
          setShowReset(false)
          clearMessages()
        }}
        loading={loading}
        error={error}
        success={success}
      />
    )
  }

  if (isLogin) {
    return (
      <LoginForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onForgot={() => {
          setShowForgot(true)
          clearMessages()
        }}
        onSwitch={() => {
          setIsLogin(false)
          clearMessages()
        }}
        loading={loading}
        error={error}
        success={success}
      />
    )
  }

  return (
    <SignupForm
      formData={formData}
      setFormData={setFormData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      onSwitch={() => {
        setIsLogin(true)
        clearMessages()
      }}
      loading={loading}
      error={error}
      success={success}
    />
  )
}
