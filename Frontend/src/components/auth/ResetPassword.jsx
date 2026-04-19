import React from "react"
import { Lock, RefreshCw, CheckCircle2 } from "lucide-react"

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

export default function ResetPassword({
  resetToken,
  setResetToken,
  newPassword,
  setNewPassword,
  handleResetPassword,
  onResend,
  loading,
  error,
  success
}) {
  return (
    <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500" dir="rtl">
      <div className="auth-card p-10 text-center relative overflow-hidden">
        {/* Brand Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-blue-50 text-blue-600">
          <CheckCircle2 size={40} />
        </div>

        <h2 className="mb-4 text-3xl font-black text-slate-800 tracking-tight">إعادة تعيين كلمة المرور</h2>
        <p className="mb-10 text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
          أدخل رمز الاستعادة ثم اختر كلمة مرور جديدة لحسابك.
        </p>

        <StatusMessage error={error} success={success} />

        <div className="space-y-6 text-right">
          <div className="space-y-2">
            <label className="auth-label">رمز الاستعادة</label>
            <div className="auth-input-group">
              <input
                type="text"
                placeholder="000000"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                maxLength={6}
                className="auth-input text-center text-2xl font-black tracking-[0.5em] h-16"
                style={{ direction: "ltr" }}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="auth-label">كلمة المرور الجديدة</label>
            <div className="auth-input-group">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="6 أحرف على الأقل"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="auth-input pr-12"
                required
              />
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading || !resetToken || !newPassword}
            className="btn-auth-primary w-full h-14 text-lg disabled:opacity-70 mt-4"
          >
            {loading ? "جاري التحديث..." : "حفظ كلمة المرور الجديدة"}
          </button>

          <button
            onClick={onResend}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 mt-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            إعادة إرسال رمز جديد
          </button>
        </div>
      </div>
    </div>
  )
}
