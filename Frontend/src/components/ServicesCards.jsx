import React from "react"
import { Wrench, Sparkles, Zap, PlugZap, Paintbrush, Hammer, Truck, ShieldCheck, ChevronLeft } from "lucide-react"
import { useLanguage } from "../i18n/LanguageContext"

function ServicesCards() {
  const { dir, isArabic, t } = useLanguage()
  const labels = t("services.categories", [])
  const categories = [
    { icon: Wrench, title: labels[0] },
    { icon: Zap, title: labels[1] },
    { icon: Paintbrush, title: labels[2] },
    { icon: Sparkles, title: labels[3] },
    { icon: Hammer, title: labels[4] },
    { icon: Truck, title: labels[5] },
    { icon: PlugZap, title: labels[6] },
    { icon: ShieldCheck, title: labels[7] }
  ]

  return (
    <section id="services" className="bg-white py-20" dir={dir}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-950">{t("services.title")}</h2>
            <p className="mt-2 font-medium text-slate-500">{t("services.subtitle")}</p>
          </div>

          <button className="flex items-center gap-2 self-start text-xs font-black uppercase tracking-widest text-primary hover:underline sm:self-auto">
            {t("services.viewAll")}
            <ChevronLeft size={14} className={isArabic ? "" : "rotate-180"} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 xl:grid-cols-8">
          {categories.map((category) => (
            <div key={category.title} className="group flex cursor-pointer flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-surface-100 bg-surface-50 text-slate-400 shadow-sm transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-md sm:h-20 sm:w-20">
                <category.icon size={24} className="sm:h-7 sm:w-7" />
              </div>
              <span className="text-xs font-black text-slate-600 transition-colors group-hover:text-primary">
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
