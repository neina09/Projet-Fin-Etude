import React, { useEffect, useMemo, useState } from "react"
import { CalendarClock, MapPin, Search, ShieldCheck, Star, UserRound, Wrench, X } from "lucide-react"
import { createBooking, getWorkerRatings, getWorkers, resolveAssetUrl } from "../api"
import WorkerCard from "./WorkerCard"

const defaultBookingForm = {
  bookingDate: "",
  address: "",
  description: ""
}

function statusLabel(availability) {
  return availability === "BUSY" ? "مشغول" : "متاح"
}

function statusClass(availability) {
  return availability === "BUSY"
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200"
}

export default function WorkersSection({ currentUser }) {
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

  const canRequestWorker = Boolean(currentUser)

  useEffect(() => {
    const loadWorkers = async () => {
      setLoading(true)
      setError("")
      try {
        const payload = await getWorkers()
        setWorkers(Array.isArray(payload) ? payload : [])
      } catch (err) {
        setError(err.message || "تعذر تحميل قائمة العمال.")
      } finally {
        setLoading(false)
      }
    }

    loadWorkers()
  }, [])

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

  const specialties = useMemo(() => {
    const items = workers.map((worker) => worker.job).filter(Boolean)
    return ["الكل", ...new Set(items)]
  }, [workers])

  const filteredWorkers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return workers.filter((worker) => {
      const haystack = [worker.name, worker.job, worker.address].filter(Boolean).join(" ").toLowerCase()
      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch)
      const matchesFilter = filter === "الكل" || worker.job === filter
      return matchesSearch && matchesFilter
    })
  }, [filter, search, workers])

  const closeModal = () => {
    setSelectedWorker(null)
    setRatings([])
    setBookingForm(defaultBookingForm)
  }

  const handleOpenWorker = (worker) => {
    setSelectedWorker(worker)
    setBookingForm((current) => ({
      ...current,
      address: worker.address || ""
    }))
  }

  const handleBookingSubmit = async (event) => {
    event.preventDefault()
    if (!selectedWorker) return

    setBookingLoading(true)
    setError("")

    try {
      const hourlyPrice = Number(selectedWorker.salary || 0)
      await createBooking({
        workerId: selectedWorker.id,
        bookingDate: bookingForm.bookingDate,
        address: bookingForm.address,
        description: bookingForm.description,
        price: hourlyPrice > 0 ? hourlyPrice : 1
      })
      setSuccess(`تم إرسال طلب مباشر إلى العامل ${selectedWorker.name} بنجاح.`)
      closeModal()
      setTimeout(() => setSuccess(""), 5000)
    } catch (err) {
      setError(err.message || "تعذر إرسال الطلب المباشر لهذا العامل.")
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12" dir="rtl">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-[#1d4ed8]">سوق العمال</p>
          <h2 className="text-4xl font-black text-slate-950">اختر العامل المناسب لمهمتك</h2>
          <p className="mt-3 text-sm font-bold text-slate-500">
            يمكن للمستخدم إرسال طلب مباشر للعامل، ويمكن للعامل إظهار حالته الحالية وتقييماته وتعليقات العملاء.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[420px]">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث بالاسم أو المهنة أو العنوان"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pr-12 pl-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {specialties.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-4 py-2 text-xs font-black transition-all ${filter === item
                    ? "bg-[#1d4ed8] text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
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

      {loading ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-16 text-center text-sm font-bold text-slate-400">
          جاري تحميل قائمة العمال...
        </div>
      ) : filteredWorkers.length ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              canHire={canRequestWorker}
              onViewDetails={() => handleOpenWorker(worker)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-16 text-center text-sm font-bold text-slate-400">
          لا يوجد عمال مطابقون لبحثك حالياً.
        </div>
      )}

      {selectedWorker && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#1d4ed8]">ملف العامل</p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">{selectedWorker.name}</h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid max-h-[calc(92vh-88px)] grid-cols-1 overflow-y-auto lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6 p-6 lg:p-8">
                <div className="flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
                  <div className="h-24 w-24 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                    {selectedWorker.imageUrl ? (
                      <img src={resolveAssetUrl(selectedWorker.imageUrl)} alt={selectedWorker.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <UserRound size={36} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">{selectedWorker.job || "عامل"}</span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(selectedWorker.availability)}`}>
                        {statusLabel(selectedWorker.availability)}
                      </span>
                      {selectedWorker.verificationStatus === "VERIFIED" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                          <ShieldCheck size={12} /> موثق
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm font-bold text-slate-600">
                      <div className="flex items-center gap-2"><MapPin size={15} className="text-[#1d4ed8]" />{selectedWorker.address || "غير محدد"}</div>
                      <div className="flex items-center gap-2"><Wrench size={15} className="text-[#1d4ed8]" />السعر الحالي: {selectedWorker.salary || 0} MRU</div>
                      <div className="flex items-center gap-2"><Star size={15} className="text-amber-500" />التقييم: {Number(selectedWorker.averageRating || 0).toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-900">آراء العملاء</h4>
                    <span className="text-xs font-black text-slate-400">{ratings.length} تقييم</span>
                  </div>

                  {ratingsLoading ? (
                    <p className="text-sm font-bold text-slate-400">جاري تحميل التقييمات...</p>
                  ) : ratings.length ? (
                    <div className="space-y-3">
                      {ratings.map((rating) => (
                        <div key={rating.id} className="rounded-2xl bg-slate-50 p-4">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm font-black text-slate-900">{rating.userName || "عميل"}</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <Star
                                  key={value}
                                  size={13}
                                  className={value <= rating.stars ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm font-bold leading-relaxed text-slate-600">{rating.comment || "لا يوجد تعليق مكتوب."}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-bold text-slate-400">
                      لا توجد تقييمات لهذا العامل بعد.
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50 p-6 lg:border-r lg:border-t-0 lg:p-8">
                <div className="mb-5">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#1d4ed8]">طلب مباشر</p>
                  <h4 className="mt-2 text-xl font-black text-slate-950">أرسل طلبك للعامل مباشرة</h4>
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    بعد إنهاء العمل سيتمكن المستخدم من تقييم العامل، وسيظهر هذا التقييم في ملفه الشخصي.
                  </p>
                </div>

                {canRequestWorker && currentUser?.id !== selectedWorker.userId ? (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">تاريخ ووقت التنفيذ</label>
                      <div className="relative">
                        <CalendarClock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                          type="datetime-local"
                          value={bookingForm.bookingDate}
                          min={new Date().toISOString().slice(0, 16)}
                          onChange={(event) => setBookingForm((current) => ({ ...current, bookingDate: event.target.value }))}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-12 pl-4 text-sm font-bold text-slate-900 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">العنوان</label>
                      <input
                        value={bookingForm.address}
                        onChange={(event) => setBookingForm((current) => ({ ...current, address: event.target.value }))}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">وصف المهمة</label>
                      <textarea
                        rows={6}
                        value={bookingForm.description}
                        onChange={(event) => setBookingForm((current) => ({ ...current, description: event.target.value }))}
                        placeholder="اكتب تفاصيل المهمة التي تريد تنفيذها"
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 outline-none"
                        required
                      />
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold text-blue-800">
                      السعر المرسل في الطلب يعتمد على سعر العامل الحالي: {selectedWorker.salary || 0} MRU
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading || selectedWorker.availability === "BUSY"}
                      className="h-12 w-full rounded-xl bg-[#1d4ed8] text-sm font-black text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {bookingLoading ? "جاري إرسال الطلب..." : selectedWorker.availability === "BUSY" ? "العامل مشغول حالياً" : "إرسال طلب مباشر"}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-bold text-slate-400">
                    {currentUser?.role === "ADMIN"
                      ? "حساب المدير لا يرسل طلبات مباشرة للعمال."
                      : "لا يمكنك إرسال طلب مباشر إلى ملفك كعامل."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
