import React, { useCallback, useEffect, useState } from "react"
import { CheckCircle2, ShieldCheck, ClipboardList } from "lucide-react"
import {
  getMyBookingRequests,
  getMyBookings,
  updateBookingStatus,
  createRating
} from "../api"

import BookingHistory from "./profile/BookingHistory"
import WorkerRequestsList from "./profile/WorkerRequestsList"

export default function MyRequestsSection({ currentUser, onRefresh, onBecomeWorker }) {
  const [bookings, setBookings] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [bookingsPage, setBookingsPage] = useState(1)
  const [requestsPage, setRequestsPage] = useState(1)
  const [ratingForm, setRatingForm] = useState({})

  const itemsPerPage = 5
  const isWorker = currentUser?.role === "WORKER"

  const publishMessage = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg({ type: "", text: "" }), 5000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [bookingsResult, requestsResult] = await Promise.allSettled([
        getMyBookings(),
        isWorker ? getMyBookingRequests() : Promise.resolve([])
      ])

      if (bookingsResult.status === "fulfilled") {
        setBookings(Array.isArray(bookingsResult.value) ? bookingsResult.value : [])
      }

      if (requestsResult.status === "fulfilled") {
        setRequests(Array.isArray(requestsResult.value) ? requestsResult.value : [])
      }
    } catch (err) {
      console.error("Failed to load requests", err)
    } finally {
      setLoading(false)
    }
  }, [isWorker])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleBookingAction = async (bookingId, action) => {
    try {
      await updateBookingStatus(bookingId, action)
      publishMessage("success", "تم تحديث حالة الحجز بنجاح.")
      await loadData()
      await onRefresh?.()
    } catch (err) {
      publishMessage("error", err.message)
    }
  }

  const handleRateWorker = async (bookingId) => {
    const payload = ratingForm[bookingId]
    if (!payload?.stars) {
      publishMessage("error", "اختر عدد النجوم قبل إرسال التقييم.")
      return
    }

    try {
      await createRating(bookingId, {
        stars: payload.stars,
        comment: payload.comment || ""
      })
      publishMessage("success", "تم إرسال تقييم العامل بنجاح.")
      setRatingForm((current) => {
        const next = { ...current }
        delete next[bookingId]
        return next
      })
      await loadData()
      await onRefresh?.()
    } catch (err) {
      publishMessage("error", err.message)
    }
  }

  return (
    <div className="page-shell mx-auto max-w-7xl" dir="rtl">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-6 badge badge-blue gap-2 px-4 py-1.5">
          <ClipboardList size={16} />
          إدارة الطلبات
        </div>

        <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          سجل <span className="text-[#1d4ed8]">الطلبات</span> والحجوزات
        </h1>

        <p className="max-w-2xl text-sm font-bold leading-relaxed text-slate-500 md:text-base">
          تابع حالة حجوزاتك وطلبات العملاء وإدارتها بكل سهولة من مكان واحد.
        </p>
      </div>

      {msg.text && (
        <div className={`mb-8 flex items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-center text-sm font-bold ${
          msg.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
        }`}>
          <CheckCircle2 size={18} />
          {msg.text}
        </div>
      )}

      <div className="space-y-10">
        {isWorker && (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <h2 className="text-xl font-black text-slate-900">طلبات العملاء الواردة</h2>
            </div>
            <WorkerRequestsList
              requests={requests.slice((requestsPage - 1) * itemsPerPage, requestsPage * itemsPerPage)}
              totalItems={requests.length}
              currentPage={requestsPage}
              onPageChange={setRequestsPage}
              itemsPerPage={itemsPerPage}
              handleBookingAction={handleBookingAction}
            />
          </section>
        )}

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-600" />
            <h2 className="text-xl font-black text-slate-900">حجوزاتي الشخصية</h2>
          </div>
          <BookingHistory
            bookings={bookings.slice((bookingsPage - 1) * itemsPerPage, bookingsPage * itemsPerPage)}
            totalItems={bookings.length}
            currentPage={bookingsPage}
            onPageChange={setBookingsPage}
            itemsPerPage={itemsPerPage}
            ratingForm={ratingForm}
            updateRatingField={(id, field, value) => setRatingForm((current) => ({ ...current, [id]: { ...current[id], [field]: value } }))}
            handleRateWorker={handleRateWorker}
            handleBookingAction={handleBookingAction}
            isWorker={isWorker}
            onBecomeWorker={onBecomeWorker}
          />
        </section>
      </div>
    </div>
  )
}
