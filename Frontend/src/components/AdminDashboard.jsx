import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Briefcase,
  CheckCircle,
  ClipboardList,
  Eye,
  IdCard,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Star,
  Users,
  X,
  XCircle
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import {
  approveTask,
  fetchWorkerIdentityDocumentPreview,
  getAdminDashboard,
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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [workerRatings, setWorkerRatings] = useState([])
  const [identityPreview, setIdentityPreview] = useState(null)
  const [identityPreviewLoading, setIdentityPreviewLoading] = useState(false)
  const [identityPreviewError, setIdentityPreviewError] = useState("")
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
        if (!cancelled) setIdentityPreviewLoading(false)
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
      if (action === "verify") {
        await verifyWorker(workerId)
      } else {
        await rejectWorker(workerId)
      }

      setSelectedWorker(null)
      await loadDashboard()
    } catch (err) {
      setError(err.message || "تعذر تنفيذ العملية على العامل.")
    }
  }

  const handleTaskAction = async (action, taskId) => {
    try {
      if (action === "approve") {
        await approveTask(taskId)
      } else {
        await rejectTask(taskId)
      }
      await loadDashboard()
    } catch (err) {
      setError(err.message || "تعذر تنفيذ العملية على المهمة.")
    }
  }

  const pseudoTasks = useMemo(
    () => [
      ...Array.from({ length: Number(stats?.pendingTasks || 0) }, (_, i) => ({ id: `p-${i}`, status: "PENDING_REVIEW" })),
      ...Array.from({ length: Number(stats?.openTasks || 0) }, (_, i) => ({ id: `o-${i}`, status: "OPEN" })),
      ...Array.from({ length: Number(stats?.inProgressTasks || 0) }, (_, i) => ({ id: `i-${i}`, status: "IN_PROGRESS" })),
      ...Array.from({ length: Number(stats?.completedTasks || 0) }, (_, i) => ({ id: `c-${i}`, status: "COMPLETED" }))
    ],
    [stats]
  )

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] bg-[#F8FAFC] px-4 py-8 text-right lg:px-8" dir="rtl">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-extrabold text-gray-900">لوحة تحكم الإدارة</h1>
        <p className="text-sm font-medium text-gray-500">هذه الأرقام والقوائم مرتبطة مباشرة بالبيانات الحقيقية في الخلفية.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
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
                <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">
                  مباشر
                </span>
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

          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">طلبات توثيق العمال</h3>
                <p className="text-sm font-medium text-gray-400">آخر الطلبات المعلقة المرتبطة ببيانات حقيقية.</p>
              </div>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                {stats?.latestPendingWorkers?.length || 0} طلب
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
                        {worker.imageUrl ? (
                          <img src={resolveAssetUrl(worker.imageUrl)} alt={worker.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <button onClick={() => openWorkerProfile(worker)} className="text-right text-base font-black text-gray-900 transition-colors hover:text-blue-600">
                          {worker.name}
                        </button>
                        <p className="text-xs font-bold text-gray-400">{worker.job || "عامل"} • {worker.address || "غير محدد"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => handleWorkerAction("verify", worker.id)} className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100">
                        قبول
                      </button>
                      <button onClick={() => handleWorkerAction("reject", worker.id)} className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-700 transition-colors hover:bg-red-100">
                        رفض
                      </button>
                      <button onClick={() => openWorkerProfile(worker)} className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 transition-colors hover:bg-blue-100">
                        عرض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm font-bold text-gray-400">
                لا توجد طلبات توثيق معلقة حالياً.
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-extrabold text-gray-900">مراجعة المهام</h3>
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
                      <button onClick={() => handleTaskAction("approve", task.id)} className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100">
                        قبول
                      </button>
                      <button onClick={() => handleTaskAction("reject", task.id)} className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-700 transition-colors hover:bg-red-100">
                        إلغاء
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm font-bold text-gray-400">
                لا توجد مهام بانتظار المراجعة.
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-extrabold text-gray-900">ملخص سريع</h3>
            <div className="space-y-4 text-sm font-bold text-gray-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span>مستخدمون موثقون</span>
                <span>{stats?.verifiedUsers || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span>حجوزات قيد الانتظار</span>
                <span>{stats?.pendingBookings || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span>حجوزات مقبولة</span>
                <span>{stats?.acceptedBookings || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span>إشعارات غير مقروءة</span>
                <span>{stats?.totalNotifications || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                    {selectedWorker.imageUrl ? (
                      <img src={resolveAssetUrl(selectedWorker.imageUrl)} alt={selectedWorker.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900">{selectedWorker.name}</h3>
                    <p className="mt-1 text-sm font-bold text-gray-400">{selectedWorker.job || "عامل"}</p>
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700">
                      <ShieldCheck size={12} />
                      بانتظار المراجعة
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-gray-500"><MapPin size={15} /> العنوان</div>
                    <p className="text-sm font-black text-gray-900">{selectedWorker.address || "غير محدد"}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-gray-500"><Phone size={15} /> الهاتف</div>
                    <p className="text-sm font-black text-gray-900" dir="ltr">{selectedWorker.phoneNumber || "غير متوفر"}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-gray-500"><IdCard size={15} /> الهوية</div>
                    <p className="text-sm font-black text-gray-900" dir="ltr">{selectedWorker.nationalIdNumber || "غير متوفرة"}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-gray-500"><Star size={15} /> التقييم</div>
                    <p className="text-sm font-black text-gray-900">{Number(selectedWorker.averageRating || 0).toFixed(1)}</p>
                  </div>
                </div>

                {selectedWorker.identityDocumentUrl && (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <h4 className="mb-4 text-sm font-black text-gray-900">وثيقة الهوية</h4>
                    <p className="mb-3 text-xs font-bold text-gray-500">
                      تُحمَّل عبر الخادم مع صلاحيات المدير (ليست رابط ملف مباشر).
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                      {identityPreviewLoading && (
                        <div className="flex min-h-[200px] items-center justify-center p-6 text-sm font-bold text-gray-400">
                          جاري تحميل صورة البطاقة...
                        </div>
                      )}
                      {!identityPreviewLoading && identityPreviewError && (
                        <div className="p-6 text-center text-sm font-bold text-red-600">{identityPreviewError}</div>
                      )}
                      {!identityPreviewLoading && !identityPreviewError && identityPreview?.objectUrl && (
                        String(identityPreview.mediaType || "").includes("pdf") ? (
                          <iframe
                            title="وثيقة الهوية"
                            src={identityPreview.objectUrl}
                            className="h-[28rem] w-full bg-white"
                          />
                        ) : (
                          <img
                            src={identityPreview.objectUrl}
                            alt="وثيقة الهوية"
                            className="max-h-[28rem] w-full object-contain p-2"
                          />
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
                  <CheckCircle size={18} />
                  توثيق العامل
                </button>
                <button onClick={() => handleWorkerAction("reject", selectedWorker.id)} className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-red-200 bg-white px-6 py-4 text-sm font-black text-red-600 transition-colors hover:bg-red-50">
                  <XCircle size={18} />
                  رفض الطلب
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
