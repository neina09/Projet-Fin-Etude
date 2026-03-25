import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'

function Navbar({ onLogin }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
  }, [])

  return (
    <div dir="rtl" className="flex items-center justify-between px-16 py-5 bg-[#FCFDFE] sticky top-0 z-50 shadow-sm border-b border-[#004384]/20">

      {/* Logo */}
      <div className={`flex items-center gap-4 transition-all duration-700 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
        <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center">
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 object-contain hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-3xl font-black leading-none tracking-tight" style={{ fontFamily: 'Georgia, serif', color: '#004384' }}>
            شغلني
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#FFB909' }} />
            <span className="text-xs font-bold uppercase opacity-50" style={{ color: '#004384', letterSpacing: '4px', fontFamily: "'Cairo', sans-serif" }}>
              توظيف
            </span>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#FFB909' }} />
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <ul className={`flex items-center gap-10 list-none m-0 p-0 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        {[
          { label: 'الخدمات',    href: '#' },
          { label: 'كيف يعمل',  href: '#' },
          { label: 'كن عاملاً', href: '#' },
          { label: 'المساعدة',  href: '#' },
        ].map((item) => (
          <li key={item.label}>
            <a href={item.href} className="text-sm font-medium no-underline text-[#004384] hover:text-[#FFB909] transition-colors duration-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Auth Buttons */}
      <div className={`flex items-center gap-3 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        <button
          onClick={onLogin}
          className="text-sm font-semibold text-[#004384] border border-[#004384] px-5 py-2 rounded-full cursor-pointer hover:bg-[#004384] hover:text-[#FCFDFE] transition-all duration-200"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          تسجيل الدخول
        </button>
        <button
          onClick={onLogin}
          className="text-sm font-semibold px-5 py-2 rounded-full border-none cursor-pointer bg-[#FFB909] text-[#004384] hover:bg-[#004384] hover:text-[#FCFDFE] transition-all duration-200"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          إنشاء حساب
        </button>
      </div>

    </div>
  )
}

export default Navbar