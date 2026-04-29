import React, { useEffect, useState } from "react"
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import heroImg from "../assets/hero-worker.png"
import { getOpenTasks, getWorkers } from "../api"
import { useLanguage } from "../i18n/LanguageContext"

function Hero() {
  const navigate = useNavigate()
  const { dir, isArabic, t } = useLanguage()
  const [stats, setStats] = useState({ workers: 0, openTasks: 0 })

  const highlights = [
    {
      icon: ShieldCheck,
      title: t("hero.verifiedTitle"),
      subtitle: t("hero.verifiedSubtitle"),
      accent: "border-emerald-100",
      iconWrap: "bg-emerald-50 text-emerald-600",
      desktopPosition: isArabic ? "sm:absolute sm:-right-4 sm:top-[18%]" : "sm:absolute sm:-left-4 sm:top-[18%]"
    },
    {
      icon: MapPin,
      title: t("hero.locationTitle"),
      subtitle: t("hero.locationSubtitle"),
      accent: "border-blue-100",
      iconWrap: "bg-blue-50 text-blue-600",
      desktopPosition: isArabic ? "sm:absolute sm:-left-4 sm:bottom-[18%]" : "sm:absolute sm:-right-4 sm:bottom-[18%]"
    }
  ]

  useEffect(() => {
    let active = true

    Promise.allSettled([getWorkers(0, 1), getOpenTasks(0, 1)]).then(([workersResult, tasksResult]) => {
      if (!active) return

      const workersPayload = workersResult.status === "fulfilled" ? workersResult.value : null
      const tasksPayload = tasksResult.status === "fulfilled" ? tasksResult.value : null

      const workersCount = Number(workersPayload?.totalElements ?? workersPayload?.totalItems ?? workersPayload?.content?.length ?? 0)
      const openTasksCount = Number(tasksPayload?.totalElements ?? tasksPayload?.totalItems ?? tasksPayload?.content?.length ?? 0)

      setStats({
        workers: Number.isFinite(workersCount) ? workersCount : 0,
        openTasks: Number.isFinite(openTasksCount) ? openTasksCount : 0
      })
    })

    return () => {
      active = false
    }
  }, [])

  return (
    <section dir={dir} className="relative container mx-auto overflow-hidden bg-white px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:pb-32 lg:pt-48">
      <div className="absolute left-0 top-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            {t("hero.badge")}
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            {t("hero.titleBefore")} <span className="text-blue-600">{t("hero.titleHighlight")}</span> {t("hero.titleAfter")}
          </h1>

          <p className="max-w-lg text-base font-medium leading-relaxed text-slate-500 sm:text-lg">
            {t("hero.description")}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/auth")}
              className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
            >
              {t("hero.primaryAction")}
              <ArrowRight size={18} className={`transition-transform ${isArabic ? "group-hover:-translate-x-1" : "rotate-180 group-hover:translate-x-1"}`} />
            </button>

            <button
              onClick={() => document.getElementById("workers")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
            >
              {t("hero.secondaryAction")}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-4 sm:gap-8">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900">{stats.openTasks}+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t("hero.openTasks")}</span>
            </div>
            <div className="hidden h-8 w-px bg-slate-100 sm:block" />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900">{stats.workers}+</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t("hero.verifiedWorkers")}</span>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative z-10 overflow-hidden rounded-[2rem] border-4 border-slate-50 shadow-2xl sm:rounded-[3rem] sm:border-8"
          >
            <img
              src={heroImg}
              alt={t("hero.imageAlt")}
              className="h-auto w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </motion.div>

          <div className="mt-4 grid gap-3 sm:hidden">
            {highlights.map((item) => (
              <div key={item.title} className={`flex items-center gap-3 rounded-2xl border bg-white/95 p-4 shadow-lg backdrop-blur-sm ${item.accent}`}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconWrap}`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{item.title}</p>
                  <p className="text-[11px] font-bold text-slate-500">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index === 0 ? 24 : -24, y: index === 0 ? 10 : 12 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.55, delay: index === 0 ? 0.55 : 0.75 }}
              className={`hidden z-20 items-center gap-3 rounded-2xl border bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:flex ${item.accent} ${item.desktopPosition}`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconWrap}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{item.title}</p>
                <p className="text-[11px] font-bold text-slate-500">{item.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
