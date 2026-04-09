import React from "react"
import { UserPlus, Search, MessageCircle, Star } from "lucide-react"

const steps = [
  { icon: UserPlus, title: "إنشاء حساب", description: "قم بالتسجيل في ثوانٍ وابدأ رحلتك معنا." },
  { icon: Search, title: "ابحث عن خبير", description: "تصفح المحترفين حسب الخدمة، التقييم، والموقع." },
  { icon: MessageCircle, title: "تواصل واتفق", description: "ناقش التفاصيل وحدد السعر والموعد المناسب." },
  { icon: Star, title: "قيّم التجربة", description: "شارك تقييمك بعد انتهاء الخدمة بكل شفافية." },
]

function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[#f8fafc]" dir="rtl">
      <div className="section-shell">
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-3 font-black">كيف يعمل شغلي؟</p>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">كيف يعمل شغلي؟</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg font-bold">
            أربع خطوات بسيطة تفصلك عن إنجاز مهامك بأعلى جودة واحترافية.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-11 right-[8%] left-[8%] h-px bg-slate-200" />
          <div className="hidden md:block absolute top-11 right-[35%] w-[30%] h-0.5 bg-blue-600" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isTalkStep = step.title === "تواصل واتفق"

              return (
                <article key={step.title} className="group relative flex flex-col items-center text-center">
                  <div
                    className="relative z-10 w-20 h-20 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center mb-5 cursor-pointer overflow-hidden transition-all duration-500 hover:border-blue-600 hover:shadow-[0_18px_35px_-15px_rgba(37,99,235,0.6)]"
                  >
                    <span className="absolute inset-0 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out origin-center" />
                    <Icon size={30} className="relative z-10 transition-colors duration-500 group-hover:text-white active:scale-95" />
                  </div>

                  <div className="text-[11px] font-black text-slate-400 mb-2 transition-colors duration-300 group-hover:text-blue-700">
                    الخطوة <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 bg-slate-100 text-slate-500 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">{i + 1}</span>
                  </div>

                  <h3 className={`text-3xl font-black mb-2 transition-colors duration-300 ${isTalkStep ? "text-slate-900 group-hover:text-blue-700" : "text-slate-900"}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-slate-500 font-bold max-w-[240px]">{step.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks