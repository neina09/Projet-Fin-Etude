import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getWorkers } from "../api"
import WorkerCard from "./WorkerCard"

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
    <section id="workers" className="bg-[#FAFBFF] py-32" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-black text-[#1d4ed8] uppercase tracking-widest">
              نخبة المجتمع
            </span>
            <h2 className="text-5xl font-black text-slate-950 tracking-tighter">أبرز <span className="text-[#1d4ed8]">المحترفين</span></h2>
            <p className="max-w-xl font-bold text-lg leading-relaxed text-slate-500/80">تصفح قائمة مختارة من أفضل العمال الموثقين والمهيئين لخدمتك بأعلى معايير الجودة في موريتانيا.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth")}
            className="rounded-[1.75rem] border border-slate-200 bg-white px-10 py-5 text-sm font-black text-slate-900 shadow-xl shadow-slate-200/20 transition-all hover:border-[#1d4ed8] hover:text-[#1d4ed8] hover:shadow-[#1d4ed8]/5"
          >
            استكشاف جميع العمال
          </motion.button>
        </div>

        {featuredWorkers.length ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWorkers.map((worker) => (
              <WorkerCard 
                key={worker.id} 
                worker={worker} 
                onViewDetails={() => navigate("/auth")} 
              />
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