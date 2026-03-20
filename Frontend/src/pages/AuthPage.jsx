import { useNavigate } from "react-router-dom"
import { HardHat, Wrench, Users, Star } from "lucide-react"
import AuthForm from "../components/AuthForm"

function AuthPage() {
  const navigate = useNavigate()
  return (
    <div className="flex w-full h-screen bg-white">

      {/* Left — Auth Form */}
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <AuthForm onLoginSuccess={() => navigate("/dashboard")} />
      </div>

      {/* Right — Brand Panel */}
      <div className="hidden lg:flex w-1/2 h-full flex-col justify-between bg-[#FFFBEB] border-l border-[#FDE68A] p-14">

        {/* Top brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center shadow">
            <HardHat size={22} className="text-white" />
          </div>
          <span className="text-gray-900 text-xl font-bold">Ommal</span>
        </div>

        {/* Center tagline */}
        <div>
          <div className="w-12 h-1 bg-[#F59E0B] rounded-full mb-8" />
          <h1 className="text-gray-900 text-4xl font-bold leading-tight mb-4">
            Connect with skilled<br />
            <span className="text-[#F59E0B]">workers</span> near you
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Ommal brings together employers and workers across all trades. Post jobs, build your profile, and get hired.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, value: "12K+", label: "Active Workers" },
            { icon: Wrench, value: "850+", label: "Jobs Posted" },
            { icon: Star, value: "4.8", label: "Avg Rating" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white border border-[#FDE68A] rounded-xl p-4 shadow-sm">
              <Icon size={16} className="text-[#F59E0B] mb-3" />
              <p className="text-gray-900 text-xl font-bold">{value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AuthPage