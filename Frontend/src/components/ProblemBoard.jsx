import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Map as MapIcon, Zap } from "lucide-react"
import { useLocation } from "react-router-dom"
import {
  acceptOffer,
  cancelTaskRequest,
  createOffer,
  createTask,
  deleteTask,
  getMyOffers,
  getMyTasks,
  getOpenTasks,
  getTasksAssignedToMe,
  markTaskDone,
  refuseOffer,
  searchOpenTasks,
  selectOffer,
  updateTask
} from "../api"
import BoardFilters from "./problem-board/BoardFilters"
import ConfirmDialog from "./ConfirmDialog"

const LeafletMapPicker = lazy(() => import("./LeafletMapPicker"))
const ProblemCard = lazy(() => import("./ProblemCard"))
const ProblemForm = lazy(() => import("./ProblemForm"))

const ITEMS_PER_PAGE = 8
const SEARCH_FETCH_SIZE = 100

const TASK_STATUS_PRIORITY = {
  COMPLETED: 4,
  CANCELLED: 4,
  CLOSED: 4,
  IN_PROGRESS: 3,
  OPEN: 2,
  PENDING_REVIEW: 1
}

const mergeTaskCollections = (...collections) => {
  const merged = new Map()

  collections.flat().forEach((task) => {
    if (!task?.id) return

    const existing = merged.get(task.id)
    if (!existing) {
      merged.set(task.id, task)
      return
    }

    const currentPriority = TASK_STATUS_PRIORITY[String(task.status || "").toUpperCase()] || 0
    const existingPriority = TASK_STATUS_PRIORITY[String(existing.status || "").toUpperCase()] || 0

    merged.set(task.id, currentPriority >= existingPriority ? { ...existing, ...task } : { ...task, ...existing })
  })

  return Array.from(merged.values())
}

const paginateItems = (items, pageNum, pageSize) => {
  const start = (pageNum - 1) * pageSize
  return items.slice(start, start + pageSize)
}

const LoadingState = ({ message }) => (
  <div className="empty-state animate-pulse">{message}</div>
)

const matchesSearch = (task, query) => {
  const normalizedQuery = String(query || "").trim().toLowerCase()
  if (!normalizedQuery) return true

  const haystack = [
    task?.title,
    task?.description,
    task?.workerName,
    task?.profession,
    task?.category,
    task?.workerJob,
    task?.specialty,
    task?.address,
    task?.city,
    task?.location
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(normalizedQuery)
}

export default function ProblemBoard({ currentUser, initialTab = "open" }) {
  const location = useLocation()
  const [problems, setProblems] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [assignedTasks, setAssignedTasks] = useState([])
  const [myOffers, setMyOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [tab, setTab] = useState(initialTab)
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(location.state?.openForm || false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deletingTask, setDeletingTask] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("keyword")
  const [historyFilter, setHistoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const isWorker = currentUser?.role === "WORKER"

  useEffect(() => {
    setTab(initialTab)
    if (location.state?.openForm) setShowForm(true)
  }, [initialTab, location.state])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, searchType])

  const fetchTasks = useCallback(async (pageNum = currentPage) => {
    setLoading(true)
    setError("")

    const normalizedQuery = searchQuery.trim()
    const openTasksPromise = normalizedQuery
      ? Promise.allSettled([
          searchOpenTasks({ keyword: normalizedQuery, page: 0, size: SEARCH_FETCH_SIZE }),
          searchOpenTasks({ address: normalizedQuery, page: 0, size: SEARCH_FETCH_SIZE }),
          searchOpenTasks({ profession: normalizedQuery, page: 0, size: SEARCH_FETCH_SIZE })
        ])
      : getOpenTasks(pageNum - 1, ITEMS_PER_PAGE)

    const [openRes, mineRes, assignedRes, offersRes] = await Promise.allSettled([
      openTasksPromise,
      getMyTasks(),
      isWorker ? getTasksAssignedToMe() : Promise.resolve([]),
      getMyOffers()
    ])

    if (openRes.status === "fulfilled") {
      if (normalizedQuery) {
        const mergedSearchResults = mergeTaskCollections(
          ...(openRes.value || []).map((result) => result.status === "fulfilled" ? (result.value?.content || []) : [])
        ).filter((task) => matchesSearch(task, normalizedQuery))

        setTotalPages(Math.max(1, Math.ceil(mergedSearchResults.length / ITEMS_PER_PAGE)))
        setProblems(paginateItems(mergedSearchResults, pageNum, ITEMS_PER_PAGE))
      } else {
        setProblems(openRes.value?.content || [])
        setTotalPages(openRes.value?.totalPages || 0)
      }
    }
    if (mineRes.status === "fulfilled") setMyTasks(mineRes.value?.content || mineRes.value || [])
    if (assignedRes.status === "fulfilled") setAssignedTasks(Array.isArray(assignedRes.value) ? assignedRes.value : [])
    if (offersRes.status === "fulfilled") setMyOffers(Array.isArray(offersRes.value) ? offersRes.value : [])

    setLoading(false)
  }, [currentPage, isWorker, searchQuery])

  useEffect(() => {
    fetchTasks(currentPage)
  }, [fetchTasks, currentPage, tab])

  const myOffersByTaskId = useMemo(
    () => Object.fromEntries(myOffers.map((offer) => [offer.taskId, offer])),
    [myOffers]
  )

  const openOwnerTasks = useMemo(
    () => myTasks
      .filter((task) => String(task.status || "").toUpperCase() === "OPEN")
      .filter((task) => matchesSearch(task, searchQuery)),
    [myTasks, searchQuery]
  )

  const visibleOpenTasks = useMemo(
    () => mergeTaskCollections(problems, openOwnerTasks),
    [openOwnerTasks, problems]
  )

  const historyTasks = useMemo(() => mergeTaskCollections(myTasks, assignedTasks), [myTasks, assignedTasks])
  const filteredHistoryTasks = useMemo(() => {
    if (historyFilter === "all") return historyTasks
    return historyTasks.filter((task) => String(task.status || "").toUpperCase() === historyFilter)
  }, [historyFilter, historyTasks])

  const mapMarkers = useMemo(
    () => problems
      .concat(myTasks)
      .filter((task) => task.latitude && task.longitude)
      .map((task) => ({
        position: { lat: task.latitude, lng: task.longitude },
        title: task.title
      })),
    [myTasks, problems]
  )

  const handleWorkerDecision = async (offerId, decision) => {
    try {
      if (decision === "accept") await acceptOffer(offerId)
      else await refuseOffer(offerId)
      await fetchTasks()
    } catch (err) {
      if (err?.message) {
        setError(err.message)
        return
      }
      setError("فشل تسجيل القرار على العرض.")
    }
  }

  const handleSelectOffer = async (offerId) => {
    try {
      const selected = await selectOffer(offerId)
      await fetchTasks()
      return selected
    } catch (err) {
      if (err?.message) {
        setError(err.message)
        return
      }
      setError("فشل اختيار العرض.")
    }
  }

  const handleStatusChange = async (task, action) => {
    try {
      let updatedStatus = null

      if (action === "done") {
        await markTaskDone(task.id)
        updatedStatus = "COMPLETED"
      } else if (action === "cancel") {
        await cancelTaskRequest(task.id)
        updatedStatus = "CANCELLED"
      } else if (action === "rated") {
        updatedStatus = String(task.status || "COMPLETED").toUpperCase()
      }

      if (updatedStatus) {
        const applyTaskPatch = (items) => items.map((item) => (
          item.id === task.id
            ? {
                ...item,
                status: updatedStatus,
                isRated: action === "rated" ? true : item.isRated,
                rated: action === "rated" ? true : item.rated
              }
            : item
        ))

        setProblems((items) => applyTaskPatch(items))
        setMyTasks((items) => applyTaskPatch(items))
        setAssignedTasks((items) => applyTaskPatch(items))
      }

      await fetchTasks()
    } catch {
      setError("فشل تحديث حالة الطلب.")
    }
  }

  const handleTaskSubmit = async (payload) => {
    setSubmitting(true)
    setError("")

    try {
      if (editingTask?.id) {
        await updateTask(editingTask.id, payload)
        setSuccessMessage("تم تحديث الطلب بنجاح.")
      } else {
        await createTask(payload)
        setSuccessMessage("تم إرسال طلبك بنجاح، وسيظهر بعد مراجعته من الإدارة.")
      }

      setShowForm(false)
      setEditingTask(null)

      if (!editingTask && currentPage !== 1) {
        setCurrentPage(1)
      } else {
        await fetchTasks(editingTask ? currentPage : 1)
      }

      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (err) {
      setError(err.message || "فشل حفظ الطلب.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!pendingDelete?.id || deletingTask) return

    setDeletingTask(true)
    setError("")

    try {
      await deleteTask(pendingDelete.id)
      setPendingDelete(null)
      await fetchTasks()
    } catch (err) {
      setError(err.message || "تعذر حذف الطلب. قد يكون قيد التنفيذ أو لا تملك صلاحية حذفه.")
    } finally {
      setDeletingTask(false)
    }
  }

  const renderPagination = (pages = totalPages) => {
    if (pages <= 1) return null

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <ChevronRight size={18} />
        </button>
        {[...Array(pages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((page) => Math.min(pages, page + 1))}
          disabled={currentPage === pages}
          className="pagination-btn"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    )
  }

  const totalHistoryPages = Math.ceil(filteredHistoryTasks.length / ITEMS_PER_PAGE)
  const pagedHistoryTasks = filteredHistoryTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="page-shell" dir="rtl">
      <section className="app-page-header">
        <div className="app-page-header-row">
          <div>
            <span className="app-page-eyebrow">{isWorker ? "العروض والمهام" : "إدارة الطلبات"}</span>
            <h1 className="app-page-title mt-4">
              {isWorker ? "لوحة" : "سجل"} <span className="text-[#1d4ed8]">{isWorker ? "العروض" : "الطلبات"}</span> والمتابعة
            </h1>
            <p className="app-page-subtitle">
              راقب الطلبات المفتوحة، تحكم في السجل، وتابع التنفيذ من نفس الواجهة بشكل أوضح وأكثر تناسقًا.
            </p>
          </div>

          {!isWorker && (
            <div className="flex justify-start lg:justify-end">
              <button
                onClick={() => {
                  setEditingTask(null)
                  setShowForm(true)
                }}
                className="btn btn-primary btn-md flex items-center gap-2"
              >
                <Zap size={14} />
                نشر طلب جديد
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mb-8">
        <BoardFilters
          searchType={searchType}
          setSearchType={setSearchType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </section>

      <div className="mx-auto mb-8 flex w-fit gap-2 rounded-xl bg-surface-50 p-1 lg:mx-0">
        {[
          { id: "open", label: isWorker ? "الفرص المتاحة" : "الطلبات المفتوحة" },
          { id: "previous", label: "السجل والمتابعة" }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setTab(item.id)
              setCurrentPage(1)
            }}
            className={`rounded-lg px-6 py-2 t-label transition-all ${tab === item.id ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "previous" && (
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: "all", label: "الكل" },
            { id: "PENDING_REVIEW", label: "قيد المراجعة" },
            { id: "IN_PROGRESS", label: "قيد التنفيذ" },
            { id: "COMPLETED", label: "مكتمل" },
            { id: "CANCELLED", label: "ملغي" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setHistoryFilter(item.id)
                setCurrentPage(1)
              }}
              className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                historyFilter === item.id
                  ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="card-lg mb-10 overflow-hidden"
          >
            <Suspense fallback={<LoadingState message="جارٍ تحميل النموذج..." />}>
              <ProblemForm
                key={editingTask?.id || "new-task"}
                initialData={editingTask}
                onAdd={handleTaskSubmit}
                onCancel={() => {
                  setEditingTask(null)
                  setShowForm(false)
                }}
                submitting={submitting}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-xs font-bold text-red-600">
          {error}
        </div>
      )}

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center shadow-sm"
          >
            <p className="text-sm font-black text-emerald-900">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {tab === "open" ? (
        <Suspense fallback={<LoadingState message="جارٍ تحميل الطلبات..." />}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {loading ? (
              <div className="col-span-full">
                <LoadingState message="جارٍ تحميل الطلبات..." />
              </div>
            ) : visibleOpenTasks.length === 0 ? (
              <div className="empty-state col-span-full">لا توجد طلبات تطابق بحثك.</div>
            ) : (
              visibleOpenTasks.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  currentUser={currentUser}
                  onEdit={(task) => {
                    setEditingTask(task)
                    setShowForm(true)
                  }}
                  onDelete={setPendingDelete}
                  onStatusChange={handleStatusChange}
                  workerOffer={myOffersByTaskId[problem.id]}
                  onSubmitOffer={createOffer}
                  onSelectOffer={handleSelectOffer}
                  onWorkerDecision={handleWorkerDecision}
                />
              ))
            )}
            <div className="col-span-full">
              {renderPagination(totalPages)}
            </div>
          </div>
        </Suspense>
      ) : (
        <Suspense fallback={<LoadingState message="جارٍ تحميل السجل..." />}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pagedHistoryTasks.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                currentUser={currentUser}
                onEdit={(task) => {
                  setEditingTask(task)
                  setShowForm(true)
                }}
                onDelete={setPendingDelete}
                onStatusChange={handleStatusChange}
                workerOffer={myOffersByTaskId[problem.id]}
                onWorkerDecision={handleWorkerDecision}
                onSelectOffer={handleSelectOffer}
              />
            ))}
            {historyTasks.length === 0 && <div className="empty-state col-span-full">السجل فارغ حاليًا.</div>}
            {pagedHistoryTasks.length === 0 && filteredHistoryTasks.length === 0 && (
              <div className="empty-state col-span-full">لا توجد طلبات في هذه الحالة حاليًا.</div>
            )}
            <div className="col-span-full">
              {renderPagination(totalHistoryPages)}
            </div>
          </div>
        </Suspense>
      )}

      <div className="card-lg mt-12">
        <h4 className="t-label mb-6 flex items-center gap-2 italic">
          خريطة الطلبات <MapIcon size={12} className="text-blue-600" />
        </h4>
        <div className="relative isolate z-0 h-64 overflow-hidden rounded-2xl border border-slate-50">
          <Suspense fallback={<LoadingState message="جارٍ تحميل الخريطة..." />}>
            <LeafletMapPicker isListView markers={mapMarkers} height="256px" />
          </Suspense>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        loading={deletingTask}
        onConfirm={handleDeleteTask}
        onCancel={() => {
          if (deletingTask) return
          setPendingDelete(null)
        }}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا الطلب نهائيًا؟"
      />
    </div>
  )
}
