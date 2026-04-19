import React from "react"
import { ArrowRight, Phone, KeyRound, ChevronRight } from "lucide-react"

function StatusMessage({ error, success }) {
  if (error) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3 text-sm font-bold text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />
        {error}
      </div>
    )
  }

  if (success) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm font-bold text-blue-600 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="h-2 w-2 shrink-0 rounded-full bg-blue-400" />
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
    <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500" dir="rtl">
      <div className="auth-card p-10 text-center relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -z-10" />

        <button
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-blue-600"
        >
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
          العودة لتسجيل الدخول
        </button>

        {/* Brand Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-blue-50 text-blue-600">
          <KeyRound size={40} />
        </div>

        <h2 className="mb-4 text-3xl font-black text-slate-800 tracking-tight">استعادة كلمة المرور</h2>
        <p className="mb-10 text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
          أدخل رقم هاتفك وسنرسل لك رمزاً لإعادة تعيين كلمة المرور عبر رسالة نصية قصيرة.
        </p>

        <StatusMessage error={error} success={success} />

        <div className="space-y-8">
          <div className="space-y-2 text-right">
            <label className="auth-label">رقم الهاتف</label>
            <div className="auth-input-group">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                placeholder="05XXXXXXXX"
                value={forgotPhone}
                onChange={(e) => setForgotPhone(e.target.value)}
                className="auth-input pr-12 text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button
            onClick={handleForgotPassword}
            disabled={loading || !forgotPhone}
            className="btn-auth-primary w-full h-14 text-lg flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? "جاري الإرسال..." : "إرسال رمز الاستعادة"}
            <ArrowRight size={20} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}
