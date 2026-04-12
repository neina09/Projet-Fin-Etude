import React from "react"
import { User, Mail, Lock } from "lucide-react"

function SignupForm({ handleChange, handleSubmit, onSwitch, loading, error, success }) {
  return (
    <div className="w-full max-w-sm mx-auto p-1 animate-fade-in" dir="rtl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-surface-900 mb-3 tracking-tight">
          انضم إلى شغلني
        </h2>
        <p className="text-sm font-medium text-surface-500">
          ابدأ رحلتك اليوم وأنشئ حسابك في أقل من دقيقة
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-red-400 shrink-0 animate-pulse" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-3 bg-primary-soft border border-primary/10 text-primary text-sm px-4 py-3 rounded-xl mb-6 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "الاسم الكامل",        name: "name",            type: "text",     placeholder: "اسمك الكامل",           Icon: User },
          { label: "البريد الإلكتروني",   name: "email",           type: "email",    placeholder: "name@company.com",      Icon: Mail },
          { label: "كلمة المرور",         name: "password",        type: "password", placeholder: "6 أحرف على الأقل",      Icon: Lock },
          { label: "تأكيد كلمة المرور",   name: "confirmPassword", type: "password", placeholder: "أعد كتابة كلمة المرور", Icon: Lock },
        ].map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="text-xs font-bold text-surface-700 mr-1 block">
              {field.label}
            </label>
            <div className="relative group">
              <field.Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type={field.type} 
                name={field.name} 
                placeholder={field.placeholder} 
                onChange={handleChange}
                className="saas-input pr-10 hover:border-surface-300"
                required
              />
            </div>
          </div>
        ))}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-saas btn-primary h-12 shadow-md shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 mt-4"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              جاري الإنشاء...
            </span>
          ) : "إنشاء حساب مجاني"}
        </button>

        <p className="text-center text-sm font-medium text-surface-500 pt-6">
          لديك حساب بالفعل؟{" "}
          <button 
            type="button" 
            onClick={onSwitch}
            className="text-primary font-bold hover:underline"
          >
            سجّل الدخول
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignupForm