import React from "react"
import logo from "../assets/logo.png"

function Navbar({ onLogin }) {
  return (
    <header dir="rtl" className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/45 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <img src={logo} alt="Shghlni" className="h-9 w-9 object-contain" />
          </div>
          <div>
            <p className="text-xl font-black text-white leading-none">شغلني</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">Professional</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2 text-sm font-bold text-white/90">
          <a href="#services" className="px-4 py-2 rounded-full hover:bg-white/10 transition-colors">الخدمات</a>
          <a href="#workers" className="px-4 py-2 rounded-full hover:bg-white/10 transition-colors">كيف يعمل</a>
          <a href="#marketplace" className="px-4 py-2 rounded-full hover:bg-white/10 transition-colors">انضم كعامل</a>
          <a href="#testimonials" className="px-4 py-2 rounded-full hover:bg-white/10 transition-colors">المساعدة</a>
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={onLogin} className="hidden sm:inline-flex px-4 py-2 text-sm font-bold text-white rounded-full hover:bg-white/10 transition-colors">
            تسجيل الدخول
          </button>
          <button onClick={onLogin} className="h-11 px-5 rounded-xl text-sm font-black bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-colors">
            أنشئ حسابا
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar