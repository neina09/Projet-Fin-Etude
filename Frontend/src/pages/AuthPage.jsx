import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Globe, HelpCircle, Users } from "lucide-react"
import AuthForm from "../components/AuthForm"
import mascotImg from "../assets/auth/mascot.png"
import brandingImg from "../assets/auth/branding.png"

function MiniAvatar({ label, bgClass }) {
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-black text-white ${bgClass}`}>
      {label}
    </div>
  )
}

function AuthPage({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [viewState, setViewState] = useState("login")

  const isSplitLayout = viewState === "login" || viewState === "signup"

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-white font-almarai transition-colors duration-700" dir="rtl">
      <div className={`flex min-h-screen w-full ${!isSplitLayout ? "items-center justify-center p-4 lg:p-12" : ""}`}>
        <div
          className={`z-10 flex flex-col items-center justify-center bg-white shadow-xl transition-all duration-500 lg:bg-transparent lg:shadow-none ${
            isSplitLayout ? "w-full lg:w-1/2" : "w-full max-w-xl"
          }`}
        >
          <div className="flex w-full items-center justify-between px-4 pb-6 pt-8 sm:px-8 lg:px-16 lg:pt-12">
            <div className="flex gap-2 sm:gap-3">
              <button type="button" className="auth-header-icon transition-all hover:bg-slate-50">
                <HelpCircle size={20} />
              </button>
              <button type="button" className="auth-header-icon transition-all hover:bg-slate-50">
                <Globe size={20} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-base font-black text-blue-600 transition-colors duration-500 sm:text-xl"
            >
              منصة العمال
            </button>
          </div>

          <div className={`w-full ${!isSplitLayout ? "px-4 py-8 sm:px-6" : "px-4 pb-14 sm:px-8 sm:pb-20 lg:px-20"}`}>
            <AuthForm onLoginSuccess={onLoginSuccess} onViewChange={setViewState} />
          </div>
        </div>

        {isSplitLayout && (
          <div className={`relative hidden min-h-screen w-1/2 flex-col items-center justify-center overflow-hidden transition-all duration-700 lg:flex ${viewState === "signup" ? "auth-sidebar-dark" : "bg-[#F8FAFF]"}`}>
            {viewState === "login" && (
              <>
                <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-50/50 blur-3xl" />
              </>
            )}

            <div className="relative z-10 w-full max-w-lg px-12 py-12 text-center">
              {viewState === "login" ? (
                <>
                  <div className="mb-8 transform transition-transform duration-1000 hover:scale-105">
                    <img
                      src={mascotImg}
                      alt="الشخصية البصرية للمنصة"
                      className="mx-auto w-full max-w-sm drop-shadow-2xl"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                  <h2 className="mb-6 text-3xl font-black leading-tight text-slate-800 lg:text-4xl">
                    ارتقِ بمهنتك إلى <span className="text-blue-600">آفاق جديدة</span>
                  </h2>
                  <p className="mb-12 text-base font-medium leading-relaxed text-slate-500 lg:text-lg">
                    نربط بين المهنيين وأصحاب المشاريع في بيئة رقمية أكثر احترافية، مع وضوح
                    في المتابعة وتنظيم أفضل للحجوزات والطلبات.
                  </p>

                  <div className="flex justify-center">
                    <div className="avatar-group animate-in slide-in-from-bottom-4 px-6 py-3 duration-700">
                      <div className="avatar-stack scale-90">
                        <MiniAvatar label="م" bgClass="bg-blue-600" />
                        <MiniAvatar label="ع" bgClass="bg-sky-500" />
                        <MiniAvatar label="ح" bgClass="bg-indigo-500" />
                      </div>
                      <span className="whitespace-nowrap text-xs font-bold text-blue-600">
                        مجتمع مهني يثق بالمنصة يوميًا
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-right">
                  <div className="glow-safe-work mb-10 transform transition-transform duration-1000">
                    <img
                      src={brandingImg}
                      alt="هوية المنصة"
                      className="mx-auto w-full max-w-sm drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="px-4">
                    <h2 className="mb-6 text-3xl font-black leading-[1.3] text-white lg:text-4xl">
                      منصة العمال
                      <br />
                      <span className="text-blue-400">حيث يلتقي المبدعون</span>
                      <br />
                      بفرص العمل الحقيقية.
                    </h2>
                    <p className="mb-10 text-base font-medium leading-relaxed text-blue-100/60 lg:text-lg">
                      لسنا مجرد وسيط، بل منصة تسهّل الوصول للخدمة المناسبة وتبني ثقة أعلى بين
                      العملاء والمهنيين.
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                        <div className="mb-1 flex items-center gap-2 font-black text-blue-400">
                          <Users size={18} />
                          <span className="text-lg">50k+</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">عامل نشط</p>
                      </div>
                      <div className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                        <div className="mb-1 flex items-center gap-2 font-black text-yellow-400">
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400/20">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
                          </div>
                          <span className="text-lg">100%</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">توثيق رسمي</p>
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
