import React from "react"
import { Facebook, Heart, Instagram, Mail, Phone, Twitter } from "lucide-react"

const smallLogo = "/logo.png"

export default function SimpleFooter() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white/50 py-12 backdrop-blur-sm" dir="rtl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 border-b border-slate-50 pb-12 md:grid-cols-4 lg:grid-cols-12">
          <div className="md:col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3">
              <img src={smallLogo} alt="عاملك" className="h-20 w-auto object-contain lg:h-24" loading="lazy" decoding="async" />
            </div>
            <p className="mt-4 max-w-xs text-sm font-bold leading-relaxed text-slate-500">
              منصة موريتانية تربط الكفاءات المهنية بمن يبحث عن خدمة موثوقة وسريعة وواضحة.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <a key={index} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-all hover:bg-primary hover:text-white">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">المنصة</h3>
            <ul className="space-y-3">
              {["عن المنصة", "كيفية العمل", "سوق العمال", "الحماية"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs font-bold text-slate-500 transition-colors hover:text-primary">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">الدعم</h3>
            <ul className="space-y-3">
              {["مركز المساعدة", "الأسئلة الشائعة", "اتصل بنا", "الشروط"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs font-bold text-slate-500 transition-colors hover:text-primary">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">تواصل مباشر</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Phone size={14} />
                </div>
                <span className="ltr text-xs font-black text-slate-700">+222 22 22 22 22</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Mail size={14} />
                </div>
                <span className="text-xs font-black text-slate-700">support@aamilak.mr</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
            <span>صنع بكل</span>
            <Heart size={12} className="fill-red-500 text-red-500" />
            <span>في موريتانيا</span>
          </div>

          <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            © {new Date().getFullYear()} منصة عاملك. جميع الحقوق محفوظة
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-100/50 bg-emerald-50 px-3 py-1">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">حماية أفضل</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
