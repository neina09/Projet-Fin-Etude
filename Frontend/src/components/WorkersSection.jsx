import React, { useEffect, useMemo, useState } from "react"
import { MapPin, Search, Star, X } from "lucide-react"
import { createBooking, getWorkerRatings, getWorkers } from "../api"
import WorkerCard from "./WorkerCard"
import WorkerRequestModal from "./WorkerRequestModal"

const getProximityLabel = (workerAddress, userArea) => {
  if (!userArea.trim()) return "أدخل مكانك لمعرفة القرب"

  const normalizedWorker = workerAddress.trim().toLowerCase()
  const normalizedUser = userArea.trim().toLowerCase()

  if (!normalizedWorker) return "الموقع غير مكتمل"
  if (normalizedWorker === normalizedUser) return "قريب جدًا منك"
  if (normalizedWorker.includes(normalizedUser) || normalizedUser.includes(normalizedWorker)) return "غالبًا قريب منك"
  return "قد يكون أبعد عنك"
}

export default function WorkersSection({ currentUser }) {
  const [search, setSearch] = useState("")
  const [myArea, setMyArea] = useState("")
  const [filter, setFilter] = useState("الكل")
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [detailsWorker, setDetailsWorker] = useState(null)
  const [ratings, setRatings] = useState([])
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const canHire = currentUser?.role !== "ADMIN"

  useEffect(() => {
    const loadWorkers = async () => {
      setLoading(true)
      setError("")

      try {
        const data = await getWorkers()
        setWorkers(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || "تعذر تحميل قائمة العمال.")
      } finally {
        setLoading(false)
      }
    }

    loadWorkers()
  }, [])

  useEffect(() => {
    if (!detailsWorker) return

    getWorkerRatings(detailsWorker.id)
      .then((data) => setRatings(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "تعذر تحميل تقييمات العامل."))
  }, [detailsWorker])

  const specialties = useMemo(() => {
    const jobs = workers.map((worker) => worker.job).filter(Boolean)
    return ["الكل", ...new Set(jobs)]
  }, [workers])

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return workers.filter((worker) => {
      const haystack = [worker.name, worker.job, worker.address]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch)
      const matchesFilter = filter === "الكل" || worker.job === filter

      return matchesSearch && matchesFilter
    })
  }, [workers, search, filter])

  const handleHireSubmit = async (bookingData) => {
    await createBooking(bookingData)
    setSuccess(`تم إرسال طلب الحجز إلى ${selectedWorker?.name || "العامل"} بنجاح.`)
    setSelectedWorker(null)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-10 flex flex-col justify-between gap-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 font-alexandria text-3xl font-black text-surface-900">العمال المحترفون</h2>
            <p className="text-sm font-bold uppercase tracking-widest text-surface-500">
              {filtered.length} عامل متاح حاليًا
            </p>
          </div>
          <div className="w-full md:w-96">
            <div className="group relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-primary" size={18} />
              <input
                type="text"
                placeholder="ابحث باسم أو مهنة أو مكان..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="saas-input h-12 border-surface-200 pr-11 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="relative max-w-md">
          <MapPin className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
          <input
            type="text"
            placeholder="أدخل مكانك لمعرفة قرب العامل منك"
            value={myArea}
            onChange={(event) => setMyArea(event.target.value)}
            className="saas-input h-12 border-surface-200 pr-11 focus:bg-white"
          />
        </div>
      </div>

      {success && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="mb-12 flex flex-wrap gap-3">
        {specialties.map((job) => (
          <button
            key={job}
            onClick={() => setFilter(job)}
            className={`rounded-2xl border px-6 py-3 text-sm font-black transition-all duration-300 ${
              filter === job
                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                : "border-surface-200 bg-white text-surface-500 hover:border-primary/30 hover:text-primary"
            }`}
          >
            {job}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="saas-card col-span-full border-dashed border-surface-200 bg-surface-50 py-28 text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-surface-200 border-t-primary" />
            <h3 className="mb-2 font-alexandria text-xl font-black text-surface-900">جارٍ تحميل العمال</h3>
            <p className="text-sm font-bold text-surface-400">نقوم بجلب البيانات الحقيقية من الخادم الآن.</p>
          </div>
        ) : filtered.length ? (
          filtered.map((worker) => (
            <div key={worker.id} className="space-y-3">
              <WorkerCard
                worker={worker}
                canHire={canHire}
                onHire={() => setSelectedWorker(worker)}
                onViewDetails={() => {
                  setDetailsWorker(worker)
                  setRatings([])
                }}
              />
              <div className="rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-xs font-black text-surface-500">
                {getProximityLabel(worker.address || "", myArea)}
              </div>
            </div>
          ))
        ) : (
          <div className="saas-card col-span-full border-dashed border-surface-200 bg-surface-50 py-28 text-center">
            <div className="mb-6 text-6xl opacity-30 grayscale">🛠</div>
            <h3 className="mb-2 font-alexandria text-xl font-black text-surface-900">لا توجد نتائج</h3>
            <p className="text-sm font-bold text-surface-400">جرّب البحث بكلمات مختلفة أو تغيير التخصص.</p>
          </div>
        )}
      </div>

      {selectedWorker && (
        <WorkerRequestModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onSubmit={handleHireSubmit}
        />
      )}

      {detailsWorker && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-surface-900/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[2rem] border border-surface-200 bg-white p-8 shadow-2xl" dir="rtl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-surface-900">{detailsWorker.name}</h3>
                <p className="text-sm font-bold text-surface-500">{detailsWorker.job || "خدمة عامة"} - {detailsWorker.address || "غير محدد"}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailsWorker(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 text-surface-400"
                aria-label="إغلاق التفاصيل"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface-50 p-5 text-center">
                <div className="mb-1 text-3xl font-black text-surface-900">{detailsWorker.averageRating || 0}</div>
                <div className="text-xs font-black uppercase tracking-widest text-surface-400">متوسط التقييم</div>
              </div>
              <div className="rounded-2xl bg-surface-50 p-5 text-center">
                <div className="mb-1 text-3xl font-black text-surface-900">{ratings.length}</div>
                <div className="text-xs font-black uppercase tracking-widest text-surface-400">عدد التقييمات</div>
              </div>
            </div>

            <div className="mb-6 overflow-hidden rounded-2xl border border-surface-200">
              <iframe
                title={`خريطة ${detailsWorker.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(detailsWorker.address || "")}&output=embed`}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="mb-6 rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm font-bold text-surface-600">
              {getProximityLabel(detailsWorker.address || "", myArea)}
            </div>

            <div className="space-y-4">
              {ratings.length ? ratings.map((rating) => (
                <div key={rating.id} className="rounded-2xl border border-surface-200 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-surface-900">{rating.userName || "عميل"}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600">
                      <Star size={12} className="fill-current" />
                      {rating.stars}/5
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-surface-500">
                    {rating.comment || "لا توجد ملاحظة نصية مع هذا التقييم."}
                  </p>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-surface-200 bg-surface-50 p-8 text-center text-sm font-bold text-surface-400">
                  لا توجد تقييمات منشورة لهذا العامل بعد.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
