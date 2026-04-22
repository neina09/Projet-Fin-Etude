import React from "react"
import { BookOpen, CheckCircle2, ChevronLeft, PlayCircle, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function UserGuide() {
  const steps = [
    {
      title: "إنشاء حساب وتوثيقه",
      desc: "ابدأ بتسجيل بياناتك وتأكيد رقم هاتفك لتتمكن من الوصول لكافة مميزات المنصة.",
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "البحث عن خدمة أو عامل",
      desc: "تصفح سوق العمال أو استخدم محرك البحث المتقدم للوصول للمهني المناسب لاحتياجاتك.",
      icon: PlayCircle,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "طلب الخدمة والمتابعة",
      desc: "أرسل طلبك، تواصل مع العامل، وتابع حالة المهمة مباشرة من لوحة التحكم الخاصة بك.",
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ]

  return (
    <div className="page-shell max-w-4xl mx-auto" dir="rtl">
      <header className="mb-12 text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
          <BookOpen size={14} /> دليل الاستخدام
        </div>
        <h1 className="text-3xl font-black text-slate-900">كيف تستخدم منصة عاملك؟</h1>
        <p className="mt-2 text-slate-500 font-bold italic">دليلك الشامل للاستفادة القصوى من كافة خدماتنا.</p>
      </header>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-lg flex items-start gap-6 group hover:border-primary/20 transition-all"
          >
            <div className={`h-14 w-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
              <step.icon size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500 font-bold leading-relaxed">{step.desc}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
              <span className="text-sm font-black">{index + 1}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-16 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(29,78,216,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-4">هل تحتاج لمساعدة إضافية؟</h2>
          <p className="text-slate-400 font-bold mb-8 max-w-lg">فريق الدعم الفني متواجد دائماً للإجابة على استفساراتكم وحل مشكلاتكم التقنية في أسرع وقت.</p>
          <button className="btn btn-primary btn-lg">
            تحدث مع الدعم الفني <ChevronLeft size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}
