import React, { useMemo } from "react"
import {
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User,
  UserPlus,
  Users,
  Sparkles,
  Zap
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import logo from "../assets/logo.png"

export default function Sidebar({ page, onNavigate, user, onLogout, isOpen, onClose }) {
  const isAdmin = user?.role === "ADMIN"
  const isWorker = user?.role === "WORKER"

  const navItems = useMemo(() => {
    const items = [
      { id: "dashboard", label: "الرئيسية الذكية", icon: LayoutDashboard },
      { id: "workers", label: "سوق الكفاءات", icon: Users },
      { id: "tasks", label: isWorker ? "المهام والعروض" : "إدارة العمليات", icon: ClipboardList },
      { id: "profile", label: "الملف الرقمي", icon: User }
    ]

    if (!isAdmin && !isWorker) {
      items.splice(3, 0, { id: "becomeWorker", label: "أضف نفسك كعامل", icon: UserPlus })
    }

    return items
  }, [isAdmin, isWorker])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-all" 
          />
        )}
      </AnimatePresence>

      <aside className={`fixed right-0 top-0 z-50 flex h-screen w-72 flex-col border-l border-slate-100 bg-white transition-all duration-500 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"}`}>
        {/* Header / Logo Section */}
        <div className="flex h-24 items-center gap-4 px-8 border-b border-slate-50">
           <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d4ed8] shadow-lg shadow-blue-500/20 group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Briefcase size={24} className="text-white relative z-10" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">عاملك</h1>
              <p className="t-label tracking-[0.3em] opacity-70">Aamilak Platform</p>
           </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-8 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = page === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${active ? "bg-blue-50 text-[#1d4ed8]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                {active && (
                  <motion.div layoutId="activePill" className="absolute right-0 h-6 w-1 rounded-l-full bg-[#1d4ed8]" />
                )}
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${active ? "bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/30 rotate-0" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-[#1d4ed8] group-hover:rotate-12"}`}>
                  <Icon size={20} />
                </div>
                {item.label}
                {active && <Sparkles size={14} className="mr-auto text-[#1d4ed8] opacity-50 animate-pulse" />}
              </button>
            )
          })}

          {isAdmin && (
             <button
               onClick={() => onNavigate("admin")}
               className={`group relative flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${page === "admin" ? "bg-amber-50 text-amber-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
             >
               <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${page === "admin" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 rotate-0" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-amber-500 group-hover:rotate-12"}`}>
                 <ShieldCheck size={20} />
               </div>
               إدارة المنصة
             </button>
          )}
        </nav>

        <div className="p-6">
          <div className="mb-6 rounded-[2rem] bg-slate-50 p-6 border border-slate-100 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-[#1d4ed8]/5 rounded-full blur-2xl transition-all group-hover:scale-150" />
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="t-label">حالة الاتصال</p>
               </div>
               <p className="text-sm font-black text-slate-900 mb-1">{user?.username || "Guest"}</p>
               <p className="t-label opacity-60">ID: {user?.id ? String(user.id).slice(-8).toUpperCase() : "USR"}</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-sm font-black text-red-500 transition-all hover:bg-red-50 group shadow-sm hover:shadow-red-100 border border-transparent hover:border-red-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-500 shadow-sm shadow-red-200">
               <LogOut size={20} />
            </div>
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  )
}
