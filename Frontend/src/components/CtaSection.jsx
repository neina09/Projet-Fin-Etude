import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function CtaSection() {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[3rem] bg-brand-blue p-12 lg:p-20 shadow-2xl shadow-blue-500/20 text-center">
          {/* Decorative Circles */}
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-white md:text-5xl lg:text-6xl leading-tight">
              ابدأ الآن واحصل على أفضل العمال في مدينتك
            </h2>
            <p className="mt-8 text-lg font-medium text-blue-100 leading-relaxed">
              انضم إلى آلاف المستخدمين الذين يثقون في منصتنا للحصول على خدمات منزلية وميدانية سريعة ومضمونة.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto rounded-2xl bg-white px-10 py-5 text-lg font-black text-brand-blue shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                ابدأ كمستخدم
              </button>
              <button 
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto rounded-2xl bg-white/10 border border-white/20 px-10 py-5 text-lg font-black text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 flex items-center justify-center gap-3"
              >
                سجل كفني
                <ArrowLeft size={22} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
