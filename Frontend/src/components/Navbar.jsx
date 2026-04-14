import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import logo from "../assets/logo.png"

function Navbar({ onLogin }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = [
    { href: "#services", label: "الخدمات" },
    { href: "#how-it-works", label: "كيف يعمل" },
    { href: "#join", label: "انضم كعامل" },
    { href: "#support", label: "الدعم" }
  ]

  return (
    <header dir="rtl" className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-md">
      <div className="section-shell flex items-center justify-between py-3">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 bg-surface-50 transition-all group-hover:border-primary/30 group-hover:bg-primary-soft">
            <img src={logo} alt="Shghlni" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-surface-900 leading-none">شغلني</p>
            <p className="text-[11px] font-bold tracking-[0.12em] text-primary/70">منصة خدمات موثوقة</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-surface-700">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-lg px-4 py-2 transition-all hover:bg-surface-100 hover:text-surface-900">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 text-surface-600 lg:hidden"
            aria-label="فتح القائمة"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <button onClick={onLogin} className="hidden text-sm font-semibold text-surface-700 transition-colors hover:text-surface-900 sm:inline-flex">
            تسجيل الدخول
          </button>
          <button onClick={onLogin} className="btn-saas btn-primary shadow-sm active:scale-95">
            أنشئ حساباً
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="section-shell border-t border-surface-200 py-3 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-surface-700 hover:bg-surface-50"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
