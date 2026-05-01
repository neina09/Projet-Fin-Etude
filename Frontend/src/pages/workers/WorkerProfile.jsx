import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, Star, CheckCircle2, Calendar, ArrowLeft, Briefcase, Images } from 'lucide-react'
import { workersApi } from '../../api/workers'
import { bookingsApi } from '../../api/bookings'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import StarRating from '../../components/ui/StarRating'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Input'
import { PageLoader } from '../../components/ui/Spinner'

export default function WorkerProfile() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(searchParams.get('book') === '1')
  const [rateOpen, setRateOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [bookingForm, setBookingForm] = useState({ date: '', description: '' })
  const [rateForm, setRateForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    workersApi.getById(id)
      .then(r => setWorker(r.data))
      .catch(() => navigate('/workers'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setSubmitting(true)
    try {
      await bookingsApi.create({ workerId: id, ...bookingForm })
      setBookingOpen(false)
      setSuccessMsg(t('common.success'))
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {}
    setSubmitting(false)
  }

  const handleRate = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setSubmitting(true)
    try {
      await workersApi.rate(id, rateForm)
      setRateOpen(false)
      const res = await workersApi.getById(id)
      setWorker(res.data)
    } catch {}
    setSubmitting(false)
  }

  if (loading) return <Layout><PageLoader /></Layout>
  if (!worker) return null

  const name = worker.name || worker.fullName || worker.user?.name || 'Worker'
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const isAvail = worker.available || worker.availability === 'AVAILABLE'
  const isOwner = user && (String(user.id) === String(id) || String(user.workerId) === String(id))
  const canRate = user && !isOwner

  return (
    <Layout>
      <div className="page-container py-10 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors">
          <ArrowLeft size={16} className="rtl-flip" /> {t('common.back')}
        </button>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-sm"
          >
            {successMsg}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 flex flex-col gap-4">
            <div className="card p-6 text-center">
              {/* Profile picture */}
              {worker.profilePictureUrl ? (
                <img
                  src={worker.profilePictureUrl}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-primary-100 dark:border-primary-900 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-md">
                  {initials}
                </div>
              )}

              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                {name}
                {worker.verified && <CheckCircle2 size={17} className="text-primary-500" />}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{worker.profession}</p>

              <div className="flex items-center justify-center gap-1 mt-2">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-900 dark:text-white">{worker.rating?.toFixed(1) ?? '—'}</span>
              </div>

              <Badge className="mt-3" variant={isAvail ? 'green' : 'gray'}>
                {isAvail ? t('workers.card.available') : t('workers.card.busy')}
              </Badge>

              <div className="flex flex-col gap-2 mt-6">
                <Button onClick={() => user ? setBookingOpen(true) : navigate('/login')} className="w-full">
                  {t('workers.profile.book')}
                </Button>
                {canRate && (
                  <Button variant="outline" onClick={() => setRateOpen(true)} className="w-full">
                    {t('workers.profile.rate')}
                  </Button>
                )}
              </div>
            </div>

            <div className="card p-5 flex flex-col gap-3 text-sm">
              {worker.location && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin size={15} className="text-primary-500" />
                  <span>{worker.location}</span>
                </div>
              )}
              {(worker.salary || worker.dailyRate) && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Briefcase size={15} className="text-primary-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {worker.salary || worker.dailyRate} MRU{t('common.perDay')}
                  </span>
                </div>
              )}
              {worker.createdAt && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar size={15} className="text-primary-500" />
                  <span>{t('workers.profile.joinedDate')}: {new Date(worker.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 flex flex-col gap-4">
            {worker.bio && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Bio</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{worker.bio}</p>
              </div>
            )}

            {worker.skills?.length > 0 && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">{t('workers.profile.skills')}</h2>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio photos */}
            {worker.portfolioPhotos?.length > 0 ? (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Images size={16} className="text-primary-500" />
                  {t('worker.portfolio')}
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {worker.portfolioPhotos.map((url, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => setLightboxSrc(url)}
                      className="aspect-square rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <img src={url} alt={`portfolio-${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-5 text-center text-sm text-gray-400 dark:text-gray-500">
                <Images size={28} className="mx-auto mb-2 opacity-40" />
                {t('worker.noPortfolio')}
              </div>
            )}

            {worker.reviews?.length > 0 && (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{t('workers.profile.reviews')}</h2>
                <div className="flex flex-col gap-4">
                  {worker.reviews.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{r.reviewerName || 'Anonyme'}</span>
                        <StarRating value={r.rating} readOnly size={14} />
                      </div>
                      {r.comment && <p className="text-sm text-gray-500 dark:text-gray-400">{r.comment}</p>}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxSrc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxSrc(null)}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
            >
              <motion.img
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                src={lightboxSrc}
                alt="portfolio"
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
                onClick={e => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Modal */}
        <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title={t('bookings.create')}>
          <form onSubmit={handleBook} className="flex flex-col gap-4">
            <Input label={t('bookings.form.date')} type="date" value={bookingForm.date} onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))} required />
            <Textarea label={t('bookings.form.description')} value={bookingForm.description} onChange={e => setBookingForm(f => ({ ...f, description: e.target.value }))} />
            <div className="flex gap-2 mt-2">
              <Button type="button" variant="secondary" onClick={() => setBookingOpen(false)} className="flex-1">{t('common.cancel')}</Button>
              <Button type="submit" loading={submitting} className="flex-1">{t('bookings.form.submit')}</Button>
            </div>
          </form>
        </Modal>

        {/* Rate Modal */}
        <Modal open={rateOpen} onClose={() => setRateOpen(false)} title={t('workers.profile.rate')}>
          <form onSubmit={handleRate} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">{t('common.stars')}</label>
              <StarRating value={rateForm.rating} onChange={v => setRateForm(f => ({ ...f, rating: v }))} />
            </div>
            <Textarea label="Commentaire" value={rateForm.comment} onChange={e => setRateForm(f => ({ ...f, comment: e.target.value }))} />
            <Button type="submit" loading={submitting} className="w-full">{t('common.save')}</Button>
          </form>
        </Modal>
      </div>
    </Layout>
  )
}
