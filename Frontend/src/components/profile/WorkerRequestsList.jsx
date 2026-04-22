import React from "react"
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Wallet, Wrench } from "lucide-react"

const STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  ACCEPTED: "مقبول",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
  CANCELLED: "ملغي"
}

const SECTION_TITLES = {
  today: "طلبات اليوم",
  future: "الطلبات القادمة",
  past: "السجل السابق"
}

const toDateKey = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

const groupRequestsByDate = (requests) => {
  const now = new Date()
  const todayKey = toDateKey(now)

  return requests.reduce(
    (groups, request) => {
      const requestDate = new Date(request.bookingDate)
      if (Number.isNaN(requestDate.getTime())) {
        groups.future.push(request)
        return groups
      }

      const requestKey = toDateKey(requestDate)
      if (requestKey === todayKey) {
        groups.today.push(request)
        return groups
      }

      if (requestDate > now) {
        groups.future.push(request)
        return groups
      }

      groups.past.push(request)
      return groups
    },
    { today: [], future: [], past: [] }
  )
}

const formatDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "غير محدد"
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date)
}

const formatPrice = (value) => {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return "غير محدد"
  return `${amount} أوقية`
}

const getStatusBadgeClass = (status) => {
  if (status === "PENDING") return "badge-amber"
  if (status === "ACCEPTED") return "badge-primary"
  if (status === "COMPLETED") return "badge-green"
  return "badge-secondary"
}

export default function WorkerRequestsList({
  requests,
  handleBookingAction,
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const groupedRequests = groupRequestsByDate(requests)
  const sectionOrder = ["today", "future", "past"]

  return (
    <div className="card-lg flex h-full flex-col" dir="rtl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Wrench size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">طلبات العملاء وسجلها</h2>
          <p className="t-label italic">ستجد طلبات اليوم والقادمة والسجل السابق مع نفس مستوى التفاصيل.</p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {requests.length ? (
          sectionOrder.map((sectionKey) => {
            const sectionItems = groupedRequests[sectionKey]
            if (!sectionItems.length) return null

            return (
              <section key={sectionKey} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">{SECTION_TITLES[sectionKey]}</h3>
                  <span className="badge badge-secondary">{sectionItems.length}</span>
                </div>

                {sectionItems.map((request) => {
                  const bookingStatus = String(request.status || "").toUpperCase()

                  return (
                    <div key={request.id} className="card space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-xs font-black text-blue-700">
                              {request.userImageUrl ? (
                                <img src={request.userImageUrl} alt={request.userName || "عميل"} className="h-full w-full rounded-2xl object-cover" />
                              ) : (
                                request.userName?.[0] || "ع"
                              )}
                            </div>
                            <div>
                              <h3 className="text-sm font-black text-slate-900">{request.userName || "عميل"}</h3>
                              <p className="t-label">طلب رقم #{request.id}</p>
                            </div>
                          </div>
                          <p className="text-xs font-bold leading-relaxed text-slate-600">
                            {request.description || "طلب خدمة"}
                          </p>
                        </div>

                        <span className={`badge ${getStatusBadgeClass(bookingStatus)}`}>
                          {STATUS_LABELS[bookingStatus] || bookingStatus}
                        </span>
                      </div>

                      <div className="grid gap-3 text-[11px] font-bold text-slate-500 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                          <CalendarDays size={14} className="text-blue-600" />
                          {formatDateTime(request.bookingDate)}
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                          <Wallet size={14} className="text-emerald-600" />
                          {formatPrice(request.price)}
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 sm:col-span-2">
                          <MapPin size={14} className="text-rose-500" />
                          {request.address || "العنوان غير متوفر"}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {bookingStatus === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleBookingAction(request.id, "accept")}
                              className="btn btn-primary btn-sm"
                            >
                              قبول الطلب
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBookingAction(request.id, "reject")}
                              className="btn btn-secondary btn-sm"
                            >
                              رفض
                            </button>
                          </>
                        )}

                        {bookingStatus === "ACCEPTED" && (
                          <button
                            type="button"
                            onClick={() => handleBookingAction(request.id, "complete")}
                            className="btn btn-primary btn-sm bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700"
                          >
                            إنهاء العمل
                          </button>
                        )}

                        {bookingStatus !== "PENDING" && bookingStatus !== "ACCEPTED" && (
                          <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
                            <Clock3 size={14} />
                            هذا الطلب محفوظ في السجل للرجوع إليه لاحقًا.
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </section>
            )
          })
        ) : (
          <div className="empty-state">
            <p className="t-label italic">لا توجد طلبات عمل حاليًا.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <ChevronRight size={14} />
          </button>

          <div className="t-label px-2">
            {currentPage} من {totalPages}
          </div>

          <button
            onClick={() => onPageChange((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <ChevronLeft size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
