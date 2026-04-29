import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react"
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
  Layout,
  Loader2,
  TrendingUp
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
  uploadIdentityDocument,
  uploadWorkerImage,
  verifyWorker
} from "../api"
import SimpleFooter from "./SimpleFooter"
import { combineIdentityFiles } from "../utils/imageFiles"
import { useLanguage } from "../i18n/LanguageContext"

const TaskStatsCharts = lazy(() => import("./TaskStatsCharts"))

const cardItems = (stats) => [
  {
    key: "users",
    title: "إجمالي المستخدمين",
    value: stats?.totalUsers || 0,
    icon: Users,
    color: "blue"
  },
  {
    key: "workers",
    title: "إجمالي العمال",
    value: stats?.totalWorkers || 0,
    icon: Briefcase,
    color: "amber"
  },
  {
    key: "pending-workers",
    title: "بانتظار التوثيق",
    value: stats?.pendingWorkers || 0,
    icon: Shield,
    color: "rose"
  },
  {
    key: "open-tasks",
    title: "مهام مفتوحة",
    value: stats?.openTasks || 0,
    icon: ClipboardList,
    color: "emerald"
  }
]

// ─── "View More" Button ───────────────────────────────────────────────────────
function ViewMoreButton({ count, onClick }) {
  if (!count || count <= 0) return null
  return (
    <motion.button
      whileHover={{ x: -4 }}
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-primary/10 bg-primary/5 px-5 py-3.5 text-[10px] font-black text-primary transition-all hover:border-primary/20 hover:bg-primary/10 hover:shadow-sm uppercase tracking-widest"
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

// ─── Task Card Item ───────────────────────────────────────────────────────────
function TaskCardItem({ task, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false)
  const description = task.description || ""
  const LIMIT = 80
  const isLong = description.length > LIMIT

  return (
    <div className="card group flex flex-col gap-3">
      {/* العنوان كاملاً دائماً */}
      <h4 className="text-xs font-black text-slate-900 transition-colors group-hover:text-primary">
        {task.title}
      </h4>

      {/* المهنة والعنوان */}
      <p className="t-label">
        {task.profession || "مهمة عامة"} • {task.address || "العنوان غير محدد"}
      </p>

      {/* الوصف مع عرض المزيد */}
      {description && (
        <p className="text-[11px] leading-relaxed text-slate-500">
          {expanded ? description : isLong ? `${description.slice(0, LIMIT)}...` : description}
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mr-1 font-bold text-blue-500 hover:underline"
            >
              {expanded ? "عرض أقل" : "عرض المزيد"}
            </button>
          )}
        </p>
      )}

      {/* أزرار القبول والرفض */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onApprove}
          className="btn btn-primary btn-sm bg-emerald-600 hover:bg-emerald-700"
        >
          قبول
        </button>
        <button
          onClick={onReject}
          className="btn btn-secondary btn-sm text-red-600 hover:bg-red-50"
        >
          إلغاء
        </button>
      </div>
    </div>
  )
}

// ─── Add Worker Modal ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  phoneNumber: "",
  job: "",
  address: "",
  salary: "",
  nationalIdNumber: ""
}

function AddWorkerModal({ onClose, onSuccess }) {
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [workerImageFile, setWorkerImageFile] = useState(null)
  const [identityFrontFile, setIdentityFrontFile] = useState(null)
  const [identityBackFile, setIdentityBackFile] = useState(null)

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setUsers(list.filter((u) => u.role !== "WORKER" && u.role !== "ADMIN"))
      })
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false))
  }, [])

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    if (!selectedUserId) {
      setFormError("يرجى اختيار مستخدم")
      return
    }
    if (!form.name.trim()) {
      setFormError("الاسم مطلوب")
      return
    }
    if (!form.phoneNumber.trim()) {
      setFormError("رقم الهاتف مطلوب")
      return
    }
    if (!form.job.trim()) {
      setFormError("المهنة مطلوبة")
      return
    }
    if (!form.address.trim()) {
      setFormError("العنوان مطلوب")
      return
    }
    if (!form.nationalIdNumber.trim()) {
      setFormError("رقم الهوية مطلوب")
      return
    }

    const salary = parseInt(form.salary, 10)
    if (isNaN(salary) || salary < 0) {
      setFormError("يرجى إدخال راتب صحيح")
      return
    }

    setSubmitting(true)
    try {
      const createdWorker = await adminCreateWorker(Number(selectedUserId), {
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        job: form.job.trim(),
        address: form.address.trim(),
        salary,
        nationalIdNumber: form.nationalIdNumber.trim()
      })

      const workerId = createdWorker?.id || createdWorker?.workerId
      if (!workerId) {
        throw new Error("تم إنشاء العامل لكن تعذر تحديد معرفه لرفع الملفات.")
      }

      if (workerImageFile) {
        await uploadWorkerImage(workerId, workerImageFile)
      }

      const identityFile = await combineIdentityFiles(identityFrontFile, identityBackFile)
      if (identityFile) {
        await uploadIdentityDocument(workerId, identityFile)
      }

      onSuccess()
      onClose()
    } catch (err) {
      setFormError(err.message || "تعذر إضافة العامل")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="modal-box"
        dir="rtl"
      >
        <div className="flex items-center justify-between bg-primary px-8 py-6 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
              لوحة الإدارة
            </p>
            <h2 className="mt-1 text-2xl font-black">إضافة عامل جديد</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="mb-2 block text-xs font-black text-gray-500">
                اختر المستخدم <span className="text-red-500">*</span>
              </label>
              {usersLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 size={16} className="animate-spin" /> جاري تحميل المستخدمين...
                </div>
              ) : (
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">-- اختر مستخدماً --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} ({u.phone || u.phoneNumber || ""})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {[
              { key: "name", label: "الاسم الكامل", placeholder: "مثال: محمد احمد", type: "text" },
              { key: "phoneNumber", label: "رقم الهاتف", placeholder: "+222XXXXXXXX", type: "text" },
              { key: "job", label: "المهنة / التخصص", placeholder: "مثال: كهربائي، سباك...", type: "text" },
              { key: "address", label: "العنوان", placeholder: "مثال: نواكشوط، تيارت...", type: "text" },
              { key: "nationalIdNumber", label: "رقم الهوية الوطنية", placeholder: "أدخل رقم البطاقة الوطنية", type: "text" },
              { key: "salary", label: "الراتب (MRU/ساعة)", placeholder: "مثال: 500", type: "number" }
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="mb-2 block text-xs font-black text-gray-500">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder={placeholder}
                  min={type === "number" ? 0 : undefined}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            ))}

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-4 text-sm font-black text-gray-900">الصورة الشخصية</h3>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-white p-6 text-center transition-all hover:border-indigo-400">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setWorkerImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                  {workerImageFile ? (
                    <img src={URL.createObjectURL(workerImageFile)} alt="Worker preview" className="h-full w-full object-cover" />
                  ) : (
                    <Users size={28} className="text-gray-300" />
                  )}
                </div>
                <span className="text-sm font-black text-gray-900">اختر صورة العامل</span>
                <span className="mt-1 text-xs font-bold text-gray-400">اختياري</span>
              </label>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-4 text-sm font-black text-gray-900">صورة البطاقة</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-gray-300 bg-white text-center transition-all hover:border-indigo-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdentityFrontFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {identityFrontFile ? (
                    <img src={URL.createObjectURL(identityFrontFile)} alt="Front ID preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="px-4">
                      <p className="text-sm font-black text-gray-900">الوجه الأمامي</p>
                      <p className="mt-1 text-xs font-bold text-gray-400">ارفع صورة أمامية</p>
                    </div>
                  )}
                </label>

                <label className="relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-gray-300 bg-white text-center transition-all hover:border-indigo-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdentityBackFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {identityBackFile ? (
                    <img src={URL.createObjectURL(identityBackFile)} alt="Back ID preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="px-4">
                      <p className="text-sm font-black text-gray-900">الوجه الخلفي</p>
                      <p className="mt-1 text-xs font-bold text-gray-400">ارفع صورة خلفية</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {formError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-sm font-black text-white transition-all hover:bg-primary-hover disabled:opacity-60 shadow-lg shadow-primary/20"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              {submitting ? "جاري الإضافة..." : "إضافة العامل للمنصة"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminDashboard({ onNavigate }) {
  const { dir } = useLanguage()
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

  useEffect(() => {
    loadDashboard()
  }, [])

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
        if (cancelled) {
          URL.revokeObjectURL(objectUrl)
          return
        }
        identityBlobRef.current = objectUrl
        setIdentityPreview({ objectUrl, mediaType })
        setIdentityPreviewError("")
      })
      .catch((err) => {
        if (!cancelled) {
          setIdentityPreviewError(err.message || "تعذر عرض وثيقة الهوية.")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIdentityPreviewLoading(false)
        }
      })

    return () => {
      cancelled = true
      revoke()
    }
  }, [selectedWorker?.id, selectedWorker?.identityDocumentUrl])

  const openWorkerProfile = async (worker) => {
    setSelectedWorker(worker)
    try {
      const ratings = await getWorkerRatings(worker.id)
      setWorkerRatings(Array.isArray(ratings) ? ratings : [])
    } catch {
      setWorkerRatings([])
    }
  }

  const handleWorkerAction = async (action, workerId) => {
    try {
      if (action === "verify") await verifyWorker(workerId)
      else await rejectWorker(workerId)
      setSelectedWorker(null)
      await loadDashboard()
    } catch (err) {
      setError(err.message || "تعذر تنفيذ العملية على العامل.")
    }
  }

  const handleTaskAction = async (action, taskId) => {
    try {
      if (action === "approve") await approveTask(taskId)
      else await rejectTask(taskId)
      await loadDashboard()
    } catch (err) {
      setError(err.message || "تعذر تنفيذ العملية على المهمة.")
    }
  }

  const pseudoTasks = useMemo(
    () => [
      ...Array.from({ length: Number(stats?.pendingTasks || 0) }, (_, i) => ({
        id: `p-${i}`,
        status: "PENDING_REVIEW"
      })),
      ...Array.from({ length: Number(stats?.openTasks || 0) }, (_, i) => ({
        id: `o-${i}`,
        status: "OPEN"
      })),
      ...Array.from({ length: Number(stats?.inProgressTasks || 0) }, (_, i) => ({
        id: `i-${i}`,
        status: "IN_PROGRESS"
      })),
      ...Array.from({ length: Number(stats?.completedTasks || 0) }, (_, i) => ({
        id: `c-${i}`,
        status: "COMPLETED"
      }))
    ],
    [stats]
  )

  const extraPendingWorkers = Math.max(
    0,
    (stats?.pendingWorkers || 0) - (stats?.latestPendingWorkers?.length || 0)
  )
  const extraPendingTasks = Math.max(
    0,
    (stats?.pendingTasks || 0) - (stats?.latestPendingTasks?.length || 0)
  )

  const goToTasksPage = (tab = "tasks") => {
    if (onNavigate) onNavigate("tasksVerification", { initialTab: tab })
  }

  return (
    <div className="space-y-10">
      <section className="app-page-header mt-2">
        <div className="app-page-header-row">
          <div className="text-right">
            <span className="app-page-eyebrow">إدارة النظام</span>
            <h1 className="app-page-title mt-4">لوحة تحكم الإدارة</h1>
            <p className="app-page-subtitle">
              مرحباً بك في منطقة الإدارة. تابع مؤشرات الأداء، تحقق من طلبات التوثيق، وقم بمراجعة المهام المعلقة بكل سهولة.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <button
              onClick={() => setShowAddWorker(true)}
              className="btn btn-primary btn-md w-full sm:w-auto"
            >
              <Plus size={18} />
              إضافة عامل جديد
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {cardItems(stats).map((item) => {
          const Icon = item.icon

          return (
            <motion.div
              key={item.key}
              whileHover={{ y: -4 }}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-500">{item.title}</p>
                  <p className="mt-3 text-3xl font-black leading-none text-slate-900">
                    {item.value}
                  </p>
                </div>

                <div
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-2xl border bg-slate-50 shadow-sm transition-transform duration-200 group-hover:scale-105",
                    item.color === "rose" ? "border-rose-100 text-rose-600" : "",
                    item.color === "blue" ? "border-blue-100 text-blue-600" : "",
                    item.color === "amber" ? "border-amber-100 text-amber-600" : "",
                    item.color === "emerald" ? "border-emerald-100 text-emerald-600" : "",
                    item.color === "slate" ? "border-slate-200 text-slate-600" : ""
                  ].join(" ")}
                >
                  <Icon size={20} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="space-y-8 xl:col-span-8">
          <div className="card-lg">
            <div className="mb-8">
              <h3 className="t-label mb-1 flex items-center gap-2">
                مؤشرات المنصة <TrendingUp size={14} />
              </h3>
              <p className="text-[10px] font-bold italic text-slate-400">
                توزيع المهام حسب حالتها الحالية.
              </p>
            </div>
            <Suspense fallback={<div className="h-72 animate-pulse rounded-3xl bg-slate-50" />}>
              <TaskStatsCharts tasks={pseudoTasks} />
            </Suspense>
          </div>

          <div className="card-lg">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="t-label mb-1 flex items-center gap-2">
                  طلبات توثيق العمال <ShieldCheck size={14} />
                </h3>
                <p className="text-[10px] font-bold italic text-slate-400">
                  آخر الطلبات المعلقة المرتبطة ببيانات حقيقية.
                </p>
              </div>
              <span className="badge badge-secondary">
                {stats?.pendingWorkers || 0} طلب
              </span>
            </div>

            {loading ? (
              <div className="animate-pulse py-10 text-center text-[10px] font-black uppercase tracking-widest italic text-slate-400">
                جاري تحميل بيانات التوثيق...
              </div>
            ) : stats?.latestPendingWorkers?.length ? (
              <div className="space-y-4">
                {stats.latestPendingWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="card group flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform group-hover:scale-105">
                        {worker.imageUrl && (
                          <img
                            src={resolveAssetUrl(worker.imageUrl)}
                            alt={worker.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <button
                          onClick={() => openWorkerProfile(worker)}
                          className="text-right text-sm font-black text-slate-900 transition-colors hover:text-primary"
                        >
                          {worker.name}
                        </button>
                        <p className="t-label mt-1">
                          {worker.job || "عامل"} • {worker.address || "غير محدد"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openWorkerProfile(worker)}
                        className="btn btn-secondary btn-sm"
                      >
                        عرض
                      </button>
                    </div>
                  </div>
                ))}

                <ViewMoreButton
                  count={extraPendingWorkers}
                  onClick={() => goToTasksPage("verification")}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-[10px] font-black uppercase tracking-widest italic text-slate-400">
                لا توجد طلبات توثيق معلقة حالياً.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8 xl:col-span-4">
          <div className="card-lg">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="mb-1 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] italic text-slate-400">
                مراجعة المهام <ClipboardList size={14} />
              </h3>
              <span className="badge badge-secondary">{stats?.pendingTasks || 0}</span>
            </div>

            {loading ? (
              <div className="animate-pulse py-10 text-center text-[10px] font-black uppercase tracking-widest italic text-slate-400">
                جاري تحميل المهام...
              </div>
            ) : stats?.latestPendingTasks?.length ? (
              <div className="space-y-4">
                {stats.latestPendingTasks.map((task) => (
                  <TaskCardItem
                    key={task.id}
                    task={task}
                    onApprove={() => handleTaskAction("approve", task.id)}
                    onReject={() => handleTaskAction("reject", task.id)}
                  />
                ))}

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

          <div className="card-lg">
            <h3 className="mb-8 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] italic text-slate-400">
              ملخص سريع <Layout size={14} />
            </h3>
            <div className="space-y-4 text-sm font-bold text-slate-600">
              {[
                { label: "مستخدمون موثقون", value: stats?.verifiedUsers || 0, color: "emerald" },
                { label: "حجوزات قيد الانتظار", value: stats?.pendingBookings || 0, color: "amber" },
                { label: "حجوزات مقبولة", value: stats?.acceptedBookings || 0, color: "primary" },
                { label: "إشعارات غير مقروءة", value: stats?.totalNotifications || 0, color: "red" }
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100/50 bg-slate-50 p-4 transition-all hover:border-slate-200 hover:bg-white"
                >
                  <span className="t-label">{label}</span>
                  <span className={`badge badge-${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddWorker && (
          <AddWorkerModal
            onClose={() => setShowAddWorker(false)}
            onSuccess={loadDashboard}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedWorker && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="modal-box max-w-2xl"
              dir="rtl"
            >
              <div className="flex items-center justify-between bg-primary px-8 py-6 text-white">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                    ملف العامل
                  </p>
                  <h2 className="mt-2 text-2xl font-black">{selectedWorker.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedWorker(null)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition-colors hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-8">
                <div className="flex items-center gap-5 rounded-4xl border border-gray-100 bg-gray-50 p-5">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    {selectedWorker.imageUrl ? (
                      <img
                        src={resolveAssetUrl(selectedWorker.imageUrl)}
                        alt={selectedWorker.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <Users size={26} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900">{selectedWorker.name}</h3>
                    <p className="mt-1 text-sm font-bold text-gray-400">
                      {selectedWorker.job || "عامل"}
                    </p>
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
                      <div className="mb-2 flex items-center gap-2 text-gray-500">
                        <Icon size={15} /> {label}
                      </div>
                      <p
                        className="text-sm font-black text-gray-900"
                        dir={ltr ? "ltr" : undefined}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedWorker.identityDocumentUrl && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <h4 className="mb-4 text-sm font-black text-gray-900">وثيقة الهوية</h4>
                    <p className="mb-3 text-xs font-bold text-gray-500">
                      تُحمَّل عبر الخادم مع صلاحيات المدير.
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                      {identityPreviewLoading && (
                        <div className="flex min-h-[200px] items-center justify-center p-6 text-sm font-bold text-gray-400">
                          جاري تحميل صورة البطاقة...
                        </div>
                      )}
                      {!identityPreviewLoading && identityPreviewError && (
                        <div className="p-6 text-center text-sm font-bold text-red-600">
                          {identityPreviewError}
                        </div>
                      )}
                      {!identityPreviewLoading &&
                        !identityPreviewError &&
                        identityPreview?.objectUrl &&
                        (String(identityPreview.mediaType || "").includes("pdf") ? (
                          <iframe
                            title="وثيقة الهوية"
                            src={identityPreview.objectUrl}
                            className="h-112 w-full bg-white"
                          />
                        ) : (
                          <img
                            src={identityPreview.objectUrl}
                            alt="وثيقة الهوية"
                            className="max-h-112 w-full object-contain p-2"
                          />
                        ))}
                    </div>
                  </div>
                )}

                {workerRatings.length > 0 && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-black text-gray-900">آخر التقييمات</h4>
                      <span className="text-xs font-bold text-gray-400">
                        {workerRatings.length} تقييم
                      </span>
                    </div>
                    <div className="space-y-3">
                      {workerRatings.slice(0, 3).map((rating) => (
                        <div key={rating.id} className="rounded-xl border border-gray-100 bg-white p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-black text-gray-800">
                              {rating.userName || "عميل"}
                            </span>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              <span className="text-xs font-black">{rating.stars}</span>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-gray-500">
                            {rating.comment || "لا يوجد تعليق."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 border-t border-gray-100 bg-gray-50 px-8 py-6">
                <button
                  onClick={() => handleWorkerAction("verify", selectedWorker.id)}
                  className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition-colors hover:bg-emerald-700"
                >
                  <CheckCircle size={18} /> توثيق العامل
                </button>
                <button
                  onClick={() => handleWorkerAction("reject", selectedWorker.id)}
                  className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-red-200 bg-white px-6 py-4 text-sm font-black text-red-600 transition-colors hover:bg-red-50"
                >
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