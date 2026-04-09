import React from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

function LoginForm({ handleChange, handleSubmit, showPassword, setShowPassword, onForgot, onSwitch, loading, error, success }) {
  return (
    <div className="w-full max-w-md px-6" dir="rtl">

      <h2 className="text-3xl font-black text-[#004384] mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
        مرحباً بعودتك
      </h2>
      <p className="text-sm text-[#004384]/40 mb-8" style={{ fontFamily: "'Cairo', sans-serif" }}>
        سجّل الدخول إلى حسابك
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

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[4px] text-[#004384]/50 mb-2 block"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-[#004384]/25" size={16} />
            <input
              type="email" name="email" placeholder="example@mail.com" onChange={handleChange}
              className="w-full bg-[#FCFDFE] border border-[#004384]/15 text-[#004384] placeholder-[#004384]/25
                rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]
                focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
              style={{ fontFamily: "'Cairo', sans-serif" }}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[4px] text-[#004384]/50 mb-2 block"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            كلمة المرور
          </label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-[#004384]/25" size={16} />
            <input
              type={showPassword ? "text" : "password"} name="password"
              placeholder="••••••••" onChange={handleChange}
              className="w-full bg-[#FCFDFE] border border-[#004384]/15 text-[#004384] placeholder-[#004384]/25
                rounded-xl pr-10 pl-10 py-3 text-sm focus:outline-none focus:border-[#2563EB]
                focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
              style={{ fontFamily: "'Cairo', sans-serif" }}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#004384]/30 hover:text-[#004384]/60 transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="text-left">
          <button type="button" onClick={onForgot}
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1E40AF] transition-colors"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            نسيت كلمة المرور؟
          </button>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full bg-[#2563EB] hover:bg-[#004384] disabled:opacity-40
            text-white font-bold py-3 rounded-full text-sm
            tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.35)]
            hover:shadow-[0_4px_20px_rgba(0,67,132,0.35)]"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </button>

        {/* Switch */}
        <p className="text-center text-sm text-[#004384]/40 pt-1"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          ليس لديك حساب؟{" "}
          <button type="button" onClick={onSwitch}
            className="text-[#004384] font-bold hover:text-[#2563EB] transition-colors"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            أنشئ حساباً
          </button>
        </p>
      </form>
    </div>
  )
}

export default LoginForm