import React, { useEffect, useState } from "react"
import { Menu, User, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const logo = "/logo.png"

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
      className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-white/82 py-3 backdrop-blur-xl shadow-[0_12px_34px_-26px_rgba(15,23,42,0.45)]"
          : "bg-transparent py-4 sm:py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div
          className="flex cursor-pointer items-center"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={logo} alt="Aamilak" className="h-14 w-auto object-contain sm:h-20 lg:h-24" />
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onLogin}
            className="hidden items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 lg:flex"
          >
            <User size={18} />
            دخول
          </button>

          <button
            onClick={onLogin}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 sm:px-6 sm:text-sm"
          >
            ابدأ
          </button>

          <button
            onClick={() => setMobileOpen((current) => !current)}
            className="p-2 text-slate-500 lg:hidden"
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-100/70 bg-white/95 backdrop-blur-md lg:hidden"
          >
            <nav className="flex flex-col space-y-4 p-4 sm:p-6">
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
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
                <button
                  onClick={() => {
                    onLogin()
                    setMobileOpen(false)
                  }}
                  className="w-full rounded-lg bg-slate-50 p-3 text-right text-sm font-bold"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => {
                    onLogin()
                    setMobileOpen(false)
                  }}
                  className="w-full rounded-lg bg-blue-600 p-4 text-sm font-bold text-white"
                >
                  ابدأ الآن
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
