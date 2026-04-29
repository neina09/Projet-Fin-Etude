import React, { useEffect, useMemo, useState } from "react"
import { MapPin, Pencil, Phone, Star, Trash2, User, Send, XCircle } from "lucide-react"
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

const STATUS_CONFIG = {
  OPEN:           { bg: "bg-emerald-50",  text: "text-emerald-700",  border: "border-emerald-200",  dot: "bg-emerald-400" },
  IN_PROGRESS:    { bg: "bg-blue-50",     text: "text-blue-700",     border: "border-blue-200",     dot: "bg-blue-400"    },
  COMPLETED:      { bg: "bg-violet-50",   text: "text-violet-700",   border: "border-violet-200",   dot: "bg-violet-400"  },
  CANCELLED:      { bg: "bg-red-50",      text: "text-red-600",      border: "border-red-200",      dot: "bg-red-400"     },
  PENDING_REVIEW: { bg: "bg-amber-50",    text: "text-amber-700",    border: "border-amber-200",    dot: "bg-amber-400"   },
  CLOSED:         { bg: "bg-slate-50",    text: "text-slate-500",    border: "border-slate-200",    dot: "bg-slate-400"   },
}

const getOfferBadgeClass = (status) => {
  if (status === "SELECTED")                                              return "bg-blue-50 text-blue-700 border border-blue-200"
  if (status === "ACCEPTED" || status === "IN_PROGRESS")                  return "bg-amber-50 text-amber-700 border border-amber-200"
  if (status === "COMPLETED")                                             return "bg-emerald-50 text-emerald-700 border border-emerald-200"
  if (status === "REFUSED" || status === "WORKER_REFUSED" || status === "CLOSED") return "bg-red-50 text-red-600 border border-red-200"
  return "bg-slate-50 text-slate-500 border border-slate-200"
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
  const [openOffers, setOpenOffers]                   = useState(false)
  const [offers, setOffers]                           = useState([])
  const [loadingOffers, setLoadingOffers]             = useState(false)
  const [offerText, setOfferText]                     = useState(workerOffer?.message || "")
  const [offerError, setOfferError]                   = useState("")
  const [isRating, setIsRating]                       = useState(false)
  const [ratingData, setRatingData]                   = useState({ stars: 0, comment: "" })
  const [ratingLoading, setRatingLoading]             = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const status        = String(problem.status || "OPEN").toUpperCase()
  const statusCfg     = STATUS_CONFIG[status] || STATUS_CONFIG.CLOSED
  const currentUserId = currentUser?.id != null ? String(currentUser.id) : ""
  const problemOwnerId = problem?.userId != null ? String(problem.userId) : ""
  const isOwner       = Boolean(currentUserId && problemOwnerId && problemOwnerId === currentUserId)
  const isWorker      = currentUser?.role === "WORKER"
  const isAdmin       = currentUser?.role === "ADMIN"
  const canOffer      = isWorker && !isOwner && status === "OPEN"
  const ownerImageUrl = resolveAssetUrl(isOwner && currentUser?.imageUrl ? currentUser.imageUrl : problem.userImageUrl)

  useEffect(() => { setOfferText(workerOffer?.message || "") }, [workerOffer?.message])

  useEffect(() => {
    if (!openOffers || !isOwner) return
    setLoadingOffers(true)
    setOfferError("")
    getOffersForTask(problem.id)
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOfferError("تعذر تحميل العروض."))
      .finally(() => setLoadingOffers(false))
  }, [isOwner, openOffers, problem.id, problem.assignedWorkerId, problem.assignedWorkerUserId, problem.status])

  const selectedOffer = useMemo(
    () => offers.find((offer) => ["SELECTED", "ACCEPTED", "IN_PROGRESS"].includes(String(offer.status || "").toUpperCase())),
    [offers]
  )
  const waitingForWorkerResponse = isOwner && status === "OPEN" && Boolean(selectedOffer || problem.assignedWorkerId || problem.assignedWorkerUserId)
  const canEdit = isOwner && status === "OPEN" && !waitingForWorkerResponse
  const canDelete = isOwner && status !== "IN_PROGRESS" && !waitingForWorkerResponse
  const canCancel = (isOwner || isAdmin) && ["OPEN", "PENDING_REVIEW"].includes(status)

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

  const handleSelectOfferClick = async (offerId) => {
    if (!onSelectOffer || waitingForWorkerResponse) return

    try {
      setOfferError("")
      const selected = await onSelectOffer(offerId)
      const selectedId = selected?.id ?? offerId

      setOffers((current) => current.map((offer) => (
        offer.id === selectedId
          ? { ...offer, status: selected?.status || "SELECTED" }
          : offer
      )))
    } catch (error) {
      setOfferError(error?.message || "تعذر اختيار العامل.")
    }
  }

  const offerStatusLabel = (() => {
    const s = String(workerOffer?.status || "").toUpperCase()
    if (s === "SELECTED")                           return "تم اختيار عرضك — بانتظار قرارك"
    if (s === "IN_PROGRESS")                        return "قيد التنفيذ"
    if (s === "COMPLETED")                          return "اكتمل التنفيذ"
    if (s === "CLOSED")                             return "أغلق الطلب"
    if (s === "REFUSED" || s === "REJECTED")        return "مرفوض"
    if (s === "WORKER_REFUSED")                     return "تم رفضه من العامل"
    return "قيد الدراسة"
  })()

  return (
    <article
      className="group relative w-full rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
      dir="rtl"
    >
      {/* Accent line on the right */}
      <div className={`absolute right-0 top-4 bottom-4 w-[3px] rounded-full ${statusCfg.dot}`} />

      <div className="p-5 pr-6">

        {/* ── Header ── */}
        <div className="mb-4 flex items-start justify-between gap-3">
          {/* Avatar + meta */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
              {ownerImageUrl ? (
                <img src={ownerImageUrl} className="h-full w-full object-cover" alt={problem.userName || "user"} />
              ) : (
                <User size={16} className="text-slate-400" />
              )}
              {problem.isUrgent && (
                <span className="absolute -top-0.5 -left-0.5 h-2.5 w-2.5 animate-ping rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{problem.userName || "صاحب الطلب"}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString("ar-MA") : "نشط الآن"}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
            {TASK_STATUS_LABELS[status] || status}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="mb-4 space-y-1">
          <h3 className="text-[15px] font-extrabold leading-snug text-slate-900">{problem.title}</h3>
          <p className="text-[13px] leading-relaxed text-slate-500">
            {isDescriptionExpanded
              ? problem.description
              : problem.description?.length > 100
                ? `${problem.description.slice(0, 100)}…`
                : problem.description}
            {problem.description?.length > 100 && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsDescriptionExpanded(!isDescriptionExpanded) }}
                className="mr-1 font-semibold text-blue-500 hover:text-blue-700 hover:underline transition-colors"
              >
                {isDescriptionExpanded ? "عرض أقل" : "عرض المزيد"}
              </button>
            )}
          </p>
        </div>

        {/* ── Tags ── */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 border border-slate-100">
            <MapPin size={10} className="text-blue-400" />
            {problem.address?.split(",")[0] || "موريتانيا"}
          </span>
          <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 border border-blue-100">
            {problem.profession || "خدمة عامة"}
          </span>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {(canOffer || workerOffer) ? (
              <button
                onClick={() => setOpenOffers((c) => !c)}
                className={`inline-flex h-8 items-center gap-1.5 rounded-xl px-3.5 text-xs font-bold transition-all ${
                  workerOffer?.status === "SELECTED"
                    ? "animate-pulse bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
              >
                {workerOffer?.status === "SELECTED"   ? "بانتظار ردك"
                  : workerOffer?.status === "IN_PROGRESS" ? "حالة التنفيذ"
                  : workerOffer                            ? "عرض حالتي"
                  : "تقديم عرض"}
              </button>
            ) : isOwner ? (
              <button
                onClick={() => setOpenOffers((c) => !c)}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {status === "IN_PROGRESS" ? "العامل المنفذ" : `العروض (${offers.length || 0})`}
              </button>
            ) : null}

            {isOwner && status === "IN_PROGRESS" && (
              <button
                onClick={() => onStatusChange?.(problem, "done")}
                className="inline-flex h-8 items-center gap-1 rounded-xl bg-emerald-600 px-3.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                تأكيد الإنجاز
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => onStatusChange?.(problem, "cancel")}
                className="inline-flex h-8 items-center gap-1 rounded-xl border border-red-200 bg-white px-3.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <XCircle size={13} />
                {"\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0645\u0647\u0645\u0629"}
              </button>
            )}
          </div>

          {/* Edit / Delete */}
          <div className="flex items-center gap-1.5">
            {canEdit && (
              <button
                onClick={() => onEdit?.(problem)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500 transition-all"
              >
                <Pencil size={13} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete?.(problem)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ── Expandable Section ── */}
        <AnimatePresence>
          {openOffers && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">

                {/* Worker: submit offer */}
                {canOffer && !workerOffer && (
                  <div className="space-y-2.5">
                    <textarea
                      value={offerText}
                      onChange={(e) => setOfferText(e.target.value)}
                      placeholder="اكتب عرضك: السعر، المدة، وملاحظات التنفيذ…"
                      rows={3}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    <button
                      onClick={handleOfferSubmit}
                      disabled={!offerText.trim()}
                      className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    >
                      <Send size={13} />
                      إرسال العرض
                    </button>
                  </div>
                )}

                {/* Owner: list of offers */}
                {isOwner && (
                  <div className="space-y-2.5">
                    {loadingOffers ? (
                      <p className="py-8 text-center text-xs text-slate-300">جارٍ جلب العروض…</p>
                    ) : offers.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-xs text-slate-300">
                        لا توجد عروض بعد
                      </div>
                    ) : (
                      offers.map((offer) => (
                        <div key={offer.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-extrabold text-blue-700">
                                {offer.workerName?.[0] || "ع"}
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-slate-900">{offer.workerName}</p>
                                <p className="text-[11px] text-slate-400">{offer.workerJob || "عامل"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getOfferBadgeClass(String(offer.status || "").toUpperCase())}`}>
                                {OFFER_STATUS_LABELS[String(offer.status || "").toUpperCase()] || offer.status}
                              </span>
                              {String(offer.status || "").toUpperCase() === "PENDING" && status === "OPEN" && !waitingForWorkerResponse && (
                                <button
                                  onClick={() => handleSelectOfferClick(offer.id)}
                                  className="h-7 rounded-lg bg-blue-600 px-3 text-[11px] font-bold text-white hover:bg-blue-700 transition-colors"
                                >
                                  اختيار
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 text-[12px] leading-relaxed text-slate-600">
                            {offer.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Owner: in-progress worker info */}
                {isOwner && (status === "IN_PROGRESS" || waitingForWorkerResponse) && selectedOffer && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                    <p className="mb-3 text-xs font-bold text-blue-700">العامل المنفذ</p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { label: "الاسم", value: selectedOffer.workerName || "غير متوفر" },
                        { label: "المهنة", value: selectedOffer.workerJob || "غير محددة" },
                        { label: "الهاتف", value: selectedOffer.workerPhoneNumber || "غير متوفر", ltr: true },
                      ].map(({ label, value, ltr }) => (
                        <div key={label} className="rounded-xl border border-blue-100 bg-white p-2.5 text-center">
                          <p className="mb-0.5 text-[10px] font-semibold text-slate-400">{label}</p>
                          <p className={`text-[12px] font-bold text-slate-800 ${ltr ? "dir-ltr" : ""}`} dir={ltr ? "ltr" : undefined}>
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Worker: offer status */}
                {workerOffer && (
                  <div className={`rounded-xl border p-4 ${
                    workerOffer.status === "SELECTED"     ? "border-amber-200 bg-amber-50"   :
                    workerOffer.status === "IN_PROGRESS"  ? "border-blue-200 bg-blue-50"     :
                    workerOffer.status === "COMPLETED"    ? "border-emerald-200 bg-emerald-50" :
                    ["CLOSED","REFUSED","WORKER_REFUSED"].includes(workerOffer.status)
                                                          ? "border-red-200 bg-red-50"       :
                    "border-slate-200 bg-slate-50"
                  }`}>
                    <p className={`mb-2 text-[10px] font-extrabold uppercase tracking-widest ${
                      workerOffer.status === "SELECTED"     ? "text-amber-600"   :
                      workerOffer.status === "IN_PROGRESS"  ? "text-blue-600"    :
                      workerOffer.status === "COMPLETED"    ? "text-emerald-600" :
                      ["CLOSED","REFUSED","WORKER_REFUSED"].includes(workerOffer.status)
                                                            ? "text-red-500"     :
                      "text-slate-400"
                    }`}>
                      {offerStatusLabel}
                    </p>
                    <p className="rounded-lg border border-white/60 bg-white/70 px-3.5 py-2.5 text-[12px] leading-relaxed text-slate-600">
                      {workerOffer.message}
                    </p>

                    {workerOffer.status === "SELECTED" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => onWorkerDecision?.(workerOffer.id, "accept")}
                          className="flex h-9 flex-1 items-center justify-center rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                        >
                          قبول وبدء التنفيذ
                        </button>
                        <button
                          onClick={() => onWorkerDecision?.(workerOffer.id, "refuse")}
                          className="flex h-9 flex-1 items-center justify-center rounded-xl border border-red-200 bg-white text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Owner: rate worker */}
                {isOwner && status === "COMPLETED" && !problem.isRated && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <button
                      onClick={() => setIsRating((c) => !c)}
                      className="flex items-center gap-2 text-[13px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      <Star size={15} className="text-amber-400" fill="currentColor" />
                      {isRating ? "إخفاء التقييم" : "تقييم العامل"}
                    </button>

                    {isRating && (
                      <div className="mt-3 space-y-3">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((v) => (
                            <button
                              key={v}
                              onClick={() => setRatingData((c) => ({ ...c, stars: v }))}
                              className={`transition-transform hover:scale-110 active:scale-95 ${ratingData.stars >= v ? "text-amber-400" : "text-slate-200"}`}
                            >
                              <Star size={26} fill={ratingData.stars >= v ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="اكتب تعليقك هنا…"
                          value={ratingData.comment}
                          onChange={(e) => setRatingData((c) => ({ ...c, comment: e.target.value }))}
                          rows={3}
                          className="w-full resize-none rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700 placeholder-slate-300 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                        />
                        <button
                          onClick={async () => {
                            if (!ratingData.stars) { setOfferError("يرجى تحديد التقييم بالنجوم."); return }
                            setRatingLoading(true); setOfferError("")
                            try {
                              await createTaskRating(problem.id, ratingData)
                              setIsRating(false)
                              onStatusChange?.(problem, "rated")
                            } catch (err) {
                              setOfferError(err.message || "تعذر إرسال التقييم.")
                            } finally { setRatingLoading(false) }
                          }}
                          disabled={ratingLoading}
                          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {ratingLoading ? "جارٍ الإرسال…" : "إرسال التقييم"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {offerError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-[11px] font-semibold text-red-500">
                    {offerError}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  )
}
