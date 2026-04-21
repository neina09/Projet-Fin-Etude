import React from "react"
import { Briefcase, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import logo from "../assets/logo.png"

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm">
                <img src={logo} alt="L" className="h-full w-full object-contain" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">عاملك</h2>
            </div>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">
              المنصة الموريتانية الأولى لربط المهنيين المهرة بأصحاب العمل. نسعى لتطوير سوق العمل الرقمي وتسهيل المعاملات بين الجميع.
            </p>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 underline decoration-[#1d4ed8] decoration-2 underline-offset-8">روابط سريعة</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[#1d4ed8] transition-colors">عن المنصة</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[#1d4ed8] transition-colors">كيفية العمل</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[#1d4ed8] transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[#1d4ed8] transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 underline decoration-[#1d4ed8] decoration-2 underline-offset-8">اتصل بنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <Phone size={16} className="text-[#1d4ed8]" /> +222 22 22 22 22
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <Mail size={16} className="text-[#1d4ed8]" /> contact@aamilak.mr
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <MapPin size={16} className="text-[#1d4ed8]" /> نواكشوط، موريتانيا
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 underline decoration-[#1d4ed8] decoration-2 underline-offset-8">تابعنا</h3>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#1d4ed8] hover:text-white transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#1d4ed8] hover:text-white transition-all shadow-sm">
                <Twitter size={18} />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#1d4ed8] hover:text-white transition-all shadow-sm">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            © {new Date().getFullYear()} عاملك. جميع الحقوق محفوظة لجمهورية موريتانيا الإسلامية.
          </p>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">حالة النظام: مستقر</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
