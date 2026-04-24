import React, { useEffect, useMemo, useState } from "react"
import { MapPin, Pencil, Phone, Star, Trash2, User } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { createTaskRating, getOffersForTask, resolveAssetUrl } from "../api"

const TASK_STATUS_LABELS = {
  PENDING_REVIEW: "قيد المراجعة",
  OPEN: "مفتوح",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
  CLOSED: "منتهي"
}

const OFFER_STATUS_LABELS = {
  PENDING: "قيد الدراسة",
  SELECTED: "بانتظار قبول العامل",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
  REFUSED: "مرفوض",
  WORKER_REFUSED: "رفض العامل",
  CLOSED: "مغلق"
}

const getOfferBadgeClass = (status) => {
  if (status === "SELECTED") return "badge-primary"
  if (status === "IN_PROGRESS") return "badge-amber"
  if (status === "COMPLETED") return "badge-green"
  if (status === "REFUSED" || status === "WORKER_REFUSED" || status === "CLOSED") return "badge-red"
  return "badge-neutral"
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
  const [offerText, setOfferText] = useState(workerOffer?.message || "")
  const [offerError, setOfferError] = useState("")
  const [isRating, setIsRating] = useState(false)
  const [ratingData, setRatingData] = useState({ stars: 0, comment: "" })
  const [ratingLoading, setRatingLoading] = useState(false)

  const status = String(problem.status || "OPEN").toUpperCase()
  const currentUserId = currentUser?.id != null ? String(currentUser.id) : ""
  const problemOwnerId = problem?.userId != null ? String(problem.userId) : ""
  const isOwner = Boolean(currentUserId && problemOwnerId && problemOwnerId === currentUserId)
  const isWorker = currentUser?.role === "WORKER"
  const canOffer = isWorker && !isOwner && status === "OPEN"
  const canEdit = isOwner && status === "OPEN"
  const canDelete = isOwner && status !== "IN_PROGRESS"
  const ownerImageUrl = resolveAssetUrl(isOwner && currentUser?.imageUrl ? currentUser.imageUrl : problem.userImageUrl)

  useEffect(() => {
    setOfferText(workerOffer?.message || "")
  }, [workerOffer?.message])

  useEffect(() => {
    if (!openOffers || !isOwner) return

    setLoadingOffers(true)
    setOfferError("")

    getOffersForTask(problem.id)
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOfferError("تعذر تحميل العروض."))
      .finally(() => setLoadingOffers(false))
  }, [isOwner, openOffers, problem.id])

  const selectedOffer = useMemo(
    () => offers.find((offer) => ["SELECTED", "ACCEPTED", "IN_PROGRESS"].includes(String(offer.status || "").toUpperCase())),
    [offers]
  )

  const handleOfferSubmit = async () => {
    if (!offerText.trim() || !onSubmitOffer) return

    try {
      setOfferError("")
      await onSubmitOffer(problem.id, { message: offerText.trim() })
      setOfferText("")
      setOpenOffers(false)
    } catch (error) {
      setOfferError(error.message || "تعذر إرسال العرض.")
    }
  }

  const offerStatusLabel = (() => {
    const workerStatus = String(workerOffer?.status || "").toUpperCase()
    if (workerStatus === "SELECTED") return "تم اختيار عرضك - بانتظار قرارك"
    if (workerStatus === "IN_PROGRESS") return "قيد التنفيذ"
    if (workerStatus === "COMPLETED") return "اكتمل التنفيذ"
    if (workerStatus === "CLOSED") return "أغلق الطلب"
    if (workerStatus === "REFUSED" || workerStatus === "REJECTED") return "مرفوض"
    if (workerStatus === "WORKER_REFUSED") return "تم رفضه من العامل"
    return "قيد الدراسة"
  })()

  return (
    <article className="card mb-4 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-900 shadow-sm">
              {ownerImageUrl ? (
                <img src={ownerImageUrl} className="h-full w-full object-cover" alt={problem.userName || "user"} />
              ) : (
                <User size={18} className="text-white/40" />
              )}
            </div>
            <div className="flex flex-col">
              <h4 className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                {problem.userName || "صاحب الطلب"}
                {problem.isUrgent && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-red-500" />}
              </h4>
              <p className="t-label mt-0.5">{problem.createdAt ? new Date(problem.createdAt).toLocaleDateString("ar") : "نشط الآن"}</p>
            </div>
          </div>

          <span className={`badge ${
            status === "COMPLETED" ? "badge-green" :
            status === "IN_PROGRESS" ? "badge-primary" :
            status === "CANCELLED" ? "badge-red" :
            "badge-neutral"
          }`}>
            {TASK_STATUS_LABELS[status] || status}
          </span>
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

          {isOwner && (
            <div className="flex gap-1">
              {canEdit && (
                <button onClick={() => onEdit?.(problem)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-500 hover:bg-blue-50">
                  <Pencil size={14} />
                </button>
              )}
              {canDelete && (
                <button onClick={() => onDelete?.(problem)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              )}
              {status === "IN_PROGRESS" && (
                <button onClick={() => onStatusChange?.(problem, "done")} className="btn btn-primary btn-sm border-emerald-600 bg-emerald-600 px-3 hover:bg-emerald-700">
                  تأكيد الإنجاز
                </button>
              )}
              {(status === "OPEN" || status === "IN_PROGRESS") && (
                <button onClick={() => onStatusChange?.(problem, "cancel")} className="btn btn-secondary btn-sm border-red-100 px-3 text-red-600 hover:bg-red-50">
                  إلغاء
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-slate-50 pt-2">
          {canOffer || workerOffer ? (
            <button onClick={() => setOpenOffers((current) => !current)} className={`btn btn-sm flex-1 ${workerOffer?.status === "SELECTED" ? "animate-pulse btn-primary" : "btn-primary"}`}>
              {workerOffer?.status === "SELECTED" ? "بانتظار ردك على الاختيار" : workerOffer?.status === "IN_PROGRESS" ? "عرض حالة التنفيذ" : workerOffer ? "عرض حالتي" : "تقديم عرض الآن"}
            </button>
          ) : isOwner ? (
            <button onClick={() => setOpenOffers((current) => !current)} className="btn btn-secondary btn-sm flex-1">
              {status === "IN_PROGRESS" ? "تفاصيل العامل المنفذ" : `عروض الخبراء (${offers.length || 0})`}
            </button>
          ) : (
            <div className="flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              عرض التفاصيل
            </div>
          )}

          <button onClick={() => setOpenOffers((current) => !current)} className={`btn btn-ghost btn-sm ${openOffers ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>
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
                      onChange={(event) => setOfferText(event.target.value)}
                      placeholder="اكتب عرضك هنا: السعر، المدة، وملاحظات التنفيذ..."
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
                      <div className="py-6 text-center text-[10px] font-bold italic text-slate-300">جارٍ جلب العروض...</div>
                    ) : offers.length === 0 ? (
                      <div className="py-6 text-center text-[10px] font-bold italic text-slate-300">لا توجد عروض بعد.</div>
                    ) : (
                      offers.map((offer) => (
                        <div key={offer.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 text-[11px] font-black text-blue-700">
                                {offer.workerName?.[0] || "ع"}
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-900">{offer.workerName}</p>
                                <p className="text-[11px] font-bold text-slate-500">{offer.workerJob || "عامل"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`badge ${getOfferBadgeClass(String(offer.status || "").toUpperCase())}`}>
                                {OFFER_STATUS_LABELS[String(offer.status || "").toUpperCase()] || String(offer.status || "").toUpperCase()}
                              </span>
                              {offer.status === "PENDING" && (
                                <button onClick={() => onSelectOffer?.(offer.id)} className="btn btn-primary btn-sm">
                                  اختيار
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="mt-3 rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs font-bold leading-relaxed text-slate-600">
                            {offer.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {isOwner && status === "IN_PROGRESS" && selectedOffer && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <h5 className="mb-3 text-xs font-black text-blue-900">بيانات العامل المنفذ</h5>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-white p-3">
                        <p className="mb-1 text-[11px] font-black text-slate-400">الاسم</p>
                        <p className="text-sm font-black text-slate-900">{selectedOffer.workerName || "غير متوفر"}</p>
                      </div>
                      <div className="rounded-xl bg-white p-3">
                        <p className="mb-1 text-[11px] font-black text-slate-400">المهنة</p>
                        <p className="text-sm font-black text-slate-900">{selectedOffer.workerJob || "غير محددة"}</p>
                      </div>
                      <div className="rounded-xl bg-white p-3">
                        <p className="mb-1 flex items-center gap-1 text-[11px] font-black text-slate-400">
                          <Phone size={12} />
                          الهاتف
                        </p>
                        <p className="text-sm font-black text-slate-900" dir="ltr">{selectedOffer.workerPhoneNumber || "غير متوفر"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {workerOffer && (
                  <div className={`rounded-xl border p-3 ${workerOffer.status === "SELECTED" ? "border-amber-200 bg-amber-50" : workerOffer.status === "IN_PROGRESS" ? "border-blue-200 bg-blue-50" : workerOffer.status === "COMPLETED" ? "border-emerald-200 bg-emerald-50" : workerOffer.status === "CLOSED" || workerOffer.status === "REFUSED" || workerOffer.status === "WORKER_REFUSED" ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
                    <p className={`mb-1 text-[8px] font-black uppercase tracking-widest ${workerOffer.status === "SELECTED" ? "text-amber-600" : workerOffer.status === "IN_PROGRESS" ? "text-blue-600" : workerOffer.status === "COMPLETED" ? "text-emerald-600" : workerOffer.status === "CLOSED" || workerOffer.status === "REFUSED" || workerOffer.status === "WORKER_REFUSED" ? "text-red-600" : "text-slate-600"}`}>
                      {offerStatusLabel}
                    </p>
                    <p className="rounded-xl bg-white px-3 py-2 text-[11px] font-bold leading-relaxed text-slate-600">{workerOffer.message}</p>

                    {workerOffer.status === "SELECTED" && (
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => onWorkerDecision?.(workerOffer.id, "accept")} className="btn btn-primary btn-sm flex-1 border-emerald-600 bg-emerald-600 hover:bg-emerald-700">
                          قبول وبدء التنفيذ
                        </button>
                        <button onClick={() => onWorkerDecision?.(workerOffer.id, "refuse")} className="btn btn-secondary btn-sm flex-1 border-red-100 text-red-600 hover:bg-red-50">
                          رفض
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {isOwner && status === "COMPLETED" && !problem.isRated && (
                  <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <button onClick={() => setIsRating((current) => !current)} className="mb-3 text-xs font-black text-emerald-900">
                      {isRating ? "إخفاء التقييم" : "تقييم العامل"}
                    </button>

                    {isRating && (
                      <>
                        <div className="mb-3 flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              onClick={() => setRatingData((current) => ({ ...current, stars: value }))}
                              className={`transition-transform hover:scale-110 ${ratingData.stars >= value ? "text-amber-400" : "text-slate-300"}`}
                            >
                              <Star size={24} fill={ratingData.stars >= value ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="اكتب تعليقك هنا..."
                          value={ratingData.comment}
                          onChange={(event) => setRatingData((current) => ({ ...current, comment: event.target.value }))}
                          className="input mb-3 h-20 resize-none bg-white text-xs"
                        />
                        <button
                          onClick={async () => {
                            if (!ratingData.stars) {
                              setOfferError("يرجى تحديد التقييم بالنجوم.")
                              return
                            }
                            setRatingLoading(true)
                            setOfferError("")
                            try {
                              await createTaskRating(problem.id, ratingData)
                              setIsRating(false)
                              onStatusChange?.(problem, "rated")
                            } catch (err) {
                              setOfferError(err.message || "تعذر إرسال التقييم.")
                            } finally {
                              setRatingLoading(false)
                            }
                          }}
                          disabled={ratingLoading}
                          className="btn btn-primary btn-sm w-full border-emerald-600 bg-emerald-600 hover:bg-emerald-700"
                        >
                          {ratingLoading ? "جارٍ الإرسال..." : "إرسال التقييم"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {offerError && <p className="text-center text-[10px] font-bold text-red-500">{offerError}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  )
}
