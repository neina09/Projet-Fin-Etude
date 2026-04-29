import React from "react"
import { ChevronLeft, ChevronRight, Clock3, MapPin, Star, Trash2, Wallet, Wrench } from "lucide-react"

const STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
  CANCELLED: "ملغي"
}

const STATUS_CONFIG = {
  PENDING: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-400" },
  IN_PROGRESS: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" },
  COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  REJECTED: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-400" },
  CANCELLED: { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" }
}

const SECTION_TITLES = {
  today: "حجوزات اليوم",
  future: "الحجوزات القادمة",
  past: "السجل السابق"
}

const SECTION_COLORS = {
  today: "text-blue-600 bg-blue-50 border-blue-100",
  future: "text-violet-600 bg-violet-50 border-violet-100",
  past: "text-slate-500 bg-slate-50 border-slate-200"
}

const toDateKey = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

const groupBookingsByDate = (bookings) => {
  const now = new Date()
  const todayKey = toDateKey(now)

  return bookings.reduce(
    (groups, booking) => {
      const bookingDate = new Date(booking.bookingDate)
      if (Number.isNaN(bookingDate.getTime())) {
        groups.future.push(booking)
        return groups
      }

      const bookingKey = toDateKey(bookingDate)
      if (bookingKey === todayKey) {
        groups.today.push(booking)
        return groups
      }

      if (bookingDate > now) {
        groups.future.push(booking)
        return groups
      }

      groups.past.push(booking)
      return groups
    },
    { today: [], future: [], past: [] }
  )
}

const formatDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "غير محدد"
  return new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

const formatPrice = (value) => {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return "غير محدد"
  return `${amount} أوقية`
}

export default function BookingHistory({
  bookings,
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage,
  handleBookingAction,
  onBecomeWorker,
  isWorker,
  bookingsFilter,
  setBookingsFilter,
  statusFilters,
  onGoToRatings
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const groupedBookings = groupBookingsByDate(bookings)
  const completedUnratedBookings = bookings.filter((booking) => (
    String(booking.status || "").toUpperCase() === "COMPLETED" && !(booking.isRated ?? booking.rated)
  ))

  return (
    <section className="mt-8" dir="rtl">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <Wrench size={18} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">حجوزاتي وسجل التعامل</h2>
            <p className="mt-0.5 text-[11px] text-slate-400">الحجوزات مقسمة إلى اليوم والقادم والسجل السابق مع تفاصيل كاملة.</p>
          </div>
        </div>

        <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-[11px] font-semibold text-blue-700">
          <span>
            {completedUnratedBookings.length
              ? `لديك ${completedUnratedBookings.length} حجز مكتمل بانتظار تقييمك. يتم تقييم هذا العمل مباشرة من صفحة التقييمات.`
              : "عند اكتمال أي حجز غير مقيم، ستجد رابطًا مباشرًا للانتقال إلى صفحة التقييمات."}
          </span>
          {onGoToRatings && (
            <button
              type="button"
              onClick={onGoToRatings}
              className="mr-2 inline-flex rounded-lg bg-white px-3 py-1 text-[11px] font-bold text-blue-700 transition hover:bg-blue-100"
            >
              انتقل إلى التقييمات
            </button>
          )}
        </div>

        {!isWorker && (
          <div className="mb-6 space-y-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-[11px] font-semibold text-amber-800">
              إذا قررت أن تصبح عاملًا، يجب أن يقبل المدير طلبك أولًا قبل أن يظهر ملفك في المنصة.
            </p>
            <button
              type="button"
              onClick={onBecomeWorker}
              className="flex h-9 items-center justify-center rounded-xl bg-amber-500 px-5 text-xs font-bold text-white transition hover:bg-amber-600"
            >
              انضم كعامل الآن
            </button>
          </div>
        )}

        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setBookingsFilter(item.id)
                  onPageChange(1)
                }}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-black transition-all ${
                  bookingsFilter === item.id
                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {bookings.length ? (
            ["today", "future", "past"].map((sectionKey) => {
              const sectionItems = groupedBookings[sectionKey]
              if (!sectionItems.length) return null

              return (
                <section key={sectionKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${SECTION_COLORS[sectionKey]}`}>
                      {SECTION_TITLES[sectionKey]}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      {sectionItems.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {sectionItems.map((booking) => {
                      const bookingStatus = String(booking.status || "").toUpperCase()
                      const isCompleted = bookingStatus === "COMPLETED"
                      const isRated = Boolean(booking.isRated ?? booking.rated)
                      const cfg = STATUS_CONFIG[bookingStatus] || STATUS_CONFIG.CANCELLED

                      return (
                        <article
                          key={booking.id}
                          className="relative flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                        >
                          <div className={`absolute bottom-4 right-0 top-4 w-[3px] rounded-full ${cfg.dot}`} />

                          <div className="flex items-start justify-between gap-2 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
                                {booking.workerImageUrl ? (
                                  <img src={booking.workerImageUrl} alt={booking.workerName || "عامل"} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-sm font-extrabold text-slate-400">{booking.workerName?.[0] || "ع"}</span>
                                )}
                              </div>
                              <div>
                                <p className="text-[12px] font-bold text-slate-800">{booking.workerName || "عامل"}</p>
                                <p className="text-[10px] text-slate-400">{formatDateTime(booking.bookingDate)}</p>
                              </div>
                            </div>

                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                              {STATUS_LABELS[bookingStatus] || bookingStatus}
                            </span>
                          </div>

                          <div className="pr-3">
                            <p className="text-[12px] font-bold text-slate-700">{booking.workerJob || "خدمة عامة"}</p>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{booking.description || "طلب خدمة"}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-50 pt-3 pr-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">
                                <MapPin size={9} className="text-blue-400" />
                                {booking.address || "غير متوفر"}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600">
                                <Wallet size={9} />
                                {formatPrice(booking.price)}
                              </span>
                            </div>

                            {bookingStatus === "PENDING" && (
                              <button
                                type="button"
                                onClick={() => handleBookingAction(booking.id, "cancel")}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          {isCompleted && !isRated && (
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                              <p className="text-[11px] font-bold leading-relaxed text-emerald-700">
                                يتم تقييم هذا العمل من صفحة التقييمات.
                              </p>
                              {onGoToRatings && (
                                <button
                                  type="button"
                                  onClick={onGoToRatings}
                                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-emerald-700"
                                >
                                  <Star size={12} fill="currentColor" />
                                  اذهب إلى التقييمات
                                </button>
                              )}
                            </div>
                          )}

                          {isCompleted && isRated && (
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-[10px] font-semibold text-emerald-700">
                              تم تقييم هذا الحجز بنجاح. شكرًا لك!
                            </div>
                          )}

                          {bookingStatus !== "PENDING" && !isCompleted && (
                            <div className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[10px] text-slate-400">
                              <Clock3 size={11} />
                              هذا الحجز محفوظ ضمن السجل.
                            </div>
                          )}
                        </article>
                      )
                    })}
                  </div>
                </section>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-300">
              لا توجد حجوزات حتى الآن.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3 border-t border-slate-50 pt-6">
            <button
              onClick={() => onPageChange((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600 disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
            <span className="text-xs font-bold text-slate-500">
              الصفحة {currentPage} من {totalPages}
            </span>
            <button
              onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600 disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
