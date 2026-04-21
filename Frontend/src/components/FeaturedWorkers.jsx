import React, { useEffect, useMemo, useState } from "react"
import { BadgeCheck, ChevronLeft, MapPin, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getWorkers, resolveAssetUrl } from "../api"

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop"

const getStatusLabel = (worker) => (worker.availability === "BUSY" ? "مشغول حالياً" : "متاح حالياً")

const getStatusClass = (worker) => (
  worker.availability === "BUSY"
    ? "bg-amber-500/95 text-white"
    : "bg-emerald-500/95 text-white"
)

export default function FeaturedWorkers() {
  const navigate = useNavigate()
  const [workers, setWorkers] = useState([])

  useEffect(() => {
    let active = true

    getWorkers()
      .then((payload) => {
        if (active) {
          // ✅ الإصلاح: payload هو { content: [...] } وليس array مباشرة
          const list = Array.isArray(payload) ? payload : (payload?.content ?? [])
          setWorkers(list)
        }
      })
      .catch(() => {
        if (active) {
          setWorkers([])
        }
      })

    return () => {
      active = false
    }
  }, [])

  const featuredWorkers = useMemo(
    () => workers.filter((worker) => worker.verificationStatus === "VERIFIED").slice(0, 3),
    [workers]
  )

  return (
    <section id="workers" className="bg-slate-50 py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-950">أفضل العمال</h2>
            <p className="mt-2 font-medium leading-relaxed text-slate-500">تصفح قائمة بأفضل المحترفين الموثقين في مدينتك</p>
          </div>
          <button
            onClick={() => navigate("/auth")}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-600 transition-all hover:border-brand-blue hover:text-brand-blue"
          >
            استكشاف جميع العمال
          </button>
        </div>

        {featuredWorkers.length ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWorkers.map((worker) => (
              <article key={worker.id} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={resolveAssetUrl(worker.imageUrl) || FALLBACK_IMAGE}
                    alt={worker.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-black shadow-sm ${getStatusClass(worker)}`}>
                    {getStatusLabel(worker)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5">
                        <h3 className="text-xl font-black text-slate-950">{worker.name}</h3>
                        <BadgeCheck size={18} className="text-brand-blue" />
                      </div>
                      <p className="text-sm font-bold text-slate-400">{worker.job || "عامل محترف"}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={16} className="fill-current" />
                        <span className="text-lg font-black text-slate-950">{Number(worker.averageRating || 0).toFixed(1)}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">موثق</span>
                    </div>
                  </div>

                  <div className="mb-6 flex items-center gap-4 border-y border-slate-50 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={16} />
                      <span className="text-sm font-medium">{worker.address || "غير محدد"}</span>
                    </div>
                    <div className="mr-auto text-left">
                      <span className="text-xl font-black text-slate-950">{worker.salary || 0}</span>
                      <span className="mr-1 text-[10px] font-bold uppercase text-slate-400">MRU / ساعة</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/auth")}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-blue py-4 text-sm font-black text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-brand-blue-hover active:scale-95"
                  >
                    احجز الآن
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-400">
            لا توجد ملفات عمال موثقة متاحة للعرض حالياً.
          </div>
        )}
      </div>
    </section>
  )
}