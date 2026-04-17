import { useNavigate } from "react-router-dom"
import { HardHat, Wrench, Users, Star } from "lucide-react"
import AuthForm from "../components/AuthForm"

function AuthPage() {
  const navigate = useNavigate()
  return (
    <div className="flex w-full h-screen bg-white" dir="rtl">

      {/* Right — Auth Form (يظهر على اليمين في RTL) */}
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <AuthForm onLoginSuccess={() => navigate("/dashboard")} />
      </div>

      {/* Left — Brand Panel (يظهر على اليسار في RTL) */}
      <div className="hidden lg:flex w-1/2 h-full flex-col justify-between bg-[#FFFBEB] border-r border-[#FDE68A] p-14">

        {/* Top brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center shadow">
            <HardHat size={22} className="text-white" />
          </div>
          <span className="text-gray-900 text-xl font-bold"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            عمّال
          </span>
        </div>

        {/* Center tagline */}
        <div>
          <div className="w-12 h-1 bg-[#F59E0B] rounded-full mb-8" />
          <h1 className="text-gray-900 text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            تواصل مع عمال مهرة<br />
            <span className="text-[#F59E0B]">بالقرب منك</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            عمّال يجمع أصحاب العمل والعمال في جميع المهن. انشر وظائف، ابنِ ملفك الشخصي، واحصل على عمل.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, value: "+12K", label: "عامل نشط" },
            { icon: Wrench, value: "+850", label: "وظيفة منشورة" },
            { icon: Star, value: "4.8", label: "متوسط التقييم" },
          ].map((item) => {
            const ItemIcon = item.icon

            return (
              <div key={item.label} className="bg-white border border-[#FDE68A] rounded-xl p-4 shadow-sm">
                <ItemIcon size={16} className="text-[#F59E0B] mb-3" />
                <p className="text-gray-900 text-xl font-bold"
                  style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {item.value}
                </p>
                <p className="text-gray-400 text-xs mt-0.5"
                  style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {item.label}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default AuthPage
