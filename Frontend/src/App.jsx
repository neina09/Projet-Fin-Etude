import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import AuthForm from "./components/AuthForm"
import Dashboard from "./components/Dashboard"
import logo from "./assets/logo.png"
import bg from "./assets/worker-bg.jpg"
import { Users, Wrench, Star } from "lucide-react"

function App() {
  const isLoggedIn = !!localStorage.getItem("token")
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
    </Routes>
  )
}

function AuthPage() {
  const navigate = useNavigate()

  return (
    <div className="flex w-full h-screen">

      {/* Left — Auth Form */}
      <div className="w-full flex items-center justify-center lg:w-1/2 bg-gray-100">
        <AuthForm onLoginSuccess={() => navigate("/dashboard")} />
      </div>

      {/* Right — Brand Panel */}
      <div
        className="hidden lg:flex w-1/2 h-full relative items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Content */}
        <div className="relative z-6 flex flex-col items-center gap-3 px-10 text-center">

          {/* Logo */}
          <img src={logo} alt="chghloni" className="w-16 h-16 object-contain" />

          {/* Name */}
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-2xl font-black text-white leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              chghloni
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-[#FFB909]" />
              <span className="text-sm font-bold uppercase tracking-[4px] text-white/50">
                Recrutement
              </span>
              <div className="w-2 h-2 rounded-full bg-[#FFB909]" />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-snug">
              Connect with skilled
            </h2>
            <h2 className="text-3xl font-extrabold leading-snug">
              <span className="text-[#FFB909]">workers</span>
              <span className="text-white"> near you</span>
            </h2>
            <p className="text-base text-white/45 mt-3 leading-relaxed max-w-sm">
              Connect with skilled local workers — simple, fast, and reliable.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {[
              { icon: Users,  value: "12K+", label: "Active Workers" },
              { icon: Wrench, value: "850+", label: "Jobs Posted"    },
              { icon: Star,   value: "4.8",  label: "Avg Rating"     },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 border border-white/20 rounded-xl p-4">
                <Icon size={20} className="text-[#FFB909] mb-3" />
                <p className="text-white text-2xl font-bold">{value}</p>
                <p className="text-white/40 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Blur bottom */}
        <div className="w-full h-1/2 bg-white/10 absolute bottom-0 backdrop-blur-lg" />
      </div>
    </div>
  )
}

export default App