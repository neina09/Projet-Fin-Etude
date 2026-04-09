import React from "react"
import { useNavigate } from "react-router-dom"
import workerBg from "../assets/worker-bg.jpg"

function BecomeTasker() {
  const navigate = useNavigate()

  return (
    <section dir="rtl" className="py-12 md:py-14 bg-[#f8fafc]">
      <div className="section-shell overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(2,6,23,0.35)]">
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="h-[460px] sm:h-[480px] md:h-[550px]">
            <img
              src={workerBg}
              alt="عامل محترف"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="bg-[#003f88] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-3">
              كن عاملاً وابدأ الكسب
            </h2>

            <p className="text-white/80 text-sm sm:text-base font-semibold mb-5 max-w-xl leading-relaxed">
              انضم إلى منصتنا وتواصل مع الأشخاص الذين يحتاجون إلى مهاراتك.
              اعمل وفق جدولك الخاص وزد دخلك بسهولة وبشكل مرن.
            </p>

            {/* Features */}
            <div className="space-y-2.5 mb-6 text-sm sm:text-base font-bold">
              {[
                "ساعات عمل مرنة",
                "ابحث عن وظائف بسهولة",
                "ابنِ سمعتك ⭐"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="text-[#facc15] text-base">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={() => navigate("/become-worker")}
              className="w-fit h-11 px-6 rounded-2xl bg-[#facc15] text-[#0f2f5d] text-sm sm:text-base font-black hover:bg-yellow-300 transition-colors"
            >
              كن عاملاً الآن
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BecomeTasker