import React, { useEffect, useMemo, useState } from "react"
import {
  Bell,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  Info,
  MessageSquare,
  ShieldCheck,
  Trash2,
  UserCheck
} from "lucide-react"

const ITEMS_PER_PAGE = 15

const formatNotificationMessage = (notification) => {
  const rawMessage = String(notification?.message || "").trim()
  if (!rawMessage) return "إشعار جديد"

  const replacements = [
    ["New task pending review: ", "مهمة جديدة بانتظار المراجعة: "],
    ["Worker submitted identity document for review:", "عامل رفع وثيقة الهوية للمراجعة: "],
    ["New worker profile pending review:", "ملف عامل جديد بانتظار المراجعة: "],
    ["You have a new booking request from ", "لديك طلب حجز جديد من "],
    ["Your booking with ", "تم تحديث الحجز مع "],
    [" has been accepted", " وتم قبوله"],
    [" has been completed", " واكتمل بنجاح"],
    [" was rejected", " وتم رفضه"],
    [" cancelled the booking request", " ألغى طلب الحجز"],
    ["You have a new offer on your task: ", "لديك عرض جديد على طلبك: "],
    ["You have been selected for the task: ", "تم اختيارك للمهمة: "],
    ["Worker ", "العامل "],
    [" has accepted to start working on: ", " وافق على بدء العمل في: "],
    [" has refused the task: ", " رفض المهمة: "]
  ]

  return replacements.reduce((message, [from, to]) => message.replace(from, to), rawMessage)
}

const getRelativeTime = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (Number.isNaN(date.getTime())) return "الآن"
  if (diff < 60) return "الآن"
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`

  return new Intl.DateTimeFormat("ar", { dateStyle: "short" }).format(date)
}

const typeConfig = (iconSize) => ({
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
  BOOKING_CANCELLED: { icon: <Info size={iconSize} />, color: "text-slate-600", bg: "bg-slate-100" },
  DEFAULT: { icon: <Info size={iconSize} />, color: "text-slate-600", bg: "bg-slate-50" }
})

export default function NotificationList({ notifications, onMarkAsRead, onMarkAllAsRead, unreadCount, onDelete, onDeleteAll }) {
  const [page, setPage] = useState(1)
  const iconSize = 16
  const configByType = typeConfig(iconSize)
  const totalPages = Math.max(1, Math.ceil(notifications.length / ITEMS_PER_PAGE))

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  const pagedNotifications = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return notifications.slice(start, start + ITEMS_PER_PAGE)
  }, [notifications, page])

  return (
    <div className="z-[200] w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
      <div className="sticky top-0 flex items-center justify-between border-b border-slate-50 bg-white/70 p-5 backdrop-blur-md">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-black text-slate-900">
            <Bell size={16} className="text-blue-600" />
            الإشعارات
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onDeleteAll}
              className="group flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
              title="حذف الكل"
            >
              <Trash2 size={14} />
            </button>
          )}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[10px] font-black tracking-widest text-primary transition-colors hover:text-primary/80"
            >
              تحديد الكل كمقروء
            </button>
          )}
          {unreadCount > 0 && <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />}
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {pagedNotifications.length > 0 ? (
          pagedNotifications.map((notification) => {
            const config = configByType[notification.type] || configByType.DEFAULT

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
                    {formatNotificationMessage(notification)}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400">
                    <Clock size={10} />
                    {getRelativeTime(notification.createdAt)}
                  </div>
                </div>

                <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onMarkAsRead(notification.id)
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-lg border border-emerald-50 bg-white text-emerald-500 shadow-sm transition-all hover:bg-emerald-50"
                      aria-label="تحديد كمقروء"
                    >
                      <Check size={14} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onDelete(notification.id)
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-rose-50 bg-white text-rose-500 shadow-sm transition-all hover:bg-rose-50"
                    aria-label="حذف الإشعار"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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

      {notifications.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/70 px-4 py-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            <ChevronRight size={14} />
          </button>

          <div className="text-[11px] font-black text-slate-500">
            الصفحة {page} من {totalPages}
          </div>

          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            <ChevronLeft size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
