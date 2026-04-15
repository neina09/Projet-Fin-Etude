import React, { useEffect, useState } from "react"
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Navigation,
  Pencil,
  Send,
  Sparkles,
  Trash2,
  User,
  XCircle
} from "lucide-react"
import { getOffersForTask } from "../api"
import LeafletMapPicker from "./LeafletMapPicker"

const TASK_STATUS_LABELS = {
  PENDING_REVIEW: "قيد مراجعة المدير",
  OPEN: "مفتوحة",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتملة",
  CANCELLED: "ملغاة",
  CLOSED: "مغلقة"
}

const OFFER_STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  SELECTED: "تم اختياره",
  REFUSED: "مرفوض",
  WORKER_REFUSED: "رفضه العامل",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
  CLOSED: "مغلق"
}

function badgeClass(status) {
  if (status === "COMPLETED") return "bg-emerald-50 border-emerald-100 text-emerald-600"
  if (status === "IN_PROGRESS") return "bg-amber-50 border-amber-100 text-amber-600"
  if (status === "SELECTED") return "bg-indigo-50 border-indigo-100 text-indigo-600"
  if (status === "PENDING_REVIEW") return "bg-amber-50 border-amber-100 text-amber-700"
  if (status === "CANCELLED" || status === "REFUSED" || status === "WORKER_REFUSED") return "bg-red-50 border-red-100 text-red-600"
  if (status === "CLOSED") return "bg-surface-50 border-surface-100 text-surface-400"
  return "bg-primary-soft border-primary/10 text-primary"
}

function formatAddress(address) {
  if (!address || typeof address !== "string") return "الموقع غير محدد"

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  if (!parts.length) return "الموقع غير محدد"

  const uniqueParts = parts.filter((part, index) => parts.indexOf(part) === index)
  const visibleParts = uniqueParts
    .filter((part) => !["موريتانيا", "Mauritania"].includes(part))
    .slice(0, 3)

  return visibleParts.length ? visibleParts.join("، ") : "الموقع غير محدد"
}

export default function ProblemCard({
  problem = {},
  currentUser,
  onEdit,
  onDelete,
  onStatusChange,
  workerOffer,
  currentWorkerStatus,
  onSubmitOffer,
  onSelectOffer,
  onWorkerDecision
}) {
  const [open, setOpen] = useState(false)
  const [offers, setOffers] = useState([])
  const [loadingOffers, setLoadingOffers] = useState(false)
  const [offerText, setOfferText] = useState("")
  const [offerError, setOfferError] = useState("")
  const [sendingOffer, setSendingOffer] = useState(false)
  const [deciding, setDeciding] = useState(false)
  const [distanceKm, setDistanceKm] = useState(null)

  const status = String(problem.status || "OPEN").toUpperCase()
  const title = problem.title || "بدون عنوان"
  const description = problem.description || ""
  const address = problem.address || "الموقع غير محدد"
  const displayAddress = formatAddress(problem.address)
  const profession = problem.profession || "مهنة غير محددة"
  const latitude = Number(problem.latitude)
  const longitude = Number(problem.longitude)
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)
  const time = problem.createdAt ? new Date(problem.createdAt).toLocaleDateString("ar-EG") : "الآن"
  const isOwner = Boolean(currentUser?.id && problem.userId === currentUser.id)
  const isWorker = currentUser?.role === "WORKER"
  const canOffer = isWorker && !isOwner && status === "OPEN"
  const canMarkDone = isOwner && status === "IN_PROGRESS"
  const canCancelTask = isOwner && (status === "OPEN" || status === "PENDING_REVIEW")
  const isCurrentWorkerBusy = currentWorkerStatus === "BUSY"

  useEffect(() => {
    if (!open || !isOwner || status === "PENDING_REVIEW") return

    setLoadingOffers(true)
    setOfferError("")

    getOffersForTask(problem.id)
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch((err) => setOfferError(err.message || "تعذر تحميل العروض"))
      .finally(() => setLoadingOffers(false))
  }, [isOwner, open, problem.id, status])

  useEffect(() => {
    if (!open) {
      setDistanceKm(null)
    }
  }, [open])

  const handleOfferSubmit = async () => {
    if (!offerText.trim()) return

    setSendingOffer(true)
    setOfferError("")

    try {
      const createdOffer = await onSubmitOffer?.(problem.id, offerText.trim())
      if (createdOffer) {
        setOffers((current) => [createdOffer, ...current])
      }
      setOfferText("")
    } catch (err) {
      setOfferError(err.message || "تعذر إرسال العرض")
    } finally {
      setSendingOffer(false)
    }
  }

  const handleSelectOffer = async (offerId) => {
    try {
      await onSelectOffer?.(offerId)
    } catch (err) {
      setOfferError(err.message || "تعذر اختيار العامل")
    }
  }

  const handleDecision = async (decision) => {
    setDeciding(true)
    setOfferError("")
    try {
      await onWorkerDecision?.(workerOffer.id, decision)
    } catch (err) {
      setOfferError(err.message || "فشل تسجيل قرارك")
    } finally {
      setDeciding(false)
    }
  }

  return (
    <article className="saas-card border-surface-200 bg-white p-6 transition-all duration-300 hover:border-primary/20">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-100 bg-surface-50 text-surface-400">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-surface-900">{problem.userName || "مستخدم"}</p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-surface-400">
                <Calendar size={12} className="opacity-50" />
                {time}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black leading-tight text-surface-900">{title}</h3>
            {description && (
              <p className="text-sm font-medium leading-7 text-surface-600">{description}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-primary/10 bg-primary-soft px-3 py-2 text-xs font-black text-primary">
              <Briefcase size={14} />
              {profession}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-xs font-bold text-surface-500">
              <MapPin size={14} className="text-primary opacity-70" />
              <span title={address}>{displayAddress}</span>
            </span>
            {distanceKm !== null && (
              <span className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">
                <Navigation size={14} />
                مسافة الطريق {distanceKm} كم
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black ${badgeClass(status)}`}>
            {TASK_STATUS_LABELS[status] || status}
          </span>

          {isOwner && (
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <button
                type="button"
                onClick={() => onEdit?.(problem)}
                className="inline-flex items-center gap-2 rounded-xl border border-surface-200 px-3 py-2 text-xs font-bold text-surface-600 hover:bg-surface-50"
              >
                <Pencil size={14} />
                تعديل
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(problem)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
                حذف
              </button>
            </div>
          )}
        </div>
      </div>

      {isWorker && workerOffer?.status === "SELECTED" && (
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-indigo-900">تم اختيارك لهذه المهمة</p>
              <p className="text-xs font-medium text-indigo-700">بانتظار موافقتك النهائية لبدء العمل.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDecision("refuse")}
              disabled={deciding}
              className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              اعتذار
            </button>
            <button
              onClick={() => handleDecision("accept")}
              disabled={deciding}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
            >
              موافق، سأبدأ الآن
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-surface-100 pt-5">
        {(canMarkDone || canCancelTask) && (
          <div className="flex flex-wrap items-center gap-2">
            {canMarkDone && (
              <button
                type="button"
                onClick={() => onStatusChange?.(problem, "done")}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50"
              >
                <CheckCircle2 size={14} />
                تأكيد الإنجاز
              </button>
            )}
            {canCancelTask && (
              <button
                type="button"
                onClick={() => onStatusChange?.(problem, "cancel")}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50"
              >
                <XCircle size={14} />
                {status === "PENDING_REVIEW" ? "سحب المهمة" : "إلغاء المهمة"}
              </button>
            )}
          </div>
        )}

        {(isOwner || canOffer || workerOffer) && (
          <button
            onClick={() => setOpen((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              open ? "bg-primary-soft text-primary" : "text-surface-500 hover:bg-surface-50 hover:text-primary"
            }`}
          >
            <MessageSquare size={14} className="opacity-70" />
            {isOwner ? "التفاصيل والعروض" : "إضافة عرض"}
          </button>
        )}
      </div>

      {open && (
        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="overflow-hidden rounded-2xl border border-surface-200">
            {hasCoordinates ? (
              <LeafletMapPicker
                isListView
                height="260px"
                showCurrentLocation
                taskLocation={{ lat: latitude, lng: longitude }}
                taskLabel={title}
                onDistanceChange={setDistanceKm}
              />
            ) : (
              <div className="flex h-56 w-full items-center justify-center bg-surface-50 text-sm font-medium text-surface-400">
                الموقع غير محدد على الخريطة
              </div>
            )}
          </div>

          {hasCoordinates && (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-surface-400">موقع المهمة</p>
                <p className="mt-1 text-sm font-bold text-surface-900">{displayAddress}</p>
              </div>
              <div className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-surface-400">الإحداثيات</p>
                <p className="mt-1 text-sm font-bold text-surface-900">
                  {latitude.toFixed(5)}, {longitude.toFixed(5)}
                </p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-blue-500">مسافة الطريق</p>
                <p className="mt-1 text-sm font-bold text-surface-900">
                  {distanceKm !== null ? `تبعد المهمة عنك عبر الطريق ${distanceKm} كم` : "اسمح بالوصول إلى موقعك لحساب مسافة الطريق"}
                </p>
              </div>
            </div>
          )}

          {status === "PENDING_REVIEW" && isOwner && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
              المهمة لم تُنشر بعد. ستظهر في المنصة فقط بعد موافقة المدير.
            </div>
          )}

          {isOwner && status !== "PENDING_REVIEW" && (
            <div className="space-y-3">
              {loadingOffers ? (
                <div className="rounded-xl border border-surface-100 bg-surface-50 p-4 text-sm font-bold text-surface-400">
                  جاري تحميل عروض العمال...
                </div>
              ) : offers.length ? (
                offers.map((offer) => (
                  <div key={offer.id} className="rounded-xl border border-surface-100 bg-surface-50 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="block text-sm font-black text-surface-900">{offer.workerName}</span>
                        <span className="text-xs font-bold text-surface-400">{offer.workerJob || "عامل"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-black ${badgeClass(offer.status)}`}>
                          {OFFER_STATUS_LABELS[offer.status] || offer.status}
                        </span>
                        {offer.status === "PENDING" && status === "OPEN" && (
                          <button
                            type="button"
                            onClick={() => handleSelectOffer(offer.id)}
                            disabled={offer.workerAvailability === "BUSY"}
                            className={`rounded-xl px-3 py-2 text-xs font-black text-white ${
                              offer.workerAvailability === "BUSY" ? "cursor-not-allowed bg-surface-300" : "bg-primary"
                            }`}
                          >
                            {offer.workerAvailability === "BUSY" ? "العامل مشغول حاليًا" : "اختيار العامل"}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-surface-600">{offer.message}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-surface-200 bg-surface-50 p-4 text-sm font-bold text-surface-400">
                  لا توجد عروض من العمال على هذه المهمة بعد.
                </div>
              )}
            </div>
          )}

          {canOffer && (
            <div className="space-y-3">
              {workerOffer ? (
                <div className="rounded-xl border border-primary/20 bg-primary-soft p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-primary">عرضك الحالي</span>
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black ${badgeClass(workerOffer.status)}`}>
                      {OFFER_STATUS_LABELS[workerOffer.status] || workerOffer.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-surface-700">{workerOffer.message}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-2">
                  <textarea
                    value={offerText}
                    onChange={(event) => setOfferText(event.target.value)}
                    placeholder={isCurrentWorkerBusy ? "أنت مشغول حاليًا، غيّر حالتك لتتمكن من إرسال عرض." : "اكتب عرضك أو رسالتك لصاحب المهمة..."}
                    disabled={sendingOffer || isCurrentWorkerBusy}
                    className="saas-input min-h-[88px] flex-1 resize-none border-surface-200 px-4 py-3"
                  />
                  <button
                    type="button"
                    onClick={handleOfferSubmit}
                    disabled={sendingOffer || !offerText.trim() || isCurrentWorkerBusy}
                    className="btn-saas btn-primary h-12 px-5 text-sm font-bold disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
              )}

              {offerError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {offerError}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
