import React from "react"
import { Facebook, Twitter, Instagram, Linkedin, Sparkles } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white shadow-lg">
                <Sparkles size={22} className="fill-current" />
              </div>
              <p className="text-2xl font-black tracking-tight text-slate-900">منصة العمل</p>
            </div>
            <p className="max-w-[240px] text-sm font-medium leading-relaxed text-slate-500">
              المنصة الموريتانية الأولى لتوظيف المحترفين الميدانيين بكل ثقة وأمان.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all hover:bg-brand-blue hover:text-white">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start gap-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">الروابط</h4>
            <nav className="flex flex-col gap-4">
              {["الرئيسية", "عن المنصة", "الخدمات", "العمال"].map((link) => (
                <a key={link} href="#" className="text-sm font-bold text-slate-500 transition-colors hover:text-brand-blue">{link}</a>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col items-start gap-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">الدعم</h4>
            <nav className="flex flex-col gap-4">
              {["الأسئلة الشائعة", "سياسة الخصوصية", "اتصل بنا", "الشروط والأحكام"].map((link) => (
                <a key={link} href="#" className="text-sm font-bold text-slate-500 transition-colors hover:text-brand-blue">{link}</a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start gap-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">تواصل معنا</h4>
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold text-slate-500">نواكشوط، موريتانيا</p>
              <p className="text-sm font-bold text-slate-500">support@mansa.mr</p>
              <p className="text-sm font-bold text-slate-500">+222 44 44 44 44</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium text-slate-400 text-center">
            © 2026 منصة العمل. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Visa_Logo.png" alt="Visa" className="h-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.png" alt="MasterCard" className="h-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
