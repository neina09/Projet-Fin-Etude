import React, { useState } from "react"
import { Lock, Phone, User, ChevronLeft, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "../../i18n/LanguageContext"
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../../utils/security"

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-red-500">
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-400 shrink-0" />
      {message}
    </p>
  )
}

function FieldSuccess({ message }) {
  if (!message) return null
  return (
    <p className="mt-1.5 text-[11px] font-semibold text-emerald-600">✓ {message}</p>
  )
}

function StatusMessage({ error, success }) {
  if (error) {
    return (
      <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-600">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-red-400" />
        {error}
      </div>
    )
  }
  if (success) {
    return (
      <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[12px] font-semibold text-emerald-700">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
        {success}
      </div>
    )
  }
  return null
}

const inputBase = "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-300 outline-none transition focus:bg-white focus:ring-2"
const inputErr  = "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100"
const inputOk   = "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
const inputDef  = "focus:border-blue-300 focus:ring-blue-100"

export default function SignupForm({ formData, handleChange, handleSubmit, onSwitch, loading, error, success }) {
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [fieldErrors,  setFieldErrors]  = useState({})
  const [touched,      setTouched]      = useState({})

  const validators = {
    name: (v) => {
      if (!v?.trim()) return "الاسم الكامل مطلوب"
      if (v.trim().length < 3) return "الاسم يجب أن يكون 3 أحرف على الأقل"
      if (/\d/.test(v)) return "الاسم لا يجب أن يحتوي على أرقام"
      return null
    },
    phone: (v) => {
      if (!v) return "رقم الهاتف مطلوب"
      const d = v.replace(/\D/g, "")
      const ok = /^[234]\d{7}$/.test(d) || /^222[234]\d{7}$/.test(d)
      if (!ok) return "يرجى إدخال رقم موريتاني صحيح (مثال: +222 XX XX XX XX)"
      return null
    },
    password: (v) => {
      if (!v) return "كلمة المرور مطلوبة"
      if (v.length < PASSWORD_MIN_LENGTH) return `كلمة المرور يجب أن تكون ${PASSWORD_MIN_LENGTH} أحرف على الأقل`
      return null
    },
    confirmPassword: (v) => {
      if (!v) return "يرجى تأكيد كلمة المرور"
      if (v !== formData.password) return "كلمتا المرور غير متطابقتين"
      return null
    },
  }

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    setFieldErrors((prev) => ({ ...prev, [name]: validators[name]?.(formData[name] || "") }))
  }

  const handleFieldChange = (e) => {
    handleChange(e)
    const { name, value } = e.target
    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validators[name]?.(value) }))
    }
    if (name === "password" && touched.confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: value !== formData.confirmPassword ? "كلمتا المرور غير متطابقتين" : null,
      }))
    }
  }

  const cls = (name, extra = "") => {
    const state = touched[name] ? (fieldErrors[name] ? inputErr : inputOk) : inputDef
    return `${inputBase} ${state} ${extra}`
  }

  return (
    <div className="mx-auto w-full max-w-sm" dir="rtl">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">{t("auth.signupTitle")}</h1>
        <p className="text-sm text-slate-400">{t("auth.signupSubtitle")}</p>
      </div>

      <StatusMessage error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* الاسم الكامل — اتجاه RTL طبيعي */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-500">{t("auth.fullName")}</label>
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder={t("auth.fullNamePlaceholder")}
              value={formData.name}
              onChange={handleFieldChange}
              onBlur={() => handleBlur("name")}
              maxLength={30}
              dir="rtl"
              className={cls("name", "pr-10 pl-4")}
              required
            />
            <User size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-300" />
          </div>
          <FieldError message={touched.name && fieldErrors.name} />
          {touched.name && !fieldErrors.name && formData.name && <FieldSuccess message="اسم صحيح" />}
        </div>

        {/* رقم الهاتف — dir=ltr لكن النص يبدأ من اليمين */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-500">{t("auth.phone")}</label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              placeholder="+222 XX XX XX XX"
              value={formData.phone}
              onChange={handleFieldChange}
              onBlur={() => handleBlur("phone")}
              inputMode="tel"
              dir="ltr"
              style={{ textAlign: "right" }}
              className={cls("phone", "pr-10 pl-4")}
              required
            />
            <Phone size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-300" />
          </div>
          <FieldError message={touched.phone && fieldErrors.phone} />
          {touched.phone && !fieldErrors.phone && formData.phone && <FieldSuccess message="رقم صحيح" />}
        </div>

        {/* كلمة المرور */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-500">{t("auth.password")}</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleFieldChange}
              onBlur={() => handleBlur("password")}
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
              dir="ltr"
              style={{ textAlign: "right" }}
              autoComplete="new-password"
              className={cls("password", "pr-10 pl-10")}
              required
            />
            {/* قفل على اليمين */}
            <Lock size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-300" />
            {/* عين على اليسار */}
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <FieldError message={touched.password && fieldErrors.password} />
        </div>

        {/* تأكيد كلمة المرور */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-500">{t("auth.confirmPassword")}</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleFieldChange}
              onBlur={() => handleBlur("confirmPassword")}
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
              dir="ltr"
              style={{ textAlign: "right" }}
              autoComplete="new-password"
              className={cls("confirmPassword", "pr-10 pl-10")}
              required
            />
            <Lock size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-300" />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <FieldError message={touched.confirmPassword && fieldErrors.confirmPassword} />
          {touched.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword && (
            <FieldSuccess message="كلمتا المرور متطابقتان" />
          )}
        </div>

        {/* زر الإرسال */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{loading ? t("auth.creatingAccount") : t("auth.signupTitle")}</span>
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {t("auth.alreadyHaveAccount")}{" "}
        <button onClick={onSwitch} className="font-bold text-blue-600 transition hover:text-blue-700 hover:underline">
          {t("auth.loginNow")}
        </button>
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-300">
        <button type="button" className="transition hover:text-slate-500">{t("common.terms")}</button>
        <span className="text-slate-200">·</span>
        <button type="button" className="transition hover:text-slate-500">{t("common.privacy")}</button>
        <span className="text-slate-200">·</span>
        <button type="button" className="transition hover:text-slate-500">{t("common.contact")}</button>
      </div>
    </div>
  )
}