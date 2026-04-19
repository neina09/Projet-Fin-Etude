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
          <button className="flex items-center gap-2 text-sm font-bold text-brand-blue hover:underline">
            عرض الكل
            <ChevronLeft size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((category) => (
            <div 
              key={category.title} 
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-brand-blue transition-all duration-300 shadow-sm border border-slate-100 group-hover:border-blue-100 group-hover:shadow-md">
                <category.icon size={28} />
              </div>
              <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue transition-colors">
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