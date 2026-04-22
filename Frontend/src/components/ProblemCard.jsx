import React, { useEffect, useState } from "react"
import { MapPin, Pencil, Trash2, User } from "lucide-react"
import { getOffersForTask, resolveAssetUrl } from "../api"
import { motion, AnimatePresence } from "framer-motion"

const TASK_STATUS_LABELS = {
  PENDING_REVIEW: "مراجعة",
  OPEN: "متاح",
  IN_PROGRESS: "تنفيذ",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
  CLOSED: "منتهية"
}

export default function ProblemCard({
  problem = {},
  currentUser,
  onEdit,
  onDelete,
  workerOffer,
  onSubmitOffer,
  onSelectOffer,
  onWorkerDecision,
  onStatusChange
}) {
  const [openOffers, setOpenOffers] = useState(false)
  const [offers, setOffers] = useState([])
  const [loadingOffers, setLoadingOffers] = useState(false)
  const [offerText, setOfferText] = useState("")
  const [offerError, setOfferError] = useState("")

  const status = String(problem.status || "OPEN").toUpperCase()
  const isOwner = Boolean(currentUser?.id && problem.userId === currentUser.id)
  const isWorker = currentUser?.role === "WORKER"
  const canOffer = isWorker && !isOwner && status === "OPEN"
  const ownerImageUrl = resolveAssetUrl(isOwner && currentUser?.imageUrl ? currentUser.imageUrl : problem.userImageUrl)

  useEffect(() => {
    if (!openOffers || !isOwner) return

    setLoadingOffers(true)
    setOfferError("")

    getOffersForTask(problem.id)
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOfferError("تعذر تحميل العروض"))
      .finally(() => setLoadingOffers(false))
  }, [isOwner, openOffers, problem.id])

  const handleOfferSubmit = async () => {
    if (!offerText.trim() || !onSubmitOffer) return

    try {
      setOfferError("")
      await onSubmitOffer(problem.id, { message: offerText.trim() })
      setOfferText("")
      setOpenOffers(false)
    } catch (error) {
      setOfferError(error.message || "تعذر إرسال العرض")
    }
  }

  return (
    <article className="card mb-4 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-900 shadow-sm">
              {ownerImageUrl ? <img src={ownerImageUrl} className="h-full w-full object-cover" alt={problem.userName || "user"} /> : <User size={18} className="text-white/40" />}
            </div>
            <div className="flex flex-col">
              <h4 className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                {problem.userName || "صاحب الطلب"}
                {problem.isUrgent && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-red-500" />}
              </h4>
              <p className="t-label mt-0.5">{problem.createdAt ? new Date(problem.createdAt).toLocaleDateString("ar") : "نشط الآن"}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`badge ${
              status === "COMPLETED" ? "badge-green" :
              status === "IN_PROGRESS" ? "badge-primary" :
              "badge-neutral"
            }`}>
              {TASK_STATUS_LABELS[status] || status}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-black leading-snug text-slate-900">{problem.title}</h3>
          <p className="t-label line-clamp-2 leading-relaxed">{problem.description}</p>
        </div>

        <div className="mt-1 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 t-label">
            <div className="badge badge-neutral italic">
              <MapPin size={10} className="text-blue-600" />
              {problem.address?.split(",")[0] || "موريتانيا"}
            </div>
            <div className="badge badge-primary">{problem.profession || "خدمة عامة"}</div>
          </div>
          <div className="flex gap-1.5">
            {isOwner && (
              <div className="flex gap-1">
                {status === "OPEN" && (
                  <>
                    <button onClick={() => onEdit?.(problem)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-500 hover:bg-blue-50">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDelete?.(problem)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
                {status === "IN_PROGRESS" && (
                  <button onClick={() => onStatusChange?.(problem, "done")} className="btn btn-primary btn-sm border-emerald-600 bg-emerald-600 px-3 hover:bg-emerald-700">
                    تأكيد الإنجاز
                  </button>
                )}
                {status === "COMPLETED" && !problem.isRated && (
                  <div className="flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-black italic text-emerald-600">
                    مكتمل! اذهب لتقييم العامل
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-50 pt-2">
          {canOffer || workerOffer ? (
            <button onClick={() => setOpenOffers(!openOffers)} className={`btn btn-sm flex-1 ${workerOffer?.status === "SELECTED" ? "btn-primary animate-pulse" : "btn-primary"}`}>
              {workerOffer?.status === "SELECTED" ? "لقد تم اختيارك! اضغط هنا" : workerOffer ? "إدارة عرضي" : "تقديم عرض الآن"}
            </button>
          ) : isOwner ? (
            <button onClick={() => setOpenOffers(!openOffers)} className="btn btn-secondary btn-sm flex-1">
              {status === "IN_PROGRESS" ? "تفاصيل العامل المنفذ" : `عروض المحترفين (${offers.length || 0})`}
            </button>
          ) : (
            <div className="flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              إظهار التفاصيل
            </div>
          )}
          <button onClick={() => setOpenOffers(!openOffers)} className={`btn btn-ghost btn-sm ${openOffers ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>
            {openOffers ? "إغلاق" : "التفاصيل"}
          </button>
        </div>

        <AnimatePresence>
          {openOffers && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 overflow-hidden">
              <div className="space-y-4 border-t border-slate-50 pt-4">
                {canOffer && !workerOffer && (
                  <div className="space-y-3">
                    <textarea
                      value={offerText}
                      onChange={(e) => setOfferText(e.target.value)}
                      placeholder="اكتب عرضك هنا (السعر والوقت المتوقع)..."
                      className="input h-20 resize-none"
                    />
                    <button onClick={handleOfferSubmit} disabled={!offerText.trim()} className="btn btn-primary btn-sm w-full disabled:cursor-not-allowed disabled:opacity-60">
                      إرسال العرض
                    </button>
                  </div>
                )}

                {isOwner && (
                  <div className="space-y-2">
                    {loadingOffers ? (
                      <div className="py-6 text-center text-[10px] font-bold italic text-slate-300">جاري جلب العروض...</div>
                    ) : offers.length === 0 ? (
                      <div className="py-6 text-center text-[10px] font-bold italic text-slate-300">لا توجد عروض بعد.</div>
                    ) : (
                      offers.map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 text-[11px] font-black text-blue-700">
                              {offer.workerName?.[0]}
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900">{offer.workerName}</p>
                              <p className="t-label italic">"{offer.message}"</p>
                            </div>
                          </div>
                          {offer.status === "PENDING" && (
                            <button onClick={() => onSelectOffer?.(offer.id)} className="btn btn-primary btn-sm">
                              توظيف
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {workerOffer && (
                  <div className={`rounded-xl border p-3 ${workerOffer.status === "SELECTED" ? "border-amber-200 bg-amber-50" : "border-blue-100 bg-blue-50"}`}>
                    <p className={`mb-1 text-[8px] font-black uppercase tracking-widest ${workerOffer.status === "SELECTED" ? "text-amber-600" : "text-blue-600"}`}>
                      {workerOffer.status === "SELECTED" ? "لقد تم قبول عرضك! هل أنت مستعد للبدء؟" : "عرضي الحالي"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-600">"{workerOffer.message}"</p>

                    {workerOffer.status === "SELECTED" && (
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => onWorkerDecision?.(workerOffer.id, "accept")} className="btn btn-primary btn-sm flex-1 border-emerald-600 bg-emerald-600 hover:bg-emerald-700">
                          قبول المهمة
                        </button>
                        <button onClick={() => onWorkerDecision?.(workerOffer.id, "refuse")} className="btn btn-secondary btn-sm flex-1 border-red-100 text-red-600 hover:bg-red-50">
                          رفض
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {offerError && <p className="text-center text-[9px] font-bold text-red-500">{offerError}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  )
}
