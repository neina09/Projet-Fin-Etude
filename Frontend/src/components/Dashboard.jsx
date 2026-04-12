import React, { useState, useEffect, useMemo } from "react"
import {
  LogOut, Briefcase, Eye, FileText,
  TrendingUp, ArrowUpRight, Wrench, Search, LayoutDashboard, Users, ClipboardList
} from "lucide-react"
import { getMe } from "../api"
import logo from "../assets/logo.png"
import WorkerCard  from "./WorkerCard"
import BecomeWorker from "./BecomeWorker"
import ProblemBoard from "./ProblemBoard"
import WorkerRequestModal from "./WorkerRequestModal"

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
const SPEC_ICON   = { "الكل":"◈", Plumber:"🔧", Electrician:"⚡", Painter:"🎨", Cleaner:"🧹" }
const SPEC_TRANSLATE = { "الكل":"الكل", Plumber:"سباك", Electrician:"كهربائي", Painter:"دهان", Cleaner:"تنظيف" }

/* ─────────────── Workers Section ─────────────── */
function WorkersSection() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("الكل")
  const [selectedWorker, setSelectedWorker] = useState(null)

  const filtered = useMemo(() =>
    MOCK_WORKERS.filter(w =>
      (w.name.toLowerCase().includes(search.toLowerCase()) ||
       w.specialty.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "الكل" || w.specialty === filter)
    ), [search, filter])

  const handleHireSubmit = (bookingData) => {
    console.log("Booking submitted:", bookingData)
    alert(`تم إرسال طلبك إلى ${selectedWorker.name} بنجاح!`)
    setSelectedWorker(null)
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-surface-900 tracking-tight mb-2">تصفح المحترفين</h2>
          <p className="text-sm font-medium text-surface-500">{filtered.length} عمال متاحون حالياً بالقرب منك</p>
        </div>
        <div className="w-full md:w-96">
           <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن اسم، مهنة، أو مهارة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="saas-input pr-11 h-12 border-surface-200"
              />
           </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        {SPECIALTIES.map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)} 
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
              filter === s 
              ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
              : "bg-white border-surface-200 text-surface-600 hover:border-primary/30 hover:text-primary"
            }`}
          >
            <span className="ml-2 opacity-70">{SPEC_ICON[s]}</span>
            {SPEC_TRANSLATE[s] || s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.length
          ? filtered.map(w => (
              <WorkerCard 
                key={w.id} 
                worker={w} 
                onHire={() => setSelectedWorker(w)} 
              />
            ))
          : (
            <div className="col-span-full py-28 text-center saas-card bg-surface-50 border-dashed border-surface-200">
              <div className="text-6xl mb-6 grayscale opacity-50">🛰️</div>
              <h3 className="text-xl font-bold text-surface-900 mb-2">لا توجد نتائج</h3>
              <p className="text-sm font-medium text-surface-500">جرب البحث بكلمات مختلفة أو تغيير الفئة.</p>
            </div>
          )
        }
      </div>

      {selectedWorker && (
        <WorkerRequestModal 
          worker={selectedWorker} 
          onClose={() => setSelectedWorker(null)}
          onSubmit={handleHireSubmit}
        />
      )}
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
    <div className="min-h-screen relative bg-surface-50/50" dir="rtl">

      {/* ── Navbar ── */}
      <nav className="h-16 flex items-center justify-between px-8 sticky top-0 z-50 bg-white/80 border-b border-surface-200 backdrop-blur-md">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setPage("dashboard")}>
            <div className="w-8 h-8 flex items-center justify-center">
               <img src={logo} alt="logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black text-surface-900 tracking-tight">شغلني</span>
          </div>
          
          <div className="w-px h-6 bg-surface-200 hidden md:block" />
          
          <div className="hidden lg:flex items-center gap-2">
            {[
              { id: "dashboard", lbl: "الرئيسية", icon: LayoutDashboard },
              { id: "workers", lbl: "المحترفون", icon: Users },
              { id: "tasks", lbl: "سوق المهام", icon: ClipboardList },
              { id: "becomeWorker", lbl: "التوظيف", icon: Briefcase }
            ].map(({id, lbl, icon: Icon}) => (
              <button 
                key={id} 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  page === id 
                  ? "bg-primary-soft text-primary" 
                  : "text-surface-500 hover:text-surface-900 hover:bg-surface-100"
                }`} 
                onClick={() => setPage(id)}
              >
                <Icon size={16} />
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="hidden md:flex h-9 px-4 rounded-lg text-xs font-black bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 items-center gap-2 active:scale-95" 
            onClick={() => setPage("becomeWorker")}
          >
             <Wrench size={14}/> كن عاملاً
          </button>
          
          <div className="w-px h-6 bg-surface-200 hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-none">
               <span className="text-xs font-bold text-surface-900">{user?.username || "المستخدم"}</span>
               <span className="text-[10px] font-bold text-surface-400 mt-0.5">عميل متميز</span>
            </div>
            <button className="h-9 w-9 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500 hover:text-red-600 hover:bg-red-50 transition-all border border-surface-200" onClick={onLogout}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main Content Area ── */}
      <main className="w-full relative z-10 transition-all duration-500 pb-20">
        {page === "dashboard" && (
          <div className="max-w-7xl mx-auto py-10 px-6 lg:px-10">
            
            {/* Elegant Welcome Banner */}
            <div className="relative bg-white overflow-hidden p-8 lg:p-12 mb-8 rounded-[2rem] border border-surface-200 shadow-xl shadow-surface-900/[0.03]">
              {/* Background Accents */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute -top-[10%] -right-[5%] w-[30%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="flex-1 text-center lg:text-right">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-[10px] font-black uppercase tracking-wider text-primary mb-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    لوحة التحكم
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 leading-[1.15] text-surface-900 tracking-tight">مرحباً {user?.username || "بك"} 👋</h2>
                  <p className="text-surface-500 font-medium mb-8 max-w-xl leading-relaxed text-base mx-auto lg:mx-0">
                    استكشف نخبة المحترفين، انشر مهامك، وتابع سير أعمالك من مكان واحد بكل سهولة واحترافية.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <button className="btn-saas btn-primary h-12 px-8 text-sm" onClick={() => setPage("workers")}>
                       استكشاف المحترفين
                    </button>
                    <button className="btn-saas btn-secondary h-12 px-8 text-sm border-surface-200" onClick={() => setPage("tasks")}>
                       إدارة المهام النشطة
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full lg:w-auto">
                   <div className="flex-1 min-w-[140px] bg-surface-50 border border-surface-200 rounded-2xl p-6 text-center group hover:border-primary/20 transition-all">
                      <div className="text-4xl font-black mb-1 text-surface-900 group-hover:text-primary transition-colors">{onlineCount}</div>
                      <div className="text-[10px] text-surface-400 font-bold uppercase tracking-widest">محترف نشط الآن</div>
                   </div>
                   <div className="flex-1 min-w-[140px] bg-surface-50 border border-surface-200 rounded-2xl p-6 text-center group hover:border-primary/20 transition-all">
                      <div className="text-4xl font-black mb-1 text-surface-900 group-hover:text-primary transition-colors">4.8</div>
                      <div className="text-[10px] text-surface-400 font-bold uppercase tracking-widest">متوسط رضا العملاء</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Feature stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Briefcase, color: "text-primary", bg: "bg-primary-soft", num: "0", lbl: "مهام قيد التنفيذ", trend: "+0%" },
                { icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50", num: "0", lbl: "العقود النشطة", trend: "+0%" },
                { icon: Eye, color: "text-amber-600", bg: "bg-amber-50", num: "0", lbl: "مشاهدات الملف", trend: "+0%" },
              ].map((s, i) => (
                <div className="saas-card p-6 bg-white border-surface-200 hover:border-primary/10 transition-all" key={i}>
                  <div className="flex justify-between items-center mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
                       <s.icon size={22} />
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-surface-50 text-surface-400 text-[10px] font-bold tracking-tight border border-surface-100">
                       {s.trend}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-surface-900 mb-1">{s.num}</div>
                  <div className="text-xs font-bold text-surface-400 uppercase tracking-wider">{s.lbl}</div>
                </div>
              ))}
            </div>

            {/* Navigation shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="saas-card p-8 flex items-center gap-6 cursor-pointer group bg-white border-surface-200 hover:shadow-lg transition-all" 
                onClick={() => setPage("workers")}
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-50 flex items-center justify-center text-3xl group-hover:bg-primary-soft transition-all duration-300">
                  🛸
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-surface-900 mb-1.5">نظام البحث الذكي</h3>
                  <p className="text-sm font-medium text-surface-500 leading-relaxed">جد أفضل الكفاءات المتوفرة حالياً في منطقتك وتصفح تقييماتهم الحقيقية.</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-surface-200 flex items-center justify-center text-surface-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div 
                className="saas-card p-8 flex items-center gap-6 cursor-pointer group bg-white border-surface-200 hover:shadow-lg transition-all" 
                onClick={() => setPage("becomeWorker")}
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-50 flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-all duration-300">
                  💼
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-surface-900 mb-1.5">انضم كشريك محترف</h3>
                  <p className="text-sm font-medium text-surface-500 leading-relaxed">هل تمتلك مهارة؟ ابدأ باستقبال طلبات العمل اليوم وزد دخلك عبر منصتنا.</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-surface-200 flex items-center justify-center text-surface-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>

          </div>
        )}

        {page === "workers" && <WorkersSection />}
        {page === "tasks" && <ProblemBoard currentUser={user} />}
        {page === "becomeWorker" && <BecomeWorker />}
      </main>
    </div>
  )
}
