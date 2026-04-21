import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  Bell,
  Search,
  LogOut,
  ClipboardList,
  Users,
  ChevronDown,
  Briefcase,
  Home,
  Star,
  Shield
} from "lucide-react"
import NotificationList from "./NotificationList"
import { getMyNotifications, isAuthenticationError, markNotificationRead, resolveAssetUrl } from "../api"
import { AnimatePresence, motion } from "framer-motion"
import logo from "../assets/logo.png"

const normalizeNotification = (notification) => ({
  ...notification,
  isRead: Boolean(notification?.isRead ?? notification?.read ?? false)
})

export default function DashboardHeader({ user, activePage, onNavigate, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [hiddenNotificationIds, setHiddenNotificationIds] = useState([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const isAdmin = user?.role === "ADMIN"

  const fetchNotifications = useCallback(async () => {
    if (!notificationsEnabled) return
    try {
      const data = await getMyNotifications()
      const list = (Array.isArray(data) ? data : []).map(normalizeNotification)
      setNotifications(
        list
          .map((n) => hiddenNotificationIds.includes(n.id) ? { ...n, isRead: true } : n)
          .filter((n) => !n.isRead)
      )
    } catch (error) {
      if (isAuthenticationError(error)) {
        setNotificationsEnabled(false)
        setNotifications([])
        return
      }
      console.error("Failed to fetch notifications:", error)
    }
  }, [hiddenNotificationIds, notificationsEnabled])

  useEffect(() => {
    if (!notificationsEnabled) return undefined
    const initialTimer = setTimeout(() => fetchNotifications(), 0)
    const interval = setInterval(fetchNotifications, 8000)
    return () => { clearTimeout(initialTimer); clearInterval(interval) }
  }, [fetchNotifications, notificationsEnabled])

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setHiddenNotificationIds((c) => (c.includes(id) ? c : [...c, id]))
      setNotifications((c) => c.filter((n) => n.id !== id))
    } catch (error) {
      if (isAuthenticationError(error)) {
        setNotificationsEnabled(false)
        setNotifications([])
        return
      }
      console.error("Failed to mark notification as read:", error)
    }
  }

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  )

  // Navigation tabs — added tasks-verification for admin
  const headerNavItems = [
    { id: isAdmin ? "admin" : "dashboard", label: "الرئيسية", icon: Home },
    { id: "workers", label: "سوق العمال", icon: Users },
    { id: "tasks", label: "المهام والعروض", icon: ClipboardList },
    ...(isAdmin
      ? [{ id: "tasksVerification", label: "المهام والتوثيق", icon: Shield }]
      : []),
    { id: "ratings", label: "التقييمات", icon: Star }
  ]

  return (
    <header className="sticky top-0 z-[50] flex flex-col border-b border-slate-100 bg-white/95 backdrop-blur-3xl transition-all duration-500 shadow-sm">
      {/* Top Row */}
      <div className="flex h-20 items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => onNavigate(isAdmin ? "admin" : "dashboard")}
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg border border-slate-100 p-1.5 overflow-hidden">
              <img src={logo} alt="L" className="h-full w-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">عاملك</h1>
              <p className="text-[8px] font-black text-[#1d4ed8] tracking-[0.2em] uppercase opacity-60">Aamilak Node</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Search Bar */}
          <div className="group relative hidden xl:flex">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1d4ed8] transition-colors" size={18} />
            <input
              type="text"
              placeholder="البحث الذكي في النظام..."
              className="w-72 rounded-2xl border border-slate-100 bg-slate-50 py-2.5 pr-12 pl-4 text-sm font-bold text-slate-900 transition-all focus:border-blue-500/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 placeholder:text-slate-400"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((c) => !c)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 ${
                showNotifications
                  ? "bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/20"
                  : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
              }`}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white ring-3 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-4 z-50 origin-top-left"
                >
                  <NotificationList notifications={notifications} onMarkAsRead={handleMarkRead} />
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-[1px] bg-slate-100" />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-3 p-1.5 rounded-2xl border transition-all duration-300 ${
                showUserMenu
                  ? "bg-slate-50 border-blue-500/20 shadow-sm"
                  : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-sm font-black text-[#1d4ed8] overflow-hidden">
                {user?.imageUrl ? (
                  <img src={resolveAssetUrl(user.imageUrl)} alt={user?.username || "User"} className="h-full w-full object-cover" />
                ) : (
                  user?.username?.[0]?.toUpperCase() || "U"
                )}
              </div>
              <div className="hidden sm:flex flex-col items-end gap-0.5 ml-2">
                <span className="text-[12px] font-black text-slate-900 leading-tight">{user?.username || "Guest User"}</span>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                  Online <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                </span>
              </div>
              <ChevronDown size={15} className={`text-slate-400 transition-transform duration-500 ${showUserMenu ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-4 w-72 origin-top-left rounded-[2rem] bg-white border border-slate-100 p-3 shadow-2xl z-50"
                >
                  <div className="mt-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={onLogout}
                      className="flex w-full items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50 group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all">
                        <LogOut size={18} />
                      </div>
                      تسجيل الخروج
                    </button>
                  </div>

                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowUserMenu(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="flex items-center gap-1 px-6 lg:px-12 -mb-px overflow-x-auto">
        {headerNavItems.map((item) => {
          const Icon = item.icon
          const isActive =
            activePage === item.id ||
            (item.id === "dashboard" && activePage === "admin" && !isAdmin)

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex shrink-0 items-center gap-2.5 px-5 py-3 text-[12px] font-black tracking-wide transition-all duration-300 border-b-[3px] ${
                isActive
                  ? "border-[#1d4ed8] text-[#1d4ed8] bg-blue-50/50"
                  : "border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50/50"
              }`}
            >
              <Icon size={16} />
              {item.label}
              {/* Highlight badge for tasks-verification tab when it's admin */}
              {item.id === "tasksVerification" && (
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                  isActive ? "bg-blue-100 text-blue-700" : "bg-red-50 text-red-500"
                }`}>
                  إدارة
                </span>
              )}
            </button>
          )
        })}
      </div>
    </header>
  )
}