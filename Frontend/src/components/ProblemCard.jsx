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
  const [selectingOfferId, setSelectingOfferId] = useState(null)
  const [distanceKm, setDistanceKm] = useState(null)

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

  // Placeholder mock data matching requested design logic
  const isUrgent = status === "PENDING_REVIEW"
  // Update ownerImageUrl to prefer currentUser.imageUrl if the logged in user is the owner
  const ownerImageUrl = resolveAssetUrl(isOwner && currentUser?.imageUrl ? currentUser.imageUrl : problem.userImageUrl)

  return (
    <article className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md mb-6 w-full">
      <div className="flex flex-col gap-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* User Info (Right) */}
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

          {/* Time & Badges (Left) */}
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

        {/* Content Section */}
        <div className="space-y-4 pr-1 mt-2">
          <h3 className="text-[22px] font-black text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-4xl opacity-90">
            {description}
          </p>
        </div>

        {/* Tags Section */}
        <div className="flex items-center gap-3 flex-wrap mt-2">
          <span className="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 text-[10px] font-black px-5 py-2 rounded-2xl flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-widest shadow-sm">
            {displayAddress.split(',')[0]} <MapPin size={14} className="text-slate-400" />
          </span>
          <span className="bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 text-[10px] font-black px-5 py-2 rounded-2xl flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-widest shadow-sm">
            {profession} <Briefcase size={14} className="text-slate-400" />
          </span>
        </div>

        {/* Actions Footer */}
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
            التفاصيل
          </button>
          
          <button className="bg-slate-50 hover:bg-slate-100 border border-slate-100 shadow-sm text-slate-400 hover:text-slate-600 flex items-center justify-center p-4 h-14 w-14 rounded-[1.25rem] transition-colors">
            <Bookmark size={20} />
          </button>
          
          {isOwner && (isAdmin || isOwner) && (
             <button onClick={() => onDelete?.(problem)} className="bg-white hover:bg-red-50 text-red-500 flex items-center justify-center p-4 h-14 w-14 rounded-[1.25rem] transition-colors border border-red-100 shadow-sm">
               <Trash2 size={20} />
             </button>
          )}
        </div>
      </div>
      
      {/* Sub-actions for active tasks / owner states */}
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

      {/* Selected worker alert */}
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

      {/* Collapsible Details Content (Map & Offers) */}
      <AnimatePresence>
        {open && (
           <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-6 pt-6 border-t border-slate-100"
           >
              <div className="space-y-10">
                 {/* Map location box */}
                 <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 shadow-sm relative">
                    {hasCoordinates ? (
                       <LeafletMapPicker isListView height="300px" showCurrentLocation taskLocation={{ lat: latitude, lng: longitude }} taskLabel={title} onDistanceChange={setDistanceKm} />
                    ) : (
                       <div className="flex h-48 w-full flex-col items-center justify-center gap-4 bg-slate-50 text-slate-400">
                          <Map size={36} />
                          <p className="text-xs font-black uppercase tracking-widest">الموقع غير محدد أوتوماتيكياً</p>
                       </div>
                    )}
                 </div>

                 {/* Offers List (Owner View) */}
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
                                      {/* Worker Info Column */}
                                      <div className="flex items-center gap-5 md:w-1/3 border-b md:border-b-0 md:border-l border-slate-100 pb-5 md:pb-0 md:pl-6">
                                         <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm transition-transform group-hover:scale-110">
                                            {o.workerImageUrl ? (
                                              <img src={o.workerImageUrl} alt={o.workerName || "عامل"} className="h-full w-full object-cover" />
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
                                               <span className={`flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-md border ${
                                                 o.workerAvailability === "BUSY"
                                                   ? "text-amber-600 bg-amber-50 border-amber-100/50"
                                                   : "text-emerald-600 bg-emerald-50 border-emerald-100/50"
                                               }`}>
                                                  {o.workerAvailability === "BUSY" ? "مشغول" : "متاح"}
                                               </span>
                                            </div>
                                         </div>
                                      </div>
                                      
                                      {/* Offer Content & Actions */}
                                      <div className="flex-1 flex flex-col justify-between">
                                         <div className="relative mb-4">
                                            <MessageSquare size={20} className="absolute -right-3 -top-3 text-blue-100/50 opacity-50 rotate-12" />
                                            <p className="text-sm font-bold text-slate-600 bg-slate-50/50 px-5 py-4 rounded-[1.25rem] border border-slate-100/80 leading-relaxed shadow-inner">
                                               "{o.message}"
                                            </p>
                                         </div>
                                         
                                         <div className="flex items-center justify-between">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase text-center border shadow-sm ${badgeClass(o.status)}`}>
                                               {OFFER_STATUS_LABELS[o.status] || o.status}
                                            </span>
                                            
                                            {o.status === "PENDING" && status === "OPEN" && (
                                               <button onClick={() => handleSelectOffer(o.id)} disabled={o.workerAvailability === "BUSY" || selectingOfferId === o.id} className="bg-[#1d4ed8] hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-xs active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-500/20">
                                                  <CheckCircle2 size={16} />
                                                  {selectingOfferId === o.id ? "جاري الاعتماد..." : o.workerAvailability === "BUSY" ? "العامل منشغل حالياً" : "قبول وتوظيف"}
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
                             <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <Briefcase size={24} className="text-slate-300" />
                             </div>
                             <div>
                                <h5 className="text-base font-black text-slate-900 mb-1">لا توجد عروض حتى الآن</h5>
                                <p className="text-xs font-bold text-slate-400">سيتم إشعارك فور تقدم أحد المحترفين لهذه المهمة.</p>
                             </div>
                          </div>
                       )}
                    </div>
                 )}

                 {/* Submit Offer (Worker View) */}
                 {canOffer && (
                    <div className="space-y-6">
                       <h4 className="text-xl font-black text-slate-900 border-r-4 border-[#1d4ed8] pr-4">قدم عرضاً لتنفيذ المهمة</h4>
                       <textarea 
                          value={offerText} 
                          onChange={e => setOfferText(e.target.value)} 
                          disabled={sendingOffer || isCurrentWorkerBusy} 
                          placeholder={isCurrentWorkerBusy ? "أنت منشغل بمهمة أخرى..." : "اشرح قدراتك والسعر والمدة.. (مثال: أستطيع تنفيذ المطلوب غداً بـ ٣٠٠ ريال)"} 
                          className="w-full min-h-[140px] p-6 text-sm font-medium bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:bg-white focus:border-blue-500 outline-none resize-none transition-all"
                       />
                       <button onClick={handleOfferSubmit} disabled={sendingOffer || !offerText.trim() || isCurrentWorkerBusy} className="w-full bg-[#1d4ed8] text-white rounded-[1.25rem] py-4 text-sm font-black active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:bg-slate-300">
                          {sendingOffer ? "جاري الإرسال..." : "إرسال العرض"} 
                          <Send size={16} />
                       </button>
                    </div>
                 )}

                 {/* Worker's Past Offer details */}
                 {workerOffer && (
                    <div className="space-y-4 p-6 bg-blue-50/30 border border-blue-100 rounded-[1.5rem]">
                       <h4 className="text-sm font-black text-[#1d4ed8]">عرضك المُقدم سابقاً:</h4>
                       <p className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200 shadow-sm leading-relaxed">"{workerOffer.message}"</p>
                    </div>
                 )}

                 {offerError && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100">{offerError}</div>}
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
