import React from "react"
import { Wrench, Sparkles, Zap, PlugZap, Paintbrush, Hammer, Truck, ShieldCheck, ChevronLeft } from "lucide-react"

const categories = [
  { icon: Wrench, title: "سباكة" },
  { icon: Zap, title: "كهرباء" },
  { icon: Paintbrush, title: "دهان" },
  { icon: Sparkles, title: "تنظيف" },
  { icon: Hammer, title: "نجارة" },
  { icon: Truck, title: "نقل" },
  { icon: PlugZap, title: "تكييف" },
  { icon: ShieldCheck, title: "أمن" }
]

function ServicesCards() {
  return (
    <section id="services" className="bg-white py-20" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-950">الفئات</h2>
            <p className="mt-2 font-medium text-slate-500">
              اختر المجال الذي تحتاجه لنعرض لك أفضل الخبراء
            </p>
          </div>
          <button className="flex items-center gap-2 self-start text-xs font-black uppercase tracking-widest text-primary hover:underline sm:self-auto">
            عرض الكل
            <ChevronLeft size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 xl:grid-cols-8">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group flex cursor-pointer flex-col items-center gap-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-surface-100 bg-surface-50 text-slate-400 shadow-sm transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-md sm:h-20 sm:w-20">
                <category.icon size={24} className="sm:h-7 sm:w-7" />
              </div>
              <span className="text-xs font-black text-slate-600 transition-colors group-hover:text-primary">
                {category.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesCards
