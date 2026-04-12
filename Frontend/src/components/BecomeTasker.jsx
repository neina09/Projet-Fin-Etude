import React from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import workerBg from "../assets/worker-bg.jpg"

function BecomeTasker() {
  const navigate = useNavigate()

  return (
    <section dir="rtl" className="py-24 bg-surface-50">
      <div className="section-shell overflow-hidden rounded-[2rem] bg-white border border-surface-200 shadow-xl shadow-surface-900/5">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Content Section */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
            <div className="max-w-md">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-soft text-primary text-[11px] font-black uppercase tracking-wider mb-6">
                فرصة عمل مميزة
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-surface-900 leading-[1.15] mb-6">
                حوّل مهاراتك إلى <span className="text-primary tracking-tight">مصدر دخل مستدام</span>
              </h2>

              <p className="text-surface-500 text-base md:text-lg font-medium mb-10 leading-relaxed">
                انضم إلى أكبر شبكة للمحترفين في موريتانيا وتواصل مع آلاف العملاء الذين يبحثون عن مهاراتك يومياً. اعمل بشروطك الخاصة وزد دخلك بسهولة.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "ساعات عمل مرنة بالكامل",
                  "طلبات عمل مستمرة",
                  "بناء هوية مهنية قوية",
                  "دعم فني على مدار الساعة"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <span className="text-sm font-bold text-surface-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate("/auth")}
                className="btn-saas btn-primary h-14 px-10 text-base shadow-lg shadow-primary/20 w-fit group active:scale-95"
              >
                انضم كعامل الآن
                <ArrowLeft size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative h-[350px] lg:h-auto order-1 lg:order-2">
            <img
              src={workerBg}
              alt="Professional Worker"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-white via-transparent to-transparent hidden lg:block" />
            <div className="absolute inset-0 bg-linear-to-b from-white via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default BecomeTasker