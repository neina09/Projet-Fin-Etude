import React from "react"
import { UserPlus, Search, MessageCircle, Star, ArrowLeft } from "lucide-react"

const steps = [
  { icon: UserPlus, title: "إنشاء حساب", description: "قم بالتسجيل في ثوانٍ معدودة وابدأ رحلتك معنا كمستخدم أو كمحترف." },
  { icon: Search, title: "ابحث عن خبير", description: "تصفح قائمة المحترفين الموثوقين حسب الخدمة، التقييم، ونطاقك الجغرافي." },
  { icon: MessageCircle, title: "تواصل واتفق", description: "ناقش تفاصيل المهمة، حدد السعر والموعد المناسب بكل سهولة ويسر." },
  { icon: Star, title: "قيّم التجربة", description: "بعد الانتهاء من العمل، شاركنا تقييمك لضمان استمرار الجودة والشفافية." },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-surface-50 border-y border-surface-100" dir="rtl">
      <div className="section-shell">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4 font-black">Process Flow</p>
          <h2 className="text-3xl md:text-5xl font-black text-surface-900 tracking-tight leading-tight">بساطة الاستخدام هي سر نجاحنا</h2>
          <p className="text-surface-500 mt-6 text-lg font-medium leading-relaxed">
            أربع خطوات بسيطة تفصلك عن إنجاز مهامك المنزلية بأعلى جودة واحترافية ممكنة.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-surface-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <article key={step.title} className="group relative flex flex-col items-center text-center z-10">
                  {/* Icon Wrapper */}
                  <div className="w-16 h-16 rounded-2xl bg-white border border-surface-200 shadow-sm flex items-center justify-center mb-8 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:-translate-y-2">
                    <Icon size={28} className="text-primary group-hover:text-white transition-colors" />
                    {/* Step Number Badge */}
                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-surface-900 text-white text-xs font-black flex items-center justify-center border-4 border-surface-50">
                      {i + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-surface-900 mb-4 transition-colors group-hover:text-primary">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-surface-500 font-medium max-w-[220px]">
                    {step.description}
                  </p>
                  
                  {/* Decorative Arrow (Desktop Only) */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -left-4 text-surface-200">
                       <ArrowLeft size={20} />
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
        
        {/* CTA Bottom */}
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