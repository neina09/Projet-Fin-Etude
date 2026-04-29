import React, { useCallback, useEffect, useState } from "react"
import { CheckCircle2, ClipboardList } from "lucide-react"
import { getMyBookingRequests, getMyBookings, updateBookingStatus } from "../api"
import BookingHistory from "./profile/BookingHistory"
import WorkerRequestsList from "./profile/WorkerRequestsList"

const BOOKING_STATUS_ORDER = {
  IN_PROGRESS: 1,
  PENDING: 2,
  COMPLETED: 3,
  REJECTED: 4,
  CANCELLED: 5
}

export default function MyRequestsSection({ currentUser, onRefresh, onBecomeWorker, onGoToRatings }) {
  const [bookings, setBookings] = useState([])
  const [requests, setRequests] = useState([])
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [bookingsPage, setBookingsPage] = useState(1)
  const [requestsPage, setRequestsPage] = useState(1)
  const [bookingsFilter, setBookingsFilter] = useState("all")
  const [requestsFilter, setRequestsFilter] = useState("all")

  const itemsPerPage = 5
  const isWorker = currentUser?.role === "WORKER"

  const publishMessage = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg({ type: "", text: "" }), 5000)
  }

  const loadData = useCallback(async () => {
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

  const statusFilters = [
    { id: "all", label: "الكل" },
    { id: "PENDING", label: "قيد الانتظار" },
    { id: "IN_PROGRESS", label: "قيد التنفيذ" },
    { id: "COMPLETED", label: "مكتمل" },
    { id: "REJECTED", label: "مرفوض" }
  ]

  const filteredBookings = bookings.filter((booking) => (
    bookingsFilter === "all" || String(booking.status || "").toUpperCase() === bookingsFilter
  )).sort((a, b) => {
    const statusA = String(a.status || "").toUpperCase()
    const statusB = String(b.status || "").toUpperCase()
    const statusDelta = (BOOKING_STATUS_ORDER[statusA] || 99) - (BOOKING_STATUS_ORDER[statusB] || 99)
    if (statusDelta !== 0) return statusDelta

    return new Date(b.bookingDate || 0).getTime() - new Date(a.bookingDate || 0).getTime()
  })

  const filteredRequests = requests.filter((request) => (
    requestsFilter === "all" || String(request.status || "").toUpperCase() === requestsFilter
  )).sort((a, b) => {
    const statusA = String(a.status || "").toUpperCase()
    const statusB = String(b.status || "").toUpperCase()
    const statusDelta = (BOOKING_STATUS_ORDER[statusA] || 99) - (BOOKING_STATUS_ORDER[statusB] || 99)
    if (statusDelta !== 0) return statusDelta

    return new Date(b.bookingDate || 0).getTime() - new Date(a.bookingDate || 0).getTime()
  })

  return (
    <div className="page-shell mx-auto max-w-7xl" dir="rtl">
      <section className="app-page-header">
        <div className="app-page-header-row">
          <div>
            <span className="app-page-eyebrow">
              <ClipboardList size={14} />
              إدارة الطلبات
            </span>
            <h1 className="app-page-title mt-4">
              سجل <span className="text-[#1d4ed8]">الطلبات</span> والحجوزات
            </h1>
            <p className="app-page-subtitle">
              تابع حالة حجوزاتك وطلبات العملاء من مكان واحد، وبنفس أسلوب العرض الموحد في باقي الصفحات.
            </p>
          </div>
        </div>
      </section>

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
              <h2 className="app-panel-title">طلبات العملاء الواردة</h2>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              {statusFilters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setRequestsFilter(item.id)
                    setRequestsPage(1)
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                    requestsFilter === item.id
                      ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <WorkerRequestsList
              requests={filteredRequests.slice((requestsPage - 1) * itemsPerPage, requestsPage * itemsPerPage)}
              totalItems={filteredRequests.length}
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
            <h2 className="app-panel-title">الحجوزات الشخصية</h2>
          </div>
          <BookingHistory
            bookings={filteredBookings.slice((bookingsPage - 1) * itemsPerPage, bookingsPage * itemsPerPage)}
            totalItems={filteredBookings.length}
            currentPage={bookingsPage}
            onPageChange={setBookingsPage}
            itemsPerPage={itemsPerPage}
            handleBookingAction={handleBookingAction}
            isWorker={isWorker}
            onBecomeWorker={onBecomeWorker}
            bookingsFilter={bookingsFilter}
            setBookingsFilter={setBookingsFilter}
            statusFilters={statusFilters}
            onGoToRatings={onGoToRatings}
          />
        </section>
      </div>
    </div>
  )
}
