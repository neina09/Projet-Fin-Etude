import React, { useEffect, useMemo, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { ArrowUpRight, Briefcase, ClipboardList, Clock, Eye, FileText } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  getMe,
  getMyBookingRequests,
  getMyBookings,
  getMyOffers,
  getMyTasks,
  getMyWorkerProfile,
  getTasksAssignedToMe,
  getWorkers
} from "../api"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import WorkersSection from "./WorkersSection"
import ProblemBoard from "./ProblemBoard"
import BecomeWorker from "./BecomeWorker"
import ChatSystem from "./ChatSystem"
import AdminDashboard from "./AdminDashboard"
import TaskStatsCharts from "./TaskStatsCharts"
import ProfileSettings from "./ProfileSettings"

const DASHBOARD_ROUTES = {
  dashboard: "/dashboard",
  workers: "/dashboard/workers",
  tasks: "/dashboard/tasks",
  becomeWorker: "/dashboard/become-worker",
  chat: "/dashboard/chat",
  profile: "/dashboard/profile",
  admin: "/dashboard/admin"
}

const PAGE_TITLES = {
  dashboard: "الرئيسية",
  workers: "العمال",
  tasks: "المهام",
  becomeWorker: "التسجيل كعامل",
  chat: "الرسائل",
  profile: "الملف الشخصي",
  admin: "لوحة الإدارة"
}

const ROLE_LABELS = {
  ADMIN: "مدير",
  WORKER: "عامل",
  USER: "عميل"
}

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [workers, setWorkers] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [assignedTasks, setAssignedTasks] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [myOffers, setMyOffers] = useState([])
  const [workerProfile, setWorkerProfile] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const isAdmin = user?.role === "ADMIN"
  const isWorker = user?.role === "WORKER"

  const page = useMemo(() => {
    const normalized = location.pathname.replace(/\/+$/, "")
    const entry = Object.entries(DASHBOARD_ROUTES).find(([, path]) => path === normalized)
    return entry?.[0] || "dashboard"
  }, [location.pathname])

  const setPage = (nextPage) => {
    const path = DASHBOARD_ROUTES[nextPage] || DASHBOARD_ROUTES.dashboard
    navigate(path)
    setSidebarOpen(false)
  }

  const loadUser = async () => {
    const currentUser = await getMe()
    setUser(currentUser)
    return currentUser
  }

  const loadDashboardData = async () => {
    const [workersResult, tasksResult, assignedTasksResult, bookingsResult, requestsResult, offersResult, workerProfileResult] = await Promise.allSettled([
      getWorkers(),
      getMyTasks(),
      isWorker ? getTasksAssignedToMe() : Promise.resolve([]),
      getMyBookings(),
      getMyBookingRequests(),
      getMyOffers(),
      isWorker ? getMyWorkerProfile() : Promise.resolve(null)
    ])


    if (workersResult.status === "fulfilled") {
      setWorkers(Array.isArray(workersResult.value) ? workersResult.value : [])
    }

    if (tasksResult.status === "fulfilled") {
      const tasks = tasksResult.value?.content || tasksResult.value || []
      setMyTasks(Array.isArray(tasks) ? tasks : [])
    }

    if (assignedTasksResult.status === "fulfilled") {
      setAssignedTasks(Array.isArray(assignedTasksResult.value) ? assignedTasksResult.value : [])
    } else {
      setAssignedTasks([])
    }

    if (bookingsResult.status === "fulfilled") {
      setMyBookings(Array.isArray(bookingsResult.value) ? bookingsResult.value : [])
    }

    if (requestsResult.status === "fulfilled") {
      setMyRequests(Array.isArray(requestsResult.value) ? requestsResult.value : [])
    }

    if (offersResult.status === "fulfilled") {
      setMyOffers(Array.isArray(offersResult.value) ? offersResult.value : [])
    }

    if (workerProfileResult.status === "fulfilled" && workerProfileResult.value) {
      setWorkerProfile(workerProfileResult.value)
    }
  }


  useEffect(() => {
    let active = true

    const run = async () => {
      try {
        if (active) {
          await loadUser()
        }
      } catch {
        onLogout()
      }
    }

    run()
    return () => {
      active = false
    }
  }, [onLogout])

  useEffect(() => {
    if (!user) return

    let active = true
    const run = async () => {
      if (active) {
        await loadDashboardData()
      }
    }

    run()
    return () => {
      active = false
    }
  }, [user])

  useEffect(() => {
    if (isAdmin && page === "dashboard") {
      navigate(DASHBOARD_ROUTES.admin, { replace: true })
    }
  }, [isAdmin, navigate, page])

  useEffect(() => {
    if ((isAdmin || isWorker) && page === "becomeWorker") {
      navigate(isAdmin ? DASHBOARD_ROUTES.admin : DASHBOARD_ROUTES.dashboard, { replace: true })
    }
  }, [isAdmin, isWorker, navigate, page])

  const dashboardCards = useMemo(() => {
    if (isWorker) {
      const pendingRequests = myRequests.filter((booking) => String(booking.status || "").toUpperCase() === "PENDING").length
      const activeJobs = assignedTasks.filter((task) => String(task.status || "").toUpperCase() === "IN_PROGRESS").length
      const completedJobs = assignedTasks.filter((task) => String(task.status || "").toUpperCase() === "COMPLETED").length

      return [
        { icon: Briefcase, color: "text-primary", bg: "bg-primary-soft", num: String(activeJobs), lbl: "أعمال جارية", trend: `${pendingRequests} طلبات جديدة` },
        { icon: ClipboardList, color: "text-indigo-600", bg: "bg-indigo-50", num: String(myOffers.length), lbl: "عروضي على المهام", trend: `${myOffers.length} عرض` },
        { icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50", num: String(completedJobs), lbl: "أعمال مكتملة", trend: `${completedJobs} منجز` }
      ]
    }

    const activeTasksCount = myTasks.filter((task) => {
      const status = String(task.status || "").toUpperCase()
      return status === "OPEN" || status === "IN_PROGRESS" || status === "ASSIGNED"
    }).length

    const completedTasksCount = myTasks.filter(
      (task) => String(task.status || "").toUpperCase() === "COMPLETED"
    ).length

    return [
      { icon: Briefcase, color: "text-primary", bg: "bg-primary-soft", num: String(activeTasksCount), lbl: "مهام نشطة", trend: `${activeTasksCount} الآن` },
      { icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50", num: String(completedTasksCount), lbl: "مهام مكتملة", trend: `${completedTasksCount} منجز` },
      { icon: Eye, color: "text-amber-600", bg: "bg-amber-50", num: String(myBookings.length), lbl: "حجوزاتي", trend: `${myBookings.length} حجز` }
    ]
  }, [assignedTasks, isWorker, myBookings.length, myOffers.length, myRequests, myTasks])

  const averageRating = workers.length
    ? (workers.reduce((sum, worker) => sum + (worker.averageRating || 0), 0) / workers.length).toFixed(1)
    : "0.0"

  return (
    <div className="flex min-h-screen bg-surface-50" dir="rtl">
      <Sidebar
        page={page}
        onNavigate={setPage}
        user={user}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 transition-all duration-500 lg:mr-72">
        <DashboardHeader
          user={user}
          title={PAGE_TITLES[page] || "لوحة التحكم"}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <main className="p-0">
          <AnimatePresence mode="wait">
            <div
              key={page}
              className="animate-fade-in"
            >
              {page === "dashboard" && !isAdmin && (
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
                  {isWorker && workerProfile && !workerProfile.verified && (
                    <div className="mb-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-8 shadow-sm">
                      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-right">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                          <Clock size={32} />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1 text-xl font-black text-amber-900">ملفك المهني قيد المراجعة</h3>
                          <p className="max-w-xl text-sm font-bold text-amber-700">
                            تم استلام بياناتك بنجاح. ملفك المهني غير ظاهر حالياً للعملاء حتى مراجعته وتوثيقه من قبل الإدارة.
                            سنقوم بإعلامك فور تفعيل حسابك.
                          </p>
                          {workerProfile?.verificationNotes && (
                            <div className="mt-3 rounded-2xl border border-amber-300 bg-white/80 px-4 py-3 text-sm font-bold text-amber-900">
                              ملاحظات الإدارة: {workerProfile.verificationNotes}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => setPage("profile")}
                          className="rounded-xl border border-amber-300 bg-white px-6 py-2 text-sm font-black text-amber-700 transition-all hover:bg-amber-100"
                        >
                          عرض تفاصيل الملف
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="relative mb-10 overflow-hidden rounded-[2.5rem] border border-surface-200 bg-white p-8 shadow-xl shadow-surface-900/[0.03] lg:p-12">

                    <div className="pointer-events-none absolute inset-0 opacity-40">
                      <div className="absolute -top-[10%] -right-[5%] h-[50%] w-[30%] rounded-full bg-primary/5 blur-3xl" />
                      <div className="absolute -bottom-[10%] -left-[5%] h-[40%] w-[40%] rounded-full bg-indigo-50/50 blur-3xl" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-between gap-12 lg:flex-row">
                      <div className="flex-1 text-center lg:text-right">
                        <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-black tracking-wider text-primary">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          مزامنة مع الخادم
                        </span>
                        <h2 className="mb-4 font-alexandria text-4xl font-black leading-[1.15] tracking-tight text-surface-900 md:text-5xl">
                          مرحباً {user?.username || "بك"}
                        </h2>
                        <p className="mx-auto mb-8 max-w-xl text-base font-bold leading-relaxed text-surface-500 lg:mx-0">
                          نوع الحساب الحالي: {ROLE_LABELS[user?.role] || "مستخدم"}. من هنا تستطيع التنقل بين العمال،
                          المهام، الرسائل، والإشعارات بدون الخروج من لوحة التحكم أو العودة إلى الصفحة العامة.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                          <button
                            className="btn-saas btn-primary h-12 px-8 text-sm shadow-lg shadow-primary/20"
                            onClick={() => setPage(isWorker ? "tasks" : "workers")}
                          >
                            {isWorker ? "استعراض المهام" : "استكشاف العمال"}
                          </button>
                          <button
                            className="btn-saas btn-secondary h-12 border-surface-200 px-8 text-sm"
                            onClick={() => setPage("profile")}
                          >
                            الملف الشخصي
                          </button>
                        </div>
                      </div>

                      <div className="flex w-full flex-col items-center gap-4 sm:flex-row lg:w-auto">
                        <div className="min-w-[160px] flex-1 rounded-3xl border border-surface-200 bg-surface-50 p-8 text-center transition-all hover:border-primary/20">
                          <div className="mb-1 font-alexandria text-4xl font-black text-surface-900">
                            {isWorker ? assignedTasks.length : workers.length}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">
                            {isWorker ? "مهام مسندة" : "عمال متاحون"}
                          </div>
                        </div>
                        <div className="min-w-[160px] flex-1 rounded-3xl border border-surface-200 bg-surface-50 p-8 text-center transition-all hover:border-primary/20">
                          <div className="mb-1 font-alexandria text-4xl font-black text-surface-900">
                            {isWorker ? myOffers.length : averageRating}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">
                            {isWorker ? "عروض مرسلة" : "متوسط تقييم العمال"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <TaskStatsCharts tasks={isWorker ? assignedTasks : myTasks} />

                  <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {dashboardCards.map((stat, index) => (
                      <div key={index} className="saas-card border-surface-200 bg-white p-8 transition-all hover:border-primary/20">
                        <div className="mb-8 flex items-center justify-between">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-black/[0.03] shadow-sm ${stat.bg} ${stat.color}`}>
                            <stat.icon size={26} />
                          </div>
                          <div className="rounded-xl border border-surface-100 bg-surface-50 px-3 py-1.5 text-[10px] font-black tracking-tight text-surface-400">
                            {stat.trend}
                          </div>
                        </div>
                        <div className="mb-1 font-alexandria text-4xl font-black text-surface-900">{stat.num}</div>
                        <div className="font-alexandria text-xs font-bold uppercase tracking-[0.15em] text-surface-400">{stat.lbl}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div
                      className="saas-card group flex cursor-pointer items-center gap-8 rounded-[2.5rem] border-surface-200 bg-white p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                      onClick={() => setPage(isWorker ? "tasks" : "workers")}
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-50 text-4xl transition-all duration-500 group-hover:bg-primary-soft">
                        {isWorker ? "📝" : "🛠"}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-alexandria text-xl font-black text-surface-900">
                          {isWorker ? "عروضي على المهام" : "العمال"}
                        </h3>
                        <p className="text-sm font-bold leading-relaxed text-surface-500">
                          {isWorker
                            ? "تابع المهام المفتوحة، أرسل عرضك، وراقب حالة كل عرض من نفس المساحة."
                            : "تصفح قائمة العمال، شاهد تقييماتهم، وابدأ الحجز المباشر من داخل المنصة."}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-200 text-surface-400 transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                        <ArrowUpRight size={22} />
                      </div>
                    </div>

                    <div
                      className="saas-card group flex cursor-pointer items-center gap-8 rounded-[2.5rem] border-surface-200 bg-white p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                      onClick={() => setPage(isAdmin ? "admin" : isWorker ? "chat" : "profile")}
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-50 text-4xl transition-all duration-500 group-hover:bg-indigo-50">
                        {isWorker ? "💬" : "👤"}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-alexandria text-xl font-black text-surface-900">
                          {isWorker ? "الرسائل والإشعارات" : "الملف الشخصي"}
                        </h3>
                        <p className="text-sm font-bold leading-relaxed text-surface-500">
                          {isWorker
                            ? "انتقل فوراً إلى المحادثات، وتابع الطلبات والإشعارات دون فقدان مكانك الحالي."
                            : "حدّث بياناتك، قيّم العمال بعد اكتمال الحجز، وراجع سجل طلباتك بسهولة."}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-200 text-surface-400 transition-all group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
                        <ArrowUpRight size={22} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {page === "workers" && <WorkersSection currentUser={user} />}
              {page === "tasks" && <ProblemBoard currentUser={user} />}
              {page === "becomeWorker" && !isAdmin && !isWorker && (
                <BecomeWorker
                  onSuccess={async () => {
                    await loadUser()
                    await loadDashboardData()
                    setPage("dashboard")
                  }}
                />
              )}
              {page === "chat" && (
                <div className="p-4 sm:p-8">
                  <ChatSystem currentUser={user} />
                </div>
              )}
              {page === "profile" && (
                <ProfileSettings
                  user={user}
                  onUpdate={(updatedUser) => setUser(updatedUser)}
                  onRefresh={loadDashboardData}
                  onBecomeWorker={() => setPage("becomeWorker")}
                  onLogout={onLogout}
                />
              )}
              {page === "admin" && <AdminDashboard />}

              {page === "becomeWorker" && (isAdmin || isWorker) && (
                <div className="mx-auto max-w-3xl px-6 py-16">
                  <div className="saas-card rounded-[2rem] border-surface-200 bg-white p-10 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-4xl">
                      ⛔
                    </div>
                    <h2 className="mb-3 font-alexandria text-3xl font-black text-surface-900">
                      هذا القسم غير متاح
                    </h2>
                    <p className="mx-auto max-w-xl text-sm font-bold leading-relaxed text-surface-500">
                      المدير لا يمكنه التسجيل كعامل، والعامل لديه ملف مهني جاهز بالفعل. يمكنك متابعة
                      مهامك أو فتح الملف الشخصي من القائمة الجانبية.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
