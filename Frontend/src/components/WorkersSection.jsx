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
  const [workers, setWorkers]               = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState("")
  const [success, setSuccess]               = useState("")
  const [modalError, setModalError]         = useState("")
  const [search, setSearch]                 = useState("")
  const [filter, setFilter]                 = useState("الكل")
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [bookingForm, setBookingForm]       = useState(defaultBookingForm)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [currentPage, setCurrentPage]       = useState(1)
  const [totalPages, setTotalPages]         = useState(0)
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
      const name    = worker.name    || ""
      const job     = worker.job     || ""
      const address = worker.address || ""
      const q = search.toLowerCase()
      const matchesSearch =
        !search ||
        name.toLowerCase().includes(q) ||
        job.toLowerCase().includes(q)  ||
        address.toLowerCase().includes(q)
      const matchesFilter = filter === "الكل" || job === filter
      return matchesSearch && matchesFilter
    })
  }, [workers, search, filter])

  const specialties = useMemo(() => {
    const items = workers.map((w) => w.job).filter(Boolean)
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
      if (currentUser?.id && selectedWorker?.userId && String(currentUser.id) === String(selectedWorker.userId))
        throw new Error("لا يمكنك حجز نفسك كعامل.")
      await createBooking({
        ...bookingForm,
        bookingDate: toLocalDateTimeString(bookingForm.bookingDate),
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
      <div className="mt-8 flex items-center justify-center gap-1.5" dir="rtl">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`h-9 min-w-[36px] rounded-xl border px-3 text-xs font-bold transition ${
              currentPage === i + 1
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="page-shell" dir="rtl">

      {/* ── Header ── */}
      <section className="mb-8">
        <span className="app-page-eyebrow">الخبراء</span>
        <h1 className="app-page-title mt-4">
          اكتشف <span className="text-blue-600">الخبراء</span> المعتمدين
        </h1>
        <p className="app-page-subtitle">
          تصفح ملفات الخبراء، واعتمد على التقييم الإجمالي، ثم أرسل الطلب مباشرة من نفس النافذة.
        </p>
      </section>

      {/* ── Search & Filter ── */}
      <section className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px]">
          {/* Search */}
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <Search size={12} /> ابحث عن خبير
            </span>
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="الاسم، المهنة، أو العنوان"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-9 pl-3 text-sm text-slate-700 placeholder-slate-300 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Filter */}
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <Filter size={12} /> التخصص
            </span>
            <div className="relative">
              <Filter size={13} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-300" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pr-9 pl-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                {specialties.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alerts ── */}
      {success && (
        <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-xs font-bold text-emerald-600">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-500">
          {error}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="py-24 text-center text-xs font-bold italic text-slate-300">جارٍ تحميل القائمة...</div>
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
        <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center text-sm font-bold text-slate-300">
          لا يوجد خبراء يطابقون بحثك حاليًا.
        </div>
      )}

      {/* ── Modal ── */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" dir="rtl">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400">ملف الخبير</p>
                <h3 className="text-base font-extrabold text-slate-900">{selectedWorker.name}</h3>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 transition hover:bg-red-50 hover:border-red-100 hover:text-red-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-5 p-6">

              {/* Worker profile banner */}
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  {selectedWorker.imageUrl ? (
                    <img src={resolveAssetUrl(selectedWorker.imageUrl)} className="h-full w-full object-cover" alt={selectedWorker.name} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-200">
                      <UserRound size={26} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{selectedWorker.job || "خبير معتمد"}</p>
                  <p className="mt-1 flex items-center gap-1 text-[12px] text-slate-400">
                    <MapPin size={11} className="text-blue-400" />
                    {selectedWorker.address || "موريتانيا"}
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Briefcase size={14} />, label: "التخصص",          value: selectedWorker.job || "غير محدد" },
                  { icon: <Phone size={14} />,     label: "الهاتف",           value: selectedWorker.phoneNumber || "غير متوفر", ltr: true },
                  { icon: <Star size={14} />,      label: "التقييم الإجمالي", value: Number(selectedWorker.averageRating || 0).toFixed(1) },
                ].map(({ icon, label, value, ltr }) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                    <div className="mb-1.5 flex items-center justify-center gap-1 text-slate-400">
                      {icon}
                      <span className="text-[10px] font-bold">{label}</span>
                    </div>
                    <p className="text-[13px] font-extrabold text-slate-800" dir={ltr ? "ltr" : undefined}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Booking form */}
              <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-400">العنوان</label>
                  <input
                    value={bookingForm.address}
                    onChange={(e) => setBookingForm((c) => ({ ...c, address: e.target.value }))}
                    required
                    placeholder="مثال: تفرغ زينة، نواكشوط"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 placeholder-slate-300 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-400">التاريخ والوقت المتوقع</label>
                  <input
                    type="datetime-local"
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm((c) => ({ ...c, bookingDate: e.target.value }))}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-400">تفاصيل الطلب</label>
                  <textarea
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm((c) => ({ ...c, description: e.target.value }))}
                    required
                    rows={3}
                    placeholder="اشرح المهمة المطلوبة..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-300 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bookingLoading ? "جارٍ الإرسال..." : "أرسل الطلب فورًا"}
                </button>

                {modalError && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-500">
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