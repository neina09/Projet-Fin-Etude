import React from "react"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck, Zap, Globe, Heart } from "lucide-react"
import logo from "../assets/logo.png"

export default function Footer() {
  return (
    <footer className="mt-40 bg-white border-t border-surface-100 relative overflow-hidden" dir="rtl">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/5 blur-[100px] rounded-full" />
      
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-50 p-2 border border-surface-100 shadow-sm">
                <img src={logo} alt="L" className="h-full w-full object-contain" />
              </div>
              <div>
                 <h2 className="text-3xl font-black tracking-tighter text-slate-900">عاملك</h2>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Premium Marketplace</p>
              </div>
            </div>
            <p className="text-lg font-bold text-slate-500 leading-relaxed max-w-md">
              المنصة الموريتانية الرقمية الأولى التي تجمع بين الخبرة الميدانية والتكنولوجيا الحديثة لخدمة المجتمع الموريتاني بكل أمان وااحترافية.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Globe].map((Icon, i) => (
                <a key={i} href="#" className="h-12 w-12 rounded-2xl bg-surface-50 border border-surface-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary/50 transition-all duration-300 group shadow-sm">
                  <Icon size={20} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">المنصة</h3>
            <ul className="space-y-4">
              {["من نحن", "كيفية العمل", "سوق العمال", "الحماية والأمان"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-base font-bold text-slate-500 hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-secondary">الدعم</h3>
            <ul className="space-y-4">
              {["الأسئلة الشائعة", "مركز المساعدة", "اتصل بنا", "الشروط والأحكام"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-base font-bold text-slate-500 hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600">تواصل معنا</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                   <Phone size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مكالمة هاتفية</p>
                   <p className="text-sm font-black text-slate-900">+222 22 22 22 22</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                   <Mail size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">بريد إلكتروني</p>
                   <p className="text-sm font-black text-slate-900">support@aamilak.mr</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-surface-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
             <span>صنع بكل</span>
             <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
             <span>في موريتانيا</span>
          </div>
          
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center md:text-right">
            © {new Date().getFullYear()} منصة عاملك . جميع الحقوق محفوظة . الجمهورية الإسلامية الموريتانية
          </p>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-50 border border-surface-100">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/80">Systems Secure</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
