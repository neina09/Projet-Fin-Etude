import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "../i18n/LanguageContext"

export default function CtaSection() {
  const navigate = useNavigate()
  const { dir, isArabic, t } = useLanguage()

  return (
    <section className="bg-white py-20 sm:py-24" dir={dir}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-6 py-10 text-center shadow-2xl shadow-primary/30 sm:rounded-[3rem] sm:p-12 lg:rounded-[4rem] lg:p-24">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <h2 className="text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-7xl">
              {t("cta.titleBefore")} <span className="text-blue-100">{t("cta.titleHighlight")}</span> {t("cta.titleAfter")}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base font-bold leading-relaxed text-blue-100/80 sm:mt-8 sm:text-lg">
              {t("cta.description")}
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:mt-14 sm:flex-row sm:items-center">
              <button
                onClick={() => navigate("/auth")}
                className="h-14 w-full rounded-[1.25rem] bg-white px-8 text-sm font-black text-primary shadow-xl transition-all hover:scale-[1.02] active:scale-95 sm:h-16 sm:w-auto sm:px-12"
              >
                {t("cta.primary")}
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-[1.25rem] border border-white/20 bg-white/10 px-8 text-sm font-black text-white backdrop-blur-xl transition-all hover:bg-white/20 active:scale-95 sm:h-16 sm:w-auto sm:px-12"
              >
                {t("cta.secondary")}
                <ArrowLeft size={18} className={isArabic ? "" : "rotate-180"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
