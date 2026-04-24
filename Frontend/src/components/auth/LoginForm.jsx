import React from "react"
import { Eye, EyeOff, Lock, Phone } from "lucide-react"

function StatusMessage({ error, success }) {
  if (error) {
    return (
      <div className="animate-in fade-in slide-in-from-top-2 mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3 text-sm font-bold text-red-600 duration-300">
        <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />
        {error}
      </div>
    )
  }

  if (success) {
    return (
      <div className="animate-in fade-in slide-in-from-top-2 mb-6 flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-bold text-primary duration-300">
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
    <div className="animate-in fade-in slide-in-from-left-4 mx-auto w-full max-w-sm duration-500" dir="rtl">
      <div className="mb-10 text-right">
        <h1 className="mb-3 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">تسجيل الدخول</h1>
        <p className="font-bold leading-relaxed text-slate-400">مرحبًا بك مجددًا في منصة العمال.</p>
      </div>

      <StatusMessage error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="auth-label mr-1 block text-slate-500">رقم الهاتف</label>
          <div className="auth-input-group">
            <input
              type="tel"
              name="phone"
              placeholder="4X XX XX XX"
              value={formData.phone}
              onChange={handleChange}
              className="auth-input input-with-icon-end bg-slate-50/50 pl-4 text-right placeholder:text-right"
              dir="auto"
              required
            />
            <Phone className="field-icon field-icon-end" size={18} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="mb-1 flex flex-col items-start gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
            <label className="auth-label m-0 block text-slate-500">كلمة المرور</label>
            <button
              type="button"
              onClick={onForgot}
              className="text-[10px] font-black uppercase tracking-widest text-primary transition-colors hover:text-primary-hover"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="auth-input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="auth-input input-with-icon-end input-with-icon-start bg-slate-50/50 text-right"
              dir="ltr"
              required
            />
            <Lock className="field-icon field-icon-end" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute left-4 top-1/2 z-[2] -translate-y-1/2 text-slate-300 transition-colors hover:text-slate-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="mr-1 flex items-center gap-3">
          <div className="relative flex h-5 items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-5 w-5 cursor-pointer rounded-lg border-slate-200 text-blue-600 transition-all focus:ring-blue-500"
            />
          </div>
          <label htmlFor="remember" className="cursor-pointer select-none text-sm font-bold text-slate-400">
            تذكرني
          </label>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="btn-auth-primary h-14 w-full text-lg shadow-blue-200">
            {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
          </button>
        </div>
      </form>

      <div className="mt-10 text-center">
        <p className="font-bold text-slate-400">
          ليس لديك حساب؟{" "}
          <button onClick={onSwitch} className="p-1 font-extrabold text-primary transition-colors hover:underline">
            إنشاء حساب جديد
          </button>
        </p>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-200 sm:mt-16 sm:gap-6">
        <button type="button" className="hover:text-slate-400">الشروط والأحكام</button>
        <button type="button" className="hover:text-slate-400">سياسة الخصوصية</button>
        <button type="button" className="hover:text-slate-400">اتصل بنا</button>
      </div>
    </div>
  )
}
