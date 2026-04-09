import React, { useState } from "react"
import { Star, MapPin, BadgeCheck } from "lucide-react"
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
    <section id="workers" className="py-20" dir="rtl">
      <div className="section-shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Top Rated Workers</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">أفضل المحترفين حسب التقييم</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-black transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-white border border-blue-100 text-blue-700 hover:bg-blue-50"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((w) => (
            <article key={w.id} className="premium-card p-4">
              <div className="relative overflow-hidden rounded-2xl h-48 mb-4">
                <img src={w.img} alt={w.name} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 px-3 py-1 text-[10px] font-black rounded-full ${w.available ? "bg-emerald-400 text-emerald-950" : "bg-slate-300 text-slate-700"}`}>
                  {w.available ? "متاح" : "مشغول"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900">{w.name}</h3>
                <BadgeCheck size={14} className="text-blue-600" />
              </div>
              <p className="text-xs font-bold text-blue-700 mt-1">{w.specialty}</p>
              <p className="flex items-center gap-1 text-xs text-slate-500 mt-2"><MapPin size={13} />{w.location}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} className="fill-yellow-400" />
                  <span className="text-xs font-black">{w.rating}</span>
                  <span className="text-[11px] text-slate-500">({w.reviews})</span>
                </div>
                <span className="text-sm font-black text-slate-900">{w.price} MRU/ساعة</span>
              </div>
              <button onClick={() => navigate("/auth")} className="btn-2026 w-full mt-4 text-sm">احجز الآن</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}