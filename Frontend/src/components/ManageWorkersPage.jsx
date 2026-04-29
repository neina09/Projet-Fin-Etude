import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Briefcase,
  Eye,
  IdCard,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  X
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import {
  adminCreateWorker,
  deleteWorkerProfile,
  fetchWorkerIdentityDocumentPreview,
  getAllUsers,
  getManagedWorkerById,
  getManageWorkers,
  getWorkerRatings,
  resolveAssetUrl,
  updateWorkerProfile,
  uploadIdentityDocument,
  uploadWorkerImage
} from "../api"
import { combineIdentityFiles } from "../utils/imageFiles"
import { useLanguage } from "../i18n/LanguageContext"

const EMPTY_FORM = {
  name: "",
  phoneNumber: "",
  job: "",
  address: "",
  salary: "",
  nationalIdNumber: ""
}

const NAME_REGEX = /^[\p{L}\s]{1,15}$/u
const NATIONAL_ID_REGEX = /^\d{10}$/

const normalizeWorkerErrorMessage = (message = "") => {
  const lower = String(message).toLowerCase()

  if (lower.includes("name must contain letters only")) {
    return "اسم العامل يجب أن يحتوي على حروف فقط وألا يتجاوز 15 حرفًا."
  }

  if (lower.includes("conflicts with existing data")) {
    return "هذه البيانات تتعارض مع بيانات عامل موجود بالفعل. تحقق من الاسم أو الهاتف أو رقم البطاقة."
  }

  return message
}

const isNumericLike = (value) => /^\d+$/.test(String(value || "").trim())

const getVerificationBadge = (status) => {
  if (status === "VERIFIED") return { className: "badge-green", label: "موثق" }
  if (status === "REJECTED") return { className: "badge-red", label: "مرفوض" }
  return { className: "badge-amber", label: "معلّق" }
}

function WorkerFormModal({ mode, worker, users, usersLoading, onClose, onSubmit }) {
  const [selectedUserId, setSelectedUserId] = useState("")
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [workerImageFile, setWorkerImageFile] = useState(null)
  const [identityFrontFile, setIdentityFrontFile] = useState(null)
  const [identityBackFile, setIdentityBackFile] = useState(null)

  useEffect(() => {
    if (mode === "edit" && worker) {
      setForm({
        name: worker.name || "",
        phoneNumber: worker.phoneNumber || "",
        job: worker.job || "",
        address: worker.address || "",
        salary: worker.salary != null ? String(worker.salary) : "",
        nationalIdNumber: worker.nationalIdNumber || ""
      })
      setSelectedUserId(String(worker.userId || ""))
      setWorkerImageFile(null)
      setIdentityFrontFile(null)
      setIdentityBackFile(null)
      return
    }

    setForm(EMPTY_FORM)
    setSelectedUserId("")
    setWorkerImageFile(null)
    setIdentityFrontFile(null)
    setIdentityBackFile(null)
  }, [mode, worker])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!form.name.trim() || !form.phoneNumber.trim() || !form.job.trim() || !form.address.trim() || !form.nationalIdNumber.trim()) {
      setError("يرجى إدخال جميع البيانات المطلوبة.")
      return
    }

    if (!NAME_REGEX.test(form.name.trim())) {
      setError("اسم العامل يجب أن يحتوي على حروف فقط وألا يتجاوز 15 حرفًا.")
      return
    }

    if (!NATIONAL_ID_REGEX.test(form.nationalIdNumber.trim())) {
      setError("رقم البطاقة يجب أن يتكون من 10 أرقام.")
      return
    }

    const salary = Number(form.salary || 0)
    if (!Number.isFinite(salary) || salary < 0) {
      setError("يرجى إدخال قيمة صحيحة للسعر أو الراتب.")
      return
    }

    if (mode === "create" && !selectedUserId) {
      setError("يرجى اختيار الحساب المرتبط بالعامل.")
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        selectedUserId: selectedUserId ? Number(selectedUserId) : undefined,
        payload: {
          name: form.name.trim(),
          phoneNumber: form.phoneNumber.trim(),
          job: form.job.trim(),
          address: form.address.trim(),
          salary,
          nationalIdNumber: form.nationalIdNumber.trim()
        },
        workerImageFile,
        identityFrontFile,
        identityBackFile
      })
      onClose()
    } catch (submitError) {
      setError(normalizeWorkerErrorMessage(submitError.message || "تعذر حفظ بيانات العامل."))
    } finally {
      setSubmitting(false)
    }
  }

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="modal-box max-w-2xl"
        dir="rtl"
      >
        <div className="flex items-center justify-between bg-primary px-8 py-6 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">إدارة العمال</p>
            <h2 className="mt-1 text-2xl font-black">{mode === "create" ? "إضافة عامل جديد" : "تعديل بيانات العامل"}</h2>
          </div>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "create" && (
              <div>
                <label className="mb-2 block text-xs font-black text-slate-500">الحساب المرتبط</label>
                {usersLoading ? (
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                    <Loader2 size={16} className="animate-spin" />
                    جاري تحميل المستخدمين...
                  </div>
                ) : (
                  <select
                    value={selectedUserId}
                    onChange={(event) => setSelectedUserId(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">-- اختر مستخدمًا --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.phone || user.phoneNumber || "بدون هاتف"})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ["name", "الاسم الكامل"],
                ["phoneNumber", "هاتف العامل"],
                ["job", "المهنة"],
                ["address", "العنوان"],
                ["nationalIdNumber", "رقم البطاقة"],
                ["salary", "السعر أو الراتب"]
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="mb-2 block text-xs font-black text-slate-500">{label}</label>
                  <input
                    type={key === "salary" ? "number" : "text"}
                    min={key === "salary" ? 0 : undefined}
                    maxLength={key === "name" ? 15 : key === "nationalIdNumber" ? 10 : undefined}
                    dir={key === "phoneNumber" || key === "nationalIdNumber" || key === "salary" ? "ltr" : undefined}
                    value={form[key]}
                    onChange={(event) => setField(key, event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-sm font-black text-slate-900">الصورة الشخصية</h3>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition-all hover:border-blue-400">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setWorkerImageFile(event.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                  {workerImageFile ? (
                    <img src={URL.createObjectURL(workerImageFile)} alt="Worker preview" className="h-full w-full object-cover" />
                  ) : worker?.imageUrl ? (
                    <img src={resolveAssetUrl(worker.imageUrl)} alt={worker.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserRound size={28} className="text-slate-300" />
                  )}
                </div>
                <span className="text-sm font-black text-slate-900">اختيار صورة العامل</span>
                <span className="mt-1 text-xs font-bold text-slate-400">{mode === "create" ? "اختياري" : "يمكن استبدال الصورة الحالية"}</span>
              </label>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-black text-slate-900">صورة البطاقة</h3>
                {mode === "edit" && worker?.identityDocumentUrl && !identityFrontFile && !identityBackFile && (
                  <span className="text-xs font-bold text-emerald-600">البطاقة الحالية موجودة</span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-white text-center transition-all hover:border-blue-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setIdentityFrontFile(event.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {identityFrontFile ? (
                    <img src={URL.createObjectURL(identityFrontFile)} alt="Front ID preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="px-4">
                      <p className="text-sm font-black text-slate-900">الوجه الأمامي</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">اختر صورة أمامية</p>
                    </div>
                  )}
                </label>

                <label className="relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-white text-center transition-all hover:border-blue-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setIdentityBackFile(event.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {identityBackFile ? (
                    <img src={URL.createObjectURL(identityBackFile)} alt="Back ID preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="px-4">
                      <p className="text-sm font-black text-slate-900">الوجه الخلفي</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">اختر صورة خلفية</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : mode === "create" ? <Plus size={18} /> : <Pencil size={18} />}
              {submitting ? "جارٍ الحفظ..." : mode === "create" ? "إضافة العامل" : "حفظ التعديلات"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

function WorkerDetailsModal({ worker, onClose, onEdit, onDelete }) {
  const [ratings, setRatings] = useState([])
  const [identityPreview, setIdentityPreview] = useState(null)
  const [identityLoading, setIdentityLoading] = useState(false)
  const [identityError, setIdentityError] = useState("")
  const previewUrlRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const revoke = () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
    }

    revoke()
    setRatings([])
    setIdentityPreview(null)
    setIdentityError("")
    setIdentityLoading(false)

    if (!worker) return undefined

    getWorkerRatings(worker.id)
      .then((result) => {
        if (!cancelled) setRatings(Array.isArray(result) ? result : [])
      })
      .catch(() => {
        if (!cancelled) setRatings([])
      })

    if (worker?.id) {
      setIdentityLoading(true)
      fetchWorkerIdentityDocumentPreview(worker.id)
        .then(({ objectUrl, mediaType }) => {
          if (cancelled) {
            URL.revokeObjectURL(objectUrl)
            return
          }
          previewUrlRef.current = objectUrl
          setIdentityPreview({ objectUrl, mediaType })
        })
        .catch((loadError) => {
          if (!cancelled) {
            setIdentityPreview(null)
            setIdentityError("")
          }
        })
        .finally(() => {
          if (!cancelled) setIdentityLoading(false)
        })
    }

    return () => {
      cancelled = true
      revoke()
    }
  }, [worker])

  if (!worker) return null

  const accountValue = worker.username || worker.userName || "غير متوفر"
  const accountLabel = isNumericLike(accountValue) ? "رقم الدخول" : "اسم الحساب"
  const accountDisplay = isNumericLike(accountValue) ? accountValue : `@${accountValue}`
  const hasIdentityPreview = Boolean(identityPreview?.objectUrl)

  const infoCards = [
    { icon: UserRound, label: "الاسم", value: worker.name || "غير متوفر" },
    { icon: UserRound, label: accountLabel, value: accountValue },
    { icon: Briefcase, label: "المهنة", value: worker.job || "غير متوفر" },
    { icon: Phone, label: "هاتف العامل", value: worker.phoneNumber || "غير متوفر", ltr: true },
    { icon: Phone, label: "هاتف الدخول", value: worker.userPhone || worker.phone || "غير متوفر", ltr: true },
    { icon: MapPin, label: "العنوان", value: worker.address || "غير متوفر" },
    { icon: IdCard, label: "رقم البطاقة", value: worker.nationalIdNumber || "لم يتم تسجيله", ltr: true },
    { icon: Star, label: "التقييم", value: Number(worker.averageRating || 0).toFixed(1) },
    { icon: ShieldCheck, label: "حالة التوثيق", value: worker.verificationStatus || "PENDING", ltr: true }
  ]

  const badge = getVerificationBadge(worker.verificationStatus)

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="modal-box max-w-3xl"
        dir="rtl"
      >
        <div className="flex items-center justify-between bg-primary px-8 py-6 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">ملف العامل</p>
            <h2 className="mt-2 text-2xl font-black">{worker.name}</h2>
          </div>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-8">
          <div className="flex flex-col gap-5 rounded-[2rem] border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {worker.imageUrl ? (
                <img src={resolveAssetUrl(worker.imageUrl)} alt={worker.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <UserRound size={30} />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-900">{worker.name}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">{worker.job || "عامل"}</p>
              <p className="mt-1 text-xs font-black text-blue-600">{accountDisplay}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`badge ${badge.className}`}>{badge.label}</span>
                <span className={`badge ${worker.available ? "badge-green" : "badge-secondary"}`}>
                  {worker.available ? "متاح" : "غير متاح"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {infoCards.map(({ icon: Icon, label, value, ltr }) => (
              <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <Icon size={15} />
                  <span className="text-xs font-black">{label}</span>
                </div>
                <p className="text-sm font-black text-slate-900" dir={ltr ? "ltr" : undefined}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {(identityLoading || hasIdentityPreview || worker.identityDocumentUrl || worker.verificationStatus === "VERIFIED") && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <h4 className="mb-4 text-sm font-black text-slate-900">صورة البطاقة</h4>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {identityLoading && (
                  <div className="flex min-h-[220px] items-center justify-center text-sm font-bold text-slate-400">
                    جاري تحميل صورة البطاقة...
                  </div>
                )}
                {!identityLoading && !identityError && hasIdentityPreview && (
                  String(identityPreview.mediaType || "").includes("pdf") ? (
                    <iframe title="وثيقة الهوية" src={identityPreview.objectUrl} className="h-[28rem] w-full bg-white" />
                  ) : (
                    <img src={identityPreview.objectUrl} alt="وثيقة الهوية" className="max-h-[28rem] w-full object-contain p-2" />
                  )
                )}
                {!identityLoading && !hasIdentityPreview && (
                  <div className="flex min-h-[160px] items-center justify-center p-6 text-center text-sm font-bold text-slate-400">
                    لا توجد صورة بطاقة متاحة لهذا العامل حالياً.
                  </div>
                )}
              </div>
            </div>
          )}

          {ratings.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900">آخر التقييمات</h4>
                <span className="text-xs font-bold text-slate-400">{ratings.length} تقييم</span>
              </div>
              <div className="space-y-3">
                {ratings.slice(0, 3).map((rating) => (
                  <div key={rating.id} className="rounded-xl border border-slate-100 bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">{rating.userName || "عميل"}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black">{rating.stars}</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-500">{rating.comment || "لا يوجد تعليق."}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50 px-8 py-6">
          <button onClick={() => onEdit(worker)} className="btn btn-secondary btn-md gap-2">
            <Pencil size={16} />
            تعديل
          </button>
          <button onClick={() => onDelete(worker)} className="btn btn-secondary btn-md gap-2 text-red-600 hover:bg-red-50">
            <Trash2 size={16} />
            حذف
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ManageWorkersPage() {
  const { dir } = useLanguage()
  const [workers, setWorkers] = useState([])
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [editingWorker, setEditingWorker] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const loadUsers = useCallback(async () => {
    setUsersLoading(true)
    try {
      const payload = await getAllUsers()
      const list = Array.isArray(payload) ? payload : []
      setUsers(list.filter((item) => item.role !== "ADMIN" && item.role !== "WORKER"))
    } catch {
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }, [])

  const loadWorkers = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      setWorkers(await getManageWorkers())
    } catch (loadError) {
      setError(loadError.message || "تعذر تحميل بيانات العمال.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWorkers()
    loadUsers()
  }, [loadUsers, loadWorkers])

  const verifiedWorkers = useMemo(
    () => workers.filter((worker) => String(worker.verificationStatus || "").toUpperCase() === "VERIFIED"),
    [workers]
  )

  const filteredWorkers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return verifiedWorkers

    return verifiedWorkers.filter((worker) =>
      [worker.name, worker.username, worker.userName, worker.job, worker.address, worker.phoneNumber, worker.userPhone, worker.phone, worker.nationalIdNumber]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [search, verifiedWorkers])

  const hydrateWorker = useCallback(async (worker) => {
    if (!worker?.id) return worker

    try {
      const freshWorker = await getManagedWorkerById(worker.id)
      const mergedFreshWorker = Object.fromEntries(
        Object.entries(freshWorker || {}).filter(([, value]) => {
          if (value === undefined || value === null) return false
          if (typeof value === "string" && value.trim() === "") return false
          return true
        })
      )

      return {
        ...worker,
        ...mergedFreshWorker,
        identityDocumentUrl: freshWorker?.identityDocumentUrl || worker?.identityDocumentUrl,
        nationalIdNumber: freshWorker?.nationalIdNumber || worker?.nationalIdNumber,
        name: freshWorker?.name || worker?.name,
        username: freshWorker?.username || worker?.username,
        userName: freshWorker?.userName || worker?.userName,
        phoneNumber: freshWorker?.phoneNumber || worker?.phoneNumber,
        address: freshWorker?.address || worker?.address
      }
    } catch {
      return worker
    }
  }, [])

  const openWorkerDetails = useCallback(async (worker) => {
    setError("")
    setSelectedWorker(await hydrateWorker(worker))
  }, [hydrateWorker])

  const openEditWorker = useCallback(async (worker) => {
    setError("")
    setEditingWorker(await hydrateWorker(worker))
  }, [hydrateWorker])

  const handleCreateWorker = async ({ selectedUserId, payload, workerImageFile, identityFrontFile, identityBackFile }) => {
    const createdWorker = await adminCreateWorker(selectedUserId, payload)
    const workerId = createdWorker?.id || createdWorker?.workerId

    if (workerId && workerImageFile) {
      await uploadWorkerImage(workerId, workerImageFile)
    }

    if (workerId) {
      const identityFile = await combineIdentityFiles(identityFrontFile, identityBackFile)
      if (identityFile) {
        await uploadIdentityDocument(workerId, identityFile)
      }
    }

    await loadWorkers()
  }

  const handleEditWorker = async ({ payload, workerImageFile, identityFrontFile, identityBackFile }) => {
    await updateWorkerProfile(editingWorker.id, payload)

    if (workerImageFile) {
      await uploadWorkerImage(editingWorker.id, workerImageFile)
    }

    const identityFile = await combineIdentityFiles(identityFrontFile, identityBackFile)
    if (identityFile) {
      await uploadIdentityDocument(editingWorker.id, identityFile)
    }

    setEditingWorker(null)
    setSelectedWorker(null)
    await loadWorkers()
  }

  const handleDeleteWorker = async (worker) => {
    const confirmed = window.confirm(`هل تريد حذف العامل "${worker.name}"؟`)
    if (!confirmed) return

    try {
      await deleteWorkerProfile(worker.id)
      setWorkers((current) => current.filter((item) => item.id !== worker.id))
      setSelectedWorker(null)
      setEditingWorker((current) => (current?.id === worker.id ? null : current))
      setError("")
      loadWorkers()
    } catch (deleteError) {
      setError(normalizeWorkerErrorMessage(deleteError.message || "تعذر حذف العامل."))
    }
  }

  return (
    <div className="space-y-8" dir={dir}>
      <section className="app-page-header mt-2">
        <div className="app-page-header-row">
          <div>
            <span className="app-page-eyebrow">لوحة الإدارة</span>
            <h1 className="app-page-title mt-4">إدارة العمال</h1>
            <p className="app-page-subtitle">
              شاهد كل العمال بكل حالاتهم، وابحث في بيانات التسجيل، واطلع على اسم الحساب المرتبط وصورة البطاقة، ثم عدل أو احذف أو أضف عاملًا جديدًا.
            </p>
          </div>

          <button onClick={() => setShowCreate(true)} className="btn btn-primary btn-md gap-2">
            <Plus size={18} />
            إضافة عامل
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          {normalizeWorkerErrorMessage(error)}
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث بالاسم، اسم الحساب، المهنة، العنوان، الهاتف أو رقم البطاقة"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-12 pl-4 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-100 bg-white shadow-sm">
          <Loader2 size={28} className="animate-spin text-blue-600" />
          <p className="text-sm font-bold text-slate-500">جاري تحميل بيانات العمال...</p>
        </div>
      ) : filteredWorkers.length ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredWorkers.map((worker) => {
            const badge = getVerificationBadge(worker.verificationStatus)

            return (
              <div key={worker.id} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    {worker.imageUrl ? (
                      <img src={resolveAssetUrl(worker.imageUrl)} alt={worker.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <UserRound size={24} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black text-slate-900">{worker.name || "عامل"}</h3>
                        <p className="mt-1 truncate text-sm font-bold text-slate-500">{worker.job || "غير محددة"}</p>
                      </div>
                      <span className={`badge ${badge.className}`}>{badge.label}</span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs font-bold text-slate-500">
                      <p className="flex items-center gap-2"><MapPin size={12} /> {worker.address || "غير متوفر"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  <button onClick={() => openWorkerDetails(worker)} className="btn btn-secondary btn-sm gap-1.5">
                    <Eye size={14} />
                    عرض
                  </button>
                  <button onClick={() => openEditWorker(worker)} className="btn btn-secondary btn-sm gap-1.5">
                    <Pencil size={14} />
                    تعديل
                  </button>
                  <button onClick={() => handleDeleteWorker(worker)} className="btn btn-secondary btn-sm gap-1.5 text-red-600 hover:bg-red-50">
                    <Trash2 size={14} />
                    حذف
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center">
          <p className="text-sm font-bold text-slate-400">لا يوجد عمال مطابقون للبحث الحالي.</p>
        </div>
      )}

      <AnimatePresence>
        {selectedWorker && (
          <WorkerDetailsModal
            worker={selectedWorker}
            onClose={() => setSelectedWorker(null)}
            onEdit={(activeWorker) => {
              setSelectedWorker(null)
              openEditWorker(activeWorker)
            }}
            onDelete={handleDeleteWorker}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreate && (
          <WorkerFormModal
            mode="create"
            users={users}
            usersLoading={usersLoading}
            onClose={() => setShowCreate(false)}
            onSubmit={handleCreateWorker}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingWorker && (
          <WorkerFormModal
            mode="edit"
            worker={editingWorker}
            users={users}
            usersLoading={usersLoading}
            onClose={() => setEditingWorker(null)}
            onSubmit={handleEditWorker}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
