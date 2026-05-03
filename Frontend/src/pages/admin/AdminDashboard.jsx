import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Users, Briefcase, CalendarCheck, CheckCircle2, XCircle,
  Trash2, BarChart3, Clock, TrendingUp, DollarSign,
  AlertTriangle, Star, Phone, Eye
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent
} from '../../components/ui/chart'
import { adminApi } from '../../api/admin'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { PageLoader } from '../../components/ui/Spinner'

// ── Shadcn chart configs ───────────────────────────────────────────────────
const earningsChartConfig = {
  revenue:        { label: 'Revenu total',     theme: { light: '#10b981', dark: '#34d399' } },
  workerEarnings: { label: 'Part travailleurs', theme: { light: '#059669', dark: '#10b981' } },
  platformFee:    { label: 'Commission',        theme: { light: '#f59e0b', dark: '#fbbf24' } },
}

const statsChartConfig = {
  value: { label: 'Valeur', theme: { light: '#10b981', dark: '#34d399' } },
}

const PERIOD_OPTIONS = [
  { key: '7d',  label: '7 jours' },
  { key: '30d', label: '30 jours' },
  { key: '90d', label: '3 mois' },
  { key: '1y',  label: '1 an' },
]

const STATUS_COLORS = {
  OPEN: 'blue', COMPLETED: 'green', IN_PROGRESS: 'yellow',
  PENDING: 'yellow', CANCELLED: 'red',
}

// ── Main component ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { t } = useTranslation()

  // core state
  const [tab, setTab]                   = useState('overview')
  const [stats, setStats]               = useState(null)
  const [pendingWorkers, setPending]    = useState([])
  const [users, setUsers]               = useState([])
  const [tasks, setTasks]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [actioning, setActioning]       = useState(null)

  // earnings state
  const [earnings, setEarnings]         = useState(null)
  const [historyData, setHistoryData]   = useState([])
  const [period, setPeriod]             = useState('30d')
  const [historyLoading, setHistoryLoading] = useState(false)

  // penalty modal state
  const [penaltyModal, setPenaltyModal] = useState(false)
  const [penaltyTarget, setPenaltyTarget] = useState(null)
  const [penaltyForm, setPenaltyForm]   = useState({ reason: '', amount: '' })
  const [penaltyLoading, setPenaltyLoading] = useState(false)

  // reviews modal state
  const [reviewsModal, setReviewsModal] = useState(false)
  const [reviewsTarget, setReviewsTarget] = useState(null)
  const [adminReviews, setAdminReviews] = useState([])

  // completed tasks toggle
  const [showCompleted, setShowCompleted] = useState(false)
  const [completedTasks, setCompletedTasks] = useState([])

  // ── Loaders ──────────────────────────────────────────────────────────────
  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    const settle = (p) => p.then(r => ({ ok: true, data: r.data })).catch(() => ({ ok: false, data: null }))
    const [statsRes, pendingRes, usersRes, tasksRes, earningsRes] = await Promise.all([
      settle(adminApi.getStats()),
      settle(adminApi.getPendingWorkers()),
      settle(adminApi.getUsers()),
      settle(adminApi.getTasks()),
      settle(adminApi.getEarnings()),
    ])
    if (statsRes.ok)   setStats(statsRes.data)
    if (pendingRes.ok) setPending(pendingRes.data || [])
    if (usersRes.ok)   setUsers(usersRes.data?.content || usersRes.data || [])
    if (tasksRes.ok)   setTasks(tasksRes.data?.content || tasksRes.data || [])
    if (earningsRes.ok) setEarnings(earningsRes.data)
    setLoading(false)
  }, [])

  const loadHistory = useCallback(async (p) => {
    setHistoryLoading(true)
    try {
      const res = await adminApi.getEarningsHistory(p)
      setHistoryData(res.data || [])
    } catch {}
    setHistoryLoading(false)
  }, [])

  const loadCompletedTasks = useCallback(async () => {
    try {
      const res = await adminApi.getCompletedTasks()
      setCompletedTasks(res.data || [])
    } catch {}
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (tab === 'earnings') loadHistory(period) }, [tab, period, loadHistory])
  useEffect(() => { if (showCompleted && completedTasks.length === 0) loadCompletedTasks() }, [showCompleted, completedTasks.length, loadCompletedTasks])

  // ── Actions ───────────────────────────────────────────────────────────────
  const approve = async (id) => {
    setActioning(id)
    const old = [...pendingWorkers]
    setPending(prev => prev.filter(w => w.id !== id))
    try { 
      await adminApi.approveWorker(id)
      await load(true) 
    } catch { 
      setPending(old)
      alert('Erreur lors de l\'approbation') 
    }
    setActioning(null)
  }

  const reject = async (id) => {
    setActioning(id)
    const old = [...pendingWorkers]
    setPending(prev => prev.filter(w => w.id !== id))
    try { 
      await adminApi.rejectWorker(id, '')
      await load(true) 
    } catch { 
      setPending(old)
      alert('Erreur lors du rejet') 
    }
    setActioning(null)
  }

  const deleteUser = async (id) => {
    if (!confirm(t('common.confirm') + ' ?')) return
    try { await adminApi.deleteUser(id); load() } catch {}
  }

  const deleteTask = async (id) => {
    if (!confirm(t('common.confirm') + ' ?')) return
    try { await adminApi.deleteTask(id); load() } catch {}
  }

  const submitPenalty = async () => {
    if (!penaltyForm.reason || !penaltyForm.amount) return
    setPenaltyLoading(true)
    try {
      await adminApi.addPenalty(penaltyTarget.id, { reason: penaltyForm.reason, amount: parseFloat(penaltyForm.amount) })
      setPenaltyModal(false)
      setPenaltyForm({ reason: '', amount: '' })
    } catch {}
    setPenaltyLoading(false)
  }

  const openReviews = async (worker) => {
    setReviewsTarget(worker)
    setReviewsModal(true)
    try {
      const res = await adminApi.getWorkerAdminReviews(worker.id)
      setAdminReviews(res.data || [])
    } catch { setAdminReviews([]) }
  }

  // ── Derived chart data ─────────────────────────────────────────────────
  const statCards = stats ? [
    { icon: Users,         label: t('admin.stats.users'),    value: stats.totalUsers    ?? 0, color: 'text-blue-500   bg-blue-50   dark:bg-blue-900/20'   },
    { icon: CheckCircle2,  label: t('admin.stats.workers'),  value: stats.totalWorkers  ?? 0, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
    { icon: Briefcase,     label: t('admin.stats.tasks'),    value: stats.totalTasks    ?? 0, color: 'text-amber-500  bg-amber-50  dark:bg-amber-900/20'  },
    { icon: CalendarCheck, label: t('admin.stats.bookings'), value: stats.totalBookings ?? 0, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  ] : []

  const overviewChartData = stats ? [
    { name: t('admin.stats.users'),    value: stats.totalUsers    ?? 0 },
    { name: t('admin.stats.workers'),  value: stats.totalWorkers  ?? 0 },
    { name: t('admin.stats.tasks'),    value: stats.totalTasks    ?? 0 },
    { name: t('admin.stats.bookings'), value: stats.totalBookings ?? 0 },
  ] : []

  const TABS = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { key: 'earnings', label: t('admin.earnings.title'), icon: TrendingUp },
    { key: 'pending',  label: t('admin.pendingWorkers'), icon: Clock },
    { key: 'users',    label: t('admin.users'),          icon: Users },
    { key: 'tasks',    label: t('admin.tasks'),          icon: Briefcase },
  ]

  if (loading) return <Layout><PageLoader /></Layout>

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="page-container py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="section-title">{t('admin.title')}</h1>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-6 overflow-x-auto">
          {TABS.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                tab === tb.key
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tb.icon size={14} /> {tb.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Statistiques générales</h2>
              <ChartContainer config={statsChartConfig} className="h-72">
                <BarChart data={overviewChartData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={700} />
                </BarChart>
              </ChartContainer>
            </motion.div>
          )}

          {/* ── EARNINGS ─────────────────────────────────────────────────── */}
          {tab === 'earnings' && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: t('admin.earnings.totalRevenue'), value: earnings?.totalRevenue ?? 0, icon: DollarSign, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
                  { label: t('admin.earnings.workerShare'), value: earnings?.totalWorkerEarnings ?? 0, icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                  { label: t('admin.earnings.platformFee'), value: earnings?.totalPlatformFee ?? 0, icon: TrendingUp, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
                ].map((c, i) => (
                  <motion.div key={c.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }} className="card p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                      <c.icon size={20} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {c.value.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} <span className="text-sm font-normal text-gray-400">MRU</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">{c.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Chart + period filter */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <h2 className="font-semibold text-gray-900 dark:text-white">{t('admin.earnings.history')}</h2>
                  <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    {PERIOD_OPTIONS.map(p => (
                      <button key={p.key} onClick={() => setPeriod(p.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          period === p.key
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {historyLoading ? (
                  <div className="h-64 flex items-center justify-center text-gray-400">Chargement…</div>
                ) : historyData.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                    <TrendingUp size={32} className="mb-2 opacity-30" />
                    <p className="text-sm">Aucune donnée pour cette période</p>
                  </div>
                ) : (
                  <ChartContainer config={earningsChartConfig} className="h-72">
                    <AreaChart data={historyData}>
                      <defs>
                        <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--color-revenue)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fillWorker" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--color-workerEarnings)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--color-workerEarnings)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fillFee" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--color-platformFee)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--color-platformFee)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `${v} MRU`} />
                      <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Area type="monotone" dataKey="revenue"        stroke="var(--color-revenue)"        fill="url(#fillRevenue)" strokeWidth={2} dot={false} isAnimationActive animationDuration={800} />
                      <Area type="monotone" dataKey="workerEarnings" stroke="var(--color-workerEarnings)" fill="url(#fillWorker)"  strokeWidth={2} dot={false} isAnimationActive animationDuration={900} />
                      <Area type="monotone" dataKey="platformFee"    stroke="var(--color-platformFee)"    fill="url(#fillFee)"     strokeWidth={2} dot={false} isAnimationActive animationDuration={1000} />
                    </AreaChart>
                  </ChartContainer>
                )}
              </div>

              {/* Per-worker table */}
              {earnings?.perWorker?.length > 0 && (
                <div className="card overflow-hidden">
                  <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="font-semibold text-gray-900 dark:text-white">{t('admin.earnings.perWorker')}</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-start px-4 py-3 font-medium text-gray-500">Travailleur</th>
                          <th className="text-start px-4 py-3 font-medium text-gray-500">Profession</th>
                          <th className="text-center px-4 py-3 font-medium text-gray-500">Missions</th>
                          <th className="text-end px-4 py-3 font-medium text-gray-500">Revenu total</th>
                          <th className="text-end px-4 py-3 font-medium text-gray-500">Part travailleur</th>
                          <th className="text-end px-4 py-3 font-medium text-gray-500">Commission</th>
                          <th className="text-center px-4 py-3 font-medium text-gray-500">Pénalité</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {earnings.perWorker.map((w, i) => (
                          <motion.tr key={w.workerId} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {w.profilePictureUrl
                                  ? <img src={w.profilePictureUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                                  : <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600">{w.workerName[0]}</div>
                                }
                                <span className="font-medium text-gray-900 dark:text-white">{w.workerName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{w.profession}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold">
                                {w.completedBookings}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-end font-mono font-medium text-gray-900 dark:text-white">{w.totalRevenue?.toLocaleString()} MRU</td>
                            <td className="px-4 py-3 text-end font-mono text-primary-600 dark:text-primary-400">{w.workerEarnings?.toLocaleString()} MRU</td>
                            <td className="px-4 py-3 text-end font-mono text-amber-600 dark:text-amber-400">{w.platformFee?.toLocaleString()} MRU</td>
                            <td className="px-4 py-3 text-center">
                              <button onClick={() => { setPenaltyTarget(w); setPenaltyModal(true) }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-colors"
                              >
                                <AlertTriangle size={11} /> {t('admin.penalty.add')}
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── PENDING WORKERS ───────────────────────────────────────────── */}
          {tab === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                {t('admin.pendingWorkers')} ({pendingWorkers.length})
              </h2>
              {pendingWorkers.length === 0 ? (
                <div className="card p-10 text-center text-gray-400">{t('admin.noData')}</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pendingWorkers.map((w, i) => (
                    <motion.div key={w.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="card p-4 flex items-center justify-between gap-3 flex-wrap"
                    >
                      <div className="flex items-center gap-3">
                        {w.profilePictureUrl
                          ? <img src={w.profilePictureUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                          : <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                              {(w.fullName || 'W')[0].toUpperCase()}
                            </div>
                        }
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{w.fullName}</p>
                          <p className="text-xs text-gray-400">{w.profession} · {w.city}</p>
                          {w.bio && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-xs">{w.bio}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approve(w.id)} loading={actioning === w.id} className="flex items-center gap-1 text-xs">
                          <CheckCircle2 size={13} /> {t('admin.approve')}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => reject(w.id)} loading={actioning === w.id} className="flex items-center gap-1 text-xs">
                          <XCircle size={13} /> {t('admin.reject')}
                        </Button>
                        <button onClick={() => openReviews(w)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <Eye size={15} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── USERS ─────────────────────────────────────────────────────── */}
          {tab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{t('admin.users')} ({users.length})</h2>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-start px-4 py-3 font-medium text-gray-500">Nom</th>
                        <th className="text-start px-4 py-3 font-medium text-gray-500">Téléphone</th>
                        <th className="text-start px-4 py-3 font-medium text-gray-500">Rôle</th>
                        <th className="text-end px-4 py-3 font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name || u.fullName}</td>
                          <td className="px-4 py-3 text-gray-500">{u.phone}</td>
                          <td className="px-4 py-3">
                            <Badge variant={u.role === 'WORKER' ? 'primary' : u.role === 'ADMIN' ? 'blue' : 'gray'}>{u.role}</Badge>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TASKS ─────────────────────────────────────────────────────── */}
          {tab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">{t('admin.tasks')} ({showCompleted ? completedTasks.length : tasks.length})</h2>
                <button onClick={() => setShowCompleted(s => !s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    showCompleted
                      ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <CheckCircle2 size={14} /> {t('admin.completedTasks')}
                </button>
              </div>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <th className="text-start px-4 py-3 font-medium text-gray-500">Titre</th>
                        <th className="text-start px-4 py-3 font-medium text-gray-500">Statut</th>
                        <th className="text-start px-4 py-3 font-medium text-gray-500">Travailleur</th>
                        <th className="text-start px-4 py-3 font-medium text-gray-500">Date</th>
                        <th className="text-end px-4 py-3 font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {(showCompleted ? completedTasks : tasks).map(task => (
                        <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-xs truncate">{task.title}</td>
                          <td className="px-4 py-3">
                            <Badge variant={STATUS_COLORS[task.status] || 'gray'}>{task.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{task.assignedWorkerId ? `#${task.assignedWorkerId}` : '—'}</td>
                          <td className="px-4 py-3 text-gray-500">{task.createdAt ? new Date(task.createdAt).toLocaleDateString('fr-FR') : '—'}</td>
                          <td className="px-4 py-3 text-end">
                            <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Penalty modal ──────────────────────────────────────────────────── */}
      <Modal isOpen={penaltyModal} onClose={() => setPenaltyModal(false)} title={t('admin.penalty.add')} size="sm">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">
            {t('admin.penalty.target')} <span className="font-medium text-gray-900 dark:text-white">{penaltyTarget?.workerName || penaltyTarget?.fullName}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.penalty.reason')}</label>
            <textarea
              rows={3}
              value={penaltyForm.reason}
              onChange={e => setPenaltyForm(f => ({ ...f, reason: e.target.value }))}
              placeholder="Raison de la pénalité..."
              className="input-base w-full resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.penalty.amount')} (MRU)</label>
            <input
              type="number" min="0"
              value={penaltyForm.amount}
              onChange={e => setPenaltyForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="0"
              className="input-base w-full"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setPenaltyModal(false)} className="flex-1">{t('common.cancel')}</Button>
            <Button variant="danger" onClick={submitPenalty} loading={penaltyLoading} className="flex-1">{t('admin.penalty.confirm')}</Button>
          </div>
        </div>
      </Modal>

      {/* ── Admin reviews modal ────────────────────────────────────────────── */}
      <Modal isOpen={reviewsModal} onClose={() => setReviewsModal(false)} title={`Avis — ${reviewsTarget?.fullName || reviewsTarget?.workerName}`} size="md">
        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
          {adminReviews.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Aucun avis</p>
          ) : adminReviews.map(r => (
            <div key={r.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{r.clientName}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <Phone size={11} /> {r.clientPhone}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-600'} />
                  ))}
                </div>
              </div>
              {r.comment && <p className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>}
              <p className="text-xs text-gray-400 mt-1">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR') : ''}</p>
            </div>
          ))}
        </div>
      </Modal>
    </Layout>
  )
}
