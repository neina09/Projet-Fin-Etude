import React, { useState, useRef, useEffect } from "react"
import { ArrowLeft, Radio, ShieldCheck } from "lucide-react"

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
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(30)
  const inputs = useRef([])

  useEffect(() => {
    let interval = null
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  // Sync with parent
  useEffect(() => {
    setVerificationCode(otp.join(""))
  }, [otp, setVerificationCode])

  const handleChange = (val, index) => {
    if (isNaN(val)) return
    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)
    if (val !== "" && index < 5) {
      inputs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus()
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-500" dir="rtl">
      
      <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 relative overflow-hidden">
        {/* Branding Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-[#F0F7FF] text-blue-600">
          <Radio size={48} className="animate-pulse" />
        </div>

        <h2 className="mb-4 text-4xl font-black text-slate-800 tracking-tight">تأكيد رقم الهاتف</h2>
        <p className="mb-12 text-slate-400 font-bold leading-relaxed max-w-xs mx-auto">
          تم إرسال رمز التحقق إلى رقم هاتفك. يرجى إدخال الرمز المكون من 6 أرقام للمتابعة.
        </p>

        <StatusMessage error={error} success={success} />

        <div className="flex justify-center gap-4 mb-12" dir="ltr">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              ref={(el) => (inputs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-16 h-16 rounded-2xl border-2 bg-slate-50 border-transparent text-center text-2xl font-black text-slate-800 transition-all focus:bg-white focus:border-blue-600 focus:shadow-[0_0_15px_rgba(37,99,235,0.1)] outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 6}
          className="btn-auth-primary w-full h-16 text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
        >
          <span>تأكيد</span>
          <ArrowLeft size={24} />
        </button>

        <div className="mt-10 space-y-4">
          <button
            onClick={handleResend}
            disabled={timer > 0 || loading}
            className={`text-blue-600 font-black hover:underline transition-opacity ${timer > 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
          >
            إعادة إرسال الرمز
          </button>

          {timer > 0 && (
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-bold">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse" />
              إعادة الإرسال خلال {timer} ثانية
            </div>
          )}
        </div>
      </div>

      {/* Security Footer */}
      <div className="mt-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-black uppercase tracking-wider">
          <ShieldCheck size={16} className="text-blue-600" />
          جميع البيانات مشفرة ولتخضع لأعلى معايير الأمان العالمية.
        </div>
        
        {/* Absolute Bottom Links */}
        <div className="pt-8 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
          <button type="button" className="hover:text-slate-500">الشروط والأحكام</button>
          <button type="button" className="hover:text-slate-500">سياسة الخصوصية</button>
          <button type="button" className="hover:text-slate-500">اتصل بنا</button>
        </div>
        
        <div className="pt-4 text-slate-300 text-[10px] font-bold flex items-center justify-between opacity-50">
          <span>&copy; 2024 منصة العمال. جميع الحقوق محفوظة</span>
          <span>مدعوم بمعايير أمان عالية</span>
        </div>
      </div>
    </div>
  )
}
