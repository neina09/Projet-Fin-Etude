import React from "react"
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Star, Wallet, Wrench } from "lucide-react"

const STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  ACCEPTED: "مقبول",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
  CANCELLED: "ملغي"
}

const SECTION_TITLES = {
  today: "حجوزات اليوم",
  future: "الحجوزات القادمة",
  past: "السجل السابق"
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
  if (status === "PENDING") return "badge-primary"
  if (status === "COMPLETED") return "badge-green"
  if (status === "ACCEPTED") return "badge-amber"
  return "badge-secondary"
}

export default function BookingHistory({
  bookings,
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage,
  ratingForm,
  updateRatingField,
  handleRateWorker,
  handleBookingAction,
  onBecomeWorker,
  isWorker
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const groupedBookings = groupBookingsByDate(bookings)
  const completedUnratedBookings = bookings.filter((booking) => {
    const bookingStatus = String(booking.status || "").toUpperCase()
    const isRated = Boolean(booking.isRated ?? booking.rated)
    return bookingStatus === "COMPLETED" && !isRated
  })

  return (
    <section className="mt-8" dir="rtl">
      <div className="card-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wrench size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">حجوزاتي وسجل التعامل</h2>
            <p className="t-label italic">الحجوزات مقسمة إلى اليوم والقادم والسجل السابق مع تفاصيل كاملة.</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4 text-[11px] font-bold text-primary">
          {completedUnratedBookings.length
            ? `لديك ${completedUnratedBookings.length} حجز مكتمل بانتظار تقييمك. ستجد نموذج التقييم داخل بطاقة الحجز المكتمل.`
            : "سيظهر نموذج تقييم العامل هنا مباشرة بعد اكتمال أي حجز لم يتم تقييمه بعد."}
        </div>

        {!isWorker && (
          <>
            <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-[11px] font-bold text-amber-900">
              إذا قررت أن تصبح عاملًا، يجب أن يقبل المدير طلبك أولًا قبل أن يظهر ملفك في المنصة.
            </div>

            <button
              type="button"
              onClick={onBecomeWorker}
              className="btn btn-primary btn-md mb-8"
            >
              انضم كعامل الآن
            </button>
          </>
        )}

        <div className="space-y-6">
          {bookings.length ? (
            ["today", "future", "past"].map((sectionKey) => {
              const sectionItems = groupedBookings[sectionKey]
              if (!sectionItems.length) return null

              return (
                <section key={sectionKey} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900">{SECTION_TITLES[sectionKey]}</h3>
                    <span className="badge badge-secondary">{sectionItems.length}</span>
                  </div>

                  {sectionItems.map((booking) => {
                    const bookingStatus = String(booking.status || "").toUpperCase()
                    const isCompleted = bookingStatus === "COMPLETED"
                    const isRated = Boolean(booking.isRated ?? booking.rated)
                    const ratingValues = ratingForm[booking.id] || { stars: 0, comment: "" }

                    return (
                      <div key={booking.id} className="card space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-xs font-black text-blue-700">
                                {booking.workerImageUrl ? (
                                  <img src={booking.workerImageUrl} alt={booking.workerName || "عامل"} className="h-full w-full rounded-2xl object-cover" />
                                ) : (
                                  booking.workerName?.[0] || "ع"
                                )}
                              </div>
                              <div>
                                <h3 className="text-sm font-black text-slate-900">{booking.workerName || "عامل"}</h3>
                                <p className="t-label">{booking.workerJob || "خدمة عامة"}</p>
                              </div>
                            </div>
                            <p className="text-xs font-bold leading-relaxed text-slate-600">
                              {booking.description || "طلب خدمة"}
                            </p>
                          </div>

                          <span className={`badge ${getStatusBadgeClass(bookingStatus)}`}>
                            {STATUS_LABELS[bookingStatus] || bookingStatus}
                          </span>
                        </div>

                        <div className="grid gap-3 text-[11px] font-bold text-slate-500 sm:grid-cols-2">
                          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                            <CalendarDays size={14} className="text-blue-600" />
                            {formatDateTime(booking.bookingDate)}
                          </div>
                          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
                            <Wallet size={14} className="text-emerald-600" />
                            {formatPrice(booking.price)}
                          </div>
                          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 sm:col-span-2">
                            <MapPin size={14} className="text-rose-500" />
                            {booking.address || "العنوان غير متوفر"}
                          </div>
                        </div>

                        {isCompleted && !isRated && (
                          <div className="card mt-2">
                            <div className="mb-4 flex items-center gap-2 t-label">
                              <Star size={14} className="text-amber-500" />
                              قيّم تجربة العمل
                            </div>

                            <div className="mb-4 flex gap-2">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => updateRatingField(booking.id, "stars", value)}
                                  className={`h-10 w-10 rounded-xl text-xs font-black transition-all ${
                                    ratingValues.stars >= value
                                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                                      : "border border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                  }`}
                                >
                                  {value}
                                </button>
                              ))}
                            </div>

                            <textarea
                              value={ratingValues.comment}
                              onChange={(event) => updateRatingField(booking.id, "comment", event.target.value)}
                              rows={3}
                              placeholder="اكتب ملاحظتك حول جودة العمل..."
                              className="input min-h-[100px] resize-none"
                            />

                            <button
                              type="button"
                              onClick={() => handleRateWorker(booking.id)}
                              className="btn btn-primary btn-md mt-4 w-full"
                            >
                              <Star size={14} />
                              إرسال التقييم النهائي
                            </button>
                          </div>
                        )}

                        {isCompleted && isRated && (
                          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-[10px] font-black italic text-emerald-800">
                            تم تقييم هذا الحجز بنجاح. شكرًا لك!
                          </div>
                        )}

                        {bookingStatus === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleBookingAction(booking.id, "cancel")}
                            className="btn btn-secondary btn-sm mt-1"
                          >
                            إلغاء الحجز
                          </button>
                        )}

                        {bookingStatus !== "PENDING" && !isCompleted && (
                          <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
                            <Clock3 size={14} />
                            هذا الحجز محفوظ ضمن السجل ويمكن الرجوع لتفاصيله في أي وقت.
                          </div>
                        )}
                      </div>
                    )
                  })}
                </section>
              )
            })
          ) : (
            <div className="empty-state">
              <p className="t-label italic">لا توجد حجوزات حتى الآن.</p>
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
              <ChevronRight size={16} />
            </button>

            <div className="t-label px-3">
              الصفحة {currentPage} من {totalPages}
            </div>

            <button
              onClick={() => onPageChange((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
