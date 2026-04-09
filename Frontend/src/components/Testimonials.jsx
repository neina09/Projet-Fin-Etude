import React from "react"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "أحمد ولد سالم",
    role: "صاحب منزل",
    text: "وجدت سباكاً في أقل من 10 دقائق! خدمة رائعة ومحترفة جداً.",
    rating: 5,
    avatar: "أو",
  },
  {
    name: "فاطمة منت الشيخ",
    role: "صاحبة عمل",
    text: "العمال موثوقون وموثقون. أستخدم شغلني كل أسبوع لمتجري.",
    rating: 5,
    avatar: "فم",
  },
  {
    name: "محمد لمين",
    role: "عامل مستقل",
    text: "منذ انضمامي كعامل، تضاعف دخلي. المنصة سهلة الاستخدام للغاية.",
    rating: 5,
    avatar: "مل",
  },
]

function Testimonials() {
  return (
    <section id="testimonials" className="py-20" dir="rtl">
      <div className="section-shell">
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Customer Reviews</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">تقييمات العملاء بعد إنجاز الخدمات</h2>
          <p className="mt-3 text-slate-600 font-semibold">آراء حقيقية من مستخدمين وعمال يستخدمون المنصة يومياً.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <article key={i} className="premium-card p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-600 leading-relaxed">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-700 text-white text-xs font-black flex items-center justify-center">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{t.name}</p>
                  <p className="text-xs font-bold text-slate-500">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials