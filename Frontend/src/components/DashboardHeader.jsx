import React, { useEffect, useState } from "react"
import { Bell, Menu, Search } from "lucide-react"
import NotificationList from "./NotificationList"
import { getMyNotifications, markNotificationRead } from "../api"

export default function DashboardHeader({ user, title, onToggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      fetchNotifications()
    }, 0)
    const interval = setInterval(fetchNotifications, 30000)
    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      )
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <header className="sticky top-0 z-[50] flex h-20 items-center justify-between border-b border-surface-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-50 text-surface-500 hover:bg-surface-100 lg:hidden"
          aria-label="فتح القائمة"
        >
          <Menu size={20} />
        </button>

        <h1 className="font-alexandria text-lg font-black text-surface-900 sm:text-xl">{title}</h1>

        <div className="group relative hidden md:flex">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-primary" size={18} />
          <input
            type="text"
            placeholder="ابحث داخل اللوحة..."
            className="saas-input h-10 w-80 border-transparent bg-surface-50 pr-11 focus:border-primary/20 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((current) => !current)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              showNotifications ? "bg-primary-soft text-primary shadow-inner" : "bg-surface-50 text-surface-500 hover:bg-surface-100"
            }`}
            aria-label="عرض الإشعارات"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -left-1 -top-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-black text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 mt-3">
              <NotificationList notifications={notifications} onMarkAsRead={handleMarkRead} />
              <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)} />
            </div>
          )}
        </div>

        <div className="hidden h-6 w-px bg-surface-200 sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end leading-tight sm:flex">
            <span className="text-xs font-black text-surface-900">{user?.username || "المستخدم"}</span>
            <span className="text-[10px] font-bold tracking-widest text-emerald-500">متصل الآن</span>
          </div>
          <div className="cursor-pointer rounded-xl bg-gradient-to-br from-primary to-indigo-600 p-[2px] shadow-lg shadow-primary/10 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-[9px] bg-white text-sm font-black text-primary">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
