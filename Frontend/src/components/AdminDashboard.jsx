import React, { useEffect, useState } from "react"
import { AlertCircle, BellRing, Briefcase, CheckCircle, ClipboardList, Clock, ShieldCheck, TrendingUp, Users } from "lucide-react"
import { approveTask, getAdminDashboard, rejectTask, rejectWorker, verifyWorker } from "../api"
import TaskStatsCharts from "./TaskStatsCharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboard = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await getAdminDashboard()
      setStats(data)
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
    { label: "الإشعارات", value: stats?.totalNotifications ?? 0, icon: BellRing, color: "text-emerald-600", bg: "bg-emerald-50" }
  ]

  const pseudoTasks = [
    ...Array.from({ length: Number(stats?.pendingTasks || 0) }, (_, i) => ({ id: `pending-${i}`, status: "PENDING_REVIEW", createdAt: new Date().toISOString() })),
    ...Array.from({ length: Number(stats?.openTasks || 0) }, (_, i) => ({ id: `open-${i}`, status: "OPEN", createdAt: new Date().toISOString() })),
    ...Array.from({ length: Number(stats?.inProgressTasks || 0) }, (_, i) => ({ id: `progress-${i}`, status: "IN_PROGRESS", createdAt: new Date().toISOString() })),
    ...Array.from({ length: Number(stats?.completedTasks || 0) }, (_, i) => ({ id: `done-${i}`, status: "COMPLETED", createdAt: new Date().toISOString() }))
  ]

  const bookingsTotal = Number(stats?.pendingBookings || 0) + Number(stats?.acceptedBookings || 0) + Number(stats?.completedBookings || 0)
  const completedBookingsPercent = bookingsTotal ? (Number(stats?.completedBookings || 0) / bookingsTotal) * 100 : 0
  const verifiedWorkersPercent = Number(stats?.totalWorkers || 0) ? (Number(stats?.verifiedWorkers || 0) / Number(stats.totalWorkers)) * 100 : 0

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="mb-2 font-alexandria text-3xl font-black text-surface-900">نظرة عامة على المنصة</h2>
          <p className="text-sm font-bold uppercase tracking-widest text-surface-500">متابعة توثيق العمال واعتماد المهام الجديدة</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white px-5 py-3 text-sm font-bold text-surface-600">
          طلبات العاملين المعلقة: {stats?.pendingWorkers ?? 0} | المهام المعلقة: {stats?.pendingTasks ?? 0}
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

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="saas-card border-surface-200 bg-white p-8">
          <h3 className="mb-6 font-alexandria text-lg font-black text-surface-900">طلبات توثيق العمال</h3>

          {loading ? (
            <div className="py-12 text-center font-bold text-surface-400">جارٍ تحميل بيانات الإدارة...</div>
          ) : stats?.latestPendingWorkers?.length ? (
            <div className="space-y-4">
              {stats.latestPendingWorkers.map((worker) => (
                <div key={worker.id} className="rounded-2xl border border-surface-100 bg-surface-50 p-4">
                  <div className="mb-3">
                    <p className="text-sm font-black text-surface-900">{worker.name}</p>
                    <p className="mt-0.5 text-xs font-bold text-surface-500">{worker.job} - {worker.address}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(worker.id)}
                      className="h-9 rounded-xl border border-red-200 px-4 text-[10px] font-black text-red-600 transition-all hover:bg-red-50"
                    >
                      رفض
                    </button>
                    <button
                      onClick={() => handleVerify(worker.id)}
                      className="h-9 rounded-xl bg-primary px-4 text-[10px] font-black text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover"
                    >
                      توثيق الحساب
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center font-bold text-surface-400">لا توجد طلبات توثيق معلقة حاليًا.</div>
          )}
        </div>

        <div className="saas-card border-surface-200 bg-white p-8">
          <h3 className="mb-6 font-alexandria text-lg font-black text-surface-900">مهام بانتظار اعتماد المدير</h3>

          {loading ? (
            <div className="py-12 text-center font-bold text-surface-400">جارٍ تحميل المهام...</div>
          ) : stats?.latestPendingTasks?.length ? (
            <div className="space-y-4">
              {stats.latestPendingTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-surface-100 bg-surface-50 p-4">
                  <div className="mb-3">
                    <p className="text-sm font-black text-surface-900">{task.title}</p>
                    <p className="mt-0.5 text-xs font-bold text-surface-500">{task.profession || "بدون مهنة"} - {task.address || "بدون مكان"}</p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-surface-500">{task.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRejectTask(task.id)}
                      className="h-9 rounded-xl border border-red-200 px-4 text-[10px] font-black text-red-600 transition-all hover:bg-red-50"
                    >
                      رفض المهمة
                    </button>
                    <button
                      onClick={() => handleApproveTask(task.id)}
                      className="h-9 rounded-xl bg-primary px-4 text-[10px] font-black text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover"
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

        <div className="saas-card relative overflow-hidden bg-surface-900 p-8 text-white">
          <div className="relative z-10">
            <h3 className="mb-4 font-alexandria text-lg font-black">ملخص الإدارة</h3>

            <div className="mb-8">
              <div className="mb-2 flex items-end justify-between">
                <span className="text-sm font-bold opacity-60">العمال الموثقون</span>
                <span className="text-xl font-black">{stats?.verifiedWorkers ?? 0}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, verifiedWorkersPercent)}%` }} />
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-2 flex items-end justify-between">
                <span className="text-sm font-bold opacity-60">الحجوزات المكتملة</span>
                <span className="text-xl font-black">{stats?.completedBookings ?? 0}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, completedBookingsPercent)}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-white/70">
                  <CheckCircle size={14} />
                  مستخدمون مفعلون
                </div>
                <div className="text-2xl font-black">{stats?.verifiedUsers ?? 0}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-white/70">
                  <ShieldCheck size={14} />
                  بانتظار التوثيق
                </div>
                <div className="text-2xl font-black">{stats?.pendingWorkers ?? 0}</div>
              </div>
            </div>

            <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 py-4 text-sm font-black transition-all hover:bg-white/20">
              <AlertCircle size={18} />
              متابعة حالة الإدارة
            </button>
          </div>

          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </div>
    </div>
  )
}
