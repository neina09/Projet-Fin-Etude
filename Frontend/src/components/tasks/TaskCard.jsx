import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Briefcase, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Badge from '../ui/Badge'

const statusVariant = {
  PENDING:     'yellow',
  OPEN:        'blue',
  IN_PROGRESS: 'primary',
  COMPLETED:   'green',
  CANCELLED:   'red',
}

export default function TaskCard({ task, index = 0 }) {
  const { t } = useTranslation()

  const statusKey = {
    PENDING:     'pending',
    OPEN:        'open',
    IN_PROGRESS: 'inProgress',
    COMPLETED:   'completed',
    CANCELLED:   'cancelled',
  }[task.status] || 'open'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
          {task.title}
        </h3>
        <Badge variant={statusVariant[task.status] || 'gray'} className="flex-shrink-0">
          {t(`tasks.status.${statusKey}`)}
        </Badge>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
        {task.profession && (
          <span className="flex items-center gap-1">
            <Briefcase size={12} /> {task.profession}
          </span>
        )}
        {task.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {task.location}
          </span>
        )}
        {task.createdAt && (
          <span className="flex items-center gap-1">
            <Clock size={12} /> {new Date(task.createdAt).toLocaleDateString()}
          </span>
        )}
        {task.offersCount !== undefined && (
          <span className="flex items-center gap-1">
            <MessageSquare size={12} /> {task.offersCount} offres
          </span>
        )}
      </div>

      {task.budget && (
        <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
          {task.budget} MRU
        </div>
      )}

      <Link
        to={`/tasks/${task.id}`}
        className="mt-auto text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
      >
        {t('common.viewMore')} →
      </Link>
    </motion.div>
  )
}
