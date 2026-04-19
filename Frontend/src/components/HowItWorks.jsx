import React from "react"
import { CheckCircle, Search, Users } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "ابحث عن الخدمة",
    description: "تصفح مئات الخدمات المتاحة واختر ما يناسب احتياجاتك الحالية بكل سهولة."
  },
  {
    icon: Users,
    title: "اختر المحترف المناسب",
    description: "قارن بين العمال من حيث التقييم وحالة التوفر والأسعار واختر الأنسب لمهمتك."
  },
  {
    icon: CheckCircle,
    title: "أنجز مهمتك بسهولة",
    description: "تواصل مباشرة مع المحترف واتفق على التفاصيل وأنجز عملك بأعلى جودة."
  }
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-black text-slate-950 md:text-5xl">كيف تعمل المنصة؟</h2>
          <p className="mt-6 text-lg font-medium leading-relaxed text-slate-500">
            خطوات بسيطة تفصلك عن الحصول على أفضل الخدمات الميدانية في وقت قياسي وبكل احترافية.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="group flex flex-col items-center text-center">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 text-brand-blue shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-brand-blue group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-500/20">
                  <Icon size={40} />
                </div>
                <h3 className="mb-4 text-2xl font-black text-slate-950">{step.title}</h3>
                <p className="max-w-[280px] text-base font-medium leading-relaxed text-slate-500">{step.description}</p>
                {i < steps.length - 1 && <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 lg:block" />}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
