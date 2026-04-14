import React from "react"
import { Lock, RefreshCw } from "lucide-react"

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
    <div className="mx-auto w-full max-w-sm p-1 animate-fade-in" dir="rtl">
      <div className="mb-10 text-center">
        <h2 className="mb-3 font-alexandria text-3xl font-black tracking-tight text-surface-900">إعادة تعيين كلمة المرور</h2>
        <p className="text-sm font-medium leading-relaxed text-surface-500">
          أدخل رمز الاستعادة ثم اختر كلمة مرور جديدة لحسابك.
        </p>
      </div>

      <StatusMessage error={error} success={success} />

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="mb-3 block text-center text-xs font-black uppercase tracking-[0.3em] text-surface-400">رمز الاستعادة</label>
          <input
            type="text"
            placeholder="000000"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            maxLength={6}
            className="w-full rounded-2xl border-2 border-surface-100 bg-white px-4 py-4 text-center text-3xl font-black tracking-[0.5em] text-surface-900 shadow-sm transition-all focus:border-primary focus:outline-none"
            style={{ direction: "ltr" }}
          />
        </div>

        <div className="space-y-2">
          <label className="mr-1 block text-xs font-bold text-surface-700">كلمة المرور الجديدة</label>
          <div className="group relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-primary" size={18} />
            <input
              type="password"
              placeholder="6 أحرف على الأقل"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="saas-input h-12 pr-10 hover:border-surface-300"
              required
            />
          </div>
        </div>

        <button
          onClick={handleResetPassword}
          disabled={loading || !resetToken || !newPassword}
          className="btn-saas btn-primary h-12 w-full font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
        </button>

        <button
          onClick={onResend}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-surface-400 transition-all hover:bg-primary-soft hover:text-primary"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          إعادة إرسال رمز جديد
        </button>
      </div>
    </div>
  )
}
