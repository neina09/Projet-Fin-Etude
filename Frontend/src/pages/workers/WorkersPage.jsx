import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, SlidersHorizontal, Users } from 'lucide-react'
import { workersApi } from '../../api/workers'
import WorkerCard from '../../components/workers/WorkerCard'
import Layout from '../../components/layout/Layout'
import { PageLoader } from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function WorkersPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterAvailable, setFilterAvailable] = useState(false)

  useEffect(() => {
    setLoading(true)
    workersApi.getAll()
      .then(r => setWorkers(r.data?.content || r.data || []))
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = workers.filter(w => {
    const name = (w.name || w.fullName || w.user?.name || '').toLowerCase()
    const prof = (w.profession || '').toLowerCase()
    const q = search.toLowerCase()
    const matchSearch = !q || name.includes(q) || prof.includes(q)
    const matchAvail = !filterAvailable || w.available || w.availability === 'AVAILABLE'
    return matchSearch && matchAvail
  })

  return (
    <Layout>
      <div className="page-container py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="section-title">{t('workers.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('workers.subtitle')}</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('workers.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base ps-10"
            />
          </div>
          <button
            onClick={() => setFilterAvailable(f => !f)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
              filterAvailable
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <SlidersHorizontal size={16} />
            {t('workers.filter.available')}
          </button>
        </motion.div>

        {/* Results count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {filtered.length} {t('workers.title').toLowerCase()}
        </p>

        {loading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title={t('workers.empty')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((w, i) => <WorkerCard key={w.id} worker={w} index={i} />)}
          </div>
        )}
      </div>
    </Layout>
  )
}
