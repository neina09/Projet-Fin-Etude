import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Briefcase,
  CheckCircle,
  ChevronLeft,
  ClipboardList,
  Eye,
  IdCard,
  MapPin,
  Phone,
  Plus,
  Shield,
  ShieldCheck,
  Star,
  Users,
  X,
  XCircle,
  Loader2
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import {
  adminCreateWorker,
  approveTask,
  fetchWorkerIdentityDocumentPreview,
  getAdminDashboard,
  getAllUsers,
  getWorkerRatings,
  rejectTask,
  rejectWorker,
  resolveAssetUrl,
  verifyWorker
} from "../api"
import TaskStatsCharts from "./TaskStatsCharts"

const cardItems = (stats) => [
  {
    key: "users",
    title: "إجمالي المستخدمين",
    value: stats?.totalUsers || 0,
    accent: "bg-blue-50 text-blue-600",
    icon: Users
  },
  {
    key: "workers",
    title: "إجمالي العمال",
    value: stats?.totalWorkers || 0,
    accent: "bg-amber-50 text-amber-600",
    icon: Briefcase
  },
  {
    key: "pending-workers",
    title: "عمال بانتظار التوثيق",
    value: stats?.pendingWorkers || 0,
    accent: "bg-red-50 text-red-600",
    icon: Shield
  },
  {
    key: "open-tasks",
    title: "مهام مفتوحة",
    value: stats?.openTasks || 0,
    accent: "bg-emerald-50 text-emerald-600",
    icon: ClipboardList
  }
]

// ─── "View More" Button ───────────────────────────────────────────────────────
function ViewMoreButton({ count, onClick }) {
  if (!count || count <= 0) return null
  return (
    <motion.button
      whileHover={{ x: -4 }}
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-3.5 text-sm font-black text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
    >
      <span className="flex items-center gap-2">
        <Eye size={15} />
        عرض جميع الطلبات
      </span>
      <span className="flex items-center gap-2 text-blue-400">
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-black text-blue-700">
          +{count}
        </span>
        <ChevronLeft size={15} />
      </span>
    </motion.button>
  )
}

// ─── Add Worker Modal ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "", phoneNumber: "", job: "", address: "",
  salary: "", nationalIdNumber: ""
}

function AddWorkerModal({ onClose, onSuccess }) {
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    getAllUsers()
      .then(data => {
        // فلترة المستخدمين الذين ليسوا عمالاً بعد
        const list = Array.isArray(data) ? data : []
        setUsers(list.filter(u => u.role !== "WORKER" && u.role !== "ADMIN"))
      })
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false))
  }, [])

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    if (!selectedUserId) { setFormError("يرجى اختيار مستخدم"); return }
    if (!form.name.trim()) { setFormError("الاسم مطلوب"); return }
    if (!form.phoneNumber.trim()) { setFormError("رقم الهاتف مطلوب"); return }
    if (!form.job.trim()) { setFormError("المهنة مطلوبة"); return }
    if (!form.address.trim()) { setFormError("العنوان مطلوب"); return }
    if (!form.nationalIdNumber.trim()) { setFormError("رقم الهوية مطلوب"); return }
    const salary = parseInt(form.salary, 10)
    if (isNaN(salary) || salary < 0) { setFormError("يرجى إدخال راتب صحيح"); return }

    setSubmitting(true)
    try {
      await adminCreateWorker(Number(selectedUserId), {
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        job: form.job.trim(),
        address: form.address.trim(),
        salary,
        nationalIdNumber: form.nationalIdNumber.trim()
      })
      onSuccess()
      onClose()
    } catch (err) {
      setFormError(err.message || "تعذر إضافة العامل")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-l from-indigo-700 to-violet-800 px-8 py-6 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">لوحة الإدارة</p>
            <h2 className="mt-1 text-2xl font-black">إضافة عامل جديد</h2>
          </div>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition-colors hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* User select */}
            <div>
              <label className="mb-2 block text-xs font-black text-gray-500">اختر المستخدم <span className="text-red-500">*</span></label>
              {usersLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 size={16} className="animate-spin" /> جاري تحميل المستخدمين...
                </div>
              ) : (
                <select
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">-- اختر مستخدماً --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.phone || u.phoneNumber || ""})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Grid fields */}
            {[
              { key: "name",             label: "الاسم الكامل",       placeholder: "مثال: محمد احمد",            type: "text" },
              { key: "phoneNumber",      label: "رقم الهاتف",         placeholder: "+222XXXXXXXX",               type: "text" },
              { key: "job",             label: "المهنة / التخصص",    placeholder: "مثال: كهربائي، سباك...",     type: "text" },
              { key: "address",         label: "العنوان",            placeholder: "مثال: نواكشوط، تيارت...",   type: "text" },
              { key: "nationalIdNumber",label: "رقم الهوية الوطنية", placeholder: "أدخل رقم البطاقة الوطنية", type: "text" },
              { key: "salary",          label: "الراتب (MRU/ساعة)",  placeholder: "مثال: 500",                type: "number" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="mb-2 block text-xs font-black text-gray-500">{label} <span className="text-red-500">*</span></label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setField(key, e.target.value)}
                  placeholder={placeholder}
                  min={type === "number" ? 0 : undefined}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            ))}

            {formError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-black text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              {submitting ? "جاري الإضافة..." : "إضافة العامل"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [workerRatings, setWorkerRatings] = useState([])
  const [identityPreview, setIdentityPreview] = useState(null)
  const [identityPreviewLoading, setIdentityPreviewLoading] = useState(false)
  const [identityPreviewError, setIdentityPreviewError] = useState("")
  const [showAddWorker, setShowAddWorker] = useState(false)
  const identityBlobRef = useRef(null)

  const loadDashboard = async () => {
    setLoading(true)
    setError("")
    try {
      setStats(await getAdminDashboard())
    } catch (err) {
      setError(err.message || "تعذر تحميل لوحة الإدارة حالياً.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDashboard() }, [])

  useEffect(() => {
    const revoke = () => {
      if (identityBlobRef.current) {
        URL.revokeObjectURL(identityBlobRef.current)
        identityBlobRef.current = null
      }
    }
    revoke()
    setIdentityPreview(null)
    setIdentityPreviewError("")

    if (!selectedWorker?.id || !selectedWorker.identityDocumentUrl) {
      setIdentityPreviewLoading(false)
      return undefined
    }

    let cancelled = false
    setIdentityPreviewLoading(true)

    fetchWorkerIdentityDocumentPreview(selectedWorker.id)
      .then(({ objectUrl, mediaType }) => {
        if (cancelled) { URL.revokeObjectURL(objectUrl); return }
        identityBlobRef.current = objectUrl
        setIdentityPreview({ objectUrl, mediaType })
        setIdentityPreviewError("")
      })
      .catch((err) => { if (!cancelled) setIdentityPreviewError(err.message || "تعذر عرض وثيقة الهوية.") })
      .finally(() => { if (!cancelled) setIdentityPreviewLoading(false) })

    return () => { cancelled = true; revoke() }
  }, [selectedWorker?.id, selectedWorker?.identityDocumentUrl])

  const openWorkerProfile = async (worker) => {
    setSelectedWorker(worker)
    try {
      const ratings = await getWorkerRatings(worker.id)
      setWorkerRatings(Array.isArray(ratings) ? ratings : [])
    } catch { setWorkerRatings([]) }
  }

  const handleWorkerAction = async (action, workerId) => {
    try {
      if (action === "verify") await verifyWorker(workerId)
      else await rejectWorker(workerId)
      setSelectedWorker(null)
      await loadDashboard()
    } catch (err) { setError(err.message || "تعذر تنفيذ العملية على العامل.") }
  }

  const handleTaskAction = async (action, taskId) => {
    try {
      if (action === "approve") await approveTask(taskId)
      else await rejectTask(taskId)
      await loadDashboard()
    } catch (err) { setError(err.message || "تعذر تنفيذ العملية على المهمة.") }
  }

  const pseudoTasks = useMemo(() => [
    ...Array.from({ length: Number(stats?.pendingTasks || 0) }, (_, i) => ({ id: `p-${i}`, status: "PENDING_REVIEW" })),
    ...Array.from({ length: Number(stats?.openTasks || 0) }, (_, i) => ({ id: `o-${i}`, status: "OPEN" })),
    ...Array.from({ length: Number(stats?.inProgressTasks || 0) }, (_, i) => ({ id: `i-${i}`, status: "IN_PROGRESS" })),
    ...Array.from({ length: Number(stats?.completedTasks || 0) }, (_, i) => ({ id: `c-${i}`, status: "COMPLETED" }))
  ], [stats])

  // Extra counts beyond the displayed preview
  const extraPendingWorkers = Math.max(0, (stats?.pendingWorkers || 0) - (stats?.latestPendingWorkers?.length || 0))
  const extraPendingTasks = Math.max(0, (stats?.pendingTasks || 0) - (stats?.latestPendingTasks?.length || 0))

  const goToTasksPage = (tab = "tasks") => {
    if (onNavigate) onNavigate("tasks-verification", { tab })
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] bg-[#F8FAFC] px-4 py-8 text-right lg:px-8" dir="rtl">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900">لوحة تحكم الإدارة</h1>
          <p className="text-sm font-medium text-gray-500">هذه الأرقام والقوائم مرتبطة مباشرة بالبيانات الحقيقية في الخلفية.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddWorker(true)}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-md shadow-indigo-200 transition-colors hover:bg-indigo-700"
        >
          <Plus size={18} />
          إضافة عامل جديد
        </motion.button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cardItems(stats).map((item) => {
          const Icon = item.icon
          return (
            <div key={item.key} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.accent}`}>
                  <Icon size={24} />
                </div>
                <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">مباشر</span>
              </div>
              <p className="mb-1 text-xs font-bold text-gray-400">{item.title}</p>
              <p className="text-3xl font-black text-gray-900">{item.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-8">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="mb-1 text-xl font-extrabold text-gray-900">مؤشرات المنصة</h3>
              <p className="text-sm font-medium text-gray-400">توزيع المهام حسب حالتها الحالية.</p>
            </div>
            <TaskStatsCharts tasks={pseudoTasks} />
          </div>

          {/* ── Pending Workers Section ── */}
          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">طلبات توثيق العمال</h3>
                <p className="text-sm font-medium text-gray-400">آخر الطلبات المعلقة المرتبطة ببيانات حقيقية.</p>
              </div>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                {stats?.pendingWorkers || 0} طلب
              </span>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm font-bold text-gray-400">جاري تحميل بيانات التوثيق...</div>
            ) : stats?.latestPendingWorkers?.length ? (
              <div className="space-y-4">
                {stats.latestPendingWorkers.map((worker) => (
                  <div key={worker.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                        {worker.imageUrl && (
                          <img src={resolveAssetUrl(worker.imageUrl)} alt={worker.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <button onClick={() => openWorkerProfile(worker)} className="text-right text-base font-black text-gray-900 transition-colors hover:text-blue-600">
                          {worker.name}
                        </button>
                        <p className="text-xs font-bold text-gray-400">{worker.job || "عامل"} • {worker.address || "غير محدد"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleWorkerAction("verify", worker.id)} className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100">قبول</button>
                      <button onClick={() => handleWorkerAction("reject", worker.id)} className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-700 transition-colors hover:bg-red-100">رفض</button>
                      <button onClick={() => openWorkerProfile(worker)} className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 transition-colors hover:bg-blue-100">عرض</button>
                    </div>
                  </div>
                ))}

                {/* View More → goes to verification tab */}
                <ViewMoreButton
                  count={extraPendingWorkers}
                  onClick={() => goToTasksPage("verification")}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm font-bold text-gray-400">
                لا توجد طلبات توثيق معلقة حالياً.
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          {/* ── Pending Tasks Section ── */}
          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-gray-900">مراجعة المهام</h3>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                {stats?.pendingTasks || 0}
              </span>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm font-bold text-gray-400">جاري تحميل المهام...</div>
            ) : stats?.latestPendingTasks?.length ? (
              <div className="space-y-4">
                {stats.latestPendingTasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="mb-2 font-black text-gray-900">{task.title}</h4>
                      <p className="text-xs font-bold text-gray-500">{task.profession || "مهمة عامة"} • {task.address || "العنوان غير محدد"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleTaskAction("approve", task.id)} className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100">قبول</button>
                      <button onClick={() => handleTaskAction("reject", task.id)} className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-700 transition-colors hover:bg-red-100">إلغاء</button>
                    </div>
                  </div>
                ))}

                {/* View More → goes to tasks tab */}
                <ViewMoreButton
                  count={extraPendingTasks}
                  onClick={() => goToTasksPage("tasks")}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm font-bold text-gray-400">
                لا توجد مهام بانتظار المراجعة.
              </div>
            )}
          </div>

          {/* ── Quick Summary ── */}
          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-extrabold text-gray-900">ملخص سريع</h3>
            <div className="space-y-4 text-sm font-bold text-gray-600">
              {[
                { label: "مستخدمون موثقون", value: stats?.verifiedUsers || 0 },
                { label: "حجوزات قيد الانتظار", value: stats?.pendingBookings || 0 },
                { label: "حجوزات مقبولة", value: stats?.acceptedBookings || 0 },
                { label: "إشعارات غير مقروءة", value: stats?.totalNotifications || 0 }
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Worker Modal ── */}
      <AnimatePresence>
        {showAddWorker && (
          <AddWorkerModal
            onClose={() => setShowAddWorker(false)}
            onSuccess={loadDashboard}
          />
        )}
      </AnimatePresence>

      {/* ── Worker Profile Modal ── */}
      <AnimatePresence>
        {selectedWorker && (
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
                  <h2 className="mt-2 text-2xl font-black">{selectedWorker.name}</h2>
                </div>
                <button onClick={() => setSelectedWorker(null)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition-colors hover:bg-white/20">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-8">
                <div className="flex items-center gap-5 rounded-[2rem] border border-gray-100 bg-gray-50 p-5">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    {selectedWorker.imageUrl && (
                      <img src={resolveAssetUrl(selectedWorker.imageUrl)} alt={selectedWorker.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900">{selectedWorker.name}</h3>
                    <p className="mt-1 text-sm font-bold text-gray-400">{selectedWorker.job || "عامل"}</p>
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700">
                      <ShieldCheck size={12} /> بانتظار المراجعة
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { icon: MapPin, label: "العنوان", value: selectedWorker.address || "غير محدد" },
                    { icon: Phone, label: "الهاتف", value: selectedWorker.phoneNumber || "غير متوفر", ltr: true },
                    { icon: IdCard, label: "الهوية", value: selectedWorker.nationalIdNumber || "غير متوفرة", ltr: true },
                    { icon: Star, label: "التقييم", value: Number(selectedWorker.averageRating || 0).toFixed(1) }
                  ].map(({ icon: Icon, label, value, ltr }) => (
                    <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-gray-500"><Icon size={15} /> {label}</div>
                      <p className="text-sm font-black text-gray-900" dir={ltr ? "ltr" : undefined}>{value}</p>
                    </div>
                  ))}
                </div>

                {selectedWorker.identityDocumentUrl && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <h4 className="mb-4 text-sm font-black text-gray-900">وثيقة الهوية</h4>
                    <p className="mb-3 text-xs font-bold text-gray-500">تُحمَّل عبر الخادم مع صلاحيات المدير.</p>
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                      {identityPreviewLoading && (
                        <div className="flex min-h-[200px] items-center justify-center p-6 text-sm font-bold text-gray-400">جاري تحميل صورة البطاقة...</div>
                      )}
                      {!identityPreviewLoading && identityPreviewError && (
                        <div className="p-6 text-center text-sm font-bold text-red-600">{identityPreviewError}</div>
                      )}
                      {!identityPreviewLoading && !identityPreviewError && identityPreview?.objectUrl && (
                        String(identityPreview.mediaType || "").includes("pdf") ? (
                          <iframe title="وثيقة الهوية" src={identityPreview.objectUrl} className="h-[28rem] w-full bg-white" />
                        ) : (
                          <img src={identityPreview.objectUrl} alt="وثيقة الهوية" className="max-h-[28rem] w-full object-contain p-2" />
                        )
                      )}
                    </div>
                  </div>
                )}

                {workerRatings.length > 0 && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-black text-gray-900">آخر التقييمات</h4>
                      <span className="text-xs font-bold text-gray-400">{workerRatings.length} تقييم</span>
                    </div>
                    <div className="space-y-3">
                      {workerRatings.slice(0, 3).map((rating) => (
                        <div key={rating.id} className="rounded-xl border border-gray-100 bg-white p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-black text-gray-800">{rating.userName || "عميل"}</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              <span className="text-xs font-black">{rating.stars}</span>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-gray-500">{rating.comment || "لا يوجد تعليق."}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 border-t border-gray-100 bg-gray-50 px-8 py-6">
                <button onClick={() => handleWorkerAction("verify", selectedWorker.id)} className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition-colors hover:bg-emerald-700">
                  <CheckCircle size={18} /> توثيق العامل
                </button>
                <button onClick={() => handleWorkerAction("reject", selectedWorker.id)} className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-red-200 bg-white px-6 py-4 text-sm font-black text-red-600 transition-colors hover:bg-red-50">
                  <XCircle size={18} /> رفض الطلب
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}