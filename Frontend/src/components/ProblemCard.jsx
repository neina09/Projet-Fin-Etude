import React, { useEffect, useState } from "react"
import {
  Briefcase,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Navigation,
  Pencil,
  Trash2,
  User,
  XCircle,
  Map,
  Zap,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Bookmark,
  Star,
  Send
} from "lucide-react"
import { getOffersForTask, resolveAssetUrl } from "../api"
import LeafletMapPicker from "./LeafletMapPicker"
import { motion, AnimatePresence } from "framer-motion"

const TASK_STATUS_LABELS = {
  PENDING_REVIEW: "تحت المراجعة",
  OPEN: "متاح",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مهمة مكتملة",
  CANCELLED: "طلب ملغى",
  CLOSED: "منتهية"
}

const OFFER_STATUS_LABELS = {
  PENDING: "بانتظار الرد",
  SELECTED: "تم اختيارك",
  REFUSED: "مرفوض",
  WORKER_REFUSED: "معتذر",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
  CLOSED: "مغلق"
}

function badgeClass(status) {
  if (status === "COMPLETED") return "bg-emerald-50 text-emerald-600 border-emerald-100"
  if (status === "IN_PROGRESS") return "bg-blue-50 text-[#1d4ed8] border-blue-100"
  if (status === "SELECTED") return "bg-indigo-50 text-indigo-600 border-indigo-100"
  if (status === "PENDING_REVIEW") return "bg-slate-50 text-slate-400 border-slate-100"
  if (status === "CANCELLED" || status === "REFUSED" || status === "WORKER_REFUSED") return "bg-red-50 text-red-600 border-red-100"
  if (status === "CLOSED") return "bg-slate-50 text-slate-400 border-slate-100"
  return "bg-blue-50 text-[#1d4ed8] border-blue-100"
}

export default function ProblemCard({
  problem = {},
  currentUser,
  onEdit,
  onDelete,
  onStatusChange,
  workerOffer,
  currentWorkerStatus,
  availableWorkers = [],
  currentWorkerProfile,
  onSubmitOffer,
  onSelectOffer,
  onWorkerDecision,
  onRequestWorker
}) {
  const [open, setOpen] = useState(false)
  const [offers, setOffers] = useState([])
  const [loadingOffers, setLoadingOffers] = useState(false)
  const [offerText, setOfferText] = useState("")
  const [offerError, setOfferError] = useState("")
  const [sendingOffer, setSendingOffer] = useState(false)
  const [deciding, setDeciding] = useState(false)
  const [selectingOfferId, setSelectingOfferId] = useState(null)
  const [distanceKm, setDistanceKm] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [requestedWorkerId, setRequestedWorkerId] = useState("")
  const [referralMessage, setReferralMessage] = useState("")
  const [requestingWorker, setRequestingWorker] = useState(false)

  const status = String(problem.status || "OPEN").toUpperCase()
  const title = problem.title || "عنوان المهمة"
  const description = problem.description || ""
  const displayAddress = problem.address || "الموقع غير محدد"
  const profession = problem.profession || "خدمة عامة"
  const latitude = Number(problem.latitude)
  const longitude = Number(problem.longitude)
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)
  const isOwner = Boolean(currentUser?.id && problem.userId === currentUser.id)
  const isWorker = currentUser?.role === "WORKER"
  const isAdmin = currentUser?.role === "ADMIN"
  const canOffer = isWorker && !isOwner && status === "OPEN"
  const canMarkDone = isOwner && status === "IN_PROGRESS"
  const canCancelTask = isOwner && (status === "OPEN" || status === "PENDING_REVIEW")
  const isCurrentWorkerBusy = currentWorkerStatus === "BUSY"
  const referralCandidates = availableWorkers.filter((worker) => (
    worker?.id &&
    worker.id !== currentWorkerProfile?.id &&
    worker.userId !== problem.userId &&
    worker.verificationStatus === "VERIFIED" &&
    worker.availability === "AVAILABLE"
  ))

  useEffect(() => {
    if (!open || !isOwner || status === "PENDING_REVIEW") return
    setLoadingOffers(true)
    getOffersForTask(problem.id)
      .then(data => setOffers(Array.isArray(data) ? data : []))
      .catch(err => setOfferError(err.message || "تعذر تحميل العروض"))
      .finally(() => setLoadingOffers(false))
  }, [isOwner, open, problem.id, status])

  const handleOfferSubmit = async () => {
    if (!offerText.trim()) return
    setSendingOffer(true)
    setOfferError("")
    try {
      const createdOffer = await onSubmitOffer?.(problem.id, offerText.trim())
      if (createdOffer) setOffers(c => [createdOffer, ...c])
      setOfferText("")
    } catch (err) { setOfferError(err.message || "فشل إرسال العرض") }
    finally { setSendingOffer(false) }
  }

  const handleDecision = async (decision) => {
    setDeciding(true)
    try { await onWorkerDecision?.(workerOffer.id, decision) }
    catch (err) { setOfferError(err.message || "فشل تسجيل القرار") }
    finally { setDeciding(false) }
  }

  const handleSelectOffer = async (offerId) => {
    setSelectingOfferId(offerId)
    setOfferError("")
    try {
      await onSelectOffer?.(offerId)
    } catch (err) {
      setOfferError(err.message || "تعذر اختيار هذا العامل.")
    } finally {
      setSelectingOfferId(null)
    }
  }

  const handleRequestWorker = async () => {
    if (!requestedWorkerId || !referralMessage.trim()) return
    setRequestingWorker(true)
    setOfferError("")
    try {
      await onRequestWorker?.(problem.id, Number(requestedWorkerId), referralMessage.trim())
      setRequestedWorkerId("")
      setReferralMessage("")
    } catch (err) {
      setOfferError(err.message || "تعذر إرسال طلب العامل الآخر")
    } finally {
      setRequestingWorker(false)
    }
  }

  const isUrgent = status === "PENDING_REVIEW"
  const ownerImageUrl = resolveAssetUrl(isOwner && currentUser?.imageUrl ? currentUser.imageUrl : problem.userImageUrl)

  return (
    <article className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md mb-6 w-full">
      <div className="flex flex-col gap-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-start gap-4 order-2 md:order-1 flex-1">
            <div className="h-16 w-16 bg-[#18181b] rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
               {ownerImageUrl ? (
                  <img src={ownerImageUrl} alt={problem.userName || "صاحب الطلب"} className="h-full w-full object-cover" />
               ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-amber-400 opacity-60">
                     <User size={32} />
                  </div>
               )}
            </div>
            
            <div className="flex flex-col justify-center gap-1 mt-1">
              <div className="flex items-center gap-2">
                <h4 className="text-[17px] font-black text-slate-900">{problem.userName || "صاحب الطلب"}</h4>
                <div className="text-blue-500 rounded-full flex items-center justify-center h-4 w-4">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1 text-slate-400">
                   <Clock size={12} /> {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString("ar") : "مهمة جديدة"}
                </span>
                {problem.distanceKm != null && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span>{problem.distanceKm} كم</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 order-1 md:order-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 text-left">
                نُشر منذ {problem.createdAt ? Math.max(1, Math.floor((Date.now() - new Date(problem.createdAt).getTime()) / 3600000)) + " ساعة" : "وقت قصير"}
              </span>
              {isUrgent && (
                <span className="bg-red-50 text-red-500 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest border border-red-100">
                  <Zap size={10} fill="currentColor" /> عاجل
                </span>
              )}
            </div>
            <div className="bg-blue-50/50 text-[#1d4ed8] text-sm font-black px-5 py-2 rounded-full mt-2 self-start md:self-end text-center w-auto inline-block border border-blue-100/30">
               {profession}
            </div>
          </div>
        </div>

        <div className="space-y-4 pr-1 mt-2">
          <h3 className="text-[22px] font-black text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-4xl opacity-90">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap mt-2">
          <span className="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 text-[10px] font-black px-5 py-2 rounded-2xl flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-widest shadow-sm">
            {displayAddress.split(',')[0]} <MapPin size={14} className="text-slate-400" />
          </span>
          <span className="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 text-[10px] font-black px-5 py-2 rounded-2xl flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-widest shadow-sm">
            {profession} <Briefcase size={14} className="text-slate-400" />
          </span>
        </div>

        <div className="flex items-center gap-4 mt-6 w-full justify-start">
          {canOffer || workerOffer ? (
             <button 
                onClick={() => setOpen(!open)}
                className="flex-1 bg-[#1d4ed8] hover:bg-blue-700 text-white font-black text-[14px] py-4 rounded-[1.25rem] shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
             >
                {workerOffer ? "إدارة العرض المُقدم" : "تقديم عرض"}
             </button>
          ) : isOwner ? (
             <button 
                onClick={() => setOpen(!open)}
                className="flex-1 bg-[#1d4ed8] hover:bg-blue-700 text-white font-black text-[14px] py-4 rounded-[1.25rem] shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
             >
                كافة العروض ({offers.length || 0})
             </button>
          ) : (
             <button disabled className="flex-1 bg-slate-50 text-slate-400 font-black text-[14px] py-4 rounded-[1.25rem] cursor-not-allowed border border-slate-100">
                غير قابل للتقديم
             </button>
          )}

          <button onClick={() => setOpen(!open)} className="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-[#1d4ed8] shadow-sm font-black text-[13px] px-8 py-4 rounded-[1.25rem] transition-colors whitespace-nowrap">
            {open ? "إغلاق" : "التفاصيل"}
          </button>
          
          <button className="bg-slate-50 hover:bg-slate-100 border border-slate-100 shadow-sm text-slate-400 hover:text-slate-600 flex items-center justify-center p-4 h-14 w-14 rounded-[1.25rem] transition-colors">
            <Bookmark size={20} />
          </button>
          
          {(isAdmin || isOwner) && (
             <button onClick={() => onDelete?.(problem)} className="bg-white hover:bg-red-50 text-red-500 flex items-center justify-center p-4 h-14 w-14 rounded-[1.25rem] transition-colors border border-red-100 shadow-sm">
                <Trash2 size={20} />
             </button>
          )}
        </div>
      </div>
      
      {(canMarkDone || canCancelTask) && (
         <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
            {canMarkDone && (
              <button onClick={() => onStatusChange?.(problem, "done")} className="flex bg-emerald-50 text-emerald-600 font-bold px-6 py-3 rounded-[1rem] text-sm items-center gap-2 hover:bg-emerald-100 transition-colors border border-emerald-100">
                 <CheckCircle2 size={18} /> اعتماد إتمام العمل
              </button>
            )}
            {canCancelTask && (
              <button onClick={() => onStatusChange?.(problem, "cancel")} className="flex bg-red-50 text-red-500 font-bold px-6 py-3 rounded-[1rem] text-sm items-center gap-2 hover:bg-red-100 transition-colors border border-red-100/50">
                 <XCircle size={18} /> {status === "PENDING_REVIEW" ? "سحب الطلب" : "إلغاء المهمة"}
              </button>
            )}
         </div>
      )}

      {isWorker && workerOffer?.status === "SELECTED" && (
         <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 rounded-[1.25rem] bg-[#1d4ed8] shadow-lg text-white">
            <div>
               <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200 mb-2">تم اختيارك لتنفيذ المهمة!</p>
               <p className="text-sm font-bold text-white/90">برجاء تأكيد العمل لتبدأ العملية فوراً.</p>
            </div>
            <div className="flex gap-4 items-center">
               <button onClick={() => handleDecision("accept")} disabled={deciding} className="bg-white text-[#1d4ed8] text-sm font-black px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-50 transition-all whitespace-nowrap">
                  <CheckCircle2 size={16} /> قبول
               </button>
               <button onClick={() => handleDecision("refuse")} disabled={deciding} className="bg-blue-700/50 border border-blue-400 text-white text-sm font-black px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-800 transition-all whitespace-nowrap">
                  <XCircle size={16} /> اعتذار
               </button>
            </div>
         </div>
      )}

      <AnimatePresence>
        {open && (
           <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-6 pt-6 border-t border-slate-100"
           >
              <div className="space-y-10">
                 {isOwner && (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <h4 className="text-xl font-black text-slate-900 border-r-4 border-[#1d4ed8] pr-4">عروض المحترفين</h4>
                          <span className="bg-blue-50 text-[#1d4ed8] text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{offers.length} عرض متاح</span>
                       </div>
                       
                       {loadingOffers ? (
                          <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                             <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-[#1d4ed8] animate-spin mb-4" />
                             <p className="font-bold text-sm">جاري جلب العروض من مركز البيانات...</p>
                          </div>
                       ) : offers.length ? (
                          <div className="grid gap-5">
                             {offers.map(o => (
                                <div key={o.id} className="relative p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group">
                                   <div className="absolute top-0 right-0 w-1.5 h-full bg-[#1d4ed8] rounded-r-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                   <div className="flex flex-col md:flex-row gap-6">
                                      <div className="flex items-center gap-5 md:w-1/3 border-b md:border-b-0 md:border-l border-slate-100 pb-5 md:pb-0 md:pl-6">
                                         <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm transition-transform group-hover:scale-110">
                                            {o.workerImageUrl ? (
                                              <img src={o.workerImageUrl} alt={o.workerName} className="h-full w-full object-cover" />
                                            ) : (
                                              <div className="flex h-full w-full items-center justify-center text-[#1d4ed8] font-black text-xl">
                                                {o.workerName?.[0] || <User size={20} />}
                                              </div>
                                            )}
                                         </div>
                                         <div className="flex-1">
                                            <h5 className="font-black text-slate-900 text-[15px] group-hover:text-[#1d4ed8] transition-colors">{o.workerName}</h5>
                                            <div className="flex items-center gap-2 mt-1.5">
                                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{o.workerJob || "محترف معتمد"}</span>
                                               <span className={`flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-md border ${o.workerAvailability === "BUSY" ? "text-amber-600 bg-amber-50 border-amber-100/50" : "text-emerald-600 bg-emerald-50 border-emerald-100/50"}`}>
                                                  {o.workerAvailability === "BUSY" ? "مشغول" : "متاح"}
                                               </span>
                                            </div>
                                         </div>
                                      </div>
                                      <div className="flex-1 flex flex-col justify-between">
                                         <div className="relative mb-4">
                                            <MessageSquare size={20} className="absolute -right-3 -top-3 text-blue-100/50 opacity-50 rotate-12" />
                                            <p className="text-sm font-bold text-slate-600 bg-slate-50/50 px-5 py-4 rounded-[1.25rem] border border-slate-100/80 leading-relaxed shadow-inner">
                                               {`"${o.message}"`}
                                            </p>
                                         </div>
                                         <div className="flex items-center justify-between">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase text-center border shadow-sm ${badgeClass(o.status)}`}>
                                               {OFFER_STATUS_LABELS[o.status] || o.status}
                                            </span>
                                            {o.status === "PENDING" && status === "OPEN" && (
                                               <button onClick={() => handleSelectOffer(o.id)} disabled={o.workerAvailability === "BUSY" || selectingOfferId === o.id} className="bg-[#1d4ed8] hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-xs transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg">
                                                  <CheckCircle2 size={16} />
                                                  {selectingOfferId === o.id ? "جاري..." : "توظيف"}
                                               </button>
                                            )}
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       ) : (
                          <div className="py-16 text-center rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center gap-4">
                             <Briefcase size={24} className="text-slate-300" />
                             <p className="text-xs font-bold text-slate-400">لا توجد عروض لهذه المهمة بعد.</p>
                          </div>
                       )}
                    </div>
                 )}

                 {canOffer && (
                    <div className="space-y-6">
                       <h4 className="text-xl font-black text-slate-900 border-r-4 border-[#1d4ed8] pr-4">قدم عرضك الآن</h4>
                       <textarea value={offerText} onChange={e => setOfferText(e.target.value)} disabled={sendingOffer || isCurrentWorkerBusy} placeholder="اشرح لماذا أنت الأنسب.." className="w-full min-h-[120px] p-6 text-sm font-medium bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:bg-white outline-none" />
                       <button onClick={handleOfferSubmit} disabled={sendingOffer || !offerText.trim() || isCurrentWorkerBusy} className="w-full bg-[#1d4ed8] text-white rounded-[1.25rem] py-4 text-sm font-black shadow-lg shadow-blue-200 flex justify-center items-center gap-2">
                          {sendingOffer ? "جاري الإرسال..." : "إرسال العرض"} <Send size={16} />
                       </button>
                    </div>
                 )}

                 {canOffer && referralCandidates.length > 0 && (
                    <div className="space-y-5 rounded-[1.5rem] border border-violet-100 bg-violet-50/70 p-6">
                       <h4 className="text-lg font-black text-slate-900">طلب عامل آخر</h4>
                       <select
                         value={requestedWorkerId}
                         onChange={(e) => setRequestedWorkerId(e.target.value)}
                         disabled={requestingWorker}
                         className="w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none"
                       >
                         <option value="">اختر العامل المطلوب</option>
                         {referralCandidates.map((worker) => (
                           <option key={worker.id} value={worker.id}>
                             {worker.name} - {worker.job || "عامل"}
                           </option>
                         ))}
                       </select>
                       <textarea
                         value={referralMessage}
                         onChange={(e) => setReferralMessage(e.target.value)}
                         disabled={requestingWorker}
                         placeholder="اكتب ملاحظة قصيرة للعامل الآخر..."
                         className="w-full min-h-[100px] rounded-[1.5rem] border border-violet-100 bg-white p-4 text-sm font-medium text-slate-700 outline-none"
                       />
                       <button
                         onClick={handleRequestWorker}
                         disabled={requestingWorker || !requestedWorkerId || !referralMessage.trim()}
                         className="w-full rounded-[1.25rem] bg-violet-600 py-4 text-sm font-black text-white shadow-lg shadow-violet-200 disabled:opacity-50"
                       >
                         {requestingWorker ? "جاري الإرسال..." : "إرسال طلب العامل"}
                       </button>
                    </div>
                 )}

                 {workerOffer && (
                   <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[1.5rem]">
                      <p className="text-xs font-black text-[#1d4ed8] mb-2">عرضك المُقدم:</p>
                      <p className="text-sm font-bold text-slate-600 italic">{`"${workerOffer.message}"`}</p>
                   </div>
                 )}

                 <div className="pt-6 border-t border-slate-50">
                    <button onClick={() => setShowMap(!showMap)} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-[#1d4ed8] transition-colors uppercase tracking-widest">
                       <Map size={14} /> {showMap ? "إخفاء الخريطة" : "عرض موقع المهمة على الخريطة"}
                    </button>
                    {showMap && (
                       <div className="mt-4 overflow-hidden rounded-[2rem] border border-slate-100 shadow-inner relative animate-in slide-in-from-top-2">
                          {hasCoordinates ? (
                             <LeafletMapPicker isListView height="250px" showCurrentLocation taskLocation={{ lat: latitude, lng: longitude }} taskLabel={title} onDistanceChange={setDistanceKm} />
                          ) : (
                             <div className="h-32 flex items-center justify-center bg-slate-50 text-slate-300 text-[10px] font-black">الموقع غير متاح</div>
                          )}
                       </div>
                    )}
                 </div>

                 {offerError && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100">{offerError}</div>}
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
