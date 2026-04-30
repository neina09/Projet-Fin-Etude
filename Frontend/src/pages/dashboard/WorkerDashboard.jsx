import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Star, CalendarCheck, Briefcase, ToggleLeft, ToggleRight } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import { workersApi } from '../../api/workers'
import { authApi } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import { Textarea, Select } from '../../components/ui/Input'
import { PageLoader } from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import StarRating from '../../components/ui/StarRating'

export default function WorkerDashboard() {
  const { t } = useTranslation()
  const { user, refreshProfile } = useAuth()
  const [tab, setTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    profession: '', bio: '', location: '', salary: '', skills: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    bookingsApi.getWorker()
      .then(r => setBookings(r.data?.content || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleAvailability = async () => {
    const newStatus = available ? 'BUSY' : 'AVAILABLE'
    try {
      await workersApi.updateAvailability(newStatus)
      setAvailable(!available)
    } catch {}
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const skills = profileForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      await workersApi.updateProfile({ ...profileForm, skills })
      await refreshProfile()
      setProfileOpen(false)
    } catch {}
    setSaving(false)
  }

  const stats = [
    { icon: Star, label: t('workerDashboard.stats.rating'), value: user?.rating?.toFixed(1) ?? '—', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { icon: CalendarCheck, label: t('workerDashboard.stats.jobs'), value: bookings.filter(b => b.status === 'COMPLETED').length, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
    { icon: Briefcase, label: t('workerDashboard.stats.pending'), value: bookings.filter(b => b.status === 'PENDING').length, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  ]

  if (loading) return <Layout><PageLoader /></Layout>

  return (
    <Layout>
      <div className="page-container py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="section-title">{t('workerDashboard.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{user?.name || user?.fullName}</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {/* Availability toggle */}
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                available
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-700 text-gray-500'
              }`}
            >
              {available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              {available ? t('workerDashboard.available') : t('workerDashboard.busy')}
            </button>
            <Button variant="secondary" onClick={() => setProfileOpen(true)}>
              {t('workerDashboard.profile')}
            </Button>
            <Link to="/tasks">
              <Button>{t('tasks.title')}</Button>
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

        {/* Bookings list */}
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{t('workerDashboard.myBookings')}</h2>
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
                    {b.clientName || b.user?.name || 'Client'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{b.date || new Date(b.createdAt).toLocaleDateString()}</p>
                  {b.description && <p className="text-xs text-gray-500 mt-1 truncate">{b.description}</p>}
                </div>
                <Badge variant={{ PENDING: 'yellow', CONFIRMED: 'green', COMPLETED: 'primary', CANCELLED: 'red' }[b.status] || 'gray'}>
                  {b.status?.toLowerCase()}
                </Badge>
              </motion.div>
            ))
          )}
        </div>

        {/* Profile Modal */}
        <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title={t('workerDashboard.profile')}>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <Input label={t('becomeWorker.form.profession')} value={profileForm.profession} onChange={e => setProfileForm(f => ({ ...f, profession: e.target.value }))} />
            <Input label={t('becomeWorker.form.location')} value={profileForm.location} onChange={e => setProfileForm(f => ({ ...f, location: e.target.value }))} />
            <Input label={t('becomeWorker.form.salary')} type="number" value={profileForm.salary} onChange={e => setProfileForm(f => ({ ...f, salary: e.target.value }))} />
            <Input label={t('becomeWorker.form.skills')} value={profileForm.skills} onChange={e => setProfileForm(f => ({ ...f, skills: e.target.value }))} placeholder="Plomberie, Soudure, ..." />
            <Textarea label={t('becomeWorker.form.bio')} value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} />
            <Button type="submit" loading={saving} className="w-full">{t('common.save')}</Button>
          </form>
        </Modal>
      </div>
    </Layout>
  )
}
