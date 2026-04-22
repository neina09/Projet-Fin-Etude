import React, { useCallback, useEffect, useState } from "react"
import {
  Bell,
  LogOut,
  ChevronDown,
  User,
  Menu,
  X
} from "lucide-react"
import NotificationList from "./NotificationList"
import {
  getMyNotifications,
  getUnreadNotificationsCount,
  isAuthenticationError,
  markAllNotificationsRead,
  markNotificationRead,
  resolveAssetUrl
} from "../api"
import { AnimatePresence, motion } from "framer-motion"
import logo from "../assets/logo.png"

const normalizeNotification = (notification) => ({
  ...notification,
  isRead: Boolean(notification?.isRead ?? notification?.read ?? false)
})

export default function DashboardHeader({ user, activePage, onNavigate, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const isAdmin = user?.role === "ADMIN"

  const fetchNotifications = useCallback(async () => {
    if (!notificationsEnabled) return
    try {
      const [notificationsData, unreadPayload] = await Promise.all([
        getMyNotifications(),
        getUnreadNotificationsCount()
      ])
      const list = (Array.isArray(notificationsData) ? notificationsData : []).map(normalizeNotification)
      setNotifications(list.slice(0, 12))
      setUnreadCount(Number(unreadPayload?.count ?? unreadPayload?.unreadCount ?? 0))
    } catch (error) {
      if (isAuthenticationError(error)) {
        setNotificationsEnabled(false)
        setNotifications([])
        setUnreadCount(0)
      }
    }
  }, [notificationsEnabled])

  useEffect(() => {
    if (!notificationsEnabled) return undefined
    const interval = setInterval(fetchNotifications, 8000)
    fetchNotifications()
    return () => clearInterval(interval)
  }, [fetchNotifications, notificationsEnabled])

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications((current) =>
        current.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
      )
      setUnreadCount((current) => Math.max(0, current - 1))
    } catch (error) {
      if (isAuthenticationError(error)) {
        setNotificationsEnabled(false)
        setNotifications([])
        setUnreadCount(0)
      }
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifications((current) => current.map((n) => ({ ...n, isRead: true, read: true })))
      setUnreadCount(0)
    } catch (error) {
      if (isAuthenticationError(error)) {
        setNotificationsEnabled(false)
        setNotifications([])
        setUnreadCount(0)
      }
    }
  }

  // نفس ترتيب الـ landing: الرئيسية، الخبراء، الخدمات، كيف يعمل
  const navItems = [
    { id: isAdmin ? "admin" : "dashboard", label: "الرئيسية" },
    { id: "workers", label: "الخبراء" },
    { id: "tasks", label: "المهام والعروض" },
    { id: "myRequests", label: "طلباتي" },
    { id: "ratings", label: "التقييمات" },
    ...(isAdmin ? [{ id: "tasksVerification", label: "الإدارة" }] : []),
  ]

  return (
    <header dir="rtl" className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-[64px] items-center justify-between">

          {/* ===== يمين: Logo — نفس الـ landing ===== */}
          <button
            onClick={() => onNavigate(isAdmin ? "admin" : "dashboard")}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <img src={logo} alt="عاملك" className="h-8 w-8 object-contain" />
            <span className="text-xl font-black tracking-tight text-slate-900">عاملك</span>
          </button>

          {/* ===== وسط: Nav links — نفس الـ landing بالضبط ===== */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  text-sm font-semibold transition-colors duration-150
                  ${activePage === item.id
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* ===== يسار: Bell + زر المستخدم الأزرق — بدل "دخول" و"ابدأ الآن" ===== */}
          <div className="flex items-center gap-3">

            {/* إشعارات */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false) }}
                className="relative flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-[99]" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 z-[200] mt-2 w-80"
                    >
                      <NotificationList
                        notifications={notifications}
                        onMarkAsRead={handleMarkRead}
                        onMarkAllAsRead={handleMarkAllRead}
                        unreadCount={unreadCount}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* زر المستخدم — نفس شكل زر "ابدأ الآن" الأزرق */}
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false) }}
                className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-bold transition-colors shadow-sm"
              >
                <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white/25 text-[11px] font-black flex-shrink-0">
                  {user?.imageUrl ? (
                    <img src={resolveAssetUrl(user.imageUrl)} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    user?.username?.[0]?.toUpperCase()
                  )}
                </div>
                <span className="hidden sm:block max-w-[80px] truncate">
                  {user?.username || "حسابي"}
                </span>
                <ChevronDown size={13} className={`transition-transform duration-200 opacity-80 ${showUserMenu ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-[99]" onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 z-[200] mt-2 w-52 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-50">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">مسجل كـ</p>
                        <p className="text-sm font-black text-slate-900 truncate">{user?.username}</p>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={() => { onNavigate("profile"); setShowUserMenu(false) }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <User size={13} />
                          </div>
                          الملف الشخصي
                        </button>
                        <div className="my-1 mx-1 h-px bg-slate-50" />
                        <button
                          onClick={onLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500">
                            <LogOut size={13} />
                          </div>
                          تسجيل الخروج
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex lg:hidden items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setShowMobileMenu(false) }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold text-right transition-colors ${
                    activePage === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}