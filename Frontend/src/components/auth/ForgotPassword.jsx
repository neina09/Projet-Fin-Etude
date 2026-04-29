import React from "react"
import { ArrowRight, Phone, KeyRound, ChevronRight } from "lucide-react"
import { useLanguage } from "../../i18n/LanguageContext"

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
  const { dir, isArabic, t } = useLanguage()

  return (
    <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500" dir={dir}>
      <div className="auth-card relative overflow-hidden p-10 text-center">
        <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-bl-[5rem] bg-blue-50/50" />

        <button
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-blue-600"
        >
          <ChevronRight size={18} className={`transition-transform ${isArabic ? "group-hover:translate-x-1" : "rotate-180 group-hover:-translate-x-1"}`} />
          {t("auth.backToLogin")}
        </button>

        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-blue-50 text-blue-600">
          <KeyRound size={40} />
        </div>

        <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-800">{t("auth.forgotTitle")}</h2>
        <p className="mx-auto mb-10 max-w-xs font-medium leading-relaxed text-slate-400">
          {t("auth.forgotSubtitle")}
        </p>

        <StatusMessage error={error} success={success} />

        <div className="space-y-8">
          <div className={`space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
            <label className="auth-label">{t("auth.phone")}</label>
            <div className="auth-input-group">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                placeholder={t("auth.forgotPlaceholder")}
                value={forgotPhone}
                onChange={(event) => setForgotPhone(event.target.value)}
                className="auth-input pr-12 text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button
            onClick={handleForgotPassword}
            disabled={loading || !forgotPhone}
            className="btn-auth-primary flex h-14 w-full items-center justify-center gap-3 text-lg disabled:opacity-70"
          >
            {loading ? t("auth.sending") : t("auth.sendResetCode")}
            <ArrowRight size={20} className={isArabic ? "rotate-180" : ""} />
          </button>
        </div>
      </div>
    </div>
  )
}
