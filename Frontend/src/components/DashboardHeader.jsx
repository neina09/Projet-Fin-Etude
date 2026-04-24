import React, { useCallback, useEffect, useState } from "react"
import { Bell, LogOut, Menu, User, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import NotificationList from "./NotificationList"
import {
  getMyNotifications,
  getUnreadNotificationsCount,
  isAuthenticationError,
  markAllNotificationsRead,
  markNotificationRead,
  resolveAssetUrl
} from "../api"

const logo = "/logo.png"

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
        current.map((item) => (item.id === id ? { ...item, isRead: true, read: true } : item))
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
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true, read: true })))
      setUnreadCount(0)
    } catch (error) {
      if (isAuthenticationError(error)) {
        setNotificationsEnabled(false)
        setNotifications([])
        setUnreadCount(0)
      }
    }
  }

  const navItems = [
    { id: isAdmin ? "admin" : "dashboard", label: "الرئيسية" },
    { id: "workers", label: "الخبراء" },
    { id: "tasks", label: "العروض والمهام" },
    { id: "myRequests", label: "الطلبات والحجوزات" },
    { id: "ratings", label: "التقييمات" },
    ...(isAdmin
      ? [
          { id: "manageWorkers", label: "إدارة العمال" },
          { id: "tasksVerification", label: "مراجعة الإدارة" }
        ]
      : [])
  ]

  return (
    <header dir="rtl" className="fixed left-0 right-0 top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[88px] items-center justify-between sm:h-[104px]">
          <button onClick={() => onNavigate(isAdmin ? "admin" : "dashboard")} className="flex shrink-0 items-center">
            <img src={logo} alt="عاملك" className="h-14 w-auto object-contain sm:h-20 lg:h-24" />
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-semibold transition-colors duration-150 ${
                  activePage === item.id ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications((current) => !current)
                  setShowUserMenu(false)
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-99" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 z-200 mt-2 w-[min(20rem,calc(100vw-2rem))] sm:w-80"
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

            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu((current) => !current)
                  setShowNotifications(false)
                }}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                {user?.imageUrl ? (
                  <img src={resolveAssetUrl(user.imageUrl)} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-black">{user?.username?.[0]?.toUpperCase()}</span>
                )}
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-99" onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 z-200 mt-2 w-52 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50"
                    >
                      <div className="border-b border-slate-50 px-4 py-3">
                        <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">مسجل كـ</p>
                        <p className="truncate text-sm font-black text-slate-900">{user?.username}</p>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={() => {
                            onNavigate("profile")
                            setShowUserMenu(false)
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <User size={13} />
                          </div>
                          الملف الشخصي
                        </button>
                        <div className="mx-1 my-1 h-px bg-slate-50" />
                        <button
                          onClick={onLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
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

            <button
              onClick={() => setShowMobileMenu((current) => !current)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-50 lg:hidden"
              aria-label={showMobileMenu ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id)
                    setShowMobileMenu(false)
                  }}
                  className={`rounded-xl px-3 py-2.5 text-right text-sm font-semibold transition-colors ${
                    activePage === item.id ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
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
