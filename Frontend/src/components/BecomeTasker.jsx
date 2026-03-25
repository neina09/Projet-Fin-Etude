import React from "react"
import { useNavigate } from "react-router-dom"

function BecomeTasker() {
  const navigate = useNavigate()

  return (
    <section dir="rtl" className="py-24 px-6 relative bg-gradient-to-br from-[#004384] via-[#003366] to-[#001f3f] text-white">
      {/* Glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FFB909]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
      </div>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Right — text */}
        <div>
          <h2
            className="text-4xl font-extrabold leading-tight mb-4"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            كن عاملاً وابدأ الكسب 💼
          </h2>
          <p
            className="text-gray-200 mb-6 max-w-md"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            انضم إلى منصتنا وتواصل مع الأشخاص الذين يحتاجون إلى مهاراتك.
            اعمل وفق جدولك الخاص وزد دخلك بسهولة.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {["ساعات عمل مرنة", "ابحث عن وظائف بسهولة", "ابنِ سمعتك ⭐"].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[#FFB909]">✔</span>
                <span style={{ fontFamily: "'Cairo', sans-serif" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* ✅ يوجه إلى صفحة BecomeWorker */}
          <button
            onClick={() => navigate("/become-worker")}
            className="bg-[#FFB909] text-[#004384] font-semibold px-6 py-3 rounded-xl
              hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl
              hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            كن عاملاً الآن
          </button>
        </div>

        {/* Left — image */}
        <div className="relative group">
          <img
            src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80"
            alt="عامل"
            className="rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-500"
          />
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#FFB909]/30 blur-3xl rounded-full"></div>
        </div>
      </div>
    </section>
  )
}

export default BecomeTasker