import React from "react"
import { Star, Quote } from "lucide-react"
import { useLanguage } from "../i18n/LanguageContext"

function Testimonials() {
  const { dir, t } = useLanguage()
  const testimonials = t("testimonials.items", [])

  return (
    <section id="testimonials" className="bg-slate-50 py-24" dir={dir}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl md:text-5xl">
              {t("testimonials.titleBefore")} <span className="text-primary">{t("testimonials.titleHighlight")}</span> {t("testimonials.titleAfter")}
            </h2>
            <p className="mt-6 text-base font-medium leading-relaxed text-slate-500 sm:mt-8 sm:text-lg">
              {t("testimonials.description")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5 sm:mt-10 sm:gap-6">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-950">98%</span>
                <span className="text-sm font-bold text-slate-400">{t("testimonials.satisfaction")}</span>
              </div>
              <div className="hidden h-10 w-px bg-slate-200 sm:block" />
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-950">+5k</span>
                <span className="text-sm font-bold text-slate-400">{t("testimonials.happyClients")}</span>
              </div>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {testimonials.map((testimonial, index) => {
              const initials = testimonial.name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "?"
              const colors = ["bg-blue-600", "bg-emerald-600", "bg-violet-600", "bg-amber-600"]
              const bgColor = colors[index % colors.length]

              return (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-x-1 hover:shadow-xl sm:p-8"
                >
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-50 text-base font-black text-white ${bgColor}`}>
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-950">{testimonial.name}</h4>
                        <p className="text-xs font-bold text-slate-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500">
                      {Array.from({ length: testimonial.rating }).map((_, itemIndex) => (
                        <Star key={itemIndex} size={14} className="fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <Quote size={20} className="absolute -right-2 -top-2 rotate-180 text-blue-50" />
                    <p className="relative z-10 text-base font-medium leading-relaxed text-slate-600 italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
