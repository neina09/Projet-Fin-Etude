import React, { useMemo, useState } from "react"
import { Star, MapPin, BadgeCheck, Shield, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const WORKERS = [
  { id: 1, name: "أحمد سالم", specialty: "سباكة", rating: 4.9, reviews: 124, price: 1200, available: true, location: "نواكشوط", initials: "أ س" },
  { id: 2, name: "فاطمة اندياي", specialty: "كهرباء", rating: 4.8, reviews: 89, price: 1500, available: true, location: "نواكشوط", initials: "ف أ" },
  { id: 3, name: "محمد ولد أحمد", specialty: "دهان", rating: 4.7, reviews: 61, price: 1000, available: false, location: "لكصر", initials: "م أ" },
  { id: 4, name: "مريم بنت سيدي", specialty: "تنظيف", rating: 4.9, reviews: 210, price: 900, available: true, location: "تفرغ زينة", initials: "م س" }
]

const FILTERS = ["الكل", "سباكة", "كهرباء", "دهان", "تنظيف"]

export default function FeaturedWorkers() {
  const [filter, setFilter] = useState("الكل")
  const navigate = useNavigate()
  const filtered = useMemo(
    () => WORKERS.filter((worker) => filter === "الكل" || worker.specialty === filter),
    [filter]
  )

  return (
    <section id="workers" className="bg-white py-24" dir="rtl">
      <div className="section-shell">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-right text-xs font-black uppercase tracking-[0.15em] text-primary">عمال موصى بهم</p>
            <h2 className="text-right text-3xl font-black tracking-tight text-surface-900 md:text-4xl">أمثلة على ملفات مهنية مرتبة</h2>
            <p className="mt-4 max-w-xl text-right font-medium leading-relaxed text-surface-500">
              بدلاً من عرض صور عشوائية وبيانات غير مترابطة، تعرض هذه البطاقات الشكل المقترح للملف المهني:
              التخصص، التقييم، الحي، والسعر في بطاقة واحدة واضحة.
            </p>
          </div>
          <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
            {FILTERS.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full border px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                  filter === item
                    ? "scale-105 border-primary bg-primary text-white shadow-md shadow-primary/20"
                    : "border-surface-200 bg-surface-50 text-surface-600 hover:border-primary/30 hover:text-primary"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((worker) => (
            <article key={worker.id} className="saas-card group overflow-hidden border-surface-200">
              <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-slate-100 via-white to-primary-soft">
                <div className="absolute inset-0 bg-linear-to-t from-surface-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-lg font-black text-surface-900 shadow-lg ring-1 ring-surface-200">
                    {worker.initials}
                  </div>
                </div>
                <span
                  className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-black shadow-sm ${
                    worker.available ? "bg-emerald-500 text-white" : "bg-surface-200 text-surface-600"
                  }`}
                >
                  {worker.available ? "متاح حالياً" : "مشغول"}
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-surface-900">{worker.name}</h3>
                    <BadgeCheck size={18} className="text-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">{worker.specialty}</span>
                    <p className="flex items-center gap-1 text-[11px] font-bold text-surface-400">
                      <MapPin size={12} className="text-surface-300" />
                      {worker.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-surface-100 pt-4">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      <Star size={14} className="fill-current" />
                      <span className="text-sm font-black text-surface-900">{worker.rating}</span>
                    </div>
                    <span className="text-[11px] font-medium text-surface-400">({worker.reviews} تقييم)</span>
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-black text-surface-900">{worker.price}</span>
                    <span className="mr-1 text-[10px] font-bold text-surface-400">MRU/ساعة</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/auth")}
                  className="btn-saas btn-secondary group/btn h-11 w-full border-surface-200 hover:border-primary hover:text-primary active:scale-95"
                >
                  ابدأ الحجز
                  <ChevronLeft size={16} className="rotate-180 transition-transform group-hover/btn:-translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex animate-fade-in flex-col items-center justify-center gap-8 rounded-2xl border border-surface-200 bg-surface-50 p-6 text-center md:flex-row md:text-right">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield size={24} />
            </div>
            <div className="flex flex-col items-start">
              <h4 className="font-bold text-surface-900">ثقة وأمان لكل عميل</h4>
              <p className="text-xs font-medium text-surface-500">المنصة تحتاج ملفات منظمة وقابلة للمراجعة قبل إظهار مزود الخدمة للمستخدمين</p>
            </div>
          </div>
          <div className="hidden h-8 w-px bg-surface-200 md:block" />
          <p className="max-w-md text-sm font-medium leading-relaxed text-surface-600">
            في النسخة النهائية يفضّل أن تأتي هذه البطاقات من قاعدة بيانات حقيقية بدل بيانات ثابتة داخل الواجهة.
          </p>
        </div>
      </div>
    </section>
  )
}
