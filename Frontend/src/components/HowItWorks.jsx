import React, { useState } from "react"
import { Search, Users, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "ابحث عن الخدمة",
    description: "تصفح الفئات والخدمات المتاحة وحدد ما يناسب احتياجك الحالي بسرعة ووضوح."
  },
  {
    icon: Users,
    title: "اختر المحترف المناسب",
    description: "قارن بين العمال من حيث التقييم والتوفر ونوع التخصص ثم اختر الأنسب لمهمتك."
  },
  {
    icon: CheckCircle,
    title: "أنجز المهمة بسهولة",
    description: "تابع التنفيذ وتواصل مع المحترف مباشرة حتى إتمام العمل بجودة واطمئنان."
  }
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-black text-slate-950 md:text-5xl">كيف تعمل المنصة؟</h2>
          <p className="mt-6 text-base font-medium leading-relaxed text-slate-500 sm:text-lg">
            خطوات بسيطة تفصلك عن الحصول على أفضل الخدمات الميدانية في وقت قياسي وبكل احترافية.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon
            return <StepCard key={step.title} step={step} index={i} Icon={Icon} />
          })}
        </div>
      </div>
    </section>
  )
}

function StepCard({ step, index, Icon }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="group flex flex-col items-center text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border shadow-sm transition-all duration-300 sm:mb-8 sm:h-24 sm:w-24"
        style={{
          background: hovered ? "#1d4ed8" : "#f8fafc",
          borderColor: hovered ? "#1d4ed8" : "#f1f5f9",
          transform: hovered ? "translateY(-8px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 20px 25px -5px rgba(29,78,216,0.2)"
            : "0 1px 2px 0 rgba(0,0,0,0.05)"
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Icon size={34} color={hovered ? "#ffffff" : "#1d4ed8"} />
      </div>
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-primary">
        {index + 1}
      </div>
      <h3 className="mb-4 text-2xl font-black text-slate-950">{step.title}</h3>
      <p className="max-w-[280px] text-base font-medium leading-relaxed text-slate-500">
        {step.description}
      </p>
    </div>
  )
}

export default HowItWorks
