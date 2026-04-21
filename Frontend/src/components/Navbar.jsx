import React, { useState, useEffect } from "react"
import { Menu, X, Sparkles } from "lucide-react"
import logo from "../assets/logo.png"

function Navbar({ onLogin }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "الرئيسية" },
    { href: "#workers", label: "الخبراء" },
    { href: "#services", label: "الخدمات" },
    { href: "#how-it-works", label: "كيف يعمل" }
  ]

  return (
    <header 
      dir="rtl" 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Right side: Logo + Navigation Links */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-100 p-1.5 shadow-lg">
              <img src={logo} alt="L" className="h-full w-full object-contain" />
            </div>
            <p className="text-2xl font-black tracking-tight text-slate-900">منصة عاملك</p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className="text-sm font-bold text-slate-600 transition-colors hover:text-brand-blue"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Left side: Action Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin} 
            className="hidden text-sm font-bold text-slate-600 transition-colors hover:text-brand-blue lg:block px-4 py-2"
          >
            تسجيل الدخول
          </button>
          
          <button 
            onClick={onLogin} 
            className="rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-brand-blue-hover active:scale-95 whitespace-nowrap"
          >
            ابدأ الآن
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`overflow-hidden transition-all duration-500 lg:hidden ${
        mobileOpen ? "max-h-96 bg-white border-t border-slate-100 mt-4 pb-6" : "max-h-0 opacity-0"
      }`}>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-5 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-all"
            >
              {item.label}
            </a>
          ))}
          <button 
            onClick={() => { onLogin(); setMobileOpen(false); }}
            className="mt-2 w-full rounded-xl border border-slate-200 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            تسجيل الدخول
          </button>
        </nav>
      </div>
    </header>
  )
}


export default Navbar
