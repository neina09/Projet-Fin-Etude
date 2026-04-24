import React from "react"
import { Facebook, Twitter, Instagram, Mail, Phone, Globe } from "lucide-react"

const logo = "/logo.png"

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-surface-100 bg-white lg:mt-40" dir="rtl">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-12 lg:pt-24">
        <div className="mb-14 grid grid-cols-1 gap-10 lg:mb-20 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-5 lg:space-y-8">
            <div className="flex items-center">
              <img src={logo} alt="عاملك" className="h-20 w-auto object-contain sm:h-24 lg:h-32" />
            </div>
            <p className="max-w-md text-base font-bold leading-relaxed text-slate-500 sm:text-lg">
              المنصة الموريتانية الرقمية الأولى التي تجمع بين الخبرة الميدانية والتكنولوجيا الحديثة
              لخدمة المجتمع الموريتاني بكل أمان واحترافية.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {[Facebook, Twitter, Instagram, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-100 bg-surface-50 text-slate-400 shadow-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary hover:text-white"
                >
                  <Icon size={20} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2 lg:space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest">المنصة</h3>
            <ul className="space-y-4">
              {["من نحن", "كيفية العمل", "سوق العمال", "الحماية والأمان"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-base font-bold text-slate-500 transition-colors hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 lg:col-span-2 lg:space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest">الدعم</h3>
            <ul className="space-y-4">
              {["الأسئلة الشائعة", "مركز المساعدة", "اتصل بنا", "الشروط والأحكام"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-base font-bold text-slate-500 transition-colors hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 lg:col-span-3 lg:space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest">تواصل معنا</h3>
            <div className="space-y-6">
              <div className="group flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">مكالمة هاتفية</p>
                  <p className="text-sm font-black text-slate-900">+222 22 22 22 22</p>
                </div>
              </div>
              <div className="group flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary transition-all group-hover:bg-primary group-hover:text-white">
                  <Mail size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">بريد إلكتروني</p>
                  <p className="break-all text-sm font-black text-slate-900">support@aamilak.mr</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-surface-100 pt-8 md:flex-row md:gap-8 md:pt-12">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 md:text-right">
            © {new Date().getFullYear()} منصة عاملك. جميع الحقوق محفوظة. الجمهورية الإسلامية الموريتانية
          </p>
        </div>
      </div>
    </footer>
  )
}
