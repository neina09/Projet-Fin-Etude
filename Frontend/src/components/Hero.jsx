import React from "react"
import { Search, Play, Star, ChevronRight, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Hero() {
  const navigate = useNavigate()

  return (
    <section dir="rtl" className="relative pt-20 pb-24 overflow-hidden bg-white">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      <div className="section-shell relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-soft border border-primary/10 text-[11px] font-black text-primary mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="uppercase tracking-[0.1em]">أكثر من 10,000 مستخدم يثقون في شغلني</span>
        </div>

        {/* Main Heading */}
        <div className="max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-surface-900 leading-[1.1] tracking-tight animate-fade-in [animation-delay:200ms]">
          اكتشف الا عمال محليني <br />
            <span className="gradient-text">كل زاوية من منزلك</span>
          </h1>
          
          <p className="text-lg md:text-xl text-surface-500 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in [animation-delay:400ms]">
            المنصة الأكبر في موريتانيا لربط العمال المهرة بأصحاب المشاريع. نضمن لك الجودة، الأمان والسرعة في كل مهمة.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:600ms]">
          <button 
            onClick={() => navigate("/auth")}
            className="btn-saas btn-primary h-14 px-8 text-base shadow-lg shadow-primary/20 w-full sm:w-auto active:scale-95"
          >
            ابدأ الآن مجاناً
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <button className="btn-saas btn-secondary h-14 px-8 text-base w-full sm:w-auto">
            <Play size={18} className="fill-surface-700" />
            شاهد كيف يعمل
          </button>
        </div>

        {/* Social Proof */}
        <div className="mt-16 flex items-center justify-center gap-6 animate-fade-in [animation-delay:800ms]">
          <div className="flex -space-x-4 space-x-reverse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden ring-1 ring-surface-200">
                <img src={`https://randomuser.me/api/portraits/thumb/men/${i+20}.jpg`} alt="User" />
              </div>
            ))}
            <div className="h-10 w-10 rounded-full border-2 border-white bg-primary text-white text-[10px] font-bold flex items-center justify-center ring-1 ring-surface-200">
              +5k
            </div>
          </div>
          <div className="h-10 w-px bg-surface-200" />
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} className="fill-current" />)}
              <span className="text-surface-900 font-black text-sm mr-1">4.9/5</span>
            </div>
            <span className="text-surface-500 text-xs font-bold">بناءً على 2000+ تقييم</span>
          </div>
        </div>

        {/* Features Row */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-surface-100 pt-16 animate-fade-in [animation-delay:1000ms]">
           <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-base font-bold text-surface-900">عمال موثوقون</h3>
              <p className="text-sm text-surface-500 font-medium">فحص دقيق لكافة الملفات الشخصية</p>
           </div>
           <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary">
                <Search size={24} />
              </div>
              <h3 className="text-base font-bold text-surface-900">بحث ذكي</h3>
              <p className="text-sm text-surface-500 font-medium">جد العامل المناسب في ثوانٍ معدودة</p>
           </div>
           <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary">
                <Star size={24} />
              </div>
              <h3 className="text-base font-bold text-surface-900">جودة مضمونة</h3>
              <p className="text-sm text-surface-500 font-medium">ضمان الرضا الكامل عن كل مهمة</p>
           </div>
        </div>
      </div>
    </section>
  )
}

export default Hero