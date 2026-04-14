import React from "react"
import { Lock, Phone, User } from "lucide-react"

function StatusMessage({ error, success }) {
  if (error) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
        <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />
        {error}
      </div>
    )
  }

  if (success) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/10 bg-primary-soft px-4 py-3 text-sm text-primary shadow-sm">
        <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
        {success}
      </div>
    )
  }

  return null
}

export default function SignupForm({ formData, handleChange, handleSubmit, onSwitch, loading, error, success }) {
  const fields = [
    { label: "الاسم الكامل", name: "name", type: "text", placeholder: "اسمك الكامل", Icon: User },
    { label: "رقم الهاتف", name: "phone", type: "tel", placeholder: "00000000", Icon: Phone },
    { label: "كلمة المرور", name: "password", type: "password", placeholder: "6 أحرف على الأقل", Icon: Lock },
    { label: "تأكيد كلمة المرور", name: "confirmPassword", type: "password", placeholder: "أعد كتابة كلمة المرور", Icon: Lock }
  ]

  return (
    <div className="mx-auto w-full max-w-sm p-1 animate-fade-in" dir="rtl">
      <div className="mb-10 text-center">
        <h2 className="mb-3 text-3xl font-black tracking-tight text-surface-900">أنشئ حسابك</h2>
        <p className="text-sm font-medium text-surface-500">
          ابدأ استخدام المنصة خلال أقل من دقيقة، ثم فعّل حسابك عبر رمز التحقق.
        </p>
      </div>

      <StatusMessage error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="mr-1 block text-xs font-bold text-surface-700">{field.label}</label>
            <div className="group relative">
              <field.Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-primary" size={18} />
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
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
          className="btn-saas btn-primary mt-4 h-12 w-full shadow-md shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
        </button>

        <p className="pt-6 text-center text-sm font-medium text-surface-500">
          لديك حساب بالفعل؟{" "}
          <button type="button" onClick={onSwitch} className="font-bold text-primary hover:underline">
            سجّل الدخول
          </button>
        </p>
      </form>
    </div>
  )
}
