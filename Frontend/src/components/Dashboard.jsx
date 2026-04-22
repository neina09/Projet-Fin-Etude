import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Briefcase,
  Clock,
  FileText,
  Users,
  Star,
  CheckCircle,
  Bell,
  ArrowRight,
  TrendingUp,
  User,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  getMe,
  getMyBookingRequests,
  getMyBookings,
  getMyOffers,
  getMyTasks,
  getTasksAssignedToMe,
  getWorkers,
  resolveAssetUrl
} from "../api"
import DashboardHeader from "./DashboardHeader"

const WorkersSection = lazy(() => import("./WorkersSection"))
const ProblemBoard = lazy(() => import("./ProblemBoard"))
const BecomeWorker = lazy(() => import("./BecomeWorker"))
const AdminDashboard = lazy(() => import("./AdminDashboard"))
const ProfileSettings = lazy(() => import("./ProfileSettings"))
const RatingsSection = lazy(() => import("./RatingsSection"))
const TasksVerificationPage = lazy(() => import("./TasksVerificationPage"))
const MyRequestsSection = lazy(() => import("./MyRequestsSection"))

function SectionLoader({ message = "جاري التحميل..." }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center space-y-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-100 border-t-primary" />
      <p className="t-label italic">{message}</p>
    </div>
  )
}

const DASHBOARD_ROUTES = {
  dashboard: "/dashboard",
  workers: "/dashboard/workers",
  tasks: "/dashboard/tasks",
  myRequests: "/dashboard/requests",
  ratings: "/dashboard/ratings",
  becomeWorker: "/dashboard/become-worker",
  profile: "/dashboard/profile",
  admin: "/dashboard/admin",
  tasksVerification: "/dashboard/tasks-verification",
  userGuide: "/dashboard/guide",
  technicalSupport: "/dashboard/support"
}

import SimpleFooter from "./SimpleFooter"

const UserGuide = lazy(() => import("./UserGuide"))
const TechnicalSupport = lazy(() => import("./TechnicalSupport"))

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null)
  const [myTasks, setMyTasks] = useState([])
  const [recentPage, setRecentPage] = useState(1)
  const [assignedTasks, setAssignedTasks] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [myOffers, setMyOffers] = useState([])
  const [tasksTab, setTasksTab] = useState("open")
  const navigate = useNavigate()
  const location = useLocation()

  const isAdmin = user?.role === "ADMIN"
  const isWorker = user?.role === "WORKER"

  const page = useMemo(() => {
    const normalized = location.pathname.replace(/\/+$/, "")
    const entry = Object.entries(DASHBOARD_ROUTES).find(([, path]) => path === normalized)
    return entry?.[0] || "dashboard"
  }, [location.pathname])

  const setPage = (nextPage, options = {}) => {
    const { initialTab = "open", openForm = false } =
      typeof options === "string" ? { initialTab: options } : options
    if (nextPage === "tasksVerification" && !isAdmin) return
    const path = DASHBOARD_ROUTES[nextPage] || DASHBOARD_ROUTES.dashboard
    setTasksTab(initialTab)
    navigate(path, { state: { openForm } })
  }

  const loadUser = useCallback(async () => {
    const currentUser = await getMe()
    setUser(currentUser)
    return currentUser
  }, [])

  const loadDashboardData = useCallback(async () => {
    const [workersRes, tasksRes, assignedTasksRes, bookingsRes, requestsRes, offersRes] = await Promise.allSettled([
      getWorkers(),
      getMyTasks(),
      isWorker ? getTasksAssignedToMe() : Promise.resolve([]),
      getMyBookings(),
      getMyBookingRequests(),
      getMyOffers()
    ])

    if (tasksRes.status === "fulfilled") setMyTasks(tasksRes.value?.content || tasksRes.value || [])
    if (assignedTasksRes.status === "fulfilled") setAssignedTasks(assignedTasksRes.value || [])
    if (bookingsRes.status === "fulfilled") setMyBookings(bookingsRes.value || [])
    if (requestsRes.status === "fulfilled") setMyRequests(requestsRes.value || [])
    if (offersRes.status === "fulfilled") setMyOffers(offersRes.value || [])
  }, [isWorker])

  useEffect(() => {
    loadUser().catch(() => onLogout())
  }, [loadUser, onLogout])

  useEffect(() => {
    if (user) loadDashboardData()
  }, [loadDashboardData, user])

  const stats = useMemo(() => {
    const activeTasksCount = myTasks.filter(
      (task) => !["COMPLETED", "CLOSED", "CANCELLED"].includes(task.status)
    ).length

    if (isWorker) {
      const pendingChoices = myOffers.filter((offer) => offer.status === "SELECTED").length
      return [
        { label: "بانتظار قبولك", value: pendingChoices, icon: Bell, color: "rose" },
        {
          label: "مهام نشطة",
          value: assignedTasks.filter((task) => task.status === "IN_PROGRESS").length,
          icon: TrendingUp,
          color: "blue"
        },
        { label: "عروضي", value: myOffers.length, icon: FileText, color: "amber" },
        { label: "الحجوزات", value: myRequests.length, icon: Users, color: "emerald" }
      ]
    }

    return [
      { label: "طلبات نشطة", value: activeTasksCount, icon: Briefcase, color: "blue" },
      {
        label: "مهام مكتملة",
        value: myTasks.filter((task) => task.status === "COMPLETED").length,
        icon: CheckCircle,
        color: "emerald"
      },
      { label: "إجمالي المهام", value: myTasks.length, icon: FileText, color: "slate" },
      { label: "حجوزاتي", value: myBookings.length, icon: Star, color: "amber" }
    ]
  }, [assignedTasks, isWorker, myOffers, myRequests.length, myBookings.length, myTasks])

  return (
    <div className="page-shell" dir="rtl">
      <DashboardHeader user={user} activePage={page} onNavigate={setPage} onLogout={onLogout} />
      <main className="mx-auto max-w-7xl px-4 pt-12 pb-6 lg:px-8">
        <AnimatePresence mode="wait">
          {page === "dashboard" && !isAdmin ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10"
            >
              <section className="app-page-header mt-2">
                <div className="app-page-header-row">
                  <div>
                    <span className="app-page-eyebrow">لوحة المتابعة</span>
                    <h1 className="app-page-title mt-4">أهلاً، {user?.username}</h1>
                    <p className="app-page-subtitle">
                      إليك نظرة أوضح على نشاطك اليومي مع نفس الطابع البصري الموجود في الصفحة
                      الرئيسية.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {isWorker ? (
                      <>
                        <button
                          onClick={() => setPage("tasks", "open")}
                          className="btn btn-primary btn-md"
                        >
                          تصفح المهام المتاحة
                        </button>
                        <button
                          onClick={() => setPage("myRequests")}
                          className="btn btn-secondary btn-md"
                        >
                          عروضي وطلباتي
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setPage("tasks", { openForm: true })}
                          className="btn btn-primary btn-md"
                        >
                          نشر طلب جديد
                        </button>
                        <button
                          onClick={() => setPage("workers")}
                          className="btn btn-secondary btn-md"
                        >
                          استعرض العمال
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                {stats.map((item, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-500">{item.label}</p>
                        <p className="mt-3 text-3xl font-black leading-none text-slate-900">
                          {item.value}
                        </p>
                      </div>

                      <div
                        className={[
                          "flex h-12 w-12 items-center justify-center rounded-2xl border bg-slate-50 shadow-sm",
                          item.color === "rose" ? "border-rose-100 text-rose-600" : "",
                          item.color === "blue" ? "border-blue-100 text-blue-600" : "",
                          item.color === "amber" ? "border-amber-100 text-amber-600" : "",
                          item.color === "emerald" ? "border-emerald-100 text-emerald-600" : "",
                          item.color === "slate" ? "border-slate-200 text-slate-600" : ""
                        ].join(" ")}
                      >
                        <item.icon size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <h2 className="app-panel-title flex items-center gap-2">
                    النشاط الأخير <Clock size={16} className="text-primary" />
                  </h2>

                  <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                    {myTasks.length === 0 ? (
                      <div className="p-10 text-center text-sm font-bold italic text-slate-400">
                        لا يوجد نشاط مسجل بعد
                      </div>
                    ) : (
                      <>
                        <div className="divide-y divide-slate-50">
                          {(() => {
                            const itemsPerPage = 4
                            const totalPages = Math.ceil(myTasks.length / itemsPerPage)
                            const start = (recentPage - 1) * itemsPerPage
                            const pagedItems = myTasks.slice(start, start + itemsPerPage)

                            return (
                              <>
                                {pagedItems.map((task, index) => (
                                  <div
                                    key={index}
                                    onClick={() => setPage("tasks")}
                                    className="group flex cursor-pointer items-center justify-between p-5 transition-colors hover:bg-slate-50"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-50 bg-slate-100 transition-all group-hover:border-blue-100">
                                        {task.userImageUrl ? (
                                          <img
                                            src={resolveAssetUrl(task.userImageUrl)}
                                            alt={task.title}
                                            className="h-full w-full object-cover"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                                            <User size={18} />
                                          </div>
                                        )}
                                      </div>

                                      <div>
                                        <p className="text-sm font-black text-slate-900">{task.title}</p>
                                        <div className="mt-1 flex items-center gap-2">
                                          <p className="t-label italic">{task.createdAt?.split("T")[0]}</p>
                                          <div className="flex gap-0.5 text-amber-500">
                                            <Star size={8} fill="currentColor" />
                                            <Star size={8} fill="currentColor" />
                                            <Star size={8} fill="currentColor" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <span
                                      className={`badge ${
                                        task.status === "COMPLETED" ? "badge-green" : "badge-primary"
                                      }`}
                                    >
                                      {task.status || "نشط"}
                                    </span>
                                  </div>
                                ))}

                                {totalPages > 1 && (
                                  <div className="pagination border-t border-slate-50 bg-slate-50/50 p-4">
                                    <button
                                      onClick={() => setRecentPage((p) => Math.max(1, p - 1))}
                                      disabled={recentPage === 1}
                                      className="pagination-btn"
                                    >
                                      <ChevronRight size={16} />
                                    </button>
                                    <div className="t-label px-3">
                                      {recentPage} / {totalPages}
                                    </div>
                                    <button
                                      onClick={() => setRecentPage((p) => Math.min(totalPages, p + 1))}
                                      disabled={recentPage === totalPages}
                                      className="pagination-btn"
                                    >
                                      <ChevronLeft size={16} />
                                    </button>
                                  </div>
                                )}
                              </>
                            )
                          })()}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  {!isWorker && !isAdmin && (
                    <div className="group relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white">
                      <div className="absolute right-0 top-0 h-full w-1.5 bg-blue-600 transition-all group-hover:w-2" />
                      <div className="relative z-10">
                        <h3 className="mb-1 text-lg font-black">هل ترغب في كسب المال؟</h3>
                        <p className="app-panel-subtitle mb-6 text-slate-300">
                          انضم إلى مجتمع المحترفين لدينا وابدأ العمل اليوم.
                        </p>
                        <button
                          onClick={() => setPage("becomeWorker")}
                          className="btn btn-secondary btn-md w-full"
                        >
                          تقديم طلب انضمام
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                    <h3 className="app-panel-title mb-6 border-r-4 border-blue-600 pr-3">
                      مساعدة سريعة
                    </h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setPage("userGuide")}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 text-right text-sm font-bold text-slate-600 transition-all hover:text-blue-600"
                      >
                        <span>دليل الاستخدام</span>
                        <ArrowRight size={14} className="rotate-180" />
                      </button>
                      <button 
                        onClick={() => setPage("technicalSupport")}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 text-right text-sm font-bold text-slate-600 transition-all hover:text-blue-600"
                      >
                        <span>الدعم الفني</span>
                        <ArrowRight size={14} className="rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Suspense fallback={<SectionLoader />}>
                {page === "workers" && <WorkersSection currentUser={user} />}
                {page === "tasks" && <ProblemBoard currentUser={user} initialTab={tasksTab} />}
                {page === "ratings" && (
                  <RatingsSection
                    currentUser={user}
                    myTasks={myTasks}
                    myOffers={myOffers}
                    onRefresh={loadDashboardData}
                  />
                )}
                {page === "becomeWorker" && <BecomeWorker onSuccess={loadDashboardData} />}
                {page === "myRequests" && (
                  <MyRequestsSection
                    currentUser={user}
                    onRefresh={loadDashboardData}
                    onBecomeWorker={() => setPage("becomeWorker")}
                  />
                )}
                {page === "profile" && (
                  <ProfileSettings 
                    user={user} 
                    onUpdate={setUser} 
                    onRefresh={loadDashboardData}
                    onLogout={onLogout}
                    onBecomeWorker={() => setPage("becomeWorker")}
                  />
                )}
                {(page === "admin" || (page === "dashboard" && isAdmin)) && isAdmin && (
                  <AdminDashboard onNavigate={setPage} />
                )}
                {page === "tasksVerification" && isAdmin && (
                  <TasksVerificationPage initialTab={tasksTab} />
                )}
                {page === "userGuide" && <UserGuide />}
                {page === "technicalSupport" && <TechnicalSupport />}
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
        <SimpleFooter />
      </main>
    </div>
  )
}