import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Shield } from 'lucide-react'
import { authApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'
import Input from '../components/ui/Input'
import { Textarea } from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function BecomeWorker() {
  const { t } = useTranslation()
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ profession: '', bio: '', location: '', salary: '', skills: '', idDocument: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setLoading(true)
    setError('')
    try {
      const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
      await authApi.becomeWorker({ ...form, skills })
      await refreshProfile()
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || t('errors.serverError'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Layout>
        <div className="page-container py-20 flex flex-col items-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('becomeWorker.success')}</h1>
          <p className="text-gray-500 mb-6">{t('becomeWorker.pending')}</p>
          <Button onClick={() => navigate('/dashboard')}>{t('nav.dashboard')}</Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-container py-10 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="section-title">{t('becomeWorker.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('becomeWorker.subtitle')}</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label={t('becomeWorker.form.profession')}
                placeholder="Plombier, Électricien, Charpentier..."
                value={form.profession}
                onChange={set('profession')}
                required
              />
              <Input
                label={t('becomeWorker.form.skills')}
                placeholder="Plomberie, Soudure, Réparation..."
                value={form.skills}
                onChange={set('skills')}
              />
              <Textarea
                label={t('becomeWorker.form.bio')}
                placeholder="Décrivez votre expérience et vos compétences..."
                value={form.bio}
                onChange={set('bio')}
                rows={4}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('becomeWorker.form.location')}
                  placeholder="Nouakchott, Mauritanie"
                  value={form.location}
                  onChange={set('location')}
                />
                <Input
                  label={t('becomeWorker.form.salary')}
                  type="number"
                  placeholder="500"
                  value={form.salary}
                  onChange={set('salary')}
                />
              </div>
              <Input
                label={t('becomeWorker.form.idDocument')}
                placeholder="Numéro CNI / Passeport"
                value={form.idDocument}
                onChange={set('idDocument')}
              />

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
              )}

              <Button type="submit" loading={loading} className="w-full">
                {t('becomeWorker.form.submit')}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
