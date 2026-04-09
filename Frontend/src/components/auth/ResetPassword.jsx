import React from "react"
import { Lock } from "lucide-react"

function ResetPassword({ resetToken, setResetToken, newPassword, setNewPassword, handleResetPassword, onResend, loading, error, success }) {
  return (
    <div className="w-full max-w-md px-6" dir="rtl">

      <h2 className="text-3xl font-black text-[#004384] mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
        إعادة تعيين كلمة المرور
      </h2>
      <p className="text-sm text-[#004384]/40 mb-8" style={{ fontFamily: "'Cairo', sans-serif" }}>
        أدخل الرمز المكون من 6 أرقام وكلمة المرور الجديدة
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-5"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-5"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />{success}
        </div>
      )}

      <div className="space-y-4">

        {/* Reset Code */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[4px] text-[#004384]/50 mb-2 block"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            رمز الاستعادة
          </label>
          <input
            type="text"
            placeholder="000000"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            className="w-full bg-[#FCFDFE] border border-[#004384]/15 text-[#004384]
              rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-black
              focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            style={{ direction: "ltr", fontFamily: "'Cairo', sans-serif" }}
            maxLength={6}
          />
        </div>

        {/* New Password */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[4px] text-[#004384]/50 mb-2 block"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            كلمة المرور الجديدة
          </label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-[#004384]/25" size={16} />
            <input
              type="password"
              placeholder="6 أحرف على الأقل"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#FCFDFE] border border-[#004384]/15 text-[#004384] placeholder-[#004384]/25
                rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]
                focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            />
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleResetPassword} disabled={loading}
          className="w-full bg-[#2563EB] hover:bg-[#004384] disabled:opacity-40
            text-white font-bold py-3 rounded-full text-sm
            tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.35)]
            hover:shadow-[0_4px_20px_rgba(0,67,132,0.35)]"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {loading ? "جارٍ التعيين..." : "إعادة تعيين كلمة المرور"}
        </button>

        {/* Resend */}
        <button onClick={onResend}
          className="w-full bg-transparent border border-[#004384]/15 hover:border-[#2563EB]
            text-[#004384]/50 hover:text-[#2563EB] py-3 rounded-full text-sm
            font-semibold transition-all duration-300"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          إعادة إرسال الرمز
        </button>

      </div>
    </div>
  )
}

export default ResetPassword