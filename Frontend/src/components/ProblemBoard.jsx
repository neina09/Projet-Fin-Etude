import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Briefcase, ChevronDown, ClipboardList, Info, LayoutGrid, MapPin, Search, Star } from "lucide-react"
import {
  acceptOffer,
  cancelTaskRequest,
  createOffer,
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

const OFFER_STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  SELECTED: "تم اختيارك",
  REFUSED: "مرفوض",
  WORKER_REFUSED: "رفضته أنت",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
  CLOSED: "مغلق"
}

const SEARCH_TYPE_META = {
  keyword: {
    icon: Search,
    label: "بحث بالكلمة",
    placeholder: "ابحث بالكلمة أو وصف المهمة"
  },
  address: {
    icon: MapPin,
    label: "بحث بالموقع",
    placeholder: "ابحث بالمكان أو الحي"
  },
  profession: {
    icon: Briefcase,
    label: "بحث بالمهنة",
    placeholder: "ابحث بالمهنة"
  }
}

const offerStatusClass = (status) => {
  if (status === "COMPLETED") return "bg-emerald-50 border-emerald-100 text-emerald-600"
  if (status === "IN_PROGRESS") return "bg-amber-50 border-amber-100 text-amber-600"
  if (status === "SELECTED") return "bg-indigo-50 border-indigo-100 text-indigo-600"
  if (status === "WORKER_REFUSED" || status === "REFUSED") return "bg-red-50 border-red-100 text-red-600"
  if (status === "CLOSED") return "bg-surface-50 border-surface-100 text-surface-400"
  return "bg-primary-soft border-primary/10 text-primary"
}

export default function ProblemBoard({ currentUser }) {
  const [problems, setProblems] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [assignedTasks, setAssignedTasks] = useState([])
  const [myOffers, setMyOffers] = useState([])
  const [currentWorkerProfile, setCurrentWorkerProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState("")
  const [tab, setTab] = useState("open")
  const [editingTask, setEditingTask] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("keyword")

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
    } else {
      setProblems([])
    }

    if (myTasksResult.status === "fulfilled") {
      setMyTasks(myTasksResult.value?.content || myTasksResult.value || [])
    } else {
      setMyTasks([])
    }

    if (assignedTasksResult.status === "fulfilled") {
      setAssignedTasks(Array.isArray(assignedTasksResult.value) ? assignedTasksResult.value : [])
    } else {
      setAssignedTasks([])
    }

    if (myOffersResult.status === "fulfilled") {
      setMyOffers(Array.isArray(myOffersResult.value) ? myOffersResult.value : [])
    } else {
      setMyOffers([])
    }

    if (workerProfileResult.status === "fulfilled") {
      setCurrentWorkerProfile(workerProfileResult.value || null)
    } else {
      setCurrentWorkerProfile(null)
    }

    if (openTasksResult.status === "rejected" && myTasksResult.status === "rejected") {
      setError("تعذر تحميل المهام حالياً.")
    } else if (openTasksResult.status === "rejected") {
      setError("تعذر تحميل المهام العامة، لكن تم عرض مهامك الشخصية.")
    } else if (myTasksResult.status === "rejected") {
      setError("تعذر تحميل مهامك الشخصية، لكن تم عرض المهام العامة.")
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
        const savedTask = await updateTask(editingTask.id, {
          title: newProblem.title,
          description: newProblem.description,
          address: newProblem.address,
          profession: newProblem.profession,
          latitude: newProblem.latitude,
          longitude: newProblem.longitude
        })

        upsertTask(savedTask)
        setEditingTask(null)
        setFeedback("تم تحديث المهمة وإعادتها للمراجعة بنجاح.")
        return
      }

      const savedTask = await createTask({
        title: newProblem.title,
        description: newProblem.description,
        address: newProblem.address,
        profession: newProblem.profession,
        latitude: newProblem.latitude,
        longitude: newProblem.longitude
      })

      setMyTasks((current) => [savedTask, ...current])
      setFeedback("تم إرسال المهمة إلى المدير للمراجعة قبل نشرها.")
    } catch (err) {
      setError(err.message || "تعذر حفظ المهمة.")
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return

    try {
      await deleteTask(pendingDelete.id)
      removeTaskFromLists(pendingDelete.id)
      if (editingTask?.id === pendingDelete.id) {
        setEditingTask(null)
      }
      setFeedback("تم حذف المهمة.")
    } catch (err) {
      setError(err.message || "تعذر حذف المهمة.")
    } finally {
      setPendingDelete(null)
    }
  }

  const handleStatusChange = async (task, action) => {
    setFeedback("")
    setError("")
    try {
      const updatedTask = action === "done"
        ? await markTaskDone(task.id)
        : await cancelTaskRequest(task.id)

      upsertTask(updatedTask)
      await fetchTasks()
      setFeedback(action === "done" ? "تم تأكيد الإنجاز." : "تم إلغاء المهمة.")
    } catch (err) {
      setError(err.message || "فشل تحديث حالة المهمة.")
    }
  }

  const handleOfferSubmit = async (taskId, message) => {
    const createdOffer = await createOffer(taskId, { message })
    setMyOffers((current) => [createdOffer, ...current.filter((offer) => offer.id !== createdOffer.id)])
    return createdOffer
  }

  const handleOfferSelect = async (offerId) => {
    await selectOffer(offerId)
    await fetchTasks()
    setFeedback("تم اختيار العرض بنجاح.")
  }

  const handleWorkerDecision = async (offerId, decision) => {
    if (decision === "accept") {
      await acceptOffer(offerId)
      setFeedback("تم قبول المهمة.")
    } else {
      await refuseOffer(offerId)
      setFeedback("تم رفض المهمة.")
    }
    await fetchTasks()
  }

  const previousTasks = myTasks.filter((task) => {
    const status = String(task.status || "").toUpperCase()
    return status === "COMPLETED" || status === "CLOSED" || status === "CANCELLED"
  })

  const pendingReviewTasks = myTasks.filter((task) => String(task.status || "").toUpperCase() === "PENDING_REVIEW")

  const activeMyTasks = myTasks.filter((task) => {
    const status = String(task.status || "").toUpperCase()
    return !["COMPLETED", "CLOSED", "CANCELLED", "PENDING_REVIEW"].includes(status)
  })

  const myOffersByTaskId = useMemo(() => {
    return myOffers.reduce((accumulator, offer) => {
      accumulator[offer.taskId] = offer
      return accumulator
    }, {})
  }, [myOffers])

  const mapMarkers = useMemo(() => {
    const markers = []

    if (problems.length > 0) {
      problems.forEach((problem) => {
        if (problem.latitude && problem.longitude) {
          markers.push({
            position: { lat: problem.latitude, lng: problem.longitude },
            title: problem.title,
            onClick: () => {
              window.scrollTo({ top: 0, behavior: "smooth" })
              setSearchQuery(problem.address || "")
              setSearchType("address")
              setTab("open")
            }
          })
        }
      })
    }

    if (activeMyTasks.length > 0) {
      activeMyTasks.forEach((task) => {
        if (task.latitude && task.longitude) {
          markers.push({
            position: { lat: task.latitude, lng: task.longitude },
            title: task.title,
            onClick: () => {
              window.scrollTo({ top: 0, behavior: "smooth" })
              setSearchQuery(task.address || "")
              setSearchType("address")
            }
          })
        }
      })
    }

    return markers
  }, [problems, activeMyTasks])

  const ActiveSearchIcon = SEARCH_TYPE_META[searchType].icon

  const tabs = isWorker
    ? [
        { id: "open", lbl: "المهام المتاحة" },
        { id: "previous", lbl: "مهامي وعروضي" }
      ]
    : [
        { id: "open", lbl: "المهام المنشورة" },
        { id: "previous", lbl: "مهامي" }
      ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-6">
      <header className="mb-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-surface-900 md:text-5xl">
              {isWorker ? "سوق المهام للعمال" : "سوق المهام"}
            </h1>
            <p className="text-lg font-medium text-surface-500">
              {isWorker
                ? "ابحث بالمكان أو المهنة ثم قدّم عرضك على المهام التي تمت الموافقة عليها."
                : "أرسل المهمة أولاً للمراجعة الإدارية، وبعد الموافقة ستبدأ باستقبال عروض العمال."}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-1.5 shadow-sm">
            <div className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">
              <ClipboardList size={16} />
              {isWorker ? "مهام متاحة" : "طلبات نشطة"}
            </div>
            <div className="px-3 text-sm font-bold text-surface-900">
              {problems.length} <span className="font-medium text-surface-400">مهمة</span>
            </div>
          </div>
        </div>
      </header>

      {(problems.length > 0 || activeMyTasks.length > 0) && (
        <div className="mb-12 h-[350px] overflow-hidden rounded-[2.5rem] border border-surface-200 shadow-xl">
          <LeafletMapPicker isListView markers={mapMarkers} />
        </div>
      )}

      <div className="group relative mb-8 overflow-hidden rounded-[2rem] border border-indigo-100 bg-indigo-50 p-8">
        <Star className="absolute -left-4 -top-4 text-indigo-100 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" size={120} />
        <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-indigo-200 bg-white text-indigo-600 shadow-sm">
            <Info size={24} />
          </div>
          <div className="text-center md:text-right">
            <h4 className="mb-1.5 text-lg font-bold text-indigo-900">
              {isWorker ? "تدفق المهام داخل المنصة" : "كيف تُدار المهمة بشكل صحيح؟"}
            </h4>
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-indigo-700/80">
              {isWorker
                ? "لن تظهر لك إلا المهام التي اعتمدها المدير. بعد اختيارك من صاحب المهمة، يبقى القرار الأخير لك بقبول التنفيذ أو رفضه."
                : "المهمة تبدأ بحالة قيد مراجعة المدير، ثم تصبح منشورة بعد الموافقة. بعد ذلك تستطيع اختيار العامل المناسب، ويجب أن يقبل العامل الطلب حتى يبدأ التنفيذ."}
            </p>
          </div>
        </div>
      </div>

      {!isAdmin && (
        <section className="mb-16">
          <div className="saas-card border-surface-200 bg-surface-50 p-1">
            <ProblemForm
              onAdd={addProblem}
              submitting={submitting}
              initialData={editingTask}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </section>
      )}

      {feedback && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
          {feedback}
        </div>
      )}

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <section className="space-y-8">
        <div className="flex flex-col justify-between gap-6 border-b border-surface-200 pb-6 md:flex-row md:items-center">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                  tab === item.id
                    ? "translate-y-[-1px] border border-surface-200 bg-white text-primary shadow-sm"
                    : "text-surface-400 hover:bg-surface-50 hover:text-surface-900"
                }`}
              >
                {item.lbl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-surface-400">
            <LayoutGrid size={14} className="opacity-50" />
            عرض الشبكة
          </div>
        </div>

        {tab === "open" && (
          <div className="grid grid-cols-1 gap-4 rounded-[2rem] border border-surface-200 bg-white p-5 md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="relative">
              <Briefcase className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
              <select
                value={searchType}
                onChange={(event) => setSearchType(event.target.value)}
                className="saas-input h-12 w-full appearance-none border-surface-200 pr-11 pl-10"
              >
                {Object.entries(SEARCH_TYPE_META).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
            </div>

            <div className="relative">
              <ActiveSearchIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={SEARCH_TYPE_META[searchType].placeholder}
                className="saas-input h-12 border-surface-200 pr-11"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="flex animate-pulse flex-col items-center justify-center py-20 text-surface-400">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-surface-200 border-t-primary" />
              <p className="text-sm font-bold">جارٍ جلب أحدث المهام...</p>
            </div>
          ) : (
            <>
              {tab === "open" && problems.length > 0 ? (
                problems.map((problem) => (
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
                ))
              ) : tab === "open" ? (
                <div className="saas-card border-dashed border-surface-200 bg-surface-50/50 p-16 text-center">
                  <div className="mb-6 text-5xl opacity-20 grayscale">📭</div>
                  <h3 className="mb-2 text-xl font-bold text-surface-900">لا توجد مهام منشورة حالياً</h3>
                  <p className="text-sm font-medium text-surface-400">جرّب تعديل البحث أو انتظر حتى يعتمد المدير مهامًا جديدة.</p>
                </div>
              ) : null}

              {tab === "previous" && isWorker && (assignedTasks.length > 0 || myOffers.length > 0) ? (
                <>
                  {assignedTasks.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-surface-900">مهام مسندة إليك</h3>
                        <span className="text-xs font-bold text-surface-400">{assignedTasks.length} مهمة</span>
                      </div>
                      {assignedTasks.map((problem) => (
                        <ProblemCard
                          key={`assigned-${problem.id}`}
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
                  )}

                  {myOffers.map((offer) => (
                  <div key={offer.id} className="saas-card border-surface-200 bg-white p-6">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-surface-900">{offer.taskTitle}</h3>
                        <p className="text-sm font-bold text-surface-500">{offer.taskUserName || "صاحب المهمة"}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-black ${offerStatusClass(offer.status)}`}>
                        {OFFER_STATUS_LABELS[offer.status] || offer.status}
                      </span>
                    </div>
                    <p className="mb-4 text-sm font-medium leading-relaxed text-surface-600">{offer.message}</p>

                    {offer.status === "SELECTED" && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleWorkerDecision(offer.id, "accept")}
                          className="btn-saas btn-primary h-10 text-xs"
                        >
                          قبول المهمة
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWorkerDecision(offer.id, "refuse")}
                          className="btn-saas btn-secondary h-10 border-surface-200 text-xs"
                        >
                          رفض المهمة
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                </>
              ) : tab === "previous" && !isWorker && (pendingReviewTasks.length > 0 || activeMyTasks.length > 0 || previousTasks.length > 0) ? (
                <>
                  {pendingReviewTasks.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-surface-900">مهام بانتظار اعتماد المدير</h3>
                        <span className="text-xs font-bold text-surface-400">{pendingReviewTasks.length} مهمة</span>
                      </div>
                      {pendingReviewTasks.map((problem) => (
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
                  )}

                  {activeMyTasks.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-surface-900">مهامي النشطة</h3>
                        <span className="text-xs font-bold text-surface-400">{activeMyTasks.length} مهمة</span>
                      </div>
                      {activeMyTasks.map((problem) => (
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
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-surface-900">السجل السابق</h3>
                      <span className="text-xs font-bold text-surface-400">{previousTasks.length} مهمة</span>
                    </div>
                    {previousTasks.map((problem) => (
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
                </>
              ) : tab === "previous" ? (
                <div className="saas-card border-dashed border-surface-200 bg-surface-50/50 p-16 text-center">
                  <div className="mb-6 text-5xl opacity-20 grayscale">📜</div>
                  <h3 className="mb-2 text-xl font-bold text-surface-900">
                    {isWorker ? "لا توجد عروض مرسلة بعد" : "لا توجد مهام في حسابك بعد"}
                  </h3>
                  <p className="text-sm font-medium text-surface-400">
                    {isWorker
                      ? "عند إرسال عروض على المهام ستظهر هنا مع حالتها الدقيقة."
                      : "ستظهر هنا مهامك قيد المراجعة والنشطة والمكتملة والملغاة."}
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="حذف المهمة"
        description={`هل تريد حذف المهمة "${pendingDelete?.title || ""}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف المهمة"
        cancelLabel="إبقاء المهمة"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
