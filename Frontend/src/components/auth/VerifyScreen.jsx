import React from "react"
import { ArrowRight, ShieldCheck } from "lucide-react"

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

export default function VerifyScreen({
  phone,
  verificationCode,
  setVerificationCode,
  handleVerify,
  handleResend,
  loading,
  error,
  success
}) {
  return (
    <div className="mx-auto w-full max-w-sm p-1 animate-fade-in" dir="rtl">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[2rem] border border-primary/10 bg-primary-soft text-primary shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <h2 className="mb-3 font-alexandria text-3xl font-black tracking-tight text-surface-900">تفعيل الحساب</h2>
        <p className="text-sm font-medium leading-relaxed text-surface-500">
          أرسلنا رمز التفعيل إلى الرقم:
          <br />
          <span className="font-bold text-primary" dir="ltr">{phone}</span>
        </p>
      </div>

      <StatusMessage error={error} success={success} />

      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <label className="block text-xs font-black uppercase tracking-[0.3em] text-surface-400">رمز التفعيل</label>
          <input
            type="text"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            className="w-full rounded-2xl border-2 border-surface-100 bg-white px-4 py-4 text-center text-3xl font-black tracking-[0.5em] text-surface-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5"
            style={{ direction: "ltr" }}
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || verificationCode.length < 6}
          className="btn-saas btn-primary h-14 w-full text-base shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "جاري التفعيل..." : "تفعيل الحساب الآن"}
        </button>

        <div className="pt-4 text-center">
          <p className="mb-4 text-sm font-medium text-surface-400">لم يصلك الرمز؟</p>
          <button
            onClick={handleResend}
            disabled={loading}
            className="mx-auto flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-6 py-2.5 text-xs font-black text-surface-900 transition-all hover:border-surface-300 hover:bg-surface-100"
          >
            إعادة إرسال الرمز
            <ArrowRight size={14} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}
