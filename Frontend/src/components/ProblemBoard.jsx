import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Zap, Map as MapIcon, ChevronRight, ChevronLeft } from "lucide-react"
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
import ProblemCard from "./ProblemCard"
import ProblemForm from "./ProblemForm"
import LeafletMapPicker from "./LeafletMapPicker"
import ConfirmDialog from "./ConfirmDialog"
import BoardFilters from "./problem-board/BoardFilters"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("keyword")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 8

  const isWorker = currentUser?.role === "WORKER"

  useEffect(() => {
    setTab(initialTab)
    if (location.state?.openForm) setShowForm(true)
  }, [initialTab, location.state])

  const fetchTasks = useCallback(async (pageNum = currentPage) => {
    setLoading(true)
    setError("")

    const normalizedQuery = searchQuery.trim()
    const openTasksPromise = normalizedQuery
      ? searchOpenTasks({
          keyword: searchType === "keyword" ? normalizedQuery : "",
          address: searchType === "address" ? normalizedQuery : "",
          profession: searchType === "profession" ? normalizedQuery : "",
          page: pageNum - 1,
          size: itemsPerPage
        })
      : getOpenTasks(pageNum - 1, itemsPerPage)

    const [openRes, mineRes, assignedRes, offersRes] = await Promise.allSettled([
      openTasksPromise,
      getMyTasks(),
      isWorker ? getTasksAssignedToMe() : Promise.resolve([]),
      getMyOffers()
    ])

    if (openRes.status === "fulfilled") {
      setProblems(openRes.value?.content || [])
      setTotalPages(openRes.value?.totalPages || 0)
    }

    if (mineRes.status === "fulfilled") setMyTasks(mineRes.value?.content || mineRes.value || [])
    if (assignedRes.status === "fulfilled") setAssignedTasks(Array.isArray(assignedRes.value) ? assignedRes.value : [])
    if (offersRes.status === "fulfilled") setMyOffers(Array.isArray(offersRes.value) ? offersRes.value : [])

    setLoading(false)
  }, [currentPage, isWorker, searchQuery, searchType])

  useEffect(() => {
    fetchTasks(currentPage)
  }, [fetchTasks, currentPage, tab])

  const myOffersByTaskId = useMemo(
    () => myOffers.reduce((acc, offer) => ({ ...acc, [offer.taskId]: offer }), {}),
    [myOffers]
  )

  const handleWorkerDecision = async (offerId, decision) => {
    try {
      if (decision === "accept") await acceptOffer(offerId)
      else await refuseOffer(offerId)

      await fetchTasks()
    } catch {
      setError("فشل تسجيل القرار.")
    }
  }

  const handleSelectOffer = async (offerId) => {
    try {
      await selectOffer(offerId)
      await fetchTasks()
    } catch {
      setError("فشل اختيار العرض.")
    }
  }

  const handleStatusChange = async (task, action) => {
    try {
      if (action === "done") await markTaskDone(task.id)
      else await cancelTaskRequest(task.id)

      await fetchTasks()
    } catch {
      setError("فشل تحديث الحالة.")
    }
  }

  const handleTaskSubmit = async (payload) => {
    setSubmitting(true)
    setError("")

    try {
      if (editingTask?.id) {
        await updateTask(editingTask.id, payload)
      } else {
        await createTask(payload)
        setSuccessMessage("تم إرسال مهمتك بنجاح! سوف يتم عرضها للجميع فور التحقق منها من قبل الإدارة.")
        setTimeout(() => setSuccessMessage(""), 6000)
      }

      setShowForm(false)
      setEditingTask(null)

      if (!editingTask && currentPage !== 1) {
        setCurrentPage(1)
      } else {
        await fetchTasks(editingTask ? currentPage : 1)
      }
    } catch (err) {
      setError(err.message || "فشل حفظ المهمة.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleFormCancel = () => {
    setEditingTask(null)
    setShowForm(false)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="pagination">
        <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="pagination-btn"><ChevronRight size={18} /></button>
        {[...Array(totalPages)].map((_, index) => (
          <button key={index} onClick={() => setCurrentPage(index + 1)} className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}>{index + 1}</button>
        ))}
        <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="pagination-btn"><ChevronLeft size={18} /></button>
      </div>
    )
  }

  return (
    <div className="page-shell" dir="rtl">
      <div className="card-lg mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900">سوق المهمات</h2>
          <p className="t-label italic">إدارة وتتبع الطلبات النشطة</p>
        </div>
        <div className="flex max-w-2xl flex-1 flex-col items-center gap-3 sm:flex-row">
          <div className="w-full flex-1">
            <BoardFilters searchType={searchType} setSearchType={setSearchType} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <button
            onClick={() => {
              setEditingTask(null)
              setShowForm(true)
            }}
            className="btn btn-primary btn-md flex items-center gap-2"
          >
            <Zap size={14} /> نشر مهمة
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="card-lg mb-10 overflow-hidden">
            <ProblemForm
              key={editingTask?.id || "new-task"}
              initialData={editingTask}
              onAdd={handleTaskSubmit}
              onCancel={handleFormCancel}
              submitting={submitting}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-xs font-bold text-red-600">{error}</div>}

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center shadow-sm"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <p className="text-sm font-black text-emerald-900">{successMessage}</p>
            <p className="mt-1 text-[10px] font-bold text-emerald-600/70">شكرًا لثقتك في منصة عاملك</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto mb-8 flex w-fit gap-2 rounded-xl bg-surface-50 p-1 lg:mx-0">
        {[{ id: "open", lbl: "المهام المتاحة" }, { id: "previous", lbl: "سجل عمليّاتي" }].map((item) => (
          <button key={item.id} onClick={() => { setTab(item.id); setCurrentPage(1); }} className={`rounded-lg px-6 py-2 t-label transition-all ${tab === item.id ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
            {item.lbl}
          </button>
        ))}
      </div>

      {tab === "open" ? (
        <div className="space-y-4">
          {loading ? (
            <div className="empty-state animate-pulse">جارٍ تحميل المهام...</div>
          ) : problems.length === 0 ? (
            <div className="empty-state">لا توجد مهام تطابق بحثك.</div>
          ) : (
            problems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                currentUser={currentUser}
                onEdit={handleEditTask}
                onDelete={setPendingDelete}
                onStatusChange={handleStatusChange}
                workerOffer={myOffersByTaskId[problem.id]}
                onSubmitOffer={createOffer}
                onSelectOffer={handleSelectOffer}
                onWorkerDecision={handleWorkerDecision}
              />
            ))
          )}
          {renderPagination()}
        </div>
      ) : (
        <div className="space-y-4">
          {(() => {
            const allMine = myTasks.concat(assignedTasks)
            const totalItems = allMine.length
            const localTotalPages = Math.ceil(totalItems / itemsPerPage)
            const start = (currentPage - 1) * itemsPerPage
            const pagedItems = allMine.slice(start, start + itemsPerPage)

            return (
              <>
                {pagedItems.map((problem) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    currentUser={currentUser}
                    onEdit={handleEditTask}
                    onDelete={setPendingDelete}
                    onStatusChange={handleStatusChange}
                    workerOffer={myOffersByTaskId[problem.id]}
                    onWorkerDecision={handleWorkerDecision}
                    onSelectOffer={handleSelectOffer}
                  />
                ))}
                {totalItems === 0 && <div className="empty-state">سجل عملياتك فارغ حاليًا.</div>}
                {localTotalPages > 1 && (
                  <div className="pagination">
                    <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="pagination-btn">
                      <ChevronRight size={18} />
                    </button>
                    {[...Array(localTotalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage((page) => Math.min(localTotalPages, page + 1))} disabled={currentPage === localTotalPages} className="pagination-btn">
                      <ChevronLeft size={18} />
                    </button>
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}

      <div className="card-lg mt-12">
        <h4 className="t-label mb-6 flex items-center gap-2 italic">مراقبة السوق جغرافيًا <MapIcon size={12} className="text-blue-600" /></h4>
        <div className="relative isolate z-0 h-64 overflow-hidden rounded-2xl border border-slate-50">
          <LeafletMapPicker
            isListView
            markers={problems.concat(myTasks).filter((task) => task.latitude && task.longitude).map((task) => ({
              position: { lat: task.latitude, lng: task.longitude },
              title: task.title
            }))}
            height="256px"
          />
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onConfirm={() => deleteTask(pendingDelete.id).then(() => { setPendingDelete(null); fetchTasks() })}
        onCancel={() => setPendingDelete(null)}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذه المهمة نهائيًا؟"
      />
    </div>
  )
}
