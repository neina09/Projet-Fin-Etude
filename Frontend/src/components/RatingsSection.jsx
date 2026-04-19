import React, { useEffect, useState } from "react"
import { Star, MessageSquare, Briefcase, CheckCircle2, Zap } from "lucide-react"
import { getWorkerRatings, createTaskRating, getMyWorkerProfile } from "../api"

export default function RatingsSection({ currentUser, myTasks = [], myOffers = [] }) {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingError, setRatingError] = useState("")

  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [taskToRate, setTaskToRate] = useState(null)
  const [ratingScore, setRatingScore] = useState(5)
  const [ratingComment, setRatingComment] = useState("")
  const [submittingRating, setSubmittingRating] = useState(false)

  const isWorker = currentUser?.role === "WORKER"

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true)
      try {
        if (isWorker) {
          // Worker fetches their own received ratings
          const profile = await getMyWorkerProfile()
          if (profile?.id) {
            const data = await getWorkerRatings(profile.id)
            setRatings(Array.isArray(data) ? data : [])
          }
        }
      } catch (err) {
        setRatingError("تعذر تحميل التقييمات حالياً.")
      } finally {
        setLoading(false)
      }
    }
    fetchRatings()
  }, [isWorker])

  // Customer logic
  const completedTasks = myTasks.filter(t => String(t.status).toUpperCase() === "COMPLETED")
  // Note: we assume tasks have `rated` or `isRated` boolean from the backend
  const unratedTasks = completedTasks.filter(t => !t.rated && !t.isRated && t.assignedWorkerId)
  const ratedTasks = completedTasks.filter(t => t.rated || t.isRated || !t.assignedWorkerId)

  const handleRateSubmit = async () => {
    if (!taskToRate) return
    setSubmittingRating(true)
    try {
      await createTaskRating(taskToRate.id, {
        stars: ratingScore,
        comment: ratingComment
      })
      // Update local state to remove from unrated
      taskToRate.rated = true
      setRatingModalOpen(false)
      setTaskToRate(null)
      setRatingComment("")
      setRatingScore(5)
    } catch (err) {
      alert("فشل في تقديم التقييم: " + err.message)
    } finally {
      setSubmittingRating(false)
    }
  }

  const openRatingModal = (task) => {
    setTaskToRate(task)
    setRatingScore(5)
    setRatingComment("")
    setRatingModalOpen(true)
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl">
      
      {/* Header section */}
      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-2 bg-[#1d4ed8]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
               <Star className="text-amber-500" size={32} /> 
               {isWorker ? "تقييماتي وعروضي" : "تقييم المحترفين"}
             </h2>
             <p className="text-slate-500 font-medium">
               {isWorker 
                 ? "تابع تعليقات العملاء، وحافظ على جودة خدمتك لزيادة فرصك في العمل." 
                 : "شارك تجربتك وساهم في بناء مجتمع موثوق مبني على الشفافية والاحترافية."}
             </p>
          </div>
          {isWorker && (
             <div className="bg-amber-50 rounded-2xl px-8 py-4 border border-amber-100 flex items-center gap-4">
                <div className="text-4xl font-black text-amber-500">
                   {ratings.length > 0 ? (ratings.reduce((acc, r) => acc + (r.score||0), 0) / ratings.length).toFixed(1) : "0.0"}
                </div>
                <div>
                   <div className="flex gap-1 text-amber-500 mb-1">
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                   </div>
                   <p className="text-xs font-black text-amber-700">التقييم العام ({ratings.length} مراجعة)</p>
                </div>
             </div>
          )}
        </div>
      </div>

      {isWorker ? (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Worker Ratings */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-slate-900 border-r-4 border-amber-500 pr-4">آراء العملاء</h3>
               {loading ? (
                  <div className="p-12 text-center text-slate-400 font-bold">جاري تحميل التقييمات...</div>
               ) : ratings.length === 0 ? (
                  <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center gap-4">
                     <Star size={48} className="text-slate-200" />
                     <p className="font-bold text-slate-400">لا توجد تقييمات حتى الآن. نفذ مهام لتحصل على أول تقييم!</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {ratings.map((r, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                           <div className="flex items-center justify-between mb-4">
                              <span className="font-black text-slate-900">{r.customerName || "عميل شغلني"}</span>
                              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-lg">
                                 <Star size={14} fill="currentColor" /> <span className="text-xs font-black">{r.score}</span>
                              </div>
                           </div>
                           <p className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl">"{r.comment || "تقييم بدون تعليق"}"</p>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Worker Offers */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-slate-900 border-r-4 border-[#1d4ed8] pr-4">عروضي المقدمة</h3>
               {myOffers.length === 0 ? (
                  <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center gap-4">
                     <MessageSquare size={48} className="text-slate-200" />
                     <p className="font-bold text-slate-400">لم تقم بتقديم أي عروض بعد. ابدأ بتصفح المهام المتاحة.</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {myOffers.map((o, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                           <div className="flex items-center justify-between mb-3">
                              <span className="font-black text-slate-900 text-sm truncate ml-4">{o.taskTitle || "مهمة مقترحة"}</span>
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase whitespace-nowrap ${o.status === 'SELECTED' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>
                                 {o.status === "SELECTED" ? "تم اختيارك" : o.status === "PENDING" ? "في الانتظار" : o.status}
                              </span>
                           </div>
                           <p className="text-xs font-medium text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100 truncate">"{o.message}"</p>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer - Pending ratings */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-slate-900 border-r-4 border-red-500 pr-4 flex items-center justify-between">
                  بانتظار التقييم
                  {unratedTasks.length > 0 && <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full">{unratedTasks.length} مهام</span>}
               </h3>
               
               {unratedTasks.length === 0 ? (
                  <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center gap-4">
                     <CheckCircle2 size={48} className="text-emerald-200" />
                     <p className="font-bold text-slate-400">ممتاز! قمت بتقييم جميع المهام المكتملة.</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {unratedTasks.map(task => (
                        <div key={task.id} className="bg-white p-6 rounded-[1.5rem] border border-red-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between group hover:border-red-300 transition-all">
                           <div>
                              <p className="font-black text-slate-900 truncate max-w-[200px]">{task.title}</p>
                              <p className="text-xs font-bold text-slate-400 mt-1">المنفذ: {task.workerName || "غير محدد"}</p>
                           </div>
                           <button onClick={() => openRatingModal(task)} className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-6 py-3 rounded-xl transition-colors whitespace-nowrap shadow-sm">
                              قيّم الآن
                           </button>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Customer - Finished & Rated list */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-slate-900 border-r-4 border-emerald-500 pr-4">محترفون تم العمل معهم</h3>
               {ratedTasks.length === 0 ? (
                  <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center gap-4">
                     <Briefcase size={48} className="text-slate-200" />
                     <p className="font-bold text-slate-400">لم يكتمل أي طلب بعد ليتم إضافته إلى الأرشيف.</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {ratedTasks.map(task => (
                        <div key={task.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm opacity-80 hover:opacity-100 transition-opacity flex flex-col sm:flex-row gap-4 items-center justify-between">
                           <div>
                              <p className="font-black text-slate-900 truncate max-w-[200px] text-sm">{task.title}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{task.profession}</p>
                           </div>
                           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100">
                              <CheckCircle2 size={16} /> <span className="text-xs font-black">مكتملة</span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      )}

      {/* Rating Modal for Customer */}
      {ratingModalOpen && taskToRate && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" dir="rtl">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-xl font-black text-slate-900">إضافة تقييم</h3>
                  <button onClick={() => setRatingModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-slate-600 shadow-sm">
                     ✕
                  </button>
               </div>
               
               <div className="p-10 space-y-8">
                  <div className="text-center">
                     <h4 className="font-black text-slate-900 mb-2">{taskToRate.title}</h4>
                     <p className="text-sm font-bold text-slate-500">للمحترف: {taskToRate.workerName || "غير محدد"}</p>
                  </div>
                  
                  <div className="flex justify-center gap-2">
                     {[1,2,3,4,5].map(star => (
                        <button 
                           key={star}
                           onClick={() => setRatingScore(star)}
                           className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110 ${ratingScore >= star ? 'bg-amber-50 text-amber-500 border border-amber-200 shadow-sm' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}
                        >
                           <Star size={32} fill={ratingScore >= star ? "currentColor" : "none"} strokeWidth={ratingScore >= star ? 0 : 2} />
                        </button>
                     ))}
                  </div>
                  
                  <textarea 
                     value={ratingComment}
                     onChange={e => setRatingComment(e.target.value)}
                     placeholder="بإمكانك إضافة تعليق يصف تجربتك ويوضح تقييمك للمحترف..."
                     className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-6 text-sm outline-none focus:border-amber-400 focus:bg-white transition-all h-32 resize-none"
                  />
                  
                  <button onClick={handleRateSubmit} disabled={submittingRating} className="w-full h-16 bg-amber-500 text-white font-black text-lg rounded-[1.5rem] shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all disabled:opacity-50">
                     {submittingRating ? "جاري الاعتماد..." : "نشر التقييم بنجاح"}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  )
}
