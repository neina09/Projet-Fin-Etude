import React from "react"
import { Search, Play, Star, ChevronRight, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Hero() {
  const navigate = useNavigate()

  return (
    <section dir="rtl" className="relative overflow-hidden bg-white pb-24 pt-20">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <div className="absolute -right-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-primary/5 blur-3xl opacity-60" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-100/40 blur-3xl" />
      </div>

      <div className="section-shell relative z-10 flex flex-col items-center text-center">
        <div className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-primary/10 bg-primary-soft px-3 py-1.5 text-[11px] font-black text-primary">
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="tracking-[0.08em]">تجربة واضحة للحجز، المهام، والمحادثات</span>
        </div>

        <div className="max-w-4xl space-y-6">
          <h1 className="animate-fade-in text-3xl font-black leading-[1.1] tracking-tight text-surface-900 [animation-delay:200ms] md:text-4xl lg:text-5xl">
            اعثر على العامل المناسب
            <br />
            <span className="gradient-text">وأدر كل الطلبات من مكان واحد</span>
          </h1>

          <p className="mx-auto max-w-2xl animate-fade-in text-lg font-medium leading-relaxed text-surface-500 [animation-delay:400ms] md:text-xl">
            منصة تجمع بين العملاء والعمال في تجربة واحدة: نشر مهمة، استقبال عروض، حجز مباشر،
            ومحادثة مستمرة بدون الخروج من لوحة التحكم.
          </p>
        </div>

        <div className="mt-12 flex animate-fade-in flex-col items-center justify-center gap-4 [animation-delay:600ms] sm:flex-row">
          <button
            onClick={() => navigate("/auth")}
            className="btn-saas btn-primary h-14 w-full px-8 text-base shadow-lg shadow-primary/20 active:scale-95 sm:w-auto"
          >
            ابدأ الآن
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <button className="btn-saas btn-secondary h-14 w-full px-8 text-base sm:w-auto">
            <Play size={18} className="fill-surface-700" />
            تعرّف على طريقة العمل
          </button>
        </div>

        <div className="mt-16 flex animate-fade-in items-center justify-center gap-6 [animation-delay:800ms]">
          <div className="flex -space-x-4 space-x-reverse">
            {["أ", "ف", "م", "س"].map((initial) => (
              <div key={initial} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-sm font-black text-surface-700 ring-1 ring-surface-200">
                {initial}
              </div>
            ))}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary text-[10px] font-bold text-white ring-1 ring-surface-200">
              24/7
            </div>
          </div>
          <div className="h-10 w-px bg-surface-200" />
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="fill-current" />
              ))}
              <span className="mr-1 text-sm font-black text-surface-900">تجربة موحدة</span>
            </div>
            <span className="text-xs font-bold text-surface-500">تنقل واضح بين المهام والرسائل والملف الشخصي</span>
          </div>
        </div>

        <div className="mt-24 grid w-full animate-fade-in grid-cols-1 gap-8 border-t border-surface-100 pt-16 [animation-delay:1000ms] md:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-base font-bold text-surface-900">ملفات مهنية واضحة</h3>
            <p className="text-sm font-medium text-surface-500">عرض التقييم، التخصص، والحالة الحالية قبل بدء الحجز أو قبول العرض</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Search size={24} />
            </div>
            <h3 className="text-base font-bold text-surface-900">وصول سريع</h3>
            <p className="text-sm font-medium text-surface-500">ابحث حسب التخصص أو الحي، ثم أكمل الإجراء من نفس الواجهة بدون خطوات مشتتة</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Star size={24} />
            </div>
            <h3 className="text-base font-bold text-surface-900">إدارة كاملة</h3>
            <p className="text-sm font-medium text-surface-500">تابع التنفيذ والرسائل والإشعارات من لوحة تحكم واحدة بدل التنقل بين صفحات منفصلة</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
