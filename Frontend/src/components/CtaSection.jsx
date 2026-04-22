import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function CtaSection() {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-white" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[4rem] bg-primary p-12 lg:p-24 shadow-2xl shadow-primary/30 text-center">
          {/* Decorative Elements */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-white md:text-5xl lg:text-7xl leading-[1.1] tracking-tight">
              ابدأ الآن واحصل على <span className="text-secondary">أفضل العمال</span> في مدينتك
            </h2>
            <p className="mt-8 text-lg font-bold text-blue-100/80 leading-relaxed max-w-2xl mx-auto italic">
              انضم إلى آلاف المستخدمين الذين يثقون في منصتنا للحصول على خدمات منزلية وميدانية سريعة ومضمونة.
            </p>
            
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto h-16 rounded-[1.25rem] bg-white px-12 text-[11px] font-black text-primary shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
              >
                ابدأ كمستخدم الآن
              </button>
              <button 
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto h-16 rounded-[1.25rem] bg-white/10 border border-white/20 px-12 text-[11px] font-black text-white backdrop-blur-xl transition-all hover:bg-white/20 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                سجل كفني مختص
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
