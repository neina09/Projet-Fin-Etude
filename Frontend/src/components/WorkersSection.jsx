import React, { useEffect, useMemo, useState } from "react"
import { Filter, MapPin, Search, UserRound, X, ChevronRight, ChevronLeft } from "lucide-react"
import { createBooking, getWorkerRatings, getWorkers, resolveAssetUrl } from "../api"
import WorkerCard from "./WorkerCard"

const defaultBookingForm = {
  bookingDate: "",
  address: "",
  description: ""
}

export default function WorkersSection() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("الكل")
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [ratings, setRatings] = useState([])
  const [ratingsLoading, setRatingsLoading] = useState(false)
  const [bookingForm, setBookingForm] = useState(defaultBookingForm)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 8

  useEffect(() => {
    const loadWorkers = async () => {
      setLoading(true)
      try {
        const payload = await getWorkers(currentPage - 1, itemsPerPage)
        setWorkers(payload.content || [])
        setTotalPages(payload.totalPages || 0)
      } catch {
        setError("تعذر تحميل قائمة العمال.")
      } finally {
        setLoading(false)
      }
    }

    loadWorkers()
  }, [currentPage])

  useEffect(() => {
    if (!selectedWorker?.id) {
      setRatings([])
      return
    }

    const loadRatings = async () => {
      setRatingsLoading(true)
      try {
        const payload = await getWorkerRatings(selectedWorker.id)
        setRatings(Array.isArray(payload) ? payload : [])
      } catch {
        setRatings([])
      } finally {
        setRatingsLoading(false)
      }
    }

    loadRatings()
  }, [selectedWorker?.id])

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const name = worker.name || ""
      const job = worker.job || ""
      const address = worker.address || ""
      const normalizedSearch = search.toLowerCase()
      const matchesSearch =
        !search ||
        name.toLowerCase().includes(normalizedSearch) ||
        job.toLowerCase().includes(normalizedSearch) ||
        address.toLowerCase().includes(normalizedSearch)
      const matchesFilter = filter === "الكل" || job === filter
      return matchesSearch && matchesFilter
    })
  }, [workers, search, filter])

  const specialties = useMemo(() => {
    const items = workers.map((worker) => worker.job).filter(Boolean)
    return ["الكل", ...new Set(items)]
  }, [workers])

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!selectedWorker) return

    setBookingLoading(true)
    try {
      await createBooking({
        ...bookingForm,
        workerId: selectedWorker.id,
        price: Number(selectedWorker.salary || 1)
      })
      setSuccess("تم إرسال الطلب بنجاح.")
      setSelectedWorker(null)
      setBookingForm(defaultBookingForm)
      setTimeout(() => setSuccess(""), 5000)
    } catch {
      setError("فشل إرسال الطلب.")
    } finally {
      setBookingLoading(false)
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null
    return (
      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="pagination-btn">
          <ChevronRight size={18} />
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="pagination-btn">
          <ChevronLeft size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="page-shell" dir="rtl">
      <div className="card-lg mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900">سوق العمال</h2>
          <p className="t-label">تصفح المحترفين المعتمدين</p>
        </div>
        <div className="flex max-w-2xl flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن عامل..." className="input !h-11 pr-10" />
          </div>
          <div className="relative min-w-[160px]">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input !h-11 appearance-none pr-9">
              {specialties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {success && <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center text-xs font-bold text-emerald-600">{success}</div>}
      {error && <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-xs font-bold text-red-600">{error}</div>}

      {loading ? (
        <div className="py-20 text-center text-xs font-bold italic text-slate-400 animate-pulse">جاري تحميل القائمة...</div>
      ) : filteredWorkers.length ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} onViewDetails={() => setSelectedWorker(worker)} />
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <div className="empty-state">لا يوجد عمال يطابقون بحثك حاليًا.</div>
      )}

      {selectedWorker && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="flex items-center justify-between border-b border-slate-50 p-6">
              <div>
                <p className="t-label">ملف العامل</p>
                <h3 className="text-lg font-black text-slate-900">{selectedWorker.name}</h3>
              </div>
              <button onClick={() => setSelectedWorker(null)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-100 bg-white">
                  {selectedWorker.imageUrl ? (
                    <img src={resolveAssetUrl(selectedWorker.imageUrl)} className="h-full w-full object-cover" alt={selectedWorker.name} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-200">
                      <UserRound size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{selectedWorker.job || "عامل مكلّف"}</p>
                  <p className="t-label mt-1 flex items-center gap-1">
                    <MapPin size={10} />
                    {selectedWorker.address || "موريتانيا"}
                  </p>
                </div>
              </div>

              {ratingsLoading ? (
                <div className="text-center text-xs font-bold text-slate-400">جاري تحميل التقييمات...</div>
              ) : ratings.length > 0 ? (
                <div className="space-y-2">
                  {ratings.slice(0, 3).map((rating) => (
                    <div key={rating.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">{rating.userName || "عميل"}</span>
                        <span className="text-xs font-black text-amber-500">{rating.stars} ★</span>
                      </div>
                      <p className="text-xs font-bold text-slate-500">{rating.comment || "لا يوجد تعليق."}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="t-label">العنوان</label>
                  <input
                    value={bookingForm.address}
                    onChange={(e) => setBookingForm((p) => ({ ...p, address: e.target.value }))}
                    className="input"
                    required
                    placeholder="مثال: تفرغ زينة، نواكشوط"
                  />
                </div>
                <div className="space-y-2">
                  <label className="t-label">التاريخ والوقت المتوقع</label>
                  <input
                    type="datetime-local"
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm((p) => ({ ...p, bookingDate: e.target.value }))}
                    className="input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="t-label">التفاصيل المطلوبة</label>
                  <textarea
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm((p) => ({ ...p, description: e.target.value }))}
                    className="input h-24 resize-none"
                    required
                    placeholder="اشرح المهمة المطلوبة..."
                  />
                </div>
                <button type="submit" disabled={bookingLoading} className="btn btn-primary btn-md w-full">
                  {bookingLoading ? "جاري الإرسال..." : "أرسل الطلب فورًا"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
