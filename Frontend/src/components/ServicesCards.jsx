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
  { icon: ShieldCheck, title: "أمن" },
]

function ServicesCards() {
  return (
    <section id="services" className="py-20 bg-white" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-950">الفئات</h2>
            <p className="mt-2 text-slate-500 font-medium">اختر المجال الذي تحتاجه لنعرض لك أفضل الخبراء</p>
          </div>
          <button className="flex items-center gap-2 text-xs font-black text-primary hover:underline uppercase tracking-widest">
            عرض الكل
            <ChevronLeft size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((category) => (
            <div 
              key={category.title} 
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="h-20 w-20 rounded-full bg-surface-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300 shadow-sm border border-surface-100 group-hover:border-primary/20 group-hover:shadow-md">
                <category.icon size={28} />
              </div>
              <span className="text-[10px] font-black text-slate-600 group-hover:text-primary transition-colors uppercase tracking-widest">
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