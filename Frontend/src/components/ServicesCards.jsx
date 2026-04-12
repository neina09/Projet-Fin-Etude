import React from "react"
import { Wrench, Sparkles, Zap, PlugZap, Paintbrush, Hammer, Truck, ShieldCheck } from "lucide-react"

const categories = [
  { icon: Wrench, title: "صيانة منزلية", subtitle: "إصلاحات دورية وأعطال مفاجئة" },
  { icon: Sparkles, title: "تنظيف احترافي", subtitle: "تنظيف عميق للمنازل والمكاتب" },
  { icon: PlugZap, title: "أعمال كهرباء", subtitle: "تمديدات، إنارة وصيانة شاملة" },
  { icon: Zap, title: "سباكة", subtitle: "إصلاح التسريبات والصرف الصحي" },
  { icon: Paintbrush, title: "دهان وتشطيب", subtitle: "تحسين مظهر المنزل بلمسات عصرية" },
  { icon: Hammer, title: "أعمال النجارة", subtitle: "تركيب وإصلاح الأثاث والأبواب" },
  { icon: Truck, title: "نقل أثاث", subtitle: "نقل آمن وسريع داخل المدينة" },
  { icon: ShieldCheck, title: "خدمات موثوقة", subtitle: "خبراء معتمدون بتقييمات حقيقية" },
]

function ServicesCards() {
  return (
    <section id="services" className="py-24 bg-surface-50" dir="rtl">
      <div className="section-shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-primary mb-3">Service Categories</p>
            <h2 className="text-3xl md:text-4xl font-black text-surface-900 tracking-tight">الفئات الأكثر طلباً</h2>
            <p className="mt-4 text-surface-500 font-medium leading-relaxed">
              اختر الخدمة التي تحتاجها من بين مجموعة واسعة من التخصصات. نوفر لك أفضل المحترفين في متناول يدك.
            </p>
          </div>
          <button className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-2 group transition-all">
            عرض كافة الفئات
            <span className="h-px w-8 bg-primary/30 group-hover:w-12 transition-all" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <article 
              key={category.title} 
              className="saas-card p-6 flex flex-col items-start gap-4 group cursor-pointer hover:border-primary/20"
            >
              <div className="h-12 w-12 rounded-xl bg-white border border-surface-200 text-primary flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <category.icon size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-surface-900 mb-1.5">{category.title}</h3>
                <p className="text-sm font-medium text-surface-500 leading-relaxed">{category.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesCards