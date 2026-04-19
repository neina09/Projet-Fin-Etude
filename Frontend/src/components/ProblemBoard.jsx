import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Briefcase, ClipboardList, Info, Star, Sparkles, ShieldCheck, Zap, ArrowRight, MessageSquare, Map as MapIcon, Compass, ChevronRight, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  acceptOffer,
  cancelTaskRequest,
  createOffer,
  createTaskRating,
  createTask,
  deleteTask,
  getMyOffers,
  getMyTasks,
  getMyWorkerProfile,
  getOpenTasks,
  getTasksAssignedToMe,
  markTaskDone,
  refuseOffer,
  searchOpenTasks,
  selectOffer,
  updateTask
} from "../api"
import ProblemCard from "./ProblemCard"
import ProblemForm from "./ProblemForm"
import LeafletMapPicker from "./LeafletMapPicker"
import ConfirmDialog from "./ConfirmDialog"
import BoardFilters from "./problem-board/BoardFilters"
import { motion, AnimatePresence } from "framer-motion"

const OFFER_STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  SELECTED: "تم اختيارك",
  REFUSED: "مرفوض",
  WORKER_REFUSED: "رفضته أنت",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
  CLOSED: "مغلق"
}

const offerStatusClass = (status) => {
  if (status === "COMPLETED") return "bg-emerald-50 border-emerald-100 text-emerald-600"
  if (status === "IN_PROGRESS") return "bg-blue-50 border-blue-100 text-[#1d4ed8]"
  if (status === "SELECTED") return "bg-indigo-50 border-indigo-100 text-indigo-600"
  if (status === "WORKER_REFUSED" || status === "REFUSED") return "bg-red-50 border-red-100 text-red-600"
  if (status === "CLOSED") return "bg-slate-50 border-slate-100 text-slate-500"
  return "bg-slate-50 border-slate-100 text-slate-600"
}

export default function ProblemBoard({ currentUser, initialTab = "open" }) {
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [assignedTasks, setAssignedTasks] = useState([])
  const [myOffers, setMyOffers] = useState([])
  const [currentWorkerProfile, setCurrentWorkerProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState("")
  const [tab, setTab] = useState(initialTab)
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("keyword")
  const [ratedTaskIds, setRatedTaskIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const isWorker = currentUser?.role === "WORKER"
  const isAdmin = currentUser?.role === "ADMIN"

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError("")

    const normalizedQuery = searchQuery.trim()
    const searchActive = Boolean(normalizedQuery)
    const openTasksPromise = searchActive
      ? searchOpenTasks({
          keyword: searchType === "keyword" ? normalizedQuery : "",
          address: searchType === "address" ? normalizedQuery : "",
          profession: searchType === "profession" ? normalizedQuery : ""
        })
      : getOpenTasks()

    const [openTasksResult, myTasksResult, assignedTasksResult, myOffersResult, workerProfileResult] = await Promise.allSettled([
      openTasksPromise,
      getMyTasks(),
      isWorker ? getTasksAssignedToMe() : Promise.resolve([]),
      getMyOffers(),
      isWorker ? getMyWorkerProfile() : Promise.resolve(null)
    ])

    if (openTasksResult.status === "fulfilled") {
      setProblems(openTasksResult.value?.content || openTasksResult.value || [])
    }
    if (myTasksResult.status === "fulfilled") {
      setMyTasks(myTasksResult.value?.content || myTasksResult.value || [])
    }
    if (assignedTasksResult.status === "fulfilled") {
      setAssignedTasks(Array.isArray(assignedTasksResult.value) ? assignedTasksResult.value : [])
    }
    if (myOffersResult.status === "fulfilled") {
      setMyOffers(Array.isArray(myOffersResult.value) ? myOffersResult.value : [])
    }
    if (workerProfileResult.status === "fulfilled") {
      setCurrentWorkerProfile(workerProfileResult.value || null)
    }

    if (openTasksResult.status === "rejected" && myTasksResult.status === "rejected") {
      setError("تعذر تحميل البيانات من مركز العمليات حالياً.")
    }

    setLoading(false)
  }, [isWorker, searchQuery, searchType])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const upsertTask = (updatedTask) => {
    setProblems((current) => current.map((task) => task.id === updatedTask.id ? updatedTask : task))
    setMyTasks((current) => current.map((task) => task.id === updatedTask.id ? updatedTask : task))
  }

  const removeTaskFromLists = (taskId) => {
    setProblems((current) => current.filter((task) => task.id !== taskId))
    setMyTasks((current) => current.filter((task) => task.id !== taskId))
  }

  const addProblem = async (newProblem) => {
    setSubmitting(true)
    setFeedback("")
    setError("")

    try {
      if (editingTask) {
        const savedTask = await updateTask(editingTask.id, { ...newProblem })
        upsertTask(savedTask)
        setEditingTask(null)
        setFeedback("تم تحديث المهمة بنجاح.")
        return
      }

      const savedTask = await createTask({ ...newProblem })
      setMyTasks((current) => [savedTask, ...current])
      setFeedback("تم إرسال المهمة للمراجعة بنجاح.")
    } catch (err) {
      setError(err.message || "تعذر تنفيذ الطلب حالياً.")
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteTask(pendingDelete.id)
      removeTaskFromLists(pendingDelete.id)
      setFeedback("تم حذف المهمة نهائياً.")
    } catch (err) {
      setError(err.message || "فشل حذف المهمة.")
    } finally {
      setPendingDelete(null)
    }
  }

  const handleStatusChange = async (task, action) => {
    try {
      const updatedTask = action === "done" ? await markTaskDone(task.id) : await cancelTaskRequest(task.id)
      upsertTask(updatedTask)
      await fetchTasks()
      setFeedback("تم تحديث حالة المهمة.")
    } catch (err) {
      setError(err.message || "فشل تحديث الحالة.")
    }
  }

  const handleOfferSubmit = async (taskId, message) => {
    const createdOffer = await createOffer(taskId, { message })
    setMyOffers((current) => [createdOffer, ...current.filter((offer) => offer.id !== createdOffer.id)])
    return createdOffer
  }

  const handleOfferSelect = async (offerId) => {
    setError("")
    setFeedback("")
    try {
      await selectOffer(offerId)
      await fetchTasks()
      setFeedback("تم اختيار العامل للمهمة بنجاح.")
    } catch (err) {
      setError(err.message || "تعذر اختيار العامل لهذا الطلب.")
      throw err
    }
  }

  const handleWorkerDecision = async (offerId, decision) => {
    if (decision === "accept") await acceptOffer(offerId)
    else await refuseOffer(offerId)
    await fetchTasks()
  }

  const handleTaskRatingSubmit = async (taskId) => {
     navigate("/dashboard/ratings")
  }

  const activeMyTasks = myTasks.filter(t => !["COMPLETED", "CLOSED", "CANCELLED", "PENDING_REVIEW"].includes(String(t.status).toUpperCase()))
  const previousTasks = myTasks.filter(t => ["COMPLETED", "CLOSED", "CANCELLED"].includes(String(t.status).toUpperCase()))
  const pendingReviewTasks = myTasks.filter(t => String(t.status).toUpperCase() === "PENDING_REVIEW")

  const myOffersByTaskId = useMemo(() => myOffers.reduce((acc, o) => ({ ...acc, [o.taskId]: o }), {}), [myOffers])

  const mapMarkers = useMemo(() => {
    const markers = []
    problems.concat(activeMyTasks).forEach(t => {
      if (t.latitude && t.longitude) {
        markers.push({
          position: { lat: t.latitude, lng: t.longitude },
          title: t.title,
          onClick: () => { window.scrollTo({ top: 0, behavior: "smooth" }); setSearchQuery(t.address || ""); setTab("open"); }
        })
      }
    })
    return markers
  }, [problems, activeMyTasks])

  const tabs = isWorker
    ? [{ id: "open", lbl: "المهام العامة" }, { id: "previous", lbl: "أعمالي وعروضي" }]
    : [{ id: "open", lbl: "سوق المهمات" }, { id: "previous", lbl: "سجل طلباتي" }]

  const totalPages = Math.ceil(problems.length / itemsPerPage)
  const currentProblems = problems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 300, behavior: "smooth" })
    }
  }

  const renderPagination = () => {
    if (totalPages <= 0) return null

    // For simplicity, just rendering a nice paginator block
    let pages = []
    
    // Always show first, last, and around current
    for (let i = 1; i <= Math.max(1, totalPages); i++) {
       if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
          pages.push(i)
       } else if (pages[pages.length - 1] !== '...') {
          pages.push('...')
       }
    }

    return (
       <div className="flex justify-center items-center gap-2 mt-16 pb-8" dir="rtl">
          <button 
             onClick={() => handlePageChange(currentPage - 1)} 
             disabled={currentPage === 1}
             className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
             <ChevronRight size={18} />
          </button>

          {pages.map((page, index) => (
             page === '...' ? (
                <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-slate-400 font-bold">...</span>
             ) : (
                <button
                   key={page}
                   onClick={() => handlePageChange(page)}
                   className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm transition-all shadow-sm ${
                      currentPage === page
                      ? "bg-[#1d4ed8] text-white shadow-blue-500/30"
                      : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                   }`}
                >
                   {page}
                </button>
             )
          ))}

          <button 
             onClick={() => handlePageChange(currentPage + 1)} 
             disabled={currentPage === totalPages}
             className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
             <ChevronLeft size={18} />
          </button>
       </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12 text-right bg-transparent" dir="rtl">
      {/* Header Section */}
      <header className="mb-16">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#1d4ed8]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1d4ed8]">غرفة العمليات</span>
               </div>
               <h2 className="text-5xl font-black text-slate-950 tracking-tight leading-tight">إدارة المهام النشطة</h2>
               <p className="text-lg font-bold text-slate-500 max-w-xl">مركز السيطرة لمتابعة العروض، إدارة المهام، وضمان جودة التنفيذ في كل خطوة.</p>
            </div>
            <button onClick={() => { setShowForm(true); setEditingTask(null); window.scrollTo({ top: 300, behavior: "smooth" }) }} className="h-16 px-10 bg-[#1d4ed8] text-white rounded-[1.75rem] font-black text-sm shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-4 group">
               <Zap size={20} className="text-blue-200" /> نشر مهمة جديدة
            </button>
         </div>
      </header>

      {/* Task Content Area */}
      <div className="mb-20">
         <AnimatePresence>
            {(showForm || editingTask) && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-16 overflow-hidden">
                  <div className="py-2">
                     <ProblemForm
                        key={editingTask?.id || "new-task"}
                        onAdd={(t) => { addProblem(t); setShowForm(false); }}
                        submitting={submitting}
                        initialData={editingTask}
                        onCancel={() => { setShowForm(false); setEditingTask(null); }}
                     />
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Map Integration */}
      {(problems.length > 0 || activeMyTasks.length > 0) && (
        <div className="mb-20">
           <div className="flex items-center justify-between mb-8 px-2">
              <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 <MapIcon size={24} className="text-[#1d4ed8]" /> الخريطة التفاعلية
              </h4>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{mapMarkers.length} موقع نشط حالياً</span>
           </div>
           <div className="h-[420px] overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl relative isolate z-0">
             <LeafletMapPicker isListView markers={mapMarkers} height="420px" />
             <div className="absolute top-6 right-6 z-[400] bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white text-[11px] font-black text-[#1d4ed8] shadow-lg">
                تتبع جغرافي حي للعمليات
             </div>
           </div>
        </div>
      )}

      {/* Guide Card */}
      <div className="relative mb-24 overflow-hidden rounded-[3rem] border border-blue-100 bg-white p-12 transition-all duration-700 hover:shadow-2xl hover:border-blue-500/10 group">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#1d4ed8]" />
        <div className="flex flex-col md:flex-row items-start lg:items-center gap-10">
           <div className="h-20 w-20 flex-shrink-0 flex items-center justify-center rounded-2xl bg-blue-50 text-[#1d4ed8] shadow-inner transform group-hover:scale-110 transition-transform">
              <ShieldCheck size={36} />
           </div>
           <div className="flex-1">
              <h4 className="text-2xl font-black text-slate-950 mb-4 flex items-center gap-4">
                 دليل العمليات الموثوق <Sparkles size={20} className="text-amber-500" />
              </h4>
              <p className="text-base font-medium leading-relaxed text-slate-500 max-w-4xl">
                 {isWorker
                   ? "منصة شغلني تضمن لك حقوقك المالية. عند اختيار عرضك، ابدأ التواصل فوراً وقم بتحديث الحالة لضمان التوثيق. التقييمات الإيجابية ترفع فرص ظهورك في المستقبل."
                   : "اختر المحترف الأنسب بناءً على خبرته وسجله العملي. يمكنك مراجعة العروض بالتفصيل واختيار من يمتلك أعلى تقييم لضمان تنفيذ مهمتك بأفضل جودة."}
              </p>
           </div>
        </div>
      </div>



      {/* Progress Tabs */}
      <section className="space-y-16 pb-32">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-2 p-2 bg-slate-100/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
              {tabs.map(item => (
                 <button
                   key={item.id}
                   onClick={() => setTab(item.id)}
                   className={`px-10 py-5 rounded-[2rem] text-[13px] font-black transition-all duration-500 whitespace-nowrap ${
                      tab === item.id
                      ? "bg-white text-[#1d4ed8] shadow-xl"
                      : "text-slate-400 hover:text-slate-600"
                   }`}
                 >
                    {item.lbl}
                 </button>
              ))}
           </div>
           
           {tab === "open" && (
              <div className="w-full md:w-[34rem]">
                 <BoardFilters
                    searchType={searchType}
                    setSearchType={setSearchType}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                 />
                 <p className="mt-3 px-2 text-xs font-bold text-slate-400">
                    يمكنك الآن البحث في المهام حسب وصف المهمة، أو نوعها، أو مكانها.
                 </p>
              </div>
           )}
        </div>

        <div className="grid grid-cols-1 gap-12">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 text-slate-400">
                <div className="relative h-20 w-20 mb-10">
                   <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-slate-100 border-t-[#1d4ed8]" />
                   <div className="absolute inset-0 flex items-center justify-center text-[#1d4ed8]">
                      <Briefcase size={28} className="animate-pulse" />
                   </div>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] italic">مزامنة مركز البيانات...</p>
              </motion.div>
            ) : (
              <motion.div 
                 key={tab}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="space-y-12"
              >
                {tab === "open" && problems.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pl-2">
                       <h3 className="text-[22px] font-black text-slate-900 flex items-center gap-2">
                          المهام المتاحة <span className="text-sm font-bold text-[#1d4ed8]">({problems.length} مهمة)</span>
                       </h3>
                       <div className="flex items-center gap-3 bg-slate-100/70 border border-slate-200/60 px-5 py-2.5 rounded-full mt-4 sm:mt-0 text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-200/50 transition-colors">
                          <span className="text-slate-400">الترتيب:</span> المقترحة لك
                          <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                       </div>
                    </div>
                    <div className="grid gap-6">
                      {currentProblems.map((problem) => (
                        <ProblemCard
                          key={problem.id}
                          problem={problem}
                          currentUser={currentUser}
                          onEdit={setEditingTask}
                          onDelete={(task) => setPendingDelete(task)}
                          onStatusChange={handleStatusChange}
                          workerOffer={myOffersByTaskId[problem.id]}
                          currentWorkerStatus={currentWorkerProfile?.availability}
                          onSubmitOffer={handleOfferSubmit}
                          onSelectOffer={handleOfferSelect}
                          onWorkerDecision={handleWorkerDecision}
                        />
                      ))}
                    </div>
                    {renderPagination()}
                  </div>
                ) : tab === "open" ? (
                  <div className="bg-white border-2 border-dashed border-slate-100 p-40 text-center rounded-[3rem] flex flex-col items-center gap-8">
                    <Compass size={80} className="text-slate-200" />
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black text-slate-950">لا توجد عمليات نشطة</h3>
                       <p className="text-lg font-bold text-slate-400 max-w-sm">لم يتم العثور على أي مهام في النطاق المحدد حالياً.</p>
                    </div>
                  </div>
                ) : null}

                {tab === "previous" && (
                   <div className="space-y-12">
                      {isWorker ? (
                         <>
                            {assignedTasks.length > 0 && assignedTasks.map(p => (
                               <ProblemCard key={p.id} problem={p} currentUser={currentUser} onStatusChange={handleStatusChange} />
                            ))}
                            {myOffers.map(offer => (
                               <div key={offer.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col md:flex-row items-center justify-between gap-10 hover:shadow-2xl transition-all shadow-sm group">
                                  <div className="flex items-center gap-8">
                                     <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1d4ed8] border border-blue-100 shadow-sm transition-transform group-hover:scale-110">
                                        <MessageSquare size={32} />
                                     </div>
                                     <div>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#1d4ed8] transition-colors">{offer.taskTitle}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{offer.workerJob || "عرض مهني مقدم"}</p>
                                     </div>
                                  </div>
                                  <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${offerStatusClass(offer.status)} shadow-sm`}>
                                     {OFFER_STATUS_LABELS[offer.status] || offer.status}
                                  </span>
                               </div>
                            ))}
                            {myOffers.length === 0 && assignedTasks.length === 0 && (
                               <div className="p-40 text-center rounded-[4rem] border-2 border-dashed border-slate-100 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">سجل عملياتك المهني نظيف حالياً.</div>
                            )}
                         </>
                      ) : (
                         <>
                            {pendingReviewTasks.length > 0 && pendingReviewTasks.map(p => <ProblemCard key={p.id} problem={p} currentUser={currentUser} />)}
                            {activeMyTasks.length > 0 && activeMyTasks.map(p => <ProblemCard key={p.id} problem={p} currentUser={currentUser} />)}
                            {previousTasks.length > 0 && previousTasks.map(p => (
                               <div key={p.id} className="space-y-6">
                                  <ProblemCard problem={p} currentUser={currentUser} />
                                  {String(p.status).toUpperCase() === "COMPLETED" && p.assignedWorkerId && !ratedTaskIds.includes(p.id) && (
                                    <div className="rounded-[2.5rem] bg-amber-50 border border-amber-100 p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm animate-in slide-in-from-bottom-4">
                                       <div className="flex gap-6 items-center">
                                          <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                                             <Star size={28} />
                                          </div>
                                          <div>
                                             <p className="text-xl font-black text-amber-950">هل كنت راضياً عن أداء المحترف؟</p>
                                             <p className="text-sm font-bold text-amber-900/60 mt-1">تقييمك يساعدنا في تحسين جودة مجتمع شغلني بشكل مستمر.</p>
                                          </div>
                                       </div>
                                       <button onClick={() => handleTaskRatingSubmit(p.id)} className="h-16 px-12 bg-amber-600 text-white rounded-2xl font-black text-sm flex items-center gap-4 hover:bg-amber-700 transition-all shadow-xl shadow-amber-500/10 active:scale-95">
                                          الذهاب للتقييم <ArrowRight size={20} className="rotate-180" />
                                       </button>
                                    </div>
                                  )}
                               </div>
                            ))}
                            {pendingReviewTasks.length === 0 && activeMyTasks.length === 0 && previousTasks.length === 0 && (
                               <div className="p-40 text-center rounded-[4rem] border-2 border-dashed border-slate-100 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">لم تقم باستخدام خدمات المنصة بعد.</div>
                            )}
                         </>
                      )}
                   </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        title="تأكيد حذف المهمة"
        description="هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً من قاعدة البيانات؟ لا يمكن استعادة البيانات بعد هذا الإجراء."
      />
    </div>
  )
}
