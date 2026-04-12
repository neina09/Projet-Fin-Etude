import React from "react"
import logo from "../assets/logo.png"

function Navbar({ onLogin }) {
  return (
    <header dir="rtl" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200">
      <div className="section-shell flex items-center justify-between py-3">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="h-10 w-10 rounded-xl bg-surface-50 border border-surface-200 flex items-center justify-center transition-all group-hover:border-primary/30 group-hover:bg-primary-soft">
            <img src={logo} alt="Shghlni" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-surface-900 leading-none">شغلني</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary/70">Professional</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-surface-700">
          <a href="#services" className="px-4 py-2 rounded-lg hover:bg-surface-100 hover:text-surface-900 transition-all">الخدمات</a>
          <a href="#how-it-works" className="px-4 py-2 rounded-lg hover:bg-surface-100 hover:text-surface-900 transition-all">كيف يعمل</a>
          <a href="#join" className="px-4 py-2 rounded-lg hover:bg-surface-100 hover:text-surface-900 transition-all">انضم كعامل</a>
          <a href="#support" className="px-4 py-2 rounded-lg hover:bg-surface-100 hover:text-surface-900 transition-all">المساعدة</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogin} 
            className="hidden sm:inline-flex text-sm font-semibold text-surface-700 hover:text-surface-900 transition-colors"
          >
            تسجيل الدخول
          </button>
          <button 
            onClick={onLogin} 
            className="btn-saas btn-primary shadow-sm active:scale-95"
          >
            أنشئ حساباً
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar