import React from "react"
import { Wrench, Sparkles, Zap, PlugZap, Paintbrush, Hammer, Truck, ShieldCheck } from "lucide-react"

const categories = [
  { icon: Wrench, title: "صيانة منزلية", subtitle: "أعطال مفاجئة وإصلاحات دورية" },
  { icon: Sparkles, title: "تنظيف احترافي", subtitle: "تنظيف منازل ومكاتب عميق" },
  { icon: PlugZap, title: "أعمال كهرباء", subtitle: "تمديدات، إنارة، وصيانة" },
  { icon: Zap, title: "سباكة", subtitle: "تسريبات، سخانات، وصرف" },
  { icon: Paintbrush, title: "دهان وتشطيبات", subtitle: "تحسين شكل المنزل بسرعة" },
  { icon: Hammer, title: "نجارة", subtitle: "تركيب وإصلاح الأثاث والأبواب" },
  { icon: Truck, title: "نقل أثاث", subtitle: "نقل آمن وسريع داخل المدينة" },
  { icon: ShieldCheck, title: "خدمات موثقة", subtitle: "عمال بتقييمات حقيقية" },
]

function ServicesCards() {
  return (
    <section id="services" className="py-20" dir="rtl">
      <div className="section-shell">
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-3">Service Categories</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">الفئات الأكثر طلباً</h2>
          <p className="mt-3 text-slate-600 font-semibold">اختر الخدمة المناسبة وابدأ طلبك خلال أقل من دقيقة.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <article key={category.title} className="premium-card p-5 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <category.icon size={22} />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1">{category.title}</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">{category.subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesCards