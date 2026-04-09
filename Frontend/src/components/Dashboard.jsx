import React, { useState, useEffect, useMemo } from "react"
import {
  LogOut, Briefcase, Eye, FileText,
  TrendingUp, ArrowUpRight, Wrench,
} from "lucide-react"
import { getMe } from "../api"
import logo from "../assets/logo.png"
import SearchBar   from "./SearchBar"
import WorkerCard  from "./WorkerCard"
import BecomeWorker from "./BecomeWorker"
import ProblemBoard from "./ProblemBoard"

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const MOCK_WORKERS = [
  { id:1, name:"أحمد سالم",    specialty:"Plumber",     rating:4.8, reviews:124, price:15, available:true,  jobs:87,  location:"نواكشوط", img:"https://randomuser.me/api/portraits/men/32.jpg",   top:true  },
  { id:2, name:"فاطمة انجاي",  specialty:"Electrician", rating:4.6, reviews:89,  price:20, available:true,  jobs:61,  location:"نواكشوط", img:"https://randomuser.me/api/portraits/women/44.jpg", top:false },
  { id:3, name:"عمر كوليبالي", specialty:"Painter",     rating:4.9, reviews:201, price:12, available:false, jobs:143, location:"روصو",      img:"https://randomuser.me/api/portraits/men/75.jpg",   top:true  },
  { id:4, name:"مريم با",      specialty:"Cleaner",     rating:4.5, reviews:67,  price:10, available:true,  jobs:39,  location:"كيفه",       img:"https://randomuser.me/api/portraits/women/68.jpg", top:false },
  { id:5, name:"إبراهيم ديوب",  specialty:"Plumber",     rating:4.7, reviews:98,  price:18, available:true,  jobs:72,  location:"نواكشوط", img:"https://randomuser.me/api/portraits/men/54.jpg",   top:false },
  { id:6, name:"عائشة كيتا",    specialty:"Painter",     rating:4.3, reviews:44,  price:11, available:false, jobs:28,  location:"الزويرات",   img:"https://randomuser.me/api/portraits/women/29.jpg", top:false },
]

const SPECIALTIES = ["الكل", "Plumber", "Electrician", "Painter", "Cleaner"]
const SPEC_ICON   = { "الكل":"◈", Plumber:"🔧", Electrician:"⚡", Painter:"🎨", Cleaner:"✦" }
const SPEC_TRANSLATE = { "الكل":"الكل", Plumber:"سباك", Electrician:"كهربائي", Painter:"دهان", Cleaner:"تنظيف" }

/* ─────────────── Workers Section ─────────────── */
function WorkersSection() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("الكل")

  const filtered = useMemo(() =>
    MOCK_WORKERS.filter(w =>
      (w.name.toLowerCase().includes(search.toLowerCase()) ||
       w.specialty.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "الكل" || w.specialty === filter)
    ), [search, filter])

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#1E293B] tracking-tight mb-2">تصفح المحترفين</h2>
          <p className="text-sm font-bold text-[#64748B] tracking-wide">{filtered.length} عمال متاحون حالياً بالقرب منك</p>
        </div>
        <div className="w-full md:w-96">
           {/* Assuming SearchBar is adaptable, wrap it or use it */}
           <div className="glass-squircle p-2 border-white">
              <SearchBar value={search} onChange={setSearch} />
           </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {SPECIALTIES.map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)} 
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              filter === s 
              ? "bg-[#7000FF] text-white shadow-[0_10px_20px_-5px_rgba(112,0,255,0.4)] scale-105" 
              : "glass-squircle !rounded-full !shadow-none hover:border-[#7000FF]/50 hover:text-[#7000FF]"
            }`}
          >
            {SPEC_ICON[s]} {SPEC_TRANSLATE[s] || s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.length
          ? filtered.map(w => <WorkerCard key={w.id} worker={w} />)
          : (
            <div className="col-span-full py-28 text-center glass-squircle border-dashed">
              <div className="text-6xl mb-6">🛰️</div>
              <div className="text-xl font-bold text-[#64748B]">الرادار الخاص بنا لم يجد أي تطابق لطلبك.</div>
            </div>
          )
        }
      </div>
    </div>
  )
}

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function Dashboard({ onLogout }) {
  const [user, setUser]   = useState(null)
  const [page, setPage]   = useState("dashboard")

  useEffect(() => { getMe().then(setUser).catch(onLogout) }, [onLogout])

  const onlineCount = MOCK_WORKERS.filter(w => w.available).length

  return (
    <div className="min-h-screen relative bg-[#f8fafc]" dir="rtl">

      {/* ── Navbar ── */}
      <nav className="h-20 flex items-center justify-between px-8 sticky top-0 z-50 bg-white/90 border-b border-slate-200 backdrop-blur-md">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setPage("dashboard")}>
            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
               <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-2xl font-black text-[#1E293B] tracking-tight">شغل<b className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] to-[#0EA5E9]">ني</b></span>
          </div>
          
          <div className="w-px h-8 bg-slate-200 hidden md:block" />
          
          <div className="hidden md:flex items-center gap-2">
            {[["dashboard","لوحة القيادة"],["workers","المحترفون"],["tasks","المهام"],["becomeWorker","كن عاملًا"]].map(([id,lbl]) => (
              <button 
                key={id} 
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-400 ${
                  page === id 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-[#64748B] hover:bg-blue-50 hover:text-[#1E293B]"
                }`} 
                onClick={() => setPage(id)}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex h-11 px-4 rounded-xl text-sm font-black bg-blue-600 text-white hover:bg-blue-700 transition-colors items-center gap-2" onClick={() => setPage("becomeWorker")}>
             <Wrench size={16}/> كن عاملًا الآن
          </button>
          <button className="h-10 px-3 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors" onClick={onLogout}>
            <LogOut size={14} className="inline-block me-1" /> خروج
          </button>
        </div>
      </nav>

      {/* ── Views ── */}
      <div className="w-full relative z-10 transition-all duration-500">
        {page === "dashboard" && (
          <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
            
            <div className="relative bg-white overflow-hidden p-10 lg:p-12 mb-10 rounded-3xl border border-slate-200 shadow-sm">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex-1">
                  <span className="inline-block px-4 py-1.5 bg-blue-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-blue-700">لوحة المستخدم</span>
                  <h2 className="text-3xl lg:text-4xl font-black mb-4 leading-tight text-slate-900">مرحبًا {user?.username || "بك"} 👋</h2>
                  <p className="text-slate-600 font-medium mb-8 max-w-lg leading-relaxed text-base">من هنا يمكنك استكشاف المحترفين، نشر المهام، التعليق عليها، ومتابعة سجل المهام السابقة بسهولة.</p>
                  
                  <div className="flex gap-4">
                    <button className="h-11 px-5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors" onClick={() => setPage("workers")}>
                       استكشاف المحترفين
                    </button>
                    <button className="h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors" onClick={() => setPage("tasks")}>
                       إدارة المهام
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-5 w-full lg:w-auto">
                   <div className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                      <div className="text-4xl font-black mb-2 text-blue-700">{onlineCount}</div>
                      <div className="text-[10px] text-blue-700 font-black uppercase tracking-[0.2em]">محترف متاح</div>
                   </div>
                   <div className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                      <div className="text-4xl font-black mb-2 text-blue-700">4.8</div>
                      <div className="text-[10px] text-blue-700 font-black uppercase tracking-[0.2em]">متوسط الجودة</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { icon:<Briefcase size={24}/>,      bg:"bg-gradient-to-br from-[#7000FF]/10 to-[#7000FF]/5", color:"text-[#7000FF]", num:"0", lbl:"مهام قيد التنفيذ" },
                { icon:<FileText size={24}/>,       bg:"bg-gradient-to-br from-[#00F0FF]/10 to-[#00F0FF]/5", color:"text-[#00B0FF]", num:"0", lbl:"العقود الذكية"  },
                { icon:<Eye size={24}/>,            bg:"bg-gradient-to-br from-amber-500/10 to-amber-500/5", color:"text-amber-500", num:"0", lbl:"رصد الملفات"    },
              ].map((s,i) => (
                <div className="glass-squircle p-8" key={i}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.bg} ${s.color} shadow-inner bg-white/50`}>
                       {s.icon}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black bg-[#00F0FF]/20 text-[#00B0FF] px-3 py-1.5 rounded-full tracking-wider">
                       <TrendingUp size={14}/> 0%
                    </div>
                  </div>
                  <div className="text-4xl font-black text-[#1E293B] mb-2">{s.num}</div>
                  <div className="text-sm font-bold text-[#64748B]">{s.lbl}</div>
                </div>
              ))}
            </div>

            {/* AI Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-squircle p-8 flex items-center gap-6 cursor-pointer group" onClick={() => setPage("workers")}>
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#7000FF]/10 text-4xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">🛰️</div>
                <div>
                  <h3 className="text-lg font-black text-[#1E293B] mb-1.5">نظام استكشاف المحترفين</h3>
                  <p className="text-xs font-semibold text-[#64748B] leading-relaxed">ابحث عن أفضل الكفاءات المتوفرة حالياً ضمن نطاقك الجغرافي بتقنيات الذكاء الخاصة بالمنصة.</p>
                </div>
                <div className="ms-auto w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#7000FF] shadow-md group-hover:bg-[#7000FF] group-hover:text-white transition-colors">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              <div className="glass-squircle p-8 flex items-center gap-6 cursor-pointer group" onClick={() => setPage("becomeWorker")}>
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#00F0FF]/10 text-4xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">⚡</div>
                <div>
                  <h3 className="text-lg font-black text-[#1E293B] mb-1.5">ارتقاء لمستوى محترف</h3>
                  <p className="text-xs font-semibold text-[#64748B] leading-relaxed">حوّل مهاراتك إلى مصدر دخل مستدام. انضم للشبكة واستلم طلبات العمل مباشرة عبر هاتفك الذكي.</p>
                </div>
                <div className="ms-auto w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00F0FF] shadow-md group-hover:bg-[#00F0FF] group-hover:text-white transition-colors">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </div>

          </div>
        )}

        {page === "workers" && <WorkersSection />}
        {page === "tasks" && <ProblemBoard currentUser={user} />}
        {page === "becomeWorker" && <BecomeWorker />}
      </div>
    </div>
  )
}