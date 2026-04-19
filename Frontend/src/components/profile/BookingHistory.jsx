import React from "react"
import { Star, Wrench } from "lucide-react"

const STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  ACCEPTED: "مقبول",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
  CANCELLED: "ملغي"
}

const inputArea =
  "min-h-[96px] w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"

export default function BookingHistory({
  bookings,
  ratingForm,
  updateRatingField,
  handleRateWorker,
  handleBookingAction,
  onBecomeWorker
}) {
  const completedUnratedBookings = bookings.filter((booking) => {
    const bookingStatus = String(booking.status || "").toUpperCase()
    const isRated = Boolean(booking.isRated ?? booking.rated)
    return bookingStatus === "COMPLETED" && !isRated
  })

  return (
    <section className="mt-8" dir="rtl">
      <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1d4ed8]">
            <Wrench size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">حجوزاتي وتقييم العمال</h2>
            <p className="text-sm font-bold text-slate-500">يمكنك تقييم العامل فقط بعد اكتمال الحجز.</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/80 px-5 py-4 text-sm font-bold text-blue-800">
          {completedUnratedBookings.length
            ? `لديك ${completedUnratedBookings.length} حجز مكتمل بانتظار تقييمك. ستجد نموذج التقييم داخل بطاقة الحجز المكتمل.`
            : "سيظهر نموذج تقييم العامل هنا مباشرة بعد اكتمال أي حجز لم يتم تقييمه بعد."}
        </div>

        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-900">
          إذا قررت أن تصبح عاملًا، يجب أن يقبل المدير طلبك أولًا قبل أن يظهر ملفك في المنصة.
        </div>

        <button
          type="button"
          onClick={onBecomeWorker}
          className="mb-6 h-12 rounded-2xl bg-[#1d4ed8] px-8 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.99]"
        >
          انضم كعامل
        </button>

        <div className="space-y-4">
          {bookings.length ? (
            bookings.map((booking) => {
              const bookingStatus = String(booking.status || "").toUpperCase()
              const isCompleted = bookingStatus === "COMPLETED"
              const isRated = Boolean(booking.isRated ?? booking.rated)
              const ratingValues = ratingForm[booking.id] || { stars: 0, comment: "" }

              return (
                <div key={booking.id} className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900">{booking.workerName || "عامل"}</h3>
                      <p className="text-sm font-bold text-slate-500">
                        {booking.workerJob || "خدمة عامة"} - {booking.address}
                      </p>
                    </div>
                    <span className="rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-black text-slate-600">
                      {STATUS_LABELS[bookingStatus] || bookingStatus}
                    </span>
                  </div>

                  {isCompleted && !isRated && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
                        <Star size={16} className="text-amber-500" />
                        قيّم العامل
                      </div>

                      <div className="mb-3 flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => updateRatingField(booking.id, "stars", value)}
                            className={`rounded-xl px-3 py-2 text-sm font-black transition-all ${
                              ratingValues.stars >= value
                                ? "bg-amber-500 text-white shadow-sm"
                                : "border border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={ratingValues.comment}
                        onChange={(e) => updateRatingField(booking.id, "comment", e.target.value)}
                        rows={3}
                        placeholder="اكتب ملاحظتك حول جودة العمل..."
                        className={inputArea}
                      />

                      <button
                        type="button"
                        onClick={() => handleRateWorker(booking.id)}
                        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#1d4ed8] text-sm font-black text-white shadow-md shadow-blue-500/15 transition-all hover:bg-blue-700"
                      >
                        <Star size={16} />
                        إرسال التقييم
                      </button>
                    </div>
                  )}

                  {isCompleted && isRated && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-black text-emerald-800">
                      تم تقييم هذا الحجز بالفعل.
                    </div>
                  )}

                  {bookingStatus === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => handleBookingAction(booking.id, "cancel")}
                      className="mt-3 h-10 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition-all hover:bg-slate-50"
                    >
                      إلغاء الحجز
                    </button>
                  )}
                </div>
              )
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm font-bold text-slate-400">
              لا توجد حجوزات حتى الآن.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
