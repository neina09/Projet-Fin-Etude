import React from "react"
import { Lock, Phone, User, Users, Briefcase, ChevronLeft } from "lucide-react"

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

export default function SignupForm({ formData, setFormData, handleChange, handleSubmit, onSwitch, loading, error, success }) {
  const isWorker = formData.userType === "WORKER"

  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-right-4 duration-500" dir="rtl">
      <div className="text-right mb-10">
        <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">إنشاء حساب</h1>
        <p className="text-slate-400 font-bold leading-relaxed">
          انضم إلى مجتمع المحترفين الأكبر في المنطقة وابدأ رحلة النجاح اليوم.
        </p>
      </div>

      <StatusMessage error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="space-y-2">
          <label className="auth-label block mr-1">الاسم الكامل</label>
          <div className="auth-input-group">
            <input
              type="text"
              name="name"
              placeholder="أدخل اسمك الثلاثي"
              value={formData.name}
              onChange={handleChange}
              maxLength={15}
              className="auth-input pr-12 bg-[#F8FAFC]"
              required
            />
            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="auth-label block mr-1">رقم الهاتف</label>
          <div className="auth-input-group">
            <input
              type="tel"
              name="phone"
              placeholder="4X XX XX XX"
              value={formData.phone}
              onChange={handleChange}
              className="auth-input pr-12 text-left bg-[#F8FAFC]"
              dir="ltr"
              required
            />
            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="auth-label block mr-1">كلمة المرور</label>
          <div className="auth-input-group">
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              maxLength={8}
              className="auth-input pr-12 text-left bg-[#F8FAFC]"
              dir="ltr"
              required
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="auth-label block mr-1">تأكيد كلمة المرور</label>
          <div className="auth-input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              maxLength={8}
              className="auth-input pr-12 text-left bg-[#F8FAFC]"
              dir="ltr"
              required
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-auth-primary w-full h-14 text-lg flex items-center justify-center gap-3 group"
          >
            <span>إنشاء حساب</span>
            <ChevronLeft size={24} className="transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-400 font-bold">
          لديك حساب بالفعل؟{" "}
          <button
            onClick={onSwitch}
            className="text-primary hover:text-primary-hover transition-all p-1 font-black"
          >
            تسجيل الدخول الآن
          </button>
        </p>
      </div>
      
      {/* Absolute Bottom Links */}
      <div className="mt-12 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
        <button type="button" className="hover:text-slate-500">الشروط والأحكام</button>
        <button type="button" className="hover:text-slate-500">سياسة الخصوصية</button>
        <button type="button" className="hover:text-slate-500">اتصل بنا</button>
      </div>
    </div>
  )
}
