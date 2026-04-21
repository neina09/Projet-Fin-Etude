import React, { useEffect, useState, useCallback } from "react"
import {
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  ClipboardList,
  Eye,
  MapPin,
  Briefcase,
  RefreshCw,
  IdCard,
  Phone,
  Star,
  X,
  ShieldCheck
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import {
  approveTask,
  rejectTask,
  verifyWorker,
  rejectWorker,
  getAdminDashboard,
  getWorkerRatings,
  fetchWorkerIdentityDocumentPreview,
  getPendingTasks,
  getPendingWorkers,
  resolveAssetUrl
} from "../api"

// ─── Pagination Hook ───────────────────────────────────────────────────────────
// No client-side usePagination hook needed anymore for main lists

// ─── Pagination UI ─────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  let pages = []
  for (let i = 1; i <= Math.max(1, totalPages); i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8 pb-4" dir="rtl">
      <button 
        onClick={() => onPageChange(page - 1)} 
        disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <ChevronRight size={18} />
      </button>
      {pages.map((p, index) => (
        p === '...' ? (
          <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-slate-400 font-bold">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm transition-all shadow-sm ${
              page === p
                ? "bg-[#1d4ed8] text-white shadow-blue-500/30"
                : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        )
      ))}
      <button 
        onClick={() => onPageChange(page + 1)} 
        disabled={page === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <ChevronLeft size={18} />
      </button>
    </div>
  )
}

// ─── Worker Profile Modal ──────────────────────────────────────────────────────
function WorkerModal({ worker, onClose, onAction }) {
  const [ratings, setRatings] = useState([])
  const [identityPreview, setIdentityPreview] = useState(null)
  const [identityLoading, setIdentityLoading] = useState(false)
  const [identityError, setIdentityError] = useState("")

  useEffect(() => {
    if (!worker) return
    getWorkerRatings(worker.id)
      .then((r) => setRatings(Array.isArray(r) ? r : []))
      .catch(() => setRatings([]))
    if (worker.identityDocumentUrl) {
      setIdentityLoading(true)
      fetchWorkerIdentityDocumentPreview(worker.id)
        .then(({ objectUrl, mediaType }) => setIdentityPreview({ objectUrl, mediaType }))
        .catch((err) => setIdentityError(err.message || "تعذر عرض وثيقة الهوية."))
        .finally(() => setIdentityLoading(false))
    }
  }, [worker?.id])

  if (!worker) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl"
        dir="rtl"
      >
        <div className="flex items-center justify-between bg-gradient-to-l from-blue-700 to-indigo-800 px-8 py-6 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">ملف العامل</p>
            <h2 className="mt-2 text-2xl font-black">{worker.name}</h2>
          </div>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition-colors hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-8">
          <div className="flex items-center gap-5 rounded-[2rem] border border-gray-100 bg-gray-50 p-5">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {worker.imageUrl && (
                <img src={resolveAssetUrl(worker.imageUrl)} alt={worker.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900">{worker.name}</h3>
              <p className="mt-1 text-sm font-bold text-gray-400">{worker.job || "عامل"}</p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700">
                <ShieldCheck size={12} /> بانتظار المراجعة
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: MapPin, label: "العنوان", value: worker.address || "غير محدد" },
              { icon: Phone, label: "الهاتف", value: worker.phoneNumber || "غير متوفر", ltr: true },
              { icon: IdCard, label: "الهوية", value: worker.nationalIdNumber || "غير متوفرة", ltr: true },
              { icon: Star, label: "التقييم", value: Number(worker.averageRating || 0).toFixed(1) }
            ].map(({ icon: Icon, label, value, ltr }) => (
              <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-500"><Icon size={15} /> {label}</div>
                <p className="text-sm font-black text-gray-900" dir={ltr ? "ltr" : undefined}>{value}</p>
              </div>
            ))}
          </div>

          {worker.identityDocumentUrl && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h4 className="mb-4 text-sm font-black text-gray-900">وثيقة الهوية</h4>
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {identityLoading && (
                  <div className="flex min-h-[200px] items-center justify-center text-sm font-bold text-gray-400">جاري التحميل...</div>
                )}
                {!identityLoading && identityError && (
                  <div className="p-6 text-center text-sm font-bold text-red-600">{identityError}</div>
                )}
                {!identityLoading && !identityError && identityPreview?.objectUrl && (
                  String(identityPreview.mediaType || "").includes("pdf")
                    ? <iframe title="وثيقة الهوية" src={identityPreview.objectUrl} className="h-[28rem] w-full bg-white" />
                    : <img src={identityPreview.objectUrl} alt="وثيقة الهوية" className="max-h-[28rem] w-full object-contain p-2" />
                )}
              </div>
            </div>
          )}

          {ratings.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-black text-gray-900">آخر التقييمات</h4>
                <span className="text-xs font-bold text-gray-400">{ratings.length} تقييم</span>
              </div>
              <div className="space-y-3">
                {ratings.slice(0, 3).map((r) => (
                  <div key={r.id} className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-black text-gray-800">{r.userName || "عميل"}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black">{r.stars}</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-500">{r.comment || "لا يوجد تعليق."}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 border-t border-gray-100 bg-gray-50 px-8 py-6">
          <button onClick={() => onAction("verify", worker.id)}
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition-colors hover:bg-emerald-700">
            <CheckCircle size={18} /> توثيق العامل
          </button>
          <button onClick={() => onAction("reject", worker.id)}
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-red-200 bg-white px-6 py-4 text-sm font-black text-red-600 transition-colors hover:bg-red-50">
            <XCircle size={18} /> رفض الطلب
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "tasks", label: "مراجعة المهام", icon: ClipboardList },
  { id: "verification", label: "توثيق العمال", icon: Shield }
]

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function TasksVerificationPage() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedWorker, setSelectedWorker] = useState(null)

  const [tasks, setTasks] = useState([])
  const [workers, setWorkers] = useState([])
  const [taskPage, setTaskPage] = useState(1)
  const [workerPage, setWorkerPage] = useState(1)
  const [taskTotalPages, setTaskTotalPages] = useState(0)
  const [workerTotalPages, setWorkerTotalPages] = useState(0)
  const [totalPendingTasks, setTotalPendingTasks] = useState(0)
  const [totalPendingWorkers, setTotalPendingWorkers] = useState(0)

  const loadStats = useCallback(async () => {
    try {
      const d = await getAdminDashboard()
      setStats(d)
      setTotalPendingTasks(d.pendingTasks || 0)
      setTotalPendingWorkers(d.pendingWorkers || 0)
    } catch {}
  }, [])

  const loadTasks = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await getPendingTasks(p - 1, 9)
      setTasks(res.content || [])
      setTaskTotalPages(res.totalPages || 0)
    } catch (err) {
      setError(err.message || "فشل تحميل المهام.")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadWorkers = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const workersList = await getPendingWorkers()
      setWorkers(workersList || [])
      setWorkerTotalPages(1) // Not paginated currently in API
    } catch (err) {
      setError(err.message || "فشل تحميل طلبات التوثيق.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    if (activeTab === "tasks") loadTasks(taskPage)
    else loadWorkers(workerPage)
  }, [activeTab, taskPage, workerPage, loadTasks, loadWorkers])

  const handleRefresh = () => {
    loadStats()
    if (activeTab === "tasks") loadTasks(taskPage)
    else loadWorkers(workerPage)
  }

  const handleTaskAction = async (action, taskId) => {
    try {
      if (action === "approve") await approveTask(taskId)
      else await rejectTask(taskId)
      handleRefresh()
    } catch (err) {
      setError(err.message || "تعذر تنفيذ العملية.")
    }
  }

  const handleWorkerAction = async (action, workerId) => {
    try {
      if (action === "verify") await verifyWorker(workerId)
      else await rejectWorker(workerId)
      setSelectedWorker(null)
      handleRefresh()
    } catch (err) {
      setError(err.message || "تعذر تنفيذ العملية.")
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] bg-[#F8FAFC] px-4 py-8 text-right lg:px-8" dir="rtl">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">المهام والتوثيق</h1>
          <p className="mt-1 text-sm font-medium text-gray-400">
            المهام التي تحتاج موافقة • طلبات توثيق العمال
          </p>
        </div>
        <button onClick={handleRefresh}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-black text-gray-600 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600">
          <RefreshCw size={15} /> تحديث
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>
      )}

      {/* Tabs */}
      <div className="mb-8 flex gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-black transition-all duration-300 ${
              activeTab === id
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}>
            <Icon size={16} />
            {label}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
              activeTab === id ? "bg-white/20 text-white" : "bg-red-50 text-red-500"
            }`}>
              {id === "tasks" ? totalPendingTasks : totalPendingWorkers}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── تاب المهام: PENDING_REVIEW فقط ── */}
        {activeTab === "tasks" && (
          <motion.div key="tasks"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}>
            {loading ? (
              <div className="py-20 text-center text-sm font-bold text-gray-400">جاري تحميل المهام...</div>
            ) : tasks.length ? (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {tasks.map((task) => (
                    <motion.div key={task.id}
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-yellow-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                      {/* ... task card content ... */}
                      <div>
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <h4 className="font-black text-gray-900 leading-snug">{task.title}</h4>
                          <span className="shrink-0 rounded-full bg-yellow-50 px-3 py-1 text-[10px] font-black text-yellow-700">
                            بانتظار الموافقة
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-400">
                          {task.profession && (
                            <span className="flex items-center gap-1"><Briefcase size={11} /> {task.profession}</span>
                          )}
                          {task.address && (
                            <span className="flex items-center gap-1"><MapPin size={11} /> {task.address}</span>
                          )}
                        </div>
                        {task.description && (
                          <p className="mt-3 text-xs font-medium text-gray-400 line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 border-t border-gray-50 pt-4">
                        <button onClick={() => handleTaskAction("approve", task.id)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2.5 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100">
                          <CheckCircle size={14} /> قبول
                        </button>
                        <button onClick={() => handleTaskAction("reject", task.id)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-xs font-black text-red-700 transition-colors hover:bg-red-100">
                          <XCircle size={14} /> رفض
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Pagination page={taskPage} totalPages={taskTotalPages} onPageChange={setTaskPage} />
                <p className="mt-3 text-center text-xs font-bold text-gray-400">
                  {totalPendingTasks} مهمة بانتظار الموافقة • الصفحة {taskPage} من {taskTotalPages}
                </p>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-20 text-center">
                <CheckCircle size={40} className="mx-auto mb-4 text-emerald-300" />
                <p className="text-sm font-bold text-gray-400">لا توجد مهام بانتظار الموافقة حالياً.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── تاب التوثيق ── */}
        {activeTab === "verification" && (
          <motion.div key="verification"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}>
            {loading ? (
              <div className="py-20 text-center text-sm font-bold text-gray-400">جاري تحميل بيانات التوثيق...</div>
            ) : workers.length ? (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {workers.map((worker) => (
                    <motion.div key={worker.id}
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                          {worker.imageUrl && (
                            <img src={resolveAssetUrl(worker.imageUrl)} alt={worker.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-gray-900 truncate">{worker.name}</h4>
                          <p className="text-xs font-bold text-gray-400 mt-0.5">{worker.job || "عامل"}</p>
                          {worker.address && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-gray-300">
                              <MapPin size={10} /> {worker.address}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 border-t border-gray-50 pt-4">
                        <button onClick={() => setSelectedWorker(worker)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-50 py-2.5 text-xs font-black text-blue-700 transition-colors hover:bg-blue-100">
                          <Eye size={14} /> عرض الملف
                        </button>
                        <button onClick={() => handleWorkerAction("verify", worker.id)}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100">
                          <CheckCircle size={14} />
                        </button>
                        <button onClick={() => handleWorkerAction("reject", worker.id)}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-black text-red-700 transition-colors hover:bg-red-100">
                          <XCircle size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {workerTotalPages > 1 && <Pagination page={workerPage} totalPages={workerTotalPages} onPageChange={setWorkerPage} /> }
                <p className="mt-3 text-center text-xs font-bold text-gray-400">
                  {totalPendingWorkers} طلب توثيق بانتظار المراجعة
                </p>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-20 text-center">
                <Shield size={40} className="mx-auto mb-4 text-blue-200" />
                <p className="text-sm font-bold text-gray-400">لا توجد طلبات توثيق معلقة حالياً.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedWorker && (
          <WorkerModal
            worker={selectedWorker}
            onClose={() => setSelectedWorker(null)}
            onAction={handleWorkerAction}
          />
        )}
      </AnimatePresence>
    </div>
  )
}