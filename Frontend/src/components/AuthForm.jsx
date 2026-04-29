import React, { useEffect, useState } from "react"
import { forgotPassword, loginUser, registerUser, resendCode, resetPassword, verifyUser } from "../api"
import ForgotPassword from "./auth/ForgotPassword"
import LoginForm from "./auth/LoginForm"
import ResetPassword from "./auth/ResetPassword"
import SignupForm from "./auth/SignupForm"
import VerifyScreen from "./auth/VerifyScreen"
import { storeSessionToken } from "../utils/auth"
import { useLanguage } from "../i18n/LanguageContext"
import { isStrongPassword, isValidMauritanianPhone, normalizePhoneNumber } from "../utils/security"

export default function AuthForm({ onLoginSuccess, onViewChange }) {
  const { t } = useLanguage()
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

  useEffect(() => {
    if (!onViewChange) return

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
    const nextValue = name === "phone" ? normalizePhoneNumber(value) : value
    setFormData((current) => ({ ...current, [name]: nextValue }))
    clearMessages()
  }

  const handleSignup = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      setError(t("authValidation.fillAllFields"))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("authValidation.passwordsMismatch"))
      return
    }

    if (!isValidMauritanianPhone(formData.phone)) {
      setError(t("authValidation.invalidPhone"))
      return
    }

    const nameRegex = /^[\u0600-\u06FFa-zA-Z ]{1,15}$/
    if (!nameRegex.test(formData.name)) {
      setError(t("authValidation.invalidName"))
      return
    }

    if (!isStrongPassword(formData.password)) {
      setError(t("authValidation.passwordLength"))
      return
    }

    setLoading(true)
    clearMessages()

    try {
      await registerUser(formData.name, formData.phone, formData.password, formData.userType)
      setSuccess(t("authValidation.accountCreated"))
      setShowVerify(true)
    } catch (err) {
      setError(err.message.includes("Phone already in use") ? t("authValidation.phoneUsed") : (err.message || t("authValidation.signupFailed")))
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!formData.phone || !formData.password) {
      setError(t("authValidation.enterPhonePassword"))
      return
    }

    if (!isValidMauritanianPhone(formData.phone)) {
      setError(t("authValidation.invalidPhone"))
      return
    }

    setLoading(true)
    clearMessages()

    try {
      const data = await loginUser(formData.phone, formData.password)
      storeSessionToken(data.token)
      onLoginSuccess(data.token)
    } catch (err) {
      if (err.message.includes("User not found")) {
        setError(t("authValidation.userNotFound"))
      } else if (err.message.includes("Account not verified")) {
        setError(t("authValidation.accountNotVerified"))
        setShowVerify(true)
      } else if (err.message.includes("Bad credentials")) {
        setError(t("authValidation.badCredentials"))
      } else {
        setError(err.message || t("authValidation.loginFailed"))
      }
      setIsLogin(true)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setError(t("authValidation.enterVerificationCode"))
      return
    }

    setLoading(true)
    clearMessages()

    try {
      await verifyUser(formData.phone, verificationCode)
      setSuccess(t("authValidation.accountVerified"))
      setTimeout(() => {
        setShowVerify(false)
        setIsLogin(true)
        clearMessages()
      }, 1200)
    } catch (err) {
      setError(err.message.includes("expired") ? t("authValidation.codeExpired") : t("authValidation.invalidVerificationCode"))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    clearMessages()

    try {
      await resendCode(formData.phone)
      setSuccess(t("authValidation.newCodeSent"))
    } catch (err) {
      setError(err.message || t("authValidation.resendFailed"))
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotPhone) {
      setError(t("authValidation.enterPhoneFirst"))
      return
    }

    if (!isValidMauritanianPhone(forgotPhone)) {
      setError(t("authValidation.invalidPhone"))
      return
    }

    setLoading(true)
    clearMessages()

    try {
      await forgotPassword(forgotPhone)
      setSuccess(t("authValidation.resetCodeSent"))
      setShowReset(true)
      setShowForgot(false)
    } catch (err) {
      setError(err.message || t("authValidation.resetSendFailed"))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) {
      setError(t("authValidation.fillAllFields"))
      return
    }

    if (!isStrongPassword(newPassword)) {
      setError(t("authValidation.newPasswordLength"))
      return
    }

    setLoading(true)
    clearMessages()

    try {
      await resetPassword(resetToken, newPassword)
      setSuccess(t("authValidation.passwordUpdated"))
      setTimeout(() => {
        setShowReset(false)
        setIsLogin(true)
        clearMessages()
      }, 1200)
    } catch (err) {
      setError(err.message.includes("expired") ? t("authValidation.codeExpired") : t("authValidation.invalidResetCode"))
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
          setForgotPhone(normalizePhoneNumber(value))
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
