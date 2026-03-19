import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import AuthForm from "./components/AuthForm"
import Dashboard from "./components/Dashboard"

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
    <div className="w-full flex items-center justify-center lg:w-1/2">
      <AuthForm onLoginSuccess={() => navigate("/dashboard")} />
    </div>
    <div className="hidden   lg:flex w-1/2 h-full relative items-center justify-center bg-gray-200">
      <div className="w-60 h-60  bg-gradient-to-tr from-[#004384] to-[#FFB909] rounded-full animate-bounce relative z-10 flex items-center justify-center">
        <img src="/src/assets/logo.png" alt="" className="w-32 h-32 object-contain" />
      </div>
      <div className="w-full h-1/2 bg-white/10 absolute bottom-0 backdrop-blur-lg" />
    </div>
  </div>
  )
}

export default App