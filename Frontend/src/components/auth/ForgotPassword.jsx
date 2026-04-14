import React from "react"
import { ArrowRight, Phone } from "lucide-react"

function StatusMessage({ error, success }) {
  if (error) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 shadow-sm">
        <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />
        {error}
      </div>
    )
  }

  if (success) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/10 bg-primary-soft px-4 py-3 text-sm font-bold text-primary shadow-sm">
        <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
        {success}
      </div>
    )
  }

  return null
}

export default function ForgotPassword({
  forgotPhone,
  setForgotPhone,
  handleForgotPassword,
  onBack,
  loading,
  error,
  success
}) {
  return (
    <div className="mx-auto w-full max-w-sm p-1 animate-fade-in" dir="rtl">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center gap-2 text-xs font-black text-surface-400 transition-colors hover:text-primary"
      >
        <ArrowRight size={14} className="transition-transform group-hover:-translate-x-1" />
        العودة لتسجيل الدخول
      </button>

      <div className="mb-10 text-center">
        <h2 className="mb-3 font-alexandria text-3xl font-black tracking-tight text-surface-900">استعادة كلمة المرور</h2>
        <p className="text-sm font-medium leading-relaxed text-surface-500">
          أدخل رقم هاتفك وسنرسل لك رمزاً لإعادة تعيين كلمة المرور.
        </p>
      </div>

      <StatusMessage error={error} success={success} />

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="mr-1 block text-xs font-bold text-surface-700">رقم الهاتف</label>
          <div className="group relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-primary" size={18} />
            <input
              type="tel"
              placeholder="00000000"
              value={forgotPhone}
              onChange={(e) => setForgotPhone(e.target.value)}
              className="saas-input h-12 pr-10 hover:border-surface-300"
              required
            />
          </div>
        </div>

        <button
          onClick={handleForgotPassword}
          disabled={loading || !forgotPhone}
          className="btn-saas btn-primary h-12 w-full font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "جاري الإرسال..." : "إرسال رمز الاستعادة"}
        </button>
      </div>
    </div>
  )
}
