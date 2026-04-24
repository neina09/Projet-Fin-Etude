import React, { useEffect, useMemo, useState } from "react"
import { Briefcase, ChevronLeft, ChevronRight, Filter, MapPin, Phone, Search, Star, UserRound, X } from "lucide-react"
import { createBooking, getWorkers, resolveAssetUrl } from "../api"
import WorkerCard from "./WorkerCard"

const defaultBookingForm = {
  bookingDate: "",
  address: "",
  description: ""
}

const toLocalDateTimeString = (value) => {
  if (!value) return ""
  if (value.includes("T")) return value

  const slashMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/)
  if (slashMatch) {
    const [, day, month, year, hour, minute] = slashMatch
    return `${year}-${month}-${day}T${hour}:${minute}`
  }

  return value
}

export default function WorkersSection({ currentUser }) {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [modalError, setModalError] = useState("")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("الكل")
  const [selectedWorker, setSelectedWorker] = useState(null)
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
      } catch (err) {
        setError(err.message || "تعذر تحميل قائمة الخبراء.")
      } finally {
        setLoading(false)
      }
    }

    loadWorkers()
  }, [currentPage])

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

  const handleBookingSubmit = async (event) => {
    event.preventDefault()
    if (!selectedWorker) return

    setBookingLoading(true)
    setError("")
    setSuccess("")
    setModalError("")

    try {
      if (currentUser?.id && selectedWorker?.userId && String(currentUser.id) === String(selectedWorker.userId)) {
        throw new Error("لا يمكنك حجز نفسك كعامل.")
      }

      const normalizedBookingDate = toLocalDateTimeString(bookingForm.bookingDate)

      await createBooking({
        ...bookingForm,
        bookingDate: normalizedBookingDate,
        workerId: selectedWorker.id,
        price: Number(selectedWorker.salary || 1)
      })

      setSuccess("تم إرسال الطلب بنجاح.")
      setSelectedWorker(null)
      setBookingForm(defaultBookingForm)
      setTimeout(() => setSuccess(""), 5000)
    } catch (err) {
      const message = err.message || "فشل إرسال الطلب."
      setError(message)
      setModalError(message)
    } finally {
      setBookingLoading(false)
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="pagination">
        <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="pagination-btn">
          <ChevronRight size={18} />
        </button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="pagination-btn">
          <ChevronLeft size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="page-shell" dir="rtl">
      <section className="app-page-header">
        <div className="app-page-header-row">
          <div>
            <span className="app-page-eyebrow">الخبراء</span>
            <h1 className="app-page-title mt-4">
              اكتشف <span className="text-[#1d4ed8]">الخبراء</span> المعتمدين
            </h1>
            <p className="app-page-subtitle">
              تصفح ملفات الخبراء، واعتمد على التقييم الإجمالي، ثم أرسل الطلب مباشرة من نفس النافذة.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8 overflow-hidden rounded-[20px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-[11px] font-black text-slate-500">
              <Search size={14} />
              ابحث عن خبير
            </span>
            <div className="relative">
              <Search className="field-icon field-icon-end" size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="الاسم، المهنة، أو العنوان"
                className="input input-with-icon-end !h-12 border-white bg-white shadow-sm"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-[11px] font-black text-slate-500">
              <Filter size={14} />
              التخصص
            </span>
            <div className="relative">
              <Filter className="field-icon field-icon-end" size={14} />
              <select value={filter} onChange={(event) => setFilter(event.target.value)} className="input input-with-icon-end !h-12 appearance-none border-white bg-white shadow-sm">
                {specialties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
      </section>

      {success && <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center text-xs font-bold text-emerald-600">{success}</div>}
      {error && <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-xs font-bold text-red-600">{error}</div>}

      {loading ? (
        <div className="animate-pulse py-20 text-center text-xs font-bold italic text-slate-400">جارٍ تحميل القائمة...</div>
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
        <div className="empty-state">لا يوجد خبراء يطابقون بحثك حاليًا.</div>
      )}

      {selectedWorker && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="flex items-center justify-between border-b border-slate-50 p-6">
              <div>
                <p className="t-label">ملف الخبير</p>
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
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">{selectedWorker.job || "خبير معتمد"}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                    <MapPin size={10} />
                    {selectedWorker.address || "موريتانيا"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Briefcase size={14} />
                    <span className="text-xs font-black">التخصص</span>
                  </div>
                  <p className="text-sm font-black text-slate-900">{selectedWorker.job || "غير محدد"}</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Phone size={14} />
                    <span className="text-xs font-black">الهاتف</span>
                  </div>
                  <p className="text-sm font-black text-slate-900" dir="ltr">{selectedWorker.phoneNumber || "غير متوفر"}</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Star size={14} />
                    <span className="text-xs font-black">التقييم الإجمالي</span>
                  </div>
                  <p className="text-sm font-black text-slate-900">{Number(selectedWorker.averageRating || 0).toFixed(1)}</p>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="t-label">العنوان</label>
                  <input
                    value={bookingForm.address}
                    onChange={(event) => setBookingForm((current) => ({ ...current, address: event.target.value }))}
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
                    onChange={(event) => setBookingForm((current) => ({ ...current, bookingDate: event.target.value }))}
                    className="input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="t-label">تفاصيل الطلب</label>
                  <textarea
                    value={bookingForm.description}
                    onChange={(event) => setBookingForm((current) => ({ ...current, description: event.target.value }))}
                    className="input h-24 resize-none"
                    required
                    placeholder="اشرح المهمة المطلوبة..."
                  />
                </div>
                <button type="submit" disabled={bookingLoading} className="btn btn-primary btn-md w-full">
                  {bookingLoading ? "جارٍ الإرسال..." : "أرسل الطلب فورًا"}
                </button>

                {modalError && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-600">
                    {modalError}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
