import React, { useState } from "react"
import { Star, MapPin, BadgeCheck, Shield, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const WORKERS = [
  { id: 1, name: "أحمد سالم", specialty: "سباكة", rating: 4.9, reviews: 124, price: 1200, available: true, location: "نواكشوط", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "فاطمة اندياي", specialty: "كهرباء", rating: 4.8, reviews: 89, price: 1500, available: true, location: "نواكشوط", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 3, name: "محمد ولد أحمد", specialty: "دهان", rating: 4.7, reviews: 61, price: 1000, available: false, location: "لكصر", img: "https://randomuser.me/api/portraits/men/55.jpg" },
  { id: 4, name: "مريم بنت سيدي", specialty: "تنظيف", rating: 4.9, reviews: 210, price: 900, available: true, location: "تفرغ زينة", img: "https://randomuser.me/api/portraits/women/68.jpg" },
]

const FILTERS = ["الكل", "سباكة", "كهرباء", "دهان", "تنظيف"]

export default function FeaturedWorkers() {
  const [filter, setFilter] = useState("الكل")
  const navigate = useNavigate()
  const filtered = WORKERS.filter((w) => filter === "الكل" || w.specialty === filter)

  return (
    <section id="workers" className="py-24 bg-white" dir="rtl">
      <div className="section-shell">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-primary mb-3 text-right">Top Rated Workers</p>
            <h2 className="text-3xl md:text-4xl font-black text-surface-900 tracking-tight text-right">أفضل المحترفين حسب التقييم</h2>
            <p className="mt-4 text-surface-500 font-medium leading-relaxed max-w-xl text-right">
              نحن نختار بعناية أفضل الكفاءات لضمان حصولك على خدمة متميزة. كافة المحترفين خضعوا لفحص دقيق لملفاتهم وتاريخ أعمالهم.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
            {FILTERS.map((f) => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                  filter === f 
                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105" 
                  : "bg-surface-50 border-surface-200 text-surface-600 hover:border-primary/30 hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((w) => (
            <article key={w.id} className="saas-card group overflow-hidden border-surface-200">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={w.img} 
                  alt={w.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-surface-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-black rounded-full shadow-sm z-10 ${
                  w.available 
                  ? "bg-emerald-500 text-white" 
                  : "bg-surface-200 text-surface-600"
                }`}>
                  {w.available ? "متاح حالياً" : "مشغول"}
                </span>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-bold text-surface-900 text-lg">{w.name}</h3>
                    <BadgeCheck size={18} className="text-primary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-xs px-2 py-0.5 bg-primary-soft rounded-md">{w.specialty}</span>
                    <p className="flex items-center gap-1 text-[11px] font-bold text-surface-400">
                      <MapPin size={12} className="text-surface-300" />
                      {w.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      <Star size={14} className="fill-current" />
                      <span className="text-sm font-black text-surface-900">{w.rating}</span>
                    </div>
                    <span className="text-[11px] font-medium text-surface-400">({w.reviews} تقييم)</span>
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-black text-surface-900">{w.price}</span>
                    <span className="text-[10px] font-bold text-surface-400 mr-1">MRU/ساعة</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate("/auth")} 
                  className="w-full btn-saas btn-secondary group/btn h-11 border-surface-200 hover:border-primary hover:text-primary active:scale-95"
                >
                  حجز موعد
                  <ChevronLeft size={16} className="rotate-180 group-hover/btn:-translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
        
        {/* Verification Badge Footer */}
        <div className="mt-16 bg-surface-50 border border-surface-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-right animate-fade-in">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Shield size={24} />
              </div>
              <div className="flex flex-col items-start">
                <h4 className="font-bold text-surface-900">حماية كاملة للمستفيد</h4>
                <p className="text-xs text-surface-500 font-medium">نضمن لك حقوقك وجودة الخدمة المقدمة</p>
              </div>
           </div>
           <div className="h-8 w-px bg-surface-200 hidden md:block" />
           <p className="max-w-md text-sm text-surface-600 font-medium leading-relaxed">
             جميع المحترفين في منصة شغلني يخضعون لمرحلة تحقق الهوية وفحص السجل الجنائي لضمان أعلى مستويات الأمان.
           </p>
        </div>
      </div>
    </section>
  )
}