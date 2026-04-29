import React, { useEffect, useRef, useState } from "react"
import { ArrowLeft, Radio, ShieldCheck } from "lucide-react"
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
  const { dir, isArabic, t, format } = useLanguage()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(30)
  const inputs = useRef([])

  useEffect(() => {
    let interval = null
    if (timer > 0) interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    setVerificationCode(otp.join(""))
  }, [otp, setVerificationCode])

  const handleChange = (value, index) => {
    if (Number.isNaN(Number(value)) && value !== "") return
    const nextOtp = [...otp]
    nextOtp[index] = value
    setOtp(nextOtp)
    if (value !== "" && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl animate-in fade-in zoom-in-95 duration-500" dir={dir}>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-50 bg-white p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-[#F0F7FF] text-blue-600">
          <Radio size={48} className="animate-pulse" />
        </div>

        <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-800">{t("auth.verifyTitle")}</h2>
        <p className="mx-auto mb-12 max-w-xs font-bold leading-relaxed text-slate-400">
          {t("auth.verifySubtitle")}
        </p>

        <StatusMessage error={error} success={success} />

        <div className="mb-12 flex justify-center gap-4" dir="ltr">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={value}
              ref={(element) => {
                inputs.current[index] = element
              }}
              onChange={(event) => handleChange(event.target.value, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="h-16 w-16 rounded-2xl border-2 border-transparent bg-slate-50 text-center text-2xl font-black text-slate-800 outline-none transition-all focus:border-blue-600 focus:bg-white focus:shadow-[0_0_15px_rgba(37,99,235,0.1)]"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 6}
          className="btn-auth-primary flex h-16 w-full items-center justify-center gap-3 text-xl transition-all active:scale-[0.98]"
        >
          <span>{t("auth.verifying")}</span>
          <ArrowLeft size={24} className={isArabic ? "" : "rotate-180"} />
        </button>

        <div className="mt-10 space-y-4">
          <button
            onClick={handleResend}
            disabled={timer > 0 || loading}
            className={`font-black text-blue-600 transition-opacity hover:underline ${timer > 0 ? "cursor-not-allowed opacity-30" : "opacity-100"}`}
          >
            {t("auth.resendCode")}
          </button>

          {timer > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300" />
              {format("auth.resendIn", { timer })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
          <ShieldCheck size={16} className="text-blue-600" />
          {t("auth.securityNote")}
        </div>

        <div className="flex items-center justify-center gap-6 whitespace-nowrap pt-8 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          <button type="button" className="hover:text-slate-500">{t("common.terms")}</button>
          <button type="button" className="hover:text-slate-500">{t("common.privacy")}</button>
          <button type="button" className="hover:text-slate-500">{t("common.contact")}</button>
        </div>

        <div className="flex items-center justify-between pt-4 text-[10px] font-bold text-slate-300 opacity-50">
          <span>&copy; 2024 {t("auth.verifyCopyright")}</span>
          <span>{t("auth.securityPowered")}</span>
        </div>
      </div>
    </div>
  )
}
