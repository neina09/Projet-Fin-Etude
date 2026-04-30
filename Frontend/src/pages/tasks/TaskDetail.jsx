import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, Clock, Briefcase, ArrowLeft, CheckCircle2, User } from 'lucide-react'
import { tasksApi } from '../../api/tasks'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Input'
import { PageLoader } from '../../components/ui/Spinner'

const statusVariant = { PENDING: 'yellow', OPEN: 'blue', IN_PROGRESS: 'primary', COMPLETED: 'green', CANCELLED: 'red' }
const statusKey = { PENDING: 'pending', OPEN: 'open', IN_PROGRESS: 'inProgress', COMPLETED: 'completed', CANCELLED: 'cancelled' }

export default function TaskDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isWorker } = useAuth()
  const [task, setTask] = useState(null)
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [offerOpen, setOfferOpen] = useState(false)
  const [offerForm, setOfferForm] = useState({ price: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      const [taskRes, offersRes] = await Promise.all([
        tasksApi.getById(id),
        tasksApi.getOffers(id),
      ])
      setTask(taskRes.data)
      setOffers(offersRes.data || [])
    } catch {
      navigate('/tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleSubmitOffer = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setSubmitting(true)
    try {
      await tasksApi.submitOffer(id, offerForm)
      setOfferOpen(false)
      load()
    } catch {}
    setSubmitting(false)
  }

  const handleAcceptOffer = async (offerId) => {
    setSubmitting(true)
    try {
      await tasksApi.acceptOffer(id, offerId)
      load()
    } catch {}
    setSubmitting(false)
  }

  if (loading) return <Layout><PageLoader /></Layout>
  if (!task) return null

  const isOwner = user?.id === task.userId || user?.id === task.user?.id

  return (
    <Layout>
      <div className="page-container py-10 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors">
          <ArrowLeft size={16} className="rtl-flip" /> {t('common.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 flex flex-col gap-5">
            <div className="card p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
                <Badge variant={statusVariant[task.status] || 'gray'}>
                  {t(`tasks.status.${statusKey[task.status] || 'open'}`)}
                </Badge>
              </div>

              {task.description && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{task.description}</p>
              )}

              <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-500 dark:text-gray-400">
                {task.profession && <span className="flex items-center gap-1.5"><Briefcase size={14} />{task.profession}</span>}
                {task.location && <span className="flex items-center gap-1.5"><MapPin size={14} />{task.location}</span>}
                {task.createdAt && <span className="flex items-center gap-1.5"><Clock size={14} />{new Date(task.createdAt).toLocaleDateString()}</span>}
              </div>

              {task.budget && (
                <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <span className="text-primary-700 dark:text-primary-300 font-semibold">{task.budget} MRU</span>
                </div>
              )}
            </div>

            {/* Offers */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {t('tasks.offers.title')} ({offers.length})
                </h2>
                {isWorker && task.status === 'OPEN' && (
                  <Button size="sm" onClick={() => user ? setOfferOpen(true) : navigate('/login')}>
                    {t('tasks.offers.submit')}
                  </Button>
                )}
              </div>

              {offers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">{t('tasks.offers.noOffers')}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {offers.map(offer => (
                    <div key={offer.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <User size={14} className="text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {offer.workerName || offer.worker?.name || 'Worker'}
                            </p>
                            <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">{offer.price} MRU</p>
                          </div>
                        </div>
                        {isOwner && task.status === 'OPEN' && (
                          <Button
                            size="sm"
                            onClick={() => handleAcceptOffer(offer.id)}
                            loading={submitting}
                            className="text-xs py-1.5 px-3"
                          >
                            <CheckCircle2 size={13} /> {t('tasks.offers.accept')}
                          </Button>
                        )}
                        {offer.accepted && <Badge variant="green">{t('tasks.offers.accepted')}</Badge>}
                      </div>
                      {offer.message && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ms-10">{offer.message}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Info</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Offres</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{offers.length}</span>
                </div>
                {task.budget && (
                  <div className="flex justify-between">
                    <span>Budget</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">{task.budget} MRU</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Statut</span>
                  <Badge variant={statusVariant[task.status] || 'gray'} className="text-xs">
                    {t(`tasks.status.${statusKey[task.status] || 'open'}`)}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submit Offer Modal */}
        <Modal open={offerOpen} onClose={() => setOfferOpen(false)} title={t('tasks.offers.submit')}>
          <form onSubmit={handleSubmitOffer} className="flex flex-col gap-4">
            <Input label={t('tasks.offers.price')} type="number" value={offerForm.price} onChange={e => setOfferForm(f => ({ ...f, price: e.target.value }))} required />
            <Textarea label={t('tasks.offers.message')} value={offerForm.message} onChange={e => setOfferForm(f => ({ ...f, message: e.target.value }))} />
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setOfferOpen(false)} className="flex-1">{t('common.cancel')}</Button>
              <Button type="submit" loading={submitting} className="flex-1">{t('tasks.offers.submit')}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  )
}
