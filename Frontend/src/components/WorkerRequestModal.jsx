import React, { useMemo, useState } from "react"
import { Calendar, Clock, MapPin, MessageSquare, Send, ShieldCheck, X } from "lucide-react"
import { resolveAssetUrl } from "../api"

function getDateInputMin() {
  const now = new Date()
  return now.toISOString().split("T")[0]
}

function getTimeInputMin(selectedDate) {
  if (!selectedDate) return "00:00"

  const now = new Date()
  const today = now.toISOString().split("T")[0]
  if (selectedDate !== today) return "00:00"

  now.setMinutes(now.getMinutes() + 30)
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

export default function WorkerRequestModal({ worker, onClose, onSubmit }) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [desc, setDesc] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const workerImg = resolveAssetUrl(worker.imageUrl || worker.img)
  const minDate = useMemo(() => getDateInputMin(), [])
  const minTime = useMemo(() => getTimeInputMin(date), [date])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const selectedDateTime = new Date(`${date}T${time}:00`)
      const minimumAllowed = new Date(Date.now() + 5 * 60 * 1000)

      if (Number.isNaN(selectedDateTime.getTime()) || selectedDateTime <= minimumAllowed) {
        throw new Error("اختر موعداً مستقبلياً بعد الوقت الحالي.")
      }

      await onSubmit({
        workerId: worker.id,
        description: desc,
        address,
        bookingDate: selectedDateTime.toISOString().slice(0, 19),
        price: worker.salary || worker.price || 0
      })
    } catch (err) {
      setError(err.message || "تعذر إرسال طلب الحجز.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in fixed inset-0 z-[1000] flex items-center justify-center bg-surface-900/60 p-4 backdrop-blur-sm duration-300 sm:p-6" dir="rtl">
      <div className="animate-in zoom-in-95 w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-surface-200 bg-white shadow-2xl duration-300">
        <div className="flex items-center justify-between border-b border-surface-100 bg-surface-50/50 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={workerImg}
                alt={worker.name}
                className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-sm"
                onError={(event) => {
                  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || "W")}&background=F4F7FD&color=2F5CF3&bold=true`
                }}
              />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                <ShieldCheck size={12} className="text-primary" />
              </div>
            </div>
            <div>
              <h3 className="mb-1.5 text-xl font-black leading-none tracking-tight text-surface-900">حجز موعد مع {worker.name}</h3>
              <p className="text-[10px] font-black uppercase leading-none tracking-widest text-primary">فئة {worker.job || worker.specialty || "محترف"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-400 shadow-sm transition-all hover:bg-surface-50 hover:text-surface-900 active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">تاريخ الحجز</label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
                <input
                  type="date"
                  required
                  min={minDate}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="saas-input h-12 border-surface-200 pr-11 text-right text-[13px] font-bold transition-all focus:bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">الوقت المفضل</label>
              <div className="relative">
                <Clock className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
                <input
                  type="time"
                  required
                  min={minTime}
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="saas-input h-12 border-surface-200 pr-11 text-right text-[13px] font-bold transition-all focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">العنوان أو الحي المختار</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
              <input
                required
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="مثال: تفرغ زينة، عمارة النجاح"
                className="saas-input h-12 border-surface-200 pr-11 text-[13px] font-bold transition-all focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">وصف التفاصيل أو المشكلة</label>
            <div className="relative">
              <textarea
                required
                rows="3"
                value={desc}
                onChange={(event) => setDesc(event.target.value)}
                placeholder="يرجى كتابة تفاصيل المهمة بوضوح..."
                className="saas-input min-h-[100px] resize-none border-surface-200 px-4 py-4 text-[13px] font-bold transition-all focus:bg-white"
              />
              <MessageSquare size={14} className="absolute bottom-4 left-4 text-surface-200" />
            </div>
          </div>

          <div className="pt-2">
            <div className="mb-4 rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm font-bold text-surface-700">
              السعر المقترح: {worker.salary || worker.price || 0} MRU
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-saas btn-primary flex h-14 w-full items-center justify-center gap-3 text-sm font-black shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  جاري المعالجة...
                </div>
              ) : (
                <>
                  <span>إرسال طلب الحجز للعامل</span>
                  <Send size={18} className="translate-x-1 rotate-180" />
                </>
              )}
            </button>
            <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-surface-400 opacity-80">
              يجب أن يكون موعد الحجز في المستقبل حتى يقبله النظام
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
