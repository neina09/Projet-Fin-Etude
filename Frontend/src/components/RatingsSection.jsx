import React, { useEffect, useState } from "react"
import { Star, MessageSquare, Briefcase, CheckCircle2 } from "lucide-react"
import { getWorkerRatings, createTaskRating, getMyWorkerProfile, resolveAssetUrl } from "../api"

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

  const completedTasks = myTasks.filter(t => String(t.status).toUpperCase() === "COMPLETED")
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

  const avgRating = ratings.length > 0 
    ? (ratings.reduce((acc, r) => acc + (Number(r.stars) || Number(r.score) || 0), 0) / ratings.length).toFixed(1)
    : "5.0"

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl">
      
      {/* Header section */}
      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-2 bg-[#1d4ed8]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
               <Star className="text-amber-500" size={32} /> 
               {isWorker ? "تقييماتي وأدائي" : "تقييم المحترفين"}
             </h2>
             <p className="text-slate-500 font-medium">
               {isWorker 
                 ? "تابع آراء العملاء لتعزيز موثوقيتك وزيادة طلبات العمل." 
                 : "شارك تجربتك وساهم في تمييز المحترفين الموثوقين."}
             </p>
          </div>
          {isWorker && (
             <div className="bg-amber-50 rounded-2xl px-8 py-5 border border-amber-100 flex items-center gap-6 shadow-sm">
                <div className="text-5xl font-black text-amber-500">{avgRating}</div>
                <div>
                   <div className="flex gap-1 text-amber-500 mb-1.5 focus-within:">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={16} fill={i <= Math.round(Number(avgRating)) ? "currentColor" : "none"} />
                      ))}
                   </div>
                   <p className="text-xs font-black text-amber-700">التقييم المتوسط ({ratings.length} تقييم)</p>
                </div>
             </div>
          )}
        </div>
      </div>

      {isWorker ? (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Worker Ratings */}
            <div className="space-y-8">
               <h3 className="text-2xl font-black text-slate-900 border-r-8 border-amber-500 pr-4">آراء العملاء</h3>
               {loading ? (
                  <div className="p-12 text-center text-slate-400 font-bold">جاري تحميل التقييمات...</div>
               ) : ratings.length === 0 ? (
                  <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center gap-6">
                     <Star size={64} className="text-slate-100" />
                     <p className="font-bold text-slate-400 text-lg">لا توجد مراجعات حالياً. ابدأ العمل لتحصل على تقييمات!</p>
                  </div>
               ) : (
                  <div className="space-y-6">
                     {ratings.map((r, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative">
                           <div className="absolute top-0 right-10 h-1 w-20 bg-amber-500/20 rounded-full" />
                           <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-5">
                                 <div className="h-16 w-16 rounded-[1.25rem] bg-indigo-50 overflow-hidden border-2 border-white shadow-md">
                                    {r.userImageUrl ? (
                                       <img src={resolveAssetUrl(r.userImageUrl)} alt={r.userName} className="h-full w-full object-cover" />
                                    ) : (
                                       <div className="h-full w-full flex items-center justify-center text-[#1d4ed8] font-black text-2xl">
                                          {(r.userName || r.customerName || "ع")?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="font-black text-slate-900 text-lg">{r.userName || r.customerName || "عميل عاملك"}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">عميل موثق</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
                                 <Star size={18} fill="currentColor" className="text-amber-500" />
                                 <span className="font-black text-amber-600 text-lg">{Number(r.stars) || Number(r.score) || 0}</span>
                              </div>
                           </div>
                           <div className="relative bg-slate-50/50 p-6 rounded-[1.75rem] border border-slate-100 group-hover:bg-white group-hover:border-amber-100 transition-colors">
                              <MessageSquare size={24} className="absolute -right-3 -top-3 text-amber-100 rotate-12" />
                              <p className="text-slate-600 font-bold leading-relaxed italic text-[15px]">"{r.comment || "تقييم بدون تعليق لفظي"}"</p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Worker Offers */}
            <div className="space-y-8">
               <h3 className="text-2xl font-black text-slate-900 border-r-8 border-[#1d4ed8] pr-4">العروض النشطة</h3>
               {myOffers.length === 0 ? (
                  <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center gap-6">
                     <MessageSquare size={64} className="text-slate-100" />
                     <p className="font-bold text-slate-400 text-lg">لم تقم بتقديم عروض حالياً.</p>
                  </div>
               ) : (
                  <div className="space-y-6">
                     {myOffers.map((o, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                           <div className="flex items-center justify-between mb-5">
                              <span className="font-black text-slate-900 text-lg">{o.taskTitle || "مهمة مقترحة"}</span>
                              <span className={`px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest ${o.status === 'SELECTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                 {o.status === "SELECTED" ? "تم اختيارك" : "بانتظار الرد"}
                              </span>
                           </div>
                           <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                             <p className="text-sm font-bold text-slate-500 leading-relaxed italic">"{o.message}"</p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Customer logic remains consistent with original design but visually refined */}
            <div className="space-y-8">
               <h3 className="text-2xl font-black text-slate-900 border-r-8 border-red-500 pr-4 flex items-center justify-between">
                  بانتظار التقييم
                  {unratedTasks.length > 0 && <span className="bg-red-50 text-red-500 text-xs px-4 py-1.5 rounded-full font-black animate-pulse">{unratedTasks.length}</span>}
               </h3>
               {unratedTasks.length === 0 ? (
                  <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center gap-6 group">
                     <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={40} className="text-emerald-400" />
                     </div>
                     <p className="font-bold text-slate-400 text-lg">كل طلباتك مكتملة ومقيّمة!</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {unratedTasks.map(task => (
                        <div key={task.id} className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between hover:border-red-200 transition-all">
                           <div className="flex-1 text-center sm:text-right">
                              <p className="font-black text-slate-900 text-lg mb-1">{task.title}</p>
                              <p className="text-sm font-bold text-slate-400">المنفذ: {task.workerName || "عاملك المعتمد"}</p>
                           </div>
                           <button onClick={() => openRatingModal(task)} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-black text-sm px-10 py-5 rounded-2xl transition-all shadow-lg shadow-amber-200">
                              قيّم الآن
                           </button>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            <div className="space-y-8">
               <h3 className="text-2xl font-black text-slate-900 border-r-8 border-emerald-500 pr-4">الأرشيف والمحترفين</h3>
               {ratedTasks.length === 0 ? (
                  <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center gap-6">
                     <Briefcase size={64} className="text-slate-100" />
                     <p className="font-bold text-slate-400 text-lg">لم يتم أرشفة أي طلبات بعد.</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {ratedTasks.map(task => (
                        <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-50 shadow-sm">
                                <CheckCircle2 size={24} />
                              </div>
                              <div>
                                <p className="font-black text-slate-900">{task.title}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{task.profession || "خدمة منزلية"}</p>
                              </div>
                           </div>
                           <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black border border-emerald-100 uppercase">مكتمل</div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      )}

      {/* Modal logic remains the same but with enhanced visuals */}
      {ratingModalOpen && taskToRate && (
         <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-[9999]" dir="rtl">
            <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
               <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <h3 className="text-2xl font-black text-slate-900">تقييم الخدمة</h3>
                  <button onClick={() => setRatingModalOpen(false)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white text-slate-400 hover:text-slate-950 shadow-md transition-all">
                     ✕
                  </button>
               </div>
               
               <div className="p-12 space-y-12">
                  <div className="text-center space-y-2">
                     <h4 className="text-xl font-black text-slate-900">{taskToRate.title}</h4>
                     <p className="text-base font-bold text-amber-500">من تنفيذ: {taskToRate.workerName || "محترف عاملك"}</p>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                     {[1,2,3,4,5].map(star => (
                        <button 
                           key={star}
                           onClick={() => setRatingScore(star)}
                           className={`h-20 w-20 rounded-[2rem] flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${ratingScore >= star ? 'bg-amber-50 text-amber-500 border-2 border-amber-200 shadow-lg' : 'bg-slate-50 text-slate-200 border-2 border-slate-100'}`}
                        >
                           <Star size={40} fill={ratingScore >= star ? "currentColor" : "none"} />
                        </button>
                     ))}
                  </div>
                  
                  <textarea 
                     value={ratingComment}
                     onChange={e => setRatingComment(e.target.value)}
                     placeholder="صف لنا جودة العمل، الاحترافية، والالتزام بالموعد..."
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8 text-base font-medium outline-none focus:border-amber-400 focus:bg-white focus:shadow-xl transition-all h-40 resize-none shadow-inner"
                  />
                  
                  <button onClick={handleRateSubmit} disabled={submittingRating} className="w-full h-20 bg-amber-500 text-white font-black text-xl rounded-[2.5rem] shadow-2xl shadow-amber-500/40 hover:bg-amber-600 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                     {submittingRating ? "جاري الحفظ..." : "نشر التقييم فوراً"}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  )
}
