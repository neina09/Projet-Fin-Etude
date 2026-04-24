import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getWorkers } from "../api"
import WorkerCard from "./WorkerCard"

export default function FeaturedWorkers() {
  const navigate = useNavigate()
  const [workers, setWorkers] = useState([])

  useEffect(() => {
    let active = true

    getWorkers()
      .then((payload) => {
        if (!active) return
        const list = Array.isArray(payload) ? payload : (payload?.content ?? [])
        setWorkers(list)
      })
      .catch(() => {
        if (active) setWorkers([])
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
    <section id="workers" className="bg-[#FAFBFF] py-24 sm:py-32" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:mb-20 md:flex-row md:items-end">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#1d4ed8]">
              نخبة المجتمع
            </span>
            <h2 className="text-4xl font-black tracking-tighter text-slate-950 sm:text-5xl">
              أبرز <span className="text-[#1d4ed8]">المحترفين</span>
            </h2>
            <p className="max-w-xl text-base font-bold leading-relaxed text-slate-500/80 sm:text-lg">
              تصفّح قائمة مختارة من أفضل العمال الموثقين والمهيئين لخدمتك بمعايير مهنية أعلى.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-900 shadow-xl shadow-slate-200/20 transition-all hover:border-[#1d4ed8] hover:text-[#1d4ed8] hover:shadow-[#1d4ed8]/5 sm:px-10 sm:py-5"
          >
            استكشاف جميع العمال
          </motion.button>
        </div>

        {featuredWorkers.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
            لا توجد ملفات عمال موثقة متاحة للعرض حاليًا.
          </div>
        )}
      </div>
    </section>
  )
}
