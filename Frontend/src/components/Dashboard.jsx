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
import Footer from "./Footer"
import { useLanguage } from "../i18n/LanguageContext"

const WorkersSection = lazy(() => import("./WorkersSection"))
const ProblemBoard = lazy(() => import("./ProblemBoard"))
const BecomeWorker = lazy(() => import("./BecomeWorker"))
const AdminDashboard = lazy(() => import("./AdminDashboard"))
const ManageWorkersPage = lazy(() => import("./ManageWorkersPage"))
const ProfileSettings = lazy(() => import("./ProfileSettings"))
const RatingsSection = lazy(() => import("./RatingsSection"))
const TasksVerificationPage = lazy(() => import("./TasksVerificationPage"))
const MyRequestsSection = lazy(() => import("./MyRequestsSection"))
const UserGuide = lazy(() => import("./UserGuide"))
const TechnicalSupport = lazy(() => import("./TechnicalSupport"))

function SectionLoader() {
  const { t, dir } = useLanguage()
  return (
    <div className="flex h-64 flex-col items-center justify-center space-y-4" dir={dir}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-100 border-t-primary" />
      <p className="t-label italic">{t("common.loadingPage")}</p>
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
  manageWorkers: "/dashboard/manage-workers",
  tasksVerification: "/dashboard/tasks-verification",
  userGuide: "/dashboard/guide",
  technicalSupport: "/dashboard/support"
}

class DashboardContentErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: "" }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || "Unable to display this page right now." }
  }

  componentDidCatch(error) {
    console.error("Dashboard content crashed", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card-lg text-center">
          <h2 className="text-lg font-black text-slate-900">Unable to open this page</h2>
          <p className="mt-3 text-sm font-bold text-slate-500">{this.state.errorMessage}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, errorMessage: "" })}
            className="btn btn-primary btn-md mt-6"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default function Dashboard({ onLogout }) {
  const { dir, isArabic } = useLanguage()
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

  const copy = useMemo(() => ({
    pageEyebrow: "لوحة المتابعة",
    welcome: "أهلاً",
    subtitle: isArabic
      ? "راقب أداء منصتك لحظة بلحظة، وتتبع النشاطات والإحصائيات بسهولة في لوحة احترافية واضحة."
      : "راقب أداء منصتك لحظة بلحظة، وتتبع النشاطات والإحصائيات بسهولة في لوحة احترافية واضحة.",
    browseTasks: "تصفح المهام المتاحة",
    offersRequests: "عروضي وطلباتي",
    publishTask: "نشر طلب جديد",
    browseWorkers: "استعرض العمال",
    statsWorkerPending: "بانتظار قبولك",
    statsWorkerActive: "مهام نشطة",
    statsWorkerOffers: "عروضي",
    statsWorkerBookings: "الحجوزات",
    statsUserActive: "طلبات نشطة",
    statsUserDone: "مهام مكتملة",
    statsUserTotal: "إجمالي المهام",
    statsUserBookings: "حجوزاتي",
    recentActivity: "النشاط الأخير",
    noActivity: "لا يوجد نشاط مسجل بعد",
    activeLabel: "نشط",
    earnMoney: "هل ترغب في كسب المال؟",
    earnMoneyText: isArabic
      ? "انضم إلى مجتمع المحترفين لدينا وابدأ العمل اليوم."
      : "انضم إلى مجتمع المحترفين لدينا وابدأ العمل اليوم.",
    joinRequest: "تقديم طلب انضمام",
    quickHelp: "مساعدة سريعة",
    userGuide: "دليل الاستخدام",
    support: "الدعم الفني",
    completed: "مكتمل"
  }), [isArabic])

  const page = useMemo(() => {
    const normalized = location.pathname.replace(/\/+$/, "")
    const entry = Object.entries(DASHBOARD_ROUTES).find(([, path]) => path === normalized)
    return entry?.[0] || "dashboard"
  }, [location.pathname])

  const setPage = (nextPage, options = {}) => {
    const { initialTab = "open", openForm = false } = typeof options === "string" ? { initialTab: options } : options
    if ((nextPage === "tasksVerification" || nextPage === "manageWorkers") && !isAdmin) return
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
    const [, tasksRes, assignedTasksRes, bookingsRes, requestsRes, offersRes] = await Promise.allSettled([
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
    const activeTasksCount = myTasks.filter((task) => !["COMPLETED", "CLOSED", "CANCELLED"].includes(task.status)).length

    if (isWorker) {
      const pendingChoices = myOffers.filter((offer) => offer.status === "SELECTED").length
      return [
        { label: copy.statsWorkerPending, value: pendingChoices, icon: Bell, color: "rose" },
        { label: copy.statsWorkerActive, value: assignedTasks.filter((task) => task.status === "IN_PROGRESS").length, icon: TrendingUp, color: "blue" },
        { label: copy.statsWorkerOffers, value: myOffers.length, icon: FileText, color: "amber" },
        { label: copy.statsWorkerBookings, value: myRequests.length, icon: Users, color: "emerald" }
      ]
    }

    return [
      { label: copy.statsUserActive, value: activeTasksCount, icon: Briefcase, color: "blue" },
      { label: copy.statsUserDone, value: myTasks.filter((task) => task.status === "COMPLETED").length, icon: CheckCircle, color: "emerald" },
      { label: copy.statsUserTotal, value: myTasks.length, icon: FileText, color: "slate" },
      { label: copy.statsUserBookings, value: myBookings.length, icon: Star, color: "amber" }
    ]
  }, [assignedTasks, copy, isWorker, myOffers, myRequests.length, myBookings.length, myTasks])

  return (
    <div className="page-shell" dir={dir}>
      <DashboardHeader user={user} activePage={page} onNavigate={setPage} onLogout={onLogout} />
      <main className="mx-auto max-w-7xl px-4 pb-6 pt-32 sm:pt-40 lg:px-8">
        <AnimatePresence mode="wait">
          {page === "dashboard" && !isAdmin ? (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <section className="app-page-header mt-2">
                <div className="app-page-header-row">
                  <div>
                    <span className="app-page-eyebrow">{copy.pageEyebrow}</span>
                    <h1 className="app-page-title mt-4">{copy.welcome}، {user?.username}</h1>
                    <p className="app-page-subtitle">{copy.subtitle}</p>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                    {isWorker ? (
                      <>
                        <button onClick={() => setPage("tasks", "open")} className="btn btn-primary btn-md w-full sm:w-auto">
                          {copy.browseTasks}
                        </button>
                        <button onClick={() => setPage("myRequests")} className="btn btn-secondary btn-md w-full sm:w-auto">
                          {copy.offersRequests}
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setPage("tasks", { openForm: true })} className="btn btn-primary btn-md w-full sm:w-auto">
                          {copy.publishTask}
                        </button>
                        <button onClick={() => setPage("workers")} className="btn btn-secondary btn-md w-full sm:w-auto">
                          {copy.browseWorkers}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {stats.map((item, index) => (
                  <div key={index} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-500">{item.label}</p>
                        <p className="mt-3 text-3xl font-black leading-none text-slate-900">{item.value}</p>
                      </div>
                      <div className={[
                        "flex h-12 w-12 items-center justify-center rounded-2xl border bg-slate-50 shadow-sm",
                        item.color === "rose" ? "border-rose-100 text-rose-600" : "",
                        item.color === "blue" ? "border-blue-100 text-blue-600" : "",
                        item.color === "amber" ? "border-amber-100 text-amber-600" : "",
                        item.color === "emerald" ? "border-emerald-100 text-emerald-600" : "",
                        item.color === "slate" ? "border-slate-200 text-slate-600" : ""
                      ].join(" ")}>
                        <item.icon size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <h2 className="app-panel-title flex items-center gap-2">
                    {copy.recentActivity} <Clock size={16} className="text-primary" />
                  </h2>

                  <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                    {myTasks.length === 0 ? (
                      <div className="p-10 text-center text-sm font-bold italic text-slate-400">{copy.noActivity}</div>
                    ) : (
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
                                  className="group flex cursor-pointer flex-col items-start gap-3 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-50 bg-slate-100 transition-all group-hover:border-blue-100">
                                      {task.userImageUrl ? (
                                        <img src={resolveAssetUrl(task.userImageUrl)} alt={task.title} className="h-full w-full object-cover" />
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

                                  <span className={`badge ${task.status === "COMPLETED" ? "badge-green" : "badge-primary"} self-start sm:self-auto`}>
                                    {task.status === "COMPLETED" ? copy.completed : (task.status || copy.activeLabel)}
                                  </span>
                                </div>
                              ))}

                              {totalPages > 1 && (
                                <div className="pagination border-t border-slate-50 bg-slate-50/50 p-4">
                                  <button onClick={() => setRecentPage((p) => Math.max(1, p - 1))} disabled={recentPage === 1} className="pagination-btn">
                                    <ChevronRight size={16} />
                                  </button>
                                  <div className="t-label px-3">{recentPage} / {totalPages}</div>
                                  <button onClick={() => setRecentPage((p) => Math.min(totalPages, p + 1))} disabled={recentPage === totalPages} className="pagination-btn">
                                    <ChevronLeft size={16} />
                                  </button>
                                </div>
                              )}
                            </>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  {!isWorker && !isAdmin && (
                    <div className="group relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white">
                      <div className="absolute right-0 top-0 h-full w-1.5 bg-blue-600 transition-all group-hover:w-2" />
                      <div className="relative z-10">
                        <h3 className="mb-1 text-lg font-black">{copy.earnMoney}</h3>
                        <p className="app-panel-subtitle mb-6 text-slate-300">{copy.earnMoneyText}</p>
                        <button onClick={() => setPage("becomeWorker")} className="btn btn-secondary btn-md w-full">
                          {copy.joinRequest}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                    <h3 className="app-panel-title mb-6 border-r-4 border-blue-600 pr-3">{copy.quickHelp}</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setPage("userGuide")}
                        className={`flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 ${isArabic ? "text-right" : "text-left"} text-sm font-bold text-slate-600 transition-all hover:text-blue-600`}
                      >
                        <span>{copy.userGuide}</span>
                        <ArrowRight size={14} className={isArabic ? "rotate-180" : ""} />
                      </button>
                      <button
                        onClick={() => setPage("technicalSupport")}
                        className={`flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 ${isArabic ? "text-right" : "text-left"} text-sm font-bold text-slate-600 transition-all hover:text-blue-600`}
                      >
                        <span>{copy.support}</span>
                        <ArrowRight size={14} className={isArabic ? "rotate-180" : ""} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <DashboardContentErrorBoundary>
                <Suspense fallback={<SectionLoader />}>
                  {page === "workers" && <WorkersSection currentUser={user} />}
                  {page === "tasks" && <ProblemBoard currentUser={user} initialTab={tasksTab} />}
                  {page === "ratings" && <RatingsSection currentUser={user} myTasks={myTasks} myBookings={myBookings} myOffers={myOffers} onRefresh={loadDashboardData} />}
                  {page === "becomeWorker" && <BecomeWorker onSuccess={loadDashboardData} />}
                  {page === "myRequests" && <MyRequestsSection currentUser={user} onRefresh={loadDashboardData} onBecomeWorker={() => setPage("becomeWorker")} onGoToRatings={() => setPage("ratings")} />}
                  {page === "profile" && <ProfileSettings user={user} onUpdate={setUser} onRefresh={loadDashboardData} onLogout={onLogout} onBecomeWorker={() => setPage("becomeWorker")} />}
                  {(page === "admin" || (page === "dashboard" && isAdmin)) && isAdmin && <AdminDashboard onNavigate={setPage} />}
                  {page === "manageWorkers" && isAdmin && <ManageWorkersPage />}
                  {page === "tasksVerification" && isAdmin && <TasksVerificationPage initialTab={tasksTab} />}
                  {page === "userGuide" && <UserGuide />}
                  {page === "technicalSupport" && <TechnicalSupport />}
                </Suspense>
              </DashboardContentErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
      <Footer />
      </main>
    </div>
  )
}
