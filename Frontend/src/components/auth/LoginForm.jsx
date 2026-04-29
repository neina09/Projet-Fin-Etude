import React, { useState } from "react"
import { Eye, EyeOff, Lock, Phone } from "lucide-react"
import { useLanguage } from "../../i18n/LanguageContext"

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

export default function LoginForm({
  formData,
  handleChange,
  handleSubmit,
  showPassword,
  setShowPassword,
  onForgot,
  onSwitch,
  loading,
  error,
  success,
}) {
  const { t } = useLanguage()
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched,     setTouched]     = useState({})

  const validators = {
    phone: (v) => {
      if (!v) return "رقم الهاتف مطلوب"
      const d = v.replace(/\D/g, "")
      const ok = /^[234]\d{7}$/.test(d) || /^222[234]\d{7}$/.test(d)
      if (!ok) return "يرجى إدخال رقم موريتاني صحيح"
      return null
    },
    password: (v) => {
      if (!v) return "كلمة المرور مطلوبة"
      if (v.length < 6) return "كلمة المرور قصيرة جداً"
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
  }

  const cls = (name, extra = "") => {
    const state = touched[name] ? (fieldErrors[name] ? inputErr : inputOk) : inputDef
    return `${inputBase} ${state} ${extra}`
  }

  return (
    <div className="mx-auto w-full max-w-sm" dir="rtl">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">{t("auth.loginTitle")}</h1>
        <p className="text-sm text-slate-400">{t("auth.loginSubtitle")}</p>
      </div>

      <StatusMessage error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* رقم الهاتف */}
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
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onForgot}
              className="text-[10px] font-bold text-blue-500 transition hover:text-blue-700 hover:underline"
            >
              {t("auth.forgotPassword")}
            </button>
            <label className="text-[11px] font-bold text-slate-500">{t("auth.password")}</label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleFieldChange}
              onBlur={() => handleBlur("password")}
              dir="ltr"
              style={{ textAlign: "right" }}
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

        {/* تذكرني */}
        <div className="flex items-center justify-end gap-2.5">
          <label htmlFor="remember" className="cursor-pointer select-none text-[12px] font-semibold text-slate-400">
            {t("auth.rememberMe")}
          </label>
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 cursor-pointer rounded border-slate-200 text-blue-600 accent-blue-600 focus:ring-blue-500"
          />
        </div>

        {/* زر الإرسال */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t("auth.loggingIn") : t("auth.loginTitle")}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {t("auth.noAccount")}{" "}
        <button onClick={onSwitch} className="font-bold text-blue-600 transition hover:text-blue-700 hover:underline">
          {t("auth.createAccount")}
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