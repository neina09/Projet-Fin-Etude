import React from "react"
import { Bell, Briefcase, Check, Clock, FileCheck, Info, MessageSquare, ShieldCheck, UserCheck } from "lucide-react"

export default function NotificationList({ notifications, onMarkAsRead }) {
  const iconSize = 16

  const typeConfig = {
    CHAT_MESSAGE: { icon: <MessageSquare size={iconSize} />, color: "text-cyan-600", bg: "bg-cyan-50" },
    TASK_OFFER: { icon: <MessageSquare size={iconSize} />, color: "text-blue-600", bg: "bg-blue-50" },
    TASK_SELECTED: { icon: <UserCheck size={iconSize} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    TASK_ACCEPTED: { icon: <Briefcase size={iconSize} />, color: "text-amber-600", bg: "bg-amber-50" },
    TASK_REFUSED: { icon: <Info size={iconSize} />, color: "text-rose-600", bg: "bg-rose-50" },
    WORKER_ASSISTANCE_REQUEST: { icon: <Briefcase size={iconSize} />, color: "text-violet-600", bg: "bg-violet-50" },
    ADMIN_TASK_REVIEW: { icon: <Briefcase size={iconSize} />, color: "text-indigo-600", bg: "bg-indigo-50" },
    ADMIN_WORKER_REVIEW: { icon: <FileCheck size={iconSize} />, color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
    WORKER_VERIFIED: { icon: <ShieldCheck size={iconSize} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    WORKER_REJECTED: { icon: <Info size={iconSize} />, color: "text-rose-600", bg: "bg-rose-50" },
    BOOKING_REQUEST: { icon: <Bell size={iconSize} />, color: "text-indigo-600", bg: "bg-indigo-50" },
    BOOKING_ACCEPTED: { icon: <Check size={iconSize} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    BOOKING_REJECTED: { icon: <Info size={iconSize} />, color: "text-rose-600", bg: "bg-rose-50" },
    BOOKING_COMPLETED: { icon: <Check size={iconSize} />, color: "text-amber-600", bg: "bg-amber-50" },
    DEFAULT: { icon: <Info size={iconSize} />, color: "text-slate-600", bg: "bg-slate-50" }
  }

  const getRelativeTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60) return "الآن"
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
    return date.toLocaleDateString("ar-EG")
  }

  return (
    <div className="absolute left-0 top-12 z-[200] w-80 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in slide-in-from-top-2 duration-300">
      <div className="sticky top-0 flex items-center justify-between border-b border-slate-50 bg-white/70 p-5 backdrop-blur-md">
        <h3 className="flex items-center gap-2 text-sm font-black text-slate-900">
          <Bell size={16} className="text-blue-600" />
          الإشعارات
        </h3>
        {notifications.some((item) => !item.isRead) && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const config = typeConfig[notification.type] || typeConfig.DEFAULT
            return (
              <div
                key={notification.id}
                className={`group relative flex gap-4 border-b border-slate-50 p-4 transition-all hover:bg-slate-50 ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${config.bg} ${config.color}`}>
                  {config.icon}
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <p className={`text-xs leading-relaxed ${!notification.isRead ? "font-black text-slate-900" : "font-bold text-slate-500"}`}>
                    {notification.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400">
                    <Clock size={10} />
                    {getRelativeTime(notification.createdAt)}
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onMarkAsRead(notification.id)
                    }}
                    className="absolute left-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg border border-emerald-50 bg-white text-emerald-500 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-emerald-50"
                    aria-label="تحديد كمقروء"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[2rem] bg-slate-50 text-slate-200">
              <Bell size={32} />
            </div>
            <p className="text-sm font-black text-slate-400">لا توجد إشعارات حالياً</p>
          </div>
        )}
      </div>
    </div>
  )
}
