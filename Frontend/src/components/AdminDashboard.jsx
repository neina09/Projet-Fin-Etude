import React, { useEffect, useState } from "react"
import { BellRing, Briefcase, ClipboardList, TrendingUp, Users } from "lucide-react"
import { approveTask, getAdminDashboard, getMyNotifications, getPendingTasks, rejectTask, rejectWorker, resolveAssetUrl, verifyWorker } from "../api"
import TaskStatsCharts from "./TaskStatsCharts"

function getVerificationNote(worker) {
  const note = String(worker?.verificationNotes || "").trim()
  if (!note) return "تم رفع الوثائق والطلب بانتظار مراجعة الإدارة."

  const lower = note.toLowerCase()
  if (lower.includes("waiting for admin review") || lower.includes("document uploaded")) {
    return "تم رفع الوثائق والطلب بانتظار مراجعة الإدارة."
  }

  if (lower === "verified by admin") return "تم توثيق الحساب من الإدارة."
  if (lower === "rejected by admin") return "تم رفض الطلب من الإدارة."

  return note
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [pendingTasks, setPendingTasks] = useState([])
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboard = async () => {
    setLoading(true)
    setError("")

    try {
      const [data, pendingTasksPage, notifications] = await Promise.all([
        getAdminDashboard(),
        getPendingTasks(),
        getMyNotifications()
      ])

      setStats(data)
      setPendingTasks(Array.isArray(pendingTasksPage?.content) ? pendingTasksPage.content : [])
      setUnreadNotificationsCount(
        (Array.isArray(notifications) ? notifications : []).filter(
          (notification) => !(notification?.isRead ?? notification?.read ?? false)
        ).length
      )
    } catch (err) {
      setError(err.message || "تعذر تحميل لوحة الإدارة.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const handleVerify = async (workerId) => {
    try {
      await verifyWorker(workerId)
      await loadDashboard()
    } catch (err) {
      setError(err.message || "تعذر توثيق العامل.")
    }
  }

  const handleReject = async (workerId) => {
    try {
      await rejectWorker(workerId)
      await loadDashboard()
    } catch (err) {
      setError(err.message || "تعذر رفض طلب العامل.")
    }
  }

  const handleApproveTask = async (taskId) => {
    try {
      await approveTask(taskId)
      await loadDashboard()
    } catch (err) {
      setError(err.message || "تعذر اعتماد المهمة.")
    }
  }

  const handleRejectTask = async (taskId) => {
    try {
      await rejectTask(taskId)
      await loadDashboard()
    } catch (err) {
      setError(err.message || "تعذر رفض المهمة.")
    }
  }

  const statCards = [
    { label: "إجمالي المستخدمين", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "إجمالي العمال", value: stats?.totalWorkers ?? 0, icon: Briefcase, color: "text-primary", bg: "bg-primary-soft" },
    { label: "مهام بانتظار المراجعة", value: stats?.pendingTasks ?? 0, icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "الإشعارات غير المقروءة", value: unreadNotificationsCount, icon: BellRing, color: "text-emerald-600", bg: "bg-emerald-50" }
  ]

  const pseudoTasks = [
    ...Array.from({ length: Number(stats?.pendingTasks || 0) }, (_, i) => ({ id: `pending-${i}`, status: "PENDING_REVIEW", createdAt: new Date().toISOString() })),
    ...Array.from({ length: Number(stats?.openTasks || 0) }, (_, i) => ({ id: `open-${i}`, status: "OPEN", createdAt: new Date().toISOString() })),
    ...Array.from({ length: Number(stats?.inProgressTasks || 0) }, (_, i) => ({ id: `progress-${i}`, status: "IN_PROGRESS", createdAt: new Date().toISOString() })),
    ...Array.from({ length: Number(stats?.completedTasks || 0) }, (_, i) => ({ id: `done-${i}`, status: "COMPLETED", createdAt: new Date().toISOString() }))
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="mb-2 font-alexandria text-3xl font-black text-surface-900">لوحة الإدارة</h2>
          <p className="text-sm font-bold text-surface-500">راجع طلبات التوثيق والمهام المعلقة ثم قرر القبول أو الرفض.</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white px-5 py-3 text-sm font-bold text-surface-600">
          طلبات التوثيق: {stats?.pendingWorkers ?? 0} | المهام المعلقة: {stats?.pendingTasks ?? 0}
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div key={index} className="saas-card border-surface-200 bg-white p-6 transition-transform hover:scale-[1.02]">
            <div className="mb-4 flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
                <TrendingUp size={12} />
                مباشر
              </div>
            </div>
            <div className="mb-1 text-3xl font-black text-surface-900">{stat.value}</div>
            <div className="font-alexandria text-xs font-bold text-surface-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <TaskStatsCharts tasks={pseudoTasks} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="saas-card border-surface-200 bg-white p-8">
          <h3 className="mb-6 font-alexandria text-lg font-black text-surface-900">طلبات توثيق العمال</h3>

          {loading ? (
            <div className="py-12 text-center font-bold text-surface-400">جارٍ تحميل طلبات التوثيق...</div>
          ) : stats?.latestPendingWorkers?.length ? (
            <div className="space-y-5">
              {stats.latestPendingWorkers.map((worker) => {
                const workerImageUrl = resolveAssetUrl(worker.imageUrl)
                const identityDocumentUrl = resolveAssetUrl(worker.identityDocumentUrl)

                return (
                  <div key={worker.id} className="rounded-3xl border border-surface-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-start gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-surface-200 bg-surface-50">
                        {workerImageUrl ? (
                          <>
                            <img
                              src={workerImageUrl}
                              alt={worker.name}
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none"
                                const fallback = event.currentTarget.nextElementSibling
                                if (fallback) fallback.style.display = "flex"
                              }}
                            />
                            <div className="hidden h-full w-full items-center justify-center px-2 text-center text-xs font-black text-surface-400">
                              لا توجد صورة واضحة
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs font-black text-surface-400">
                            لا توجد صورة واضحة
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-black text-surface-900">{worker.name || "-"}</p>
                        <p className="mt-1 text-sm font-bold text-surface-600">{worker.job || "بدون مهنة"}</p>
                        <p className="mt-1 text-sm font-bold text-primary">{worker.phoneNumber || "بدون هاتف"}</p>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-surface-500">{worker.address || "بدون عنوان"}</p>
                      </div>
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-black text-surface-400">الاسم</span>
                        <span className="text-sm font-black text-surface-900">{worker.name || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-black text-surface-400">المهنة</span>
                        <span className="text-sm font-bold text-surface-700">{worker.job || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-black text-surface-400">الهاتف</span>
                        <span className="text-sm font-bold text-surface-700">{worker.phoneNumber || "-"}</span>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <span className="pt-0.5 text-xs font-black text-surface-400">العنوان</span>
                        <span className="max-w-[65%] text-left text-sm font-bold leading-relaxed text-surface-700">{worker.address || "-"}</span>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <span className="pt-0.5 text-xs font-black text-surface-400">ملاحظات النظام</span>
                        <span className="max-w-[65%] text-left text-sm font-medium leading-relaxed text-surface-600">{getVerificationNote(worker)}</span>
                      </div>
                    </div>

                    {identityDocumentUrl ? (
                      <div className="mb-5">
                        <p className="mb-2 text-sm font-black text-surface-700">وثيقة الهوية المرفوعة</p>
                        <div className="group relative h-56 w-full overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm">
                          <img
                            src={identityDocumentUrl}
                            alt="وثيقة الهوية"
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.display = "none"
                              const fallback = event.currentTarget.nextElementSibling
                              if (fallback) fallback.style.display = "flex"
                            }}
                            onClick={() => window.open(identityDocumentUrl, "_blank")}
                            title="انقر لعرض الوثيقة بحجم أوضح"
                          />
                          <div className="hidden h-full w-full items-center justify-center bg-surface-100 px-4 text-center text-sm font-bold text-surface-500">
                            تعذر تحميل الوثيقة في المعاينة.
                          </div>
                        </div>
                        <a
                          href={identityDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex rounded-xl border border-surface-200 bg-surface-50 px-4 py-2 text-xs font-black text-surface-700 transition-all hover:bg-white"
                        >
                          فتح الوثيقة في نافذة جديدة
                        </a>
                      </div>
                    ) : (
                      <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                        لم يتم رفع وثيقة هوية واضحة بعد.
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReject(worker.id)}
                        className="flex-1 h-11 rounded-xl border border-red-200 px-4 text-sm font-black text-red-600 transition-all hover:bg-red-50"
                      >
                        رفض الطلب
                      </button>
                      <button
                        onClick={() => handleVerify(worker.id)}
                        className="flex-1 h-11 rounded-xl bg-primary px-4 text-sm font-black text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover"
                      >
                        توثيق الحساب
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center font-bold text-surface-400">لا توجد طلبات توثيق معلقة حاليًا.</div>
          )}
        </div>

        <div className="saas-card border-surface-200 bg-white p-8">
          <h3 className="mb-6 font-alexandria text-lg font-black text-surface-900">مهام بانتظار اعتماد المدير</h3>

          {loading ? (
            <div className="py-12 text-center font-bold text-surface-400">جارٍ تحميل المهام...</div>
          ) : pendingTasks.length ? (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-surface-100 bg-surface-50 p-5">
                  <div className="mb-3">
                    <p className="text-base font-black text-surface-900">{task.title}</p>
                    <p className="mt-1 text-sm font-bold text-surface-500">{task.profession || "بدون مهنة"} - {task.address || "بدون مكان"}</p>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-surface-600">{task.description}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRejectTask(task.id)}
                      className="h-10 rounded-xl border border-red-200 px-4 text-sm font-black text-red-600 transition-all hover:bg-red-50"
                    >
                      رفض المهمة
                    </button>
                    <button
                      onClick={() => handleApproveTask(task.id)}
                      className="h-10 rounded-xl bg-primary px-4 text-sm font-black text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover"
                    >
                      اعتماد المهمة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center font-bold text-surface-400">لا توجد مهام معلقة للمراجعة حاليًا.</div>
          )}
        </div>
      </div>
    </div>
  )
}
