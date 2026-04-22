import React, { useEffect, useState } from "react"
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import heroImg from "../assets/hero-worker.png"
import { getOpenTasks, getWorkers } from "../api"

function Hero() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    workers: 0,
    openTasks: 0
  })

  useEffect(() => {
    let active = true

    Promise.allSettled([
      getWorkers(0, 1),
      getOpenTasks(0, 1)
    ]).then(([workersResult, tasksResult]) => {
      if (!active) return

      setStats({
        workers: workersResult.status === "fulfilled" ? Number(workersResult.value?.totalElements || 0) : 0,
        openTasks: tasksResult.status === "fulfilled" ? Number(tasksResult.value?.totalElements || 0) : 0
      })
    })

    return () => {
      active = false
    }
  }, [])

  return (
    <section dir="rtl" className="relative container mx-auto bg-white px-6 pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            أفضل المنصات المهنية في موريتانيا
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
            ابحث عن <span className="text-blue-600">المحترف</span> المناسب لكل مهمة.
          </h1>

          <p className="max-w-lg text-lg font-medium leading-relaxed text-slate-500">
            نحن نسهل عليك الوصول إلى أفضل العمال والمهنيين في محيطك، مع ضمان الجودة والسرعة في التنفيذ.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button onClick={() => navigate("/auth")} className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700">
              ابدأ رحلتك الآن
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-[-4px]" />
            </button>
            <button onClick={() => document.getElementById("workers")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50">
              استعرض خدماتنا
            </button>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900">{stats.openTasks}+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">مهمة مفتوحة</span>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900">{stats.workers}+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">عامل مسجل</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div className="relative z-10 overflow-hidden rounded-[3rem] border-8 border-slate-50 shadow-2xl">
            <img src={heroImg} alt="Worker" className="h-auto w-full object-cover" />
          </div>

          <div className="absolute -right-6 top-1/4 z-20 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck size={20} /></div>
            <span className="text-sm font-bold text-slate-900">عمال موثقون</span>
          </div>

          <div className="absolute -left-6 bottom-1/4 z-20 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><MapPin size={20} /></div>
            <span className="text-sm font-bold text-slate-900">دقة في الموقع</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
