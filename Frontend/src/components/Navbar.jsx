import React, { useState, useEffect } from "react"
import { Menu, X, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-200 py-3" : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
          <p className="text-xl font-bold tracking-tight text-slate-900">عاملك</p>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin} 
            className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 transition-colors"
          >
            <User size={18} />
            دخول
          </button>
          
          <button 
            onClick={onLogin} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95"
          >
            ابدأ الآن
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-500 lg:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-slate-600 hover:text-blue-600"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                 <button onClick={() => { onLogin(); setMobileOpen(false); }} className="w-full text-right p-3 rounded-lg bg-slate-50 text-sm font-bold">تسجيل الدخول</button>
                 <button onClick={() => { onLogin(); setMobileOpen(false); }} className="w-full bg-blue-600 text-white p-4 rounded-lg text-sm font-bold">ابدأ الآن</button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
