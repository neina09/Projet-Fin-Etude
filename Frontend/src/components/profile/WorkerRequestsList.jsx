import React from "react"
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Wallet, Wrench } from "lucide-react"

const STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  IN_PROGRESS: "قيد التنفيذ",
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
  if (status === "IN_PROGRESS") return "badge-primary"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionItems.map((request) => {
                    const bookingStatus = String(request.status || "").toUpperCase()

                    return (
                      <article key={request.id} className="card w-full p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-900 shadow-sm">
                                {request.userImageUrl ? (
                                  <img src={request.userImageUrl} alt={request.userName || "عميل"} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-[11px] font-black text-white/40">{request.userName?.[0] || "ع"}</span>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <h4 className="flex items-center gap-1.5 text-[11px] font-black text-slate-800">
                                  {request.userName || "عميل"}
                                </h4>
                                <p className="t-label mt-0 text-[9px]">{formatDateTime(request.bookingDate)}</p>
                              </div>
                            </div>

                            <span className={`badge py-0.5 px-2 text-[9px] ${getStatusBadgeClass(bookingStatus)}`}>
                              {STATUS_LABELS[bookingStatus] || bookingStatus}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <h3 className="text-xs font-black leading-snug text-slate-900">طلب خدمة رقم #{request.id}</h3>
                            <div className="text-[11px] leading-relaxed text-slate-600">
                              {request.description || "طلب خدمة"}
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between border-t border-slate-50 pt-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <div className="badge badge-neutral py-0.5 px-1.5 text-[8px] italic">
                                <MapPin size={8} className="text-blue-600" />
                                {request.address || "العنوان غير متوفر"}
                              </div>
                              <div className="badge badge-primary py-0.5 px-1.5 text-[8px]">
                                <Wallet size={8} className="ml-1" />
                                {formatPrice(request.price)}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {bookingStatus === "PENDING" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleBookingAction(request.id, "accept")}
                                    className="h-6 rounded-lg bg-primary px-3 text-[9px] font-black text-white hover:bg-primary/90"
                                  >
                                    قبول
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleBookingAction(request.id, "reject")}
                                    className="text-[8px] font-black text-rose-400 hover:text-rose-600 hover:underline"
                                    style={{ padding: '2px 4px' }}
                                  >
                                    رفض
                                  </button>
                                </>
                              )}

                              {bookingStatus === "IN_PROGRESS" && (
                                <button
                                  type="button"
                                  onClick={() => handleBookingAction(request.id, "complete")}
                                  className="h-6 rounded-lg bg-emerald-600 px-3 text-[9px] font-black text-white hover:bg-emerald-700"
                                >
                                  إنهاء العمل
                                </button>
                              )}
                            </div>
                          </div>

                          {request.offers?.length ? (
                            <div className="mt-2 space-y-2 border-t border-slate-50 pt-2">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">العروض المتاحة</h4>
                              {request.offers.map((offer) => (
                                <div key={offer.id} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-600">{offer.providerName || "مزود"} - {formatPrice(offer.price)}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleBookingAction(request.id, `select_${offer.id}`)}
                                    className="btn btn-primary btn-xs h-6 px-2 text-[9px]"
                                  >
                                    اختيار
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {bookingStatus !== "PENDING" && bookingStatus !== "IN_PROGRESS" && (
                            <div className="flex items-center gap-2 rounded-xl border border-slate-50 bg-slate-50/50 px-3 py-2 text-[9px] font-bold text-slate-400">
                              <Clock3 size={12} />
                              هذا الطلب محفوظ في السجل.
                            </div>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
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
