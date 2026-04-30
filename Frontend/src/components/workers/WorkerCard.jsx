import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Star, CheckCircle2, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function WorkerCard({ worker, index = 0 }) {
  const { t } = useTranslation()
  const name = worker.name || worker.fullName || worker.user?.name || 'Worker'
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{name}</h3>
            {worker.verified && (
              <CheckCircle2 size={15} className="text-primary-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {worker.profession || worker.skills?.[0] || '—'}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {worker.rating?.toFixed(1) ?? '—'}
            </span>
          </div>
        </div>
        <Badge variant={worker.available || worker.availability === 'AVAILABLE' ? 'green' : 'gray'}>
          {worker.available || worker.availability === 'AVAILABLE'
            ? t('workers.card.available')
            : t('workers.card.busy')}
        </Badge>
      </div>

      {/* Info */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
        {worker.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {worker.location}
          </span>
        )}
        {(worker.salary || worker.dailyRate) && (
          <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
            {worker.salary || worker.dailyRate} MRU{t('common.perDay')}
          </span>
        )}
      </div>

      {/* Skills */}
      {worker.skills && worker.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {worker.skills.slice(0, 3).map((s, i) => (
            <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg">
              {s}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="text-xs text-gray-400">+{worker.skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2">
        <Link to={`/workers/${worker.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-sm py-2">
            {t('workers.card.viewProfile')}
          </Button>
        </Link>
        <Link to={`/workers/${worker.id}?book=1`} className="flex-1">
          <Button size="sm" className="w-full text-sm py-2">
            {t('workers.card.book')}
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
