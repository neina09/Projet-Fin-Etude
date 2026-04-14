import React, { useMemo } from "react"
import {
  Home,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShieldCheck,
  User,
  UserPlus,
  Users,
  Wrench,
  X
} from "lucide-react"

export default function Sidebar({ page, onNavigate, user, onLogout, isOpen, onClose }) {
  const isAdmin = user?.role === "ADMIN"
  const isWorker = user?.role === "WORKER"

  const navItems = useMemo(() => {
    const items = [
      { id: "dashboard", label: "الرئيسية", icon: LayoutDashboard },
      { id: "workers", label: "العمال", icon: Users },
      { id: "tasks", label: isWorker ? "المهام والعروض" : "المهام", icon: ClipboardList },
      { id: "chat", label: "الرسائل", icon: MessageSquare },
      { id: "profile", label: "الملف الشخصي", icon: User }
    ]

    if (!isAdmin && !isWorker) {
      items.splice(3, 0, { id: "becomeWorker", label: "قدّم كعامل", icon: UserPlus })
    }

    return items
  }, [isAdmin, isWorker])

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-[55] bg-slate-950/35 lg:hidden" onClick={onClose} />}

      <aside className={`fixed right-0 top-0 z-[60] flex h-screen w-72 flex-col border-l border-surface-200 bg-white shadow-xl shadow-surface-900/[0.02] transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between gap-3 p-6">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-3 text-right"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <Wrench size={20} />
            </div>
            <div>
              <span className="block font-alexandria text-2xl font-black tracking-tight text-surface-900">شغلني</span>
              <span className="block text-[11px] font-bold text-surface-400">لوحة التحكم</span>
            </div>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-surface-400 hover:bg-surface-50 lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex w-full items-center gap-3 rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm font-bold text-surface-700 hover:border-primary/20 hover:text-primary"
          >
            <Home size={18} />
            <span className="flex-1 text-right">العودة إلى ملخص الحساب</span>
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-2 overflow-y-auto px-4 pb-6">
          <p className="mb-4 px-4 text-[11px] font-black tracking-[0.2em] text-surface-400">التنقل الرئيسي</p>

          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                page === item.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-surface-500 hover:bg-surface-50 hover:text-surface-900"
              }`}
            >
              <item.icon size={20} className={page === item.id ? "text-white" : "text-surface-400 transition-colors group-hover:text-primary"} />
              <span className="flex-1 text-right">{item.label}</span>
              {page === item.id && <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          ))}

          {!isAdmin && !isWorker && (
            <button
              type="button"
              onClick={() => onNavigate("becomeWorker")}
              className="mt-4 w-full rounded-2xl border border-primary/20 bg-primary-soft px-4 py-4 text-sm font-black text-primary transition-all hover:bg-primary hover:text-white"
            >
              ابدأ كمزود خدمة
            </button>
          )}

          {isAdmin && (
            <>
              <div className="mx-4 my-6 h-px bg-surface-100" />
              <p className="mb-4 px-4 text-[11px] font-black tracking-[0.2em] text-surface-400">الإدارة</p>
              <button
                type="button"
                onClick={() => onNavigate("admin")}
                className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                  page === "admin"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-surface-500 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <ShieldCheck size={20} className={page === "admin" ? "text-white" : "text-indigo-400"} />
                <span className="flex-1 text-right">لوحة الإدارة</span>
              </button>
            </>
          )}
        </nav>

        <div className="border-t border-surface-100 bg-surface-50/50 p-6">
          <div className="mb-6 flex items-center gap-3 p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 bg-white font-black text-primary shadow-sm">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-black text-surface-900">{user?.username || "المستخدم"}</p>
              <p className="text-[11px] font-bold tracking-tight text-surface-400">
                {isAdmin ? "حساب مدير" : isWorker ? "حساب عامل" : "حساب عميل"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-surface-200 bg-white px-4 py-3 text-xs font-black text-red-500 shadow-sm transition-all hover:border-red-100 hover:bg-red-50"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  )
}
