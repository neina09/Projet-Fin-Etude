import { useNavigate } from "react-router-dom"
import AuthForm from "../components/AuthForm"
import { useState } from "react"
import { HelpCircle, Globe, Users } from "lucide-react"

function AuthPage({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [viewState, setViewState] = useState("login") // login, signup, verify, forgot, reset

  const isSplitLayout = viewState === "login" || viewState === "signup"

  return (
    <div className="min-h-screen w-full bg-white font-almarai transition-colors duration-700 overflow-y-auto" dir="rtl">

      <div className={`flex w-full min-h-screen ${!isSplitLayout ? "items-center justify-center p-4 lg:p-12" : ""}`}>
        
        {/* Auth Form Container (Right Side in RTL) */}
        <div className={`flex flex-col items-center justify-center transition-all duration-500 shadow-xl lg:shadow-none bg-white lg:bg-transparent z-10 ${isSplitLayout ? "w-full lg:w-1/2" : "w-full max-w-xl"}`}>
          
          {/* Header elements inside the form container - Fixed spacing to prevent cutoff */}
          <div className="w-full flex items-center justify-between p-8 lg:px-16 pt-12 pb-6">
            <div className="flex gap-3">
              <button className="auth-header-icon hover:bg-slate-50 transition-all"><HelpCircle size={20} /></button>
              <button className="auth-header-icon hover:bg-slate-50 transition-all"><Globe size={20} /></button>
            </div>
            <div className={`text-xl font-black text-blue-600 transition-colors duration-500`}>منصة العمال</div>
          </div>

          {/* Form Content Area */}
          <div className={`w-full ${!isSplitLayout ? "px-6 py-8" : "px-8 lg:px-20 pb-20"}`}>
            <AuthForm 
              onLoginSuccess={onLoginSuccess} 
              onViewChange={(view) => setViewState(view)}
            />
          </div>
        </div>

        {/* Dynamic Sidebar (Only for Login/Signup) */}
        {isSplitLayout && (
          <div className={`hidden lg:flex w-1/2 min-h-screen flex-col items-center justify-center relative overflow-hidden transition-all duration-700 ${viewState === "signup" ? "auth-sidebar-dark" : "bg-[#F8FAFF]"}`}>
            
            {/* Background elements for Login mode */}
            {viewState === "login" && (
              <>
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-50/50 blur-3xl" />
              </>
            )}

            <div className="relative z-10 w-full max-w-lg px-12 text-center py-12">
              {viewState === "login" ? (
                <>
                  <div className="mb-8 transform transition-transform duration-1000 hover:scale-105">
                    <img 
                      src="/src/assets/auth/mascot.png" 
                      alt="Workers Mascot" 
                      className="w-full max-w-sm mx-auto drop-shadow-2xl"
                    />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mb-6 leading-tight">
                    ارتقِ بمهنتك إلى <span className="text-blue-600">آفاق جديدة</span>
                  </h2>
                  <p className="text-base lg:text-lg text-slate-500 leading-relaxed font-medium mb-12">
                    نحن نربط بين أمهر العمال وأصحاب المشاريع في بيئة رقمية احترافية تضمن الحقوق وتنمي الأعمال.
                  </p>
                  
                  {/* Trust Pill */}
                  <div className="flex justify-center">
                    <div className="avatar-group animate-in slide-in-from-bottom-4 duration-700 py-3 px-6">
                      <div className="avatar-stack scale-90">
                        <img src="https://ui-avatars.com/api/?name=User+1&background=random" alt="" />
                        <img src="https://ui-avatars.com/api/?name=User+2&background=random" alt="" />
                        <img src="https://ui-avatars.com/api/?name=User+3&background=random" alt="" />
                      </div>
                      <span className="text-xs font-bold text-blue-600 whitespace-nowrap">أكثر من 10,000 مستخدم يثق بنا</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-right">
                  <div className="mb-10 glow-safe-work transform transition-transform duration-1000">
                    <img 
                      src="/src/assets/auth/branding.png" 
                      alt="Safe Work Concept" 
                      className="w-full max-w-sm mx-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                    />
                  </div>
                  <div className="px-4">
                    <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-[1.3]">
                      منصة العمال<br />
                      <span className="text-blue-400">حيث يلتقي المبدعون</span><br />
                      بفرص العمل الحقيقية.
                    </h2>
                    <p className="text-base lg:text-lg text-blue-100/60 leading-relaxed font-medium mb-10">
                      نحن لسنا مجرد وسيط، نحن شركاؤك في بناء المستقبل. نظام ذكي يضمن حقوقك ويسهل وصولك لأفضل الخدمات.
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-blue-400 mb-1 font-black">
                          <Users size={18} />
                          <span className="text-lg">50k+</span>
                        </div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">عامل نشط</p>
                      </div>
                      <div className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-yellow-400 mb-1 font-black">
                          <div className="h-4 w-4 rounded-full bg-yellow-400/20 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                          </div>
                          <span className="text-lg">100%</span>
                        </div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">توثيق رسمي</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage
