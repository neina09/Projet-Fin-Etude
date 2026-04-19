import React from "react"
import { Search, Star, MapPin, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import heroImg from "../assets/hero-worker.png"

function Hero() {
  const navigate = useNavigate()

  return (
    <section dir="rtl" className="relative bg-white pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-brand-blue">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-blue" />
              </span>
              منصة العمل الموثوقة
            </div>

            <h1 className="mb-8 text-5xl font-black leading-[1.15] text-slate-950 md:text-6xl lg:text-7xl">
              أفضل العمال
              <br />
              الموثوقين <span className="text-brand-blue">بالقرب منك</span>
            </h1>

            <p className="mb-12 max-w-xl text-lg font-medium leading-relaxed text-slate-500">
              احصل على أفضل الخدمات الميدانية في دقائق. نجمع لك نخبة المحترفين المعتمدين لتنفيذ مهامك بكل جودة وأمان.
            </p>

            {/* Search Box */}
            <div className="mb-10 w-full max-w-2xl rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-200/50 flex flex-col sm:flex-row gap-2">
              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <Search size={20} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="ما هي الخدمة التي تبحث عنها؟" 
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="hidden sm:block w-px h-8 bg-slate-100 my-auto" />
              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <MapPin size={20} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="الموقع (نواكشوط، تفرغ زينة...)" 
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <button 
                onClick={() => navigate("/auth")}
                className="rounded-xl bg-brand-blue px-8 py-3.5 text-sm font-black text-white hover:bg-brand-blue-hover transition-all active:scale-95"
              >
                بحث
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex -space-x-3 space-x-reverse">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i} 
                    src={`https://i.pravatar.cc/100?u=${i + 10}`} 
                    alt="User" 
                    className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                  />
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-black text-slate-600">
                  +1k
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} className="fill-current" />)}
                  <span className="mr-2 text-sm font-black text-slate-900">4.9/5</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">تقييم العملاء الراضين</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square w-full max-w-[540px] mx-auto overflow-hidden rounded-[40px] shadow-2xl">
              <img 
                src={heroImg} 
                alt="Service Worker" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Info Cards */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -right-8 top-1/4 hidden xl:flex items-center gap-4 bg-white p-5 rounded-2xl shadow-xl border border-slate-50"
            >
              <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">عمال معتمدون</p>
                <p className="text-xs font-bold text-slate-400">تطبيق أعلى معايير الجودة</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -left-8 bottom-1/4 hidden xl:flex items-center gap-4 bg-white p-5 rounded-2xl shadow-xl border border-slate-50"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">خدمة فورية</p>
                <p className="text-xs font-bold text-slate-400">تغطية شاملة لجميع الأحياء</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

