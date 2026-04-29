import { Phone, CheckCircle, Clock, Users, MapPin, CreditCard } from "lucide-react"
import { useLanguage } from "../i18n/LanguageContext"

export default function AboutUs() {
  const { dir, isArabic, t } = useLanguage()

  const stats = [
    { val: "+8K", label: t("about.stats.workers") },
    { val: "+40K", label: t("about.stats.tasks") },
    { val: "4.8/5", label: t("about.stats.rating") },
  ]

  const features = [
    { icon: Phone, ...t("about.features.0") },
    { icon: CheckCircle, ...t("about.features.1") },
    { icon: Clock, ...t("about.features.2") },
    { icon: Users, ...t("about.features.3") },
    { icon: MapPin, ...t("about.features.4") },
    { icon: CreditCard, ...t("about.features.5") },
  ]

  return (
    <section id="about" dir={dir} className="py-24 bg-white">
      <div className="section-shell">
        <div className="saas-card p-8 md:p-12 lg:p-16 border-surface-200">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Main Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className={`space-y-4 ${isArabic ? "text-right" : "text-left"}`}>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{t("about.missionVision")}</p>
                <h2 className="text-3xl md:text-5xl font-black text-surface-900 leading-tight">
                  {t("about.titleBefore")} <br />
                  <span className="text-primary italic">{t("about.titleHighlight")}</span> {t("about.titleAfter")}
                </h2>
                <p className="text-surface-500 text-lg font-medium leading-relaxed max-w-xl">
                  {t("about.description")}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-surface-100">
                {stats.map(({ val, label }) => (
                  <div key={label} className={`space-y-1 ${isArabic ? "text-right" : "text-left"}`}>
                    <p className="text-2xl md:text-4xl font-black text-surface-900">{val}</p>
                    <p className="text-[10px] md:text-xs font-bold text-surface-400 uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="space-y-4 group">
                  <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-surface-900 mb-2">{feature.title}</h3>
                    <p className="text-sm font-medium text-surface-400 leading-relaxed">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}