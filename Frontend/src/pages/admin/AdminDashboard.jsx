import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Users, Briefcase, CalendarCheck, CheckCircle2, XCircle, Trash2, BarChart3, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { adminApi } from '../../api/admin'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/Spinner'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [pendingWorkers, setPendingWorkers] = useState([])
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [statsRes, pendingRes, usersRes, tasksRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPendingWorkers(),
        adminApi.getUsers(),
        adminApi.getTasks(),
      ])
      setStats(statsRes.data)
      setPendingWorkers(pendingRes.data || [])
      setUsers(usersRes.data?.content || usersRes.data || [])
      setTasks(tasksRes.data?.content || tasksRes.data || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const approve = async (id) => {
    setActioning(id)
    try { await adminApi.approveWorker(id); load() } catch {}
    setActioning(null)
  }

  const reject = async (id) => {
    setActioning(id)
    try { await adminApi.rejectWorker(id); load() } catch {}
    setActioning(null)
  }

  const deleteUser = async (id) => {
    if (!confirm(t('common.confirm') + '?')) return
    try { await adminApi.deleteUser(id); load() } catch {}
  }

  const deleteTask = async (id) => {
    if (!confirm(t('common.confirm') + '?')) return
    try { await adminApi.deleteTask(id); load() } catch {}
  }

  const statCards = stats ? [
    { icon: Users, label: t('admin.stats.users'), value: stats.totalUsers ?? stats.users ?? 0, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { icon: CheckCircle2, label: t('admin.stats.workers'), value: stats.totalWorkers ?? stats.workers ?? 0, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
    { icon: Briefcase, label: t('admin.stats.tasks'), value: stats.totalTasks ?? stats.tasks ?? 0, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { icon: CalendarCheck, label: t('admin.stats.bookings'), value: stats.totalBookings ?? stats.bookings ?? 0, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  ] : []

  const chartData = stats ? [
    { name: t('admin.stats.users'), value: stats.totalUsers ?? stats.users ?? 0 },
    { name: t('admin.stats.workers'), value: stats.totalWorkers ?? stats.workers ?? 0 },
    { name: t('admin.stats.tasks'), value: stats.totalTasks ?? stats.tasks ?? 0 },
    { name: t('admin.stats.bookings'), value: stats.totalBookings ?? stats.bookings ?? 0 },
  ] : []

  const TABS = [
    { key: 'overview', label: t('admin.stats.users'), icon: BarChart3 },
    { key: 'pending', label: t('admin.pendingWorkers'), icon: Clock },
    { key: 'users', label: t('admin.users'), icon: Users },
    { key: 'tasks', label: t('admin.tasks'), icon: Briefcase },
  ]

  if (loading) return <Layout><PageLoader /></Layout>

  return (
    <Layout>
      <div className="page-container py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="section-title">{t('admin.title')}</h1>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
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
          {TABS.map(t_ => (
            <button
              key={t_.key}
              onClick={() => setTab(t_.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                tab === t_.key
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <t_.icon size={14} /> {t_.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && chartData.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Statistiques</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tw-bg-opacity)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Pending workers */}
        {tab === 'pending' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('admin.pendingWorkers')} ({pendingWorkers.length})
            </h2>
            {pendingWorkers.length === 0 ? (
              <div className="card p-10 text-center text-gray-400">{t('admin.noData')}</div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingWorkers.map((w, i) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card p-4 flex items-center justify-between gap-3 flex-wrap"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                        {(w.name || w.user?.name || 'W')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{w.name || w.user?.name || 'Worker'}</p>
                        <p className="text-xs text-gray-400">{w.profession}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approve(w.id)}
                        loading={actioning === w.id}
                        className="flex items-center gap-1 text-xs py-1.5 px-3"
                      >
                        <CheckCircle2 size={13} /> {t('admin.approve')}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => reject(w.id)}
                        loading={actioning === w.id}
                        className="flex items-center gap-1 text-xs py-1.5 px-3"
                      >
                        <XCircle size={13} /> {t('admin.reject')}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('admin.users')} ({users.length})
            </h2>
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
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {u.name || u.fullName}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{u.phone}</td>
                        <td className="px-4 py-3">
                          <Badge variant={u.role === 'WORKER' ? 'primary' : u.role === 'ADMIN' ? 'blue' : 'gray'}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
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

        {/* Tasks */}
        {tab === 'tasks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('admin.tasks')} ({tasks.length})
            </h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <th className="text-start px-4 py-3 font-medium text-gray-500">Titre</th>
                      <th className="text-start px-4 py-3 font-medium text-gray-500">Statut</th>
                      <th className="text-start px-4 py-3 font-medium text-gray-500">Date</th>
                      <th className="text-end px-4 py-3 font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {tasks.map(task => (
                      <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-xs truncate">
                          {task.title}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={{ OPEN: 'blue', COMPLETED: 'green', PENDING: 'yellow', CANCELLED: 'red' }[task.status] || 'gray'}>
                            {task.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-end">
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
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
      </div>
    </Layout>
  )
}
