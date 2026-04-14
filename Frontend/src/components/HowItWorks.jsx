import React from "react"
import { UserPlus, Search, MessageCircle, Star, ArrowLeft } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "أنشئ حسابك",
    description: "سجّل خلال دقائق وابدأ استخدام المنصة كعميل يبحث عن خدمة أو كعامل يريد توسيع نشاطه."
  },
  {
    icon: Search,
    title: "اختر الخدمة المناسبة",
    description: "تصفح قائمة العمال حسب التخصص، التقييم، السعر، والموقع داخل نواكشوط أو أي ولاية أخرى."
  },
  {
    icon: MessageCircle,
    title: "تواصل واتفق",
    description: "ناقش تفاصيل الطلب وحدد الموعد والمقابل المناسب بكل وضوح قبل بدء العمل."
  },
  {
    icon: Star,
    title: "قيّم التجربة",
    description: "بعد انتهاء الخدمة شارك تقييمك حتى تبقى المنصة أكثر موثوقية وشفافية للجميع."
  }
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-surface-100 bg-surface-50 py-24" dir="rtl">
      <div className="section-shell">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-primary">خطوات واضحة وسريعة</p>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-surface-900 md:text-5xl">
            كل ما تحتاجه في أربع خطوات بسيطة
          </h2>
          <p className="mt-6 text-lg font-medium leading-relaxed text-surface-500">
            صممنا التجربة لتكون مباشرة وسهلة، سواء كنت تبحث عن عامل موثوق أو ترغب في الحصول على فرص عمل جديدة.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-12 z-0 hidden h-px w-full bg-surface-200 lg:block" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <article key={step.title} className="group relative z-10 flex flex-col items-center text-center">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                    <Icon size={28} className="text-primary transition-colors group-hover:text-white" />
                    <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-4 border-surface-50 bg-surface-900 text-xs font-black text-white">
                      {i + 1}
                    </div>
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-surface-900 transition-colors group-hover:text-primary">
                    {step.title}
                  </h3>
                  <p className="max-w-[220px] text-sm font-medium leading-relaxed text-surface-500">{step.description}</p>

                  {i < steps.length - 1 && (
                    <div className="absolute -left-4 top-12 hidden text-surface-200 lg:block">
                      <ArrowLeft size={20} />
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>

        <div className="mt-20 text-center animate-fade-in">
          <button className="btn-saas btn-primary h-12 px-10 shadow-md shadow-primary/20">
            ابدأ تجربتك الأولى الآن
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
