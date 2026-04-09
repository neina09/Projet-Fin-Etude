import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import AuthForm from "./components/AuthForm"
import Dashboard from "./components/Dashboard"
import BecomeWorker from "./components/BecomeWorker"
import authBg from "./assets/worker-bg.jpg"


function App() {
  const isLoggedIn = !!localStorage.getItem("token")
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/become-worker" element={<BecomeWorker />} />
    </Routes>
  )
}

function AuthPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex w-full min-h-screen overflow-hidden" dir="rtl">
      <img src={authBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-slate-950/55" />
      <div className="absolute inset-0 bg-linear-to-l from-blue-900/45 via-slate-900/40 to-slate-900/45" />

      {/* Right — Auth Form (يمين في RTL) */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl border border-white/35 bg-white/90 backdrop-blur-md p-2 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.7)]">
          <AuthForm onLoginSuccess={() => navigate("/dashboard")} />
        </div>
      </div>

    </div>
  )
}

export default App