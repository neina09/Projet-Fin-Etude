import React, { useMemo } from "react"
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User,
  UserPlus,
  Users,
  Sparkles
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Logo from "./Logo"
import { useLanguage } from "../i18n/LanguageContext"

export default function Sidebar({ page, onNavigate, user, onLogout, isOpen, onClose }) {
  const { dir, isArabic } = useLanguage()
  const isAdmin = user?.role === "ADMIN"
  const isWorker = user?.role === "WORKER"

  const navItems = useMemo(() => {
    const items = [
      { id: "dashboard", label: "الرئيسية", icon: LayoutDashboard },
      { id: "workers", label: "الخبراء", icon: Users },
      { id: "tasks", label: isWorker ? "المهام والعروض" : "إدارة الطلبات", icon: ClipboardList },
      { id: "profile", label: "الملف الشخصي", icon: User }
    ]

    if (!isAdmin && !isWorker) {
      items.splice(3, 0, { id: "becomeWorker", label: "انضم كعامل", icon: UserPlus })
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
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-all lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside dir={dir} className={`fixed right-0 top-0 z-50 flex h-screen w-72 flex-col border-l border-slate-100 bg-white transition-all duration-500 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"}`}>
        <div className="flex h-24 items-center gap-4 border-b border-slate-50 px-8">
          <Logo onClick={() => onNavigate(isAdmin ? "admin" : "dashboard")} className="cursor-pointer" />
        </div>

        <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-8">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = page === item.id

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${active ? "bg-blue-50 text-[#1d4ed8]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                {active && <motion.div layoutId="activePill" className="absolute right-0 h-6 w-1 rounded-l-full bg-[#1d4ed8]" />}
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${active ? "bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/30" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-[#1d4ed8] group-hover:rotate-12"}`}>
                  <Icon size={20} />
                </div>
                {item.label}
                {active && <Sparkles size={14} className="mr-auto animate-pulse text-[#1d4ed8] opacity-50" />}
              </button>
            )
          })}

          {isAdmin && (
            <button
              onClick={() => onNavigate("admin")}
              className={`group relative flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 ${page === "admin" ? "bg-amber-50 text-amber-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${page === "admin" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-amber-500 group-hover:rotate-12"}`}>
                <ShieldCheck size={20} />
              </div>
              إدارة المنصة
            </button>
          )}
        </nav>

        <div className="p-6">
          <div className="group relative mb-6 overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#1d4ed8]/5 blur-2xl transition-all group-hover:scale-150" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <p className="t-label">حالة الاتصال</p>
              </div>
              <p className="mb-1 text-sm font-black text-slate-900">{user?.username || "ضيف"}</p>
              <p className="t-label opacity-60">ID: {user?.id ? String(user.id).slice(-8).toUpperCase() : "USR"}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="group flex w-full items-center gap-4 rounded-2xl border border-transparent px-6 py-4 text-sm font-black text-red-500 shadow-sm transition-all hover:border-red-100 hover:bg-red-50 hover:shadow-red-100"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 shadow-sm shadow-red-200 transition-all duration-500 group-hover:bg-red-500 group-hover:text-white">
              <LogOut size={20} />
            </div>
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  )
}
