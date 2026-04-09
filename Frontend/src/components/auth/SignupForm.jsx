import React from "react"
import { User, Mail, Lock } from "lucide-react"

function SignupForm({ handleChange, handleSubmit, onSwitch, loading, error, success }) {
  return (
    <div className="w-full max-w-md px-6" dir="rtl">

      <h2 className="text-3xl font-black text-[#004384] mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
        انضم إلى شغلني
      </h2>
      <p className="text-sm text-[#004384]/40 mb-8" style={{ fontFamily: "'Cairo', sans-serif" }}>
        أنشئ حسابك المجاني في ثوانٍ
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
        {[
          { label: "الاسم الكامل",        name: "name",            type: "text",     placeholder: "اسمك الكامل",           Icon: User },
          { label: "البريد الإلكتروني",   name: "email",           type: "email",    placeholder: "example@mail.com",      Icon: Mail },
          { label: "كلمة المرور",         name: "password",        type: "password", placeholder: "6 أحرف على الأقل",      Icon: Lock },
          { label: "تأكيد كلمة المرور",   name: "confirmPassword", type: "password", placeholder: "أعد كتابة كلمة المرور", Icon: Lock },
        ].map((field) => (
          <div key={field.name}>
            <label
              className="text-[10px] font-bold uppercase tracking-[4px] text-[#004384]/50 mb-2 block"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {field.label}
            </label>
            <div className="relative">
              <field.Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-[#004384]/25" size={16} />
              <input
                type={field.type} name={field.name} placeholder={field.placeholder} onChange={handleChange}
                className="w-full bg-[#FCFDFE] border border-[#004384]/15 text-[#004384] placeholder-[#004384]/25
                  rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-[#2563EB]
                  focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                style={{ fontFamily: "'Cairo', sans-serif" }}
                required
              />
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading}
          className="w-full bg-[#2563EB] hover:bg-[#004384] disabled:opacity-40
            text-white font-bold py-3 rounded-full text-sm
            tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.35)]
            hover:shadow-[0_4px_20px_rgba(0,67,132,0.35)]"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
        </button>

        <p className="text-center text-sm text-[#004384]/40 pt-1"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          لديك حساب بالفعل؟{" "}
          <button type="button" onClick={onSwitch}
            className="text-[#004384] font-bold hover:text-[#2563EB] transition-colors"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            سجّل الدخول
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignupForm