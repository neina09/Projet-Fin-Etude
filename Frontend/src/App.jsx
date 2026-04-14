import React, { useCallback, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import AuthForm from "./components/AuthForm"
import Dashboard from "./components/Dashboard"
import BecomeWorker from "./components/BecomeWorker"
import authBg from "./assets/worker-bg.jpg"
import "leaflet/dist/leaflet.css"

function App() {
  const [authStatus, setAuthStatus] = useState(Boolean(localStorage.getItem("token")))
  const navigate = useNavigate()

  const handleLogin = useCallback((token) => {
    localStorage.setItem("token", token)
    setAuthStatus(true)
    navigate("/dashboard")
  }, [navigate])

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    setAuthStatus(false)
    navigate("/")
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage onLoginSuccess={handleLogin} />} />
      <Route
        path="/dashboard/*"
        element={authStatus ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
      />
      <Route path="/become-worker" element={<BecomeWorker />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function AuthPage({ onLoginSuccess }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden" dir="rtl">
      <img src={authBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-slate-950/55" />
      <div className="absolute inset-0 bg-linear-to-l from-blue-900/45 via-slate-900/40 to-slate-900/45" />

      <div className="relative z-10 flex w-full items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl border border-white/35 bg-white/90 p-2 backdrop-blur-md shadow-[0_25px_60px_-25px_rgba(15,23,42,0.7)]">
          <AuthForm onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </div>
  )
}

export default App
