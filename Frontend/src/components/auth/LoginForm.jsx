import React from "react"
import { Eye, EyeOff, Lock, Phone, UserCircle2 } from "lucide-react"

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
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-bold text-primary animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
        {success}
      </div>
    )
  }

  return null
}

export default function LoginForm({
  formData,
  handleChange,
  handleSubmit,
  showPassword,
  setShowPassword,
  onForgot,
  onSwitch,
  loading,
  error,
  success
}) {
  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-left-4 duration-500" dir="rtl">
      
      <div className="text-right mb-10">
        <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">تسجيل الدخول</h1>
        <p className="text-slate-400 font-bold">مرحباً بك مجدداً في منصة العمال</p>
      </div>

      <StatusMessage error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="auth-label block mr-1 text-slate-500">رقم الهاتف</label>
          <div className="auth-input-group">
            <input
              type="tel"
              name="phone"
              placeholder="4X XX XX XX"
              value={formData.phone}
              onChange={handleChange}
              className="auth-input pr-12 text-left bg-slate-50/50"
              dir="ltr"
              required
            />
            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1 px-1">
            <label className="auth-label block m-0 text-slate-500">كلمة المرور</label>
            <button
              type="button"
              onClick={onForgot}
              className="text-[10px] font-black text-primary hover:text-primary-hover transition-colors uppercase tracking-widest"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="auth-input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="auth-input pr-12 text-left bg-slate-50/50"
              dir="ltr"
              required
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mr-1">
          <div className="relative flex items-center h-5">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
            />
          </div>
          <label htmlFor="remember" className="text-sm font-bold text-slate-400 cursor-pointer select-none">تذكرني</label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-auth-primary w-full h-14 text-lg shadow-blue-200"
          >
            {loading ? "جاري التحميل..." : "تسجيل الدخول"}
          </button>
        </div>
      </form>

      <div className="mt-10 text-center">
        <p className="text-slate-400 font-bold">
          ليس لديك حساب؟{" "}
          <button
            onClick={onSwitch}
            className="text-primary hover:underline font-extrabold transition-colors p-1"
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
      
      {/* Absolute Bottom Links */}
      <div className="mt-16 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-200 uppercase tracking-widest whitespace-nowrap">
        <button type="button" className="hover:text-slate-400">الشروط والأحكام</button>
        <button type="button" className="hover:text-slate-400">سياسة الخصوصية</button>
        <button type="button" className="hover:text-slate-400">اتصل بنا</button>
      </div>
    </div>
  )
}
