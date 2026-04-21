import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Briefcase, ClipboardList, Clock, Eye, FileText, LayoutDashboard, Settings, LogOut, Users, Sparkles, TrendingUp, Compass, Zap, Star, CheckCircle, Bell, UserPlus } from "lucide-react"
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
import DashboardHeader from "./DashboardHeader"
import Footer from "./Footer"

const WorkersSection = lazy(() => import("./WorkersSection"))
const ProblemBoard = lazy(() => import("./ProblemBoard"))
const BecomeWorker = lazy(() => import("./BecomeWorker"))
const AdminDashboard = lazy(() => import("./AdminDashboard"))
const TaskStatsCharts = lazy(() => import("./TaskStatsCharts"))
const ProfileSettings = lazy(() => import("./ProfileSettings"))
const RatingsSection = lazy(() => import("./RatingsSection"))
const TasksVerificationPage = lazy(() => import("./TasksVerificationPage"))

function SectionLoader({ message = "جاري تحضير البيانات..." }) {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center p-12 text-center">
       <div className="relative mb-8 h-20 w-20">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-slate-100 border-t-[#1d4ed8]" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Zap size={24} className="text-[#1d4ed8] animate-pulse" />
          </div>
       </div>
       <h3 className="text-xl font-black text-slate-900 mb-2">{message}</h3>
       <p className="text-sm font-bold text-slate-500 tracking-tight">برجاء الانتظار لحظات لمزامنة حسابك.</p>
    </div>
  )
}

const DASHBOARD_ROUTES = {
  dashboard: "/dashboard",
  workers: "/dashboard/workers",
  tasks: "/dashboard/tasks",
  ratings: "/dashboard/ratings",
  becomeWorker: "/dashboard/become-worker",
  profile: "/dashboard/profile",
  admin: "/dashboard/admin",
  tasksVerification: "/dashboard/tasks-verification"   // ← جديد
}

const PAGE_TITLES = {
  dashboard: "لوحة التحكم المركزية",
  workers: "سوق المحترفين",
  tasks: "إدارة المهام",
  ratings: "التقييمات والعروض",
  becomeWorker: "الانضمام للمنصة",
  profile: "الملف الشخصي",
  admin: "لوحة السيطرة",
  tasksVerification: "إدارة المهام والتوثيق"           // ← جديد
}

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null)
  const [workers, setWorkers] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [assignedTasks, setAssignedTasks] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [myOffers, setMyOffers] = useState([])
  const [workerProfile, setWorkerProfile] = useState(null)
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

  const setPage = (nextPage, initialTab = "open") => {
    // ── حماية: صفحة إدارة المهام والتوثيق للمدير فقط ──
    if (nextPage === "tasksVerification" && !isAdmin) return

    const path = DASHBOARD_ROUTES[nextPage] || DASHBOARD_ROUTES.dashboard
    setTasksTab(initialTab)
    navigate(path)
  }

  const loadUser = useCallback(async () => {
    const currentUser = await getMe()
    setUser(currentUser)
    return currentUser
  }, [])

  const loadDashboardData = useCallback(async () => {
    const [workersRes, tasksRes, assignedTasksRes, bookingsRes, requestsRes, offersRes, profileRes] = await Promise.allSettled([
      getWorkers(), getMyTasks(), isWorker ? getTasksAssignedToMe() : Promise.resolve([]),
      getMyBookings(), getMyBookingRequests(), getMyOffers(), isWorker ? getMyWorkerProfile() : Promise.resolve(null)
    ])

    if (workersRes.status === "fulfilled") setWorkers(Array.isArray(workersRes.value) ? workersRes.value : [])
    if (tasksRes.status === "fulfilled") setMyTasks(tasksRes.value?.content || tasksRes.value || [])
    if (assignedTasksRes.status === "fulfilled") setAssignedTasks(assignedTasksRes.value || [])
    if (bookingsRes.status === "fulfilled") setMyBookings(bookingsRes.value || [])
    if (requestsRes.status === "fulfilled") setMyRequests(requestsRes.value || [])
    if (offersRes.status === "fulfilled") setMyOffers(offersRes.value || [])
    if (profileRes.status === "fulfilled") setWorkerProfile(profileRes.value)
  }, [isWorker])

  useEffect(() => { loadUser().catch(() => onLogout()) }, [loadUser, onLogout])
  useEffect(() => { if (user) loadDashboardData() }, [loadDashboardData, user])

  useEffect(() => {
    if (isAdmin && page === "dashboard") navigate(DASHBOARD_ROUTES.admin, { replace: true })
    if ((isAdmin || isWorker) && page === "becomeWorker") navigate(isAdmin ? DASHBOARD_ROUTES.admin : DASHBOARD_ROUTES.dashboard, { replace: true })
    // ── إعادة توجيه غير المدير إذا حاول الوصول المباشر ──
    if (!isAdmin && page === "tasksVerification" && user !== null) navigate(DASHBOARD_ROUTES.dashboard, { replace: true })
  }, [isAdmin, isWorker, navigate, page, user])

  const statsCards = useMemo(() => {
    const activeTasksCount = myTasks.filter(t => ["OPEN", "IN_PROGRESS", "ASSIGNED"].includes(String(t.status).toUpperCase())).length
    const completedTasksCount = myTasks.filter(t => String(t.status).toUpperCase() === "COMPLETED").length
    
    if (isWorker) {
      const activeJobs = assignedTasks.filter(t => String(t.status).toUpperCase() === "IN_PROGRESS").length
      return [
        { icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", num: String(activeJobs), lbl: "المهام النشطة", trend: "أداء مستقر" },
        { icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50", num: String(myOffers.length), lbl: "عروضي الحالية", trend: "نمو مستمر" },
        { icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", num: String(myRequests.length), lbl: "الحجوزات المباشرة", trend: "ثقة العملاء" },
        { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50", num: String(assignedTasks.length), lbl: "إجمالي المهام", trend: "السجل العملي" }
      ]
    }
    
    return [
      { icon: Compass, color: "text-blue-600", bg: "bg-blue-50", num: String(activeTasksCount), lbl: "طلبات نشطة", trend: "بانتظار التأكيد" },
      { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", num: String(completedTasksCount), lbl: "مهام مكتملة", trend: "إنجاز ناجح" },
      { icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50", num: String(myTasks.length), lbl: "مهامي القائمة", trend: "جاري المراجعة" },
      { icon: Star, color: "text-blue-600", bg: "bg-blue-50", num: "08", lbl: "عمالي المفضلين", trend: "اختياراتك المميزة" }
    ]
  }, [assignedTasks, isWorker, myOffers.length, myRequests.length, myTasks])

  return (
    <div className="flex min-h-screen bg-slate-50/50" dir="rtl">
      <div className="flex-1 transition-all duration-700">
        <DashboardHeader 
          user={user} 
          title={
            page === "profile" && isWorker
              ? "تعديل الهوية"
              : (PAGE_TITLES[page] || "المنصة")
          } 
          activePage={page}
          onNavigate={setPage} 
          onLogout={onLogout} 
        />

        <main className="relative p-6 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div 
              key={page} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.4, ease: "easeOut" }} 
            >
              {page === "dashboard" && !isAdmin && (
                <div className="mx-auto max-w-7xl space-y-12">
                  {/* Welcome Header */}
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                     <div>
                        <h2 className="font-alexandria text-4xl font-black text-slate-900">
                           مرحباً بك مجدداً، <span className="text-[#1d4ed8]">{user?.username?.split(' ')[0]}</span>! 👋
                        </h2>
                        <p className="mt-2 text-sm font-bold text-slate-500">إليك ملخص سريع لنشاطك وطلباتك القائمة لهذا الأسبوع.</p>
                     </div>
                     <div className="flex flex-wrap items-center gap-3">
                        <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-500 shadow-sm transition-colors hover:bg-slate-50">
                           <Clock size={14} /> آخر ٣٠ يوم
                        </button>
                        {user?.role !== "WORKER" && user?.role !== "ADMIN" && (
                          <button
                            type="button"
                            onClick={() => setPage("becomeWorker")}
                            className="flex items-center gap-2 rounded-xl bg-[#1d4ed8] px-6 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
                          >
                            <UserPlus size={16} aria-hidden />
                            انضم كعامل
                          </button>
                        )}
                     </div>
                  </div>

                  {/* 4-Column Stats Grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1 + i * 0.1 }} 
                        key={i} 
                        className="rounded-[2rem] bg-white p-7 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-500 group"
                      >
                        <div className="mb-6 flex items-center justify-between">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} transition-all group-hover:scale-110 shadow-sm shadow-black/5`}>
                            <stat.icon size={26} />
                          </div>
                          <span className="text-[10px] font-black tracking-widest text-[#1d4ed8] uppercase bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/50">{stat.trend}</span>
                        </div>
                        <div className="mb-1 text-4xl font-black text-slate-950 tabular-nums tracking-tighter">{stat.num}</div>
                        <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">{stat.lbl}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-12 xl:grid-cols-12">
                     {/* Main Flow Content */}
                     <div className="xl:col-span-8 space-y-12">
                        {/* Booking Activities Section */}
                        <section>
                           <div className="mb-8 flex items-center justify-between px-2">
                              <h3 className="text-2xl font-black text-slate-900">الحجوزات النشطة</h3>
                              <button onClick={() => setPage("workers")} className="text-sm font-black text-[#1d4ed8] hover:underline">عرض الكل</button>
                           </div>
                           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              {myBookings.length === 0 ? (
                                <div className="col-span-full bg-white p-12 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-slate-400 shadow-sm border-dashed">
                                   <Clock size={40} className="mb-4 text-slate-200" />
                                   <p className="font-bold text-sm">لا توجد حجوزات نشطة حالياً</p>
                                </div>
                              ) : myBookings.slice(0, 2).map((booking, idx) => (
                                <div key={booking.id || idx} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-500/10 transition-all duration-500 group">
                                   <div className="flex gap-4 items-center mb-8">
                                      <div className="h-16 w-16 rounded-2xl bg-white border-2 border-slate-50 overflow-hidden ring-4 ring-blue-50 shadow-inner">
                                         <img src={`https://ui-avatars.com/api/?name=${booking.workerName || "عامل"}&background=1d4ed8&color=fff`} alt="Worker" className="h-full w-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                         <p className="text-[10px] font-black text-[#1d4ed8] uppercase tracking-widest mb-1">{booking.status === "PENDING" ? "بانتظار التأكيد" : "حجز مؤكد"}</p>
                                         <h4 className="text-xl font-black text-slate-900 group-hover:text-[#1d4ed8] transition-colors">{booking.workerName || "مقدم خدمة"}</h4>
                                         <p className="text-[11px] font-bold text-slate-400">{booking.serviceType || "خدمة عامة"} • {booking.duration} ساعة</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3 mb-8 text-[11px] font-bold text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                      <Clock size={14} className="text-[#1d4ed8]" /> {booking.date} • {booking.time}
                                   </div>
                                   <div className="flex gap-4">
                                      {booking.status === "COMPLETED" ? (
                                        <button onClick={() => setPage("profile")} className="h-12 bg-emerald-600 text-white flex-1 rounded-2xl text-[11px] font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95">تقييم العامل</button>
                                      ) : (
                                        <button onClick={() => setPage("workers")} className="h-12 bg-[#1d4ed8] text-white flex-1 rounded-2xl text-[11px] font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">كل الحجوزات</button>
                                      )}
                                   </div>
                                </div>
                              ))}
                           </div>
                        </section>

                        {/* Current Tasks Table */}
                        <section>
                           <div className="mb-8 flex items-center justify-between px-2">
                              <h3 className="text-2xl font-black text-slate-900">إدارة مهامي الحالية</h3>
                              <button onClick={() => setPage("tasks", "previous")} className="text-sm font-black text-[#1d4ed8] hover:underline">إدارة غرفة العمليات</button>
                           </div>
                           <div className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                              <table className="w-full text-right border-collapse">
                                 <thead>
                                    <tr className="bg-slate-50/80 text-[11px] font-black uppercase tracking-widest text-slate-400">
                                       <th className="px-10 py-6 border-b border-slate-100">تفاصيل المهمة</th>
                                       <th className="px-10 py-6 text-center border-b border-slate-100">المتقدمون</th>
                                       <th className="px-10 py-6 border-b border-slate-100">حالة التنفيذ</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50">
                                    {myTasks.length === 0 ? (
                                        <tr><td colSpan="3" className="px-10 py-12 text-center text-[13px] font-black text-slate-400">لا توجد مهام حالياً. قم بنشر مهمة جديدة للبدء.</td></tr>
                                    ) : myTasks.slice(0, 4).map((row, i) => (
                                       <tr key={row.id || i} onClick={() => setPage("tasks")} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                                          <td className="px-10 py-8">
                                             <p className="text-[15px] font-black text-slate-900 mb-1 group-hover:text-[#1d4ed8] transition-colors">{row.title}</p>
                                             <p className="text-[11px] font-bold text-slate-400">الطلب #{row.id} • {row.profession || "مهمة عامة"}</p>
                                          </td>
                                          <td className="px-10 py-8">
                                             <div className="flex items-center justify-center gap-3">
                                                <span className="text-[11px] font-black text-slate-600">عروض متاحة</span>
                                             </div>
                                          </td>
                                          <td className="px-10 py-8">
                                             <div className="flex items-center gap-2.5">
                                                <div className={`h-2 w-2 rounded-full ${row.status === 'COMPLETED' ? 'bg-emerald-500' : row.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-amber-400'}`} />
                                                <span className={`text-[11px] font-black ${row.status === 'COMPLETED' ? 'text-emerald-600' : row.status === 'IN_PROGRESS' ? 'text-blue-600' : 'text-amber-600'} uppercase tracking-wider`}>
                                                   {row.status === 'COMPLETED' ? "مكتملة" : row.status === 'IN_PROGRESS' ? "قيد التنفيذ" : "مفتوحة"}
                                                </span>
                                             </div>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </section>
                     </div>

                     {/* Right Panel Side View */}
                     <div className="xl:col-span-4 space-y-12">
                        {/* Quick Actions Card */}
                        <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-80" />
                           <h3 className="text-xl font-black text-slate-900 mb-10">إجراءات سريعة</h3>
                           <div className="space-y-5">
                              <button onClick={() => setPage("tasks")} className="h-16 w-full bg-[#1d4ed8] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10 hover:bg-blue-700 transition-all active:scale-95 group">
                                 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                                    <Sparkles size={18} />
                                 </div>
                                 نشر مهمة جديدة
                              </button>
                              <button onClick={() => setPage("workers")} className="h-16 w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-white hover:border-blue-500/20 transition-all group">
                                 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 group-hover:text-[#1d4ed8]">
                                    <Users size={18} />
                                 </div>
                                 بحث عن خبراء
                              </button>
                              <button onClick={() => setPage("ratings")} className="h-16 w-full bg-amber-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10 hover:bg-amber-600 transition-all active:scale-95 group">
                                 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                                    <Star size={18} />
                                 </div>
                                 التقييمات والعروض
                              </button>
                              <button onClick={() => setPage("profile")} className="h-16 w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-white hover:border-blue-500/20 transition-all group">
                                 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm text-slate-400 group-hover:text-[#1d4ed8]">
                                    <Settings size={18} />
                                 </div>
                                 تعديل هويتي
                              </button>
                           </div>
                        </div>

                        {/* Suggested Workers Card */}
                        <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm">
                           <h3 className="text-xl font-black text-slate-900 mb-10">خبراء مقترحون</h3>
                           <div className="space-y-8">
                              {[
                                 { name: "محمد السعدي", job: "سباك محترف", rate: "4.9", points: "925", avatar: "https://i.pravatar.cc/150?u=ms" },
                                 { name: "ياسر حسين", job: "فني كهرباء", rate: "4.8", points: "850", avatar: "https://i.pravatar.cc/150?u=yh" },
                                 { name: "فاطمة علي", job: "تصميم داخلي", rate: "5.0", points: "1.2K", avatar: "https://i.pravatar.cc/150?u=fa" }
                              ].map((w, i) => (
                                 <div key={i} className="flex items-center gap-5 group cursor-pointer">
                                    <div className="h-14 w-14 rounded-2xl border-2 border-slate-50 overflow-hidden ring-4 ring-slate-100 transition-transform group-hover:scale-110 shadow-sm">
                                       <img src={w.avatar} alt="Worker" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                       <h4 className="text-sm font-black text-slate-900 group-hover:text-[#1d4ed8] transition-colors">{w.name}</h4>
                                       <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{w.job} • {w.rate}⭐</span>
                                       </div>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-blue-200 group-hover:bg-[#1d4ed8] transition-all" />
                                 </div>
                              ))}
                              <button onClick={() => setPage("workers")} className="w-full mt-10 py-5 rounded-2xl border border-slate-100 text-[11px] font-black text-slate-400 hover:bg-[#1d4ed8] hover:text-white hover:border-[#1d4ed8] transition-all uppercase tracking-widest">تصفح قائمة الخبراء بالكامل</button>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              <div className="mx-auto max-w-7xl">
                {page === "workers" && <Suspense fallback={<SectionLoader message="جاري استدعاء قائمة الخبراء..." />}><WorkersSection currentUser={user} /></Suspense>}
                {page === "tasks" && <Suspense fallback={<SectionLoader message="جاري تجهيز غرفة العمليات..." />}><ProblemBoard currentUser={user} initialTab={tasksTab} /></Suspense>}
                {page === "ratings" && <Suspense fallback={<SectionLoader message="جاري تجهيز التقييمات..." />}><RatingsSection currentUser={user} myTasks={myTasks} myOffers={myOffers} /></Suspense>}
                {page === "becomeWorker" && !isAdmin && !isWorker && <Suspense fallback={<SectionLoader message="جاري فتح نموذج الانضمام..." />}><BecomeWorker onSuccess={async () => { await loadUser(); await loadDashboardData(); setPage("dashboard"); }} /></Suspense>}
                {page === "profile" && <Suspense fallback={<SectionLoader message="جاري عرض الهوية الرقمية..." />}><ProfileSettings user={user} onUpdate={setUser} onRefresh={loadDashboardData} onBecomeWorker={() => setPage("becomeWorker")} onLogout={onLogout} /></Suspense>}
                {page === "admin" && isAdmin && <Suspense fallback={<SectionLoader message="الوصول لمركز السيطرة المركزي..." />}><AdminDashboard onNavigate={setPage} /></Suspense>}

                {/* ── صفحة إدارة المهام والتوثيق — للمدير فقط ── */}
                {page === "tasksVerification" && isAdmin && (
                  <Suspense fallback={<SectionLoader message="جاري تحميل إدارة المهام والتوثيق..." />}>
                    <TasksVerificationPage />
                  </Suspense>
                )}

                {/* ── حماية: غير المدير لا يرى الصفحة ── */}
                {page === "tasksVerification" && !isAdmin && user !== null && (
                  <div className="flex min-h-[500px] flex-col items-center justify-center text-center p-12">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                      <span className="text-4xl">🔒</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">غير مصرح بالدخول</h3>
                    <p className="text-sm font-bold text-slate-400 mb-8">هذه الصفحة مخصصة للمدير فقط.</p>
                    <button onClick={() => setPage("dashboard")} className="rounded-2xl bg-[#1d4ed8] px-8 py-3 text-sm font-black text-white shadow-lg hover:bg-blue-700 transition-all">
                      العودة للرئيسية
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          <Footer />
        </main>
      </div>
    </div>
  )
}