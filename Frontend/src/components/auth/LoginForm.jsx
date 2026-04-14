import React from "react"
import { Eye, EyeOff, Lock, Phone } from "lucide-react"

function StatusMessage({ error, success }) {
  if (error) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
        <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />
        {error}
      </div>
    )
  }

  if (success) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/10 bg-primary-soft px-4 py-3 text-sm text-primary shadow-sm">
        <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
        {success}
      </div>
    )
  }

  return null
}

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
  success
}) {
  return (
    <div className="mx-auto w-full max-w-sm animate-fade-in p-1" dir="rtl">
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-3xl font-black tracking-tight text-surface-900">مرحباً بعودتك</h2>
        <p className="text-sm font-medium text-surface-500">
          سجّل الدخول لإدارة مهامك، حجوزاتك، ورسائلك من لوحة واحدة.
        </p>
      </div>

      <StatusMessage error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="mr-1 block text-xs font-bold text-surface-700">رقم الهاتف</label>
          <div className="group relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-primary" size={18} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              placeholder="00000000"
              onChange={handleChange}
              className="saas-input pr-10 hover:border-surface-300"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="block text-xs font-bold text-surface-700">كلمة المرور</label>
            <button
              type="button"
              onClick={onForgot}
              className="text-xs font-bold text-primary transition-colors hover:text-primary-hover"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="group relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-primary" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="••••••••"
              onChange={handleChange}
              className="saas-input pl-10 pr-10 hover:border-surface-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 transition-colors hover:text-surface-600"
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-saas btn-primary h-12 w-full shadow-md shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
        </button>

        <p className="pt-4 text-center text-sm font-medium text-surface-500">
          ليس لديك حساب؟{" "}
          <button type="button" onClick={onSwitch} className="font-bold text-primary hover:underline">
            أنشئ حساباً جديداً
          </button>
        </p>
      </form>
    </div>
  )
}
