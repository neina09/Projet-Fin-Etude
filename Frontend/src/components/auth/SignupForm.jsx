import React from "react"
import { Lock, Phone, User, ChevronLeft } from "lucide-react"

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

export default function SignupForm({ formData, handleChange, handleSubmit, onSwitch, loading, error, success }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 mx-auto w-full max-w-sm duration-500" dir="rtl">
      <div className="mb-10 text-right">
        <h1 className="mb-3 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">إنشاء حساب</h1>
        <p className="font-bold leading-relaxed text-slate-400">
          انضم إلى مجتمع المحترفين الأكبر في المنطقة وابدأ رحلة النجاح اليوم.
        </p>
      </div>

      <StatusMessage error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="auth-label mr-1 block">الاسم الكامل</label>
          <div className="auth-input-group">
            <input
              type="text"
              name="name"
              placeholder="أدخل اسمك الثلاثي"
              value={formData.name}
              onChange={handleChange}
              maxLength={15}
              className="auth-input input-with-icon-end bg-[#F8FAFC] text-right placeholder:text-right"
              required
            />
            <User className="field-icon field-icon-end" size={18} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="auth-label mr-1 block">رقم الهاتف</label>
          <div className="auth-input-group">
            <input
              type="tel"
              name="phone"
              placeholder="4X XX XX XX"
              value={formData.phone}
              onChange={handleChange}
              className="auth-input input-with-icon-end bg-[#F8FAFC] text-right placeholder:text-right"
              dir="auto"
              required
            />
            <Phone className="field-icon field-icon-end" size={18} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="auth-label mr-1 block">كلمة المرور</label>
          <div className="auth-input-group">
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              maxLength={8}
              className="auth-input input-with-icon-end bg-[#F8FAFC] text-right"
              dir="ltr"
              required
            />
            <Lock className="field-icon field-icon-end" size={18} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="auth-label mr-1 block">تأكيد كلمة المرور</label>
          <div className="auth-input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              maxLength={8}
              className="auth-input input-with-icon-end bg-[#F8FAFC] text-right"
              dir="ltr"
              required
            />
            <Lock className="field-icon field-icon-end" size={18} />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-auth-primary group flex h-14 w-full items-center justify-center gap-3 text-lg"
          >
            <span>{loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}</span>
            <ChevronLeft size={24} className="transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="font-bold text-slate-400">
          لديك حساب بالفعل؟{" "}
          <button onClick={onSwitch} className="p-1 font-black text-primary transition-all hover:text-primary-hover">
            تسجيل الدخول الآن
          </button>
        </p>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-300 sm:gap-6">
        <button type="button" className="hover:text-slate-500">الشروط والأحكام</button>
        <button type="button" className="hover:text-slate-500">سياسة الخصوصية</button>
        <button type="button" className="hover:text-slate-500">اتصل بنا</button>
      </div>
    </div>
  )
}
