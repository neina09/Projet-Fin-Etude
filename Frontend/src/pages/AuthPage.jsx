import { useNavigate } from "react-router-dom"
import AuthForm from "../components/AuthForm"

function AuthPage() {
  const navigate = useNavigate()

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <AuthForm onLoginSuccess={() => navigate("/dashboard")} />
      </div>
      <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center bg-gray-200">
        <img src="/src/assets/logo.png" alt="" className="absolute w-48 h-48 object-contain opacity-20" />
        <div className="w-60 h-60 bg-gradient-to-tr from-[#004384] to-[#FFB909] rounded-full animate-bounce relative z-10" />
        <div className="w-full h-1/2 bg-white/10 absolute bottom-0 backdrop-blur-lg" />
      </div>
    </div>
  )
}

export default AuthPage