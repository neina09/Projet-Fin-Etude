import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Briefcase, CalendarCheck, Plus, User, Clock, CheckCircle2 } from 'lucide-react'
import { tasksApi } from '../../api/tasks'
import { bookingsApi } from '../../api/bookings'
import { authApi } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import { PageLoader } from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'

const statusVariant = { PENDING: 'yellow', OPEN: 'blue', IN_PROGRESS: 'primary', COMPLETED: 'green', CANCELLED: 'red', CONFIRMED: 'green' }

export default function UserDashboard() {
  const { t } = useTranslation()
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('tasks')
  const [tasks, setTasks] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.name || user?.fullName || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      tasksApi.getMy().then(r => setTasks(r.data?.content || r.data || [])).catch(() => {}),
      bookingsApi.getMy().then(r => setBookings(r.data?.content || r.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authApi.updateProfile(profileForm)
      await refreshProfile()
      setProfileOpen(false)
    } catch {}
    setSaving(false)
  }

  const stats = [
    { icon: Briefcase, label: t('dashboard.stats.tasks'), value: tasks.length, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { icon: CalendarCheck, label: t('dashboard.stats.bookings'), value: bookings.length, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
    { icon: Clock, label: t('tasks.status.pending'), value: tasks.filter(t => t.status === 'PENDING').length, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  ]

  if (loading) return <Layout><PageLoader /></Layout>

  return (
    <Layout>
      <div className="page-container py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="section-title">{t('dashboard.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t('dashboard.welcome')}, <span className="font-semibold text-gray-900 dark:text-white">{user?.name || user?.fullName}</span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => setProfileOpen(true)} className="flex items-center gap-2">
              <User size={15} /> {t('dashboard.profile')}
            </Button>
            <Link to="/tasks">
              <Button className="flex items-center gap-2">
                <Plus size={15} /> {t('tasks.create')}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-6">
          {['tasks', 'bookings'].map(t_ => (
            <button
              key={t_}
              onClick={() => setTab(t_)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t_
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t_ === 'tasks' ? t('dashboard.myTasks') : t('dashboard.myBookings')}
            </button>
          ))}
        </div>

        {/* Tasks Tab */}
        {tab === 'tasks' && (
          <div className="flex flex-col gap-3">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Briefcase size={36} className="mx-auto mb-3 opacity-40" />
                <p>{t('tasks.empty')}</p>
                <Link to="/tasks" className="mt-3 inline-block">
                  <Button size="sm" className="mt-3">{t('tasks.create')}</Button>
                </Link>
              </div>
            ) : (
              tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{task.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={statusVariant[task.status] || 'gray'}>
                      {task.status?.toLowerCase()}
                    </Badge>
                    <Link to={`/tasks/${task.id}`} className="text-xs text-primary-600 hover:underline">{t('common.viewMore')}</Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div className="flex flex-col gap-3">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <CalendarCheck size={36} className="mx-auto mb-3 opacity-40" />
                <p>{t('bookings.empty')}</p>
              </div>
            ) : (
              bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {b.workerName || b.worker?.name || 'Travailleur'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{b.date || new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={statusVariant[b.status] || 'gray'}>{b.status?.toLowerCase()}</Badge>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Profile Modal */}
        <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title={t('profile.title')}>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <Input label={t('profile.name')} value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
            <Input label={t('profile.phone')} type="tel" value={profileForm.phone} readOnly className="opacity-60 cursor-not-allowed" />
            <Button type="submit" loading={saving} className="w-full">{t('profile.update')}</Button>
          </form>
        </Modal>
      </div>
    </Layout>
  )
}
