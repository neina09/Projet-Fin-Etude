import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Briefcase } from 'lucide-react'
import { tasksApi } from '../../api/tasks'
import { useAuth } from '../../context/AuthContext'
import TaskCard from '../../components/tasks/TaskCard'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { Textarea, Select } from '../../components/ui/Input'
import { PageLoader } from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const STATUSES = ['ALL', 'OPEN', 'PENDING', 'IN_PROGRESS', 'COMPLETED']

export default function TasksPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', profession: '', location: '', budget: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    tasksApi.getAll()
      .then(r => setTasks(r.data?.content || r.data || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = tasks.filter(task => {
    const q = search.toLowerCase()
    const matchSearch = !q || task.title?.toLowerCase().includes(q) || task.description?.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'ALL' || task.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await tasksApi.create(form)
      setCreateOpen(false)
      setForm({ title: '', description: '', profession: '', location: '', budget: '' })
      load()
    } catch {}
    setSubmitting(false)
  }

  return (
    <Layout>
      <div className="page-container py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="section-title">{t('tasks.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('tasks.subtitle')}</p>
          </div>
          {user && (
            <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2">
              <Plus size={16} /> {t('tasks.create')}
            </Button>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('tasks.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base ps-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === s
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {s === 'ALL'
                  ? t('workers.filter.all')
                  : t(`tasks.status.${s.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase()).replace('_', '')}`) || s}
              </button>
            ))}
          </div>
        </motion.div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} {t('tasks.title').toLowerCase()}</p>

        {loading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Briefcase} title={t('tasks.empty')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((task, i) => <TaskCard key={task.id} task={task} index={i} />)}
          </div>
        )}

        {/* Create Task Modal */}
        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t('tasks.create')}>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Input label={t('tasks.form.title')} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            <Textarea label={t('tasks.form.description')} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <Input label={t('tasks.form.profession')} value={form.profession} onChange={e => setForm(f => ({ ...f, profession: e.target.value }))} />
            <Input label={t('tasks.form.location')} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <Input label={t('tasks.form.budget')} type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
            <div className="flex gap-2 mt-2">
              <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)} className="flex-1">{t('common.cancel')}</Button>
              <Button type="submit" loading={submitting} className="flex-1">{t('tasks.form.submit')}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  )
}
