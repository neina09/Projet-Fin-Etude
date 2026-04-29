import React from "react"
import { Lock, RefreshCw, CheckCircle2 } from "lucide-react"
import { useLanguage } from "../../i18n/LanguageContext"
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../../utils/security"

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
  const { dir, isArabic, t } = useLanguage()

  return (
    <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500" dir={dir}>
      <div className="auth-card relative overflow-hidden p-10 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-blue-50 text-blue-600">
          <CheckCircle2 size={40} />
        </div>

        <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-800">{t("auth.resetTitle")}</h2>
        <p className="mx-auto mb-10 max-w-xs font-medium leading-relaxed text-slate-400">
          {t("auth.resetSubtitle")}
        </p>

        <StatusMessage error={error} success={success} />

        <div className={`space-y-6 ${isArabic ? "text-right" : "text-left"}`}>
          <div className="space-y-2">
            <label className="auth-label">{t("auth.resetCode")}</label>
            <div className="auth-input-group">
              <input
                type="text"
                placeholder="000000"
                value={resetToken}
                onChange={(event) => setResetToken(event.target.value)}
                maxLength={6}
                className="auth-input h-16 text-center text-2xl font-black tracking-[0.5em]"
                style={{ direction: "ltr" }}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="auth-label">{t("auth.newPassword")}</label>
            <div className="auth-input-group">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder={t("auth.newPasswordPlaceholder")}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                className="auth-input pr-12"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading || !resetToken || !newPassword}
            className="btn-auth-primary mt-4 h-14 w-full text-lg disabled:opacity-70"
          >
            {loading ? t("auth.updatingPassword") : t("auth.saveNewPassword")}
          </button>

          <button
            onClick={onResend}
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {t("auth.resendNewCode")}
          </button>
        </div>
      </div>
    </div>
  )
}
