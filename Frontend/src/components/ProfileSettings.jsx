import React, { useCallback, useEffect, useMemo, useState } from "react"
import { CheckCircle2, FileBadge2, KeyRound, Phone, Save, ShieldAlert, Star, Trash2, Upload, User, Wrench, X } from "lucide-react"
import {
  changePassword,
  createRating,
  deleteAccount,
  getMyBookingRequests,
  getMyBookings,
  getWorkerRatings,
  updateBookingStatus,
  updateProfile,
  getMyWorkerProfile,
  updateWorkerAvailability,
  updateWorkerProfile,
  resolveAssetUrl,
  uploadIdentityDocument,
  uploadWorkerImage
} from "../api"

function previewUrl(file) {
  return file ? URL.createObjectURL(file) : ""
}

function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      resolve({ image, url, width: image.width, height: image.height })
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("تعذر قراءة الصورة المختارة."))
    }

    image.src = url
  })
}

async function combineIdentityFiles(frontFile, backFile) {
  if (!frontFile && !backFile) return null
  if (frontFile && !backFile) return frontFile
  if (!frontFile && backFile) return backFile

  const front = await readImageDimensions(frontFile)
  const back = await readImageDimensions(backFile)

  const padding = 32
  const labelHeight = 48
  const canvas = document.createElement("canvas")
  const width = Math.max(front.width, back.width) + padding * 2
  const height = front.height + back.height + padding * 3 + labelHeight * 2

  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, width, height)
  context.fillStyle = "#111827"
  context.font = "bold 24px Arial"
  context.direction = "rtl"
  context.textAlign = "right"

  const labelX = width - padding
  let currentY = padding

  context.fillText("البطاقة - الوجه الأمامي", labelX, currentY + 28)
  currentY += labelHeight
  context.drawImage(front.image, (width - front.width) / 2, currentY)
  currentY += front.height + padding

  context.fillText("البطاقة - الوجه الخلفي", labelX, currentY + 28)
  currentY += labelHeight
  context.drawImage(back.image, (width - back.width) / 2, currentY)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92))

  URL.revokeObjectURL(front.url)
  URL.revokeObjectURL(back.url)

  if (!blob) {
    throw new Error("تعذر تجهيز صور البطاقة للرفع.")
  }

  return new File([blob], "identity-front-back.jpg", { type: "image/jpeg" })
}

function FilePreview({ file, label, onClear }) {
  const src = useMemo(() => previewUrl(file), [file])

  if (!file) return null

  return (
    <div className="rounded-2xl border border-surface-200 bg-surface-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-black text-surface-700">{label}</span>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-2 py-1 text-xs font-bold text-surface-500 hover:bg-surface-100"
        >
          <X size={12} />
          إزالة
        </button>
      </div>
      <img src={src} alt={label} className="h-40 w-full rounded-xl object-cover" />
      <p className="mt-2 truncate text-xs font-bold text-surface-500">{file.name}</p>
    </div>
  )
}

const STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  ACCEPTED: "مقبول",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
  CANCELLED: "ملغي"
}

export default function ProfileSettings({ user, onUpdate, onRefresh, onLogout, onBecomeWorker }) {
  const [username, setUsername] = useState(user?.username || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const [requests, setRequests] = useState([])
  const [ratings, setRatings] = useState([])
  const [ratingForm, setRatingForm] = useState({})
  const [workerProfile, setWorkerProfile] = useState(null)
  const [workerForm, setWorkerForm] = useState({
    name: "",
    job: "",
    salary: "",
    phoneNumber: "",
    address: "",
    nationalIdNumber: ""
  })
  const [workerImageFile, setWorkerImageFile] = useState(null)
  const [identityFrontFile, setIdentityFrontFile] = useState(null)
  const [identityBackFile, setIdentityBackFile] = useState(null)
  const [workerProfileImageFailed, setWorkerProfileImageFailed] = useState(false)
  const isWorker = user?.role === "WORKER"

  const loadProfileData = useCallback(async () => {
    const [bookingsResult, requestsResult, workerProfileResult] = await Promise.allSettled([
      getMyBookings(),
      getMyBookingRequests(),
      isWorker ? getMyWorkerProfile() : Promise.resolve(null)
    ])

    if (bookingsResult.status === "fulfilled") {
      setBookings(Array.isArray(bookingsResult.value) ? bookingsResult.value : [])
    }

    if (requestsResult.status === "fulfilled") {
      setRequests(Array.isArray(requestsResult.value) ? requestsResult.value : [])
    }

    if (workerProfileResult.status === "fulfilled" && workerProfileResult.value) {
      setWorkerProfile(workerProfileResult.value)
    }
  }, [isWorker])

  useEffect(() => {
    setUsername(user?.username || "")
    setPhone(user?.phone || "")
  }, [user])

  useEffect(() => {
    loadProfileData()
  }, [loadProfileData])

  useEffect(() => {
    if (!workerProfile?.id) {
      setRatings([])
      return
    }

    getWorkerRatings(workerProfile.id)
      .then((data) => setRatings(Array.isArray(data) ? data : []))
      .catch(() => setRatings([]))
  }, [workerProfile?.id])

  useEffect(() => {
    if (!workerProfile) return

    setWorkerForm({
      name: workerProfile.name || "",
      job: workerProfile.job || "",
      salary: String(workerProfile.salary ?? ""),
      phoneNumber: workerProfile.phoneNumber || "",
      address: workerProfile.address || "",
      nationalIdNumber: workerProfile.nationalIdNumber || ""
    })
  }, [workerProfile])

  useEffect(() => {
    setWorkerProfileImageFailed(false)
  }, [workerProfile?.imageUrl])

  const publishMessage = (type, text) => setMsg({ type, text })

  const refreshAll = async () => {
    await loadProfileData()
    await onRefresh?.()
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updated = await updateProfile({ username, phone })
      onUpdate?.(updated)
      publishMessage("success", "تم تحديث معلومات الحساب بنجاح.")
      await refreshAll()
    } catch (err) {
      publishMessage("error", err.message)
    }
  }

  const handleToggleAvailability = async () => {
    if (!workerProfile) return
    if (!workerProfile.verified) {
      publishMessage("error", "يجب أن يكون حسابك موثقًا من الإدارة لتغيير حالتك.")
      return
    }

    const nextStatus = workerProfile.availability === "AVAILABLE" ? "BUSY" : "AVAILABLE"
    setLoading(true)

    try {
      const updated = await updateWorkerAvailability(workerProfile.id, nextStatus)
      setWorkerProfile(updated)
      publishMessage("success", `أنت الآن ${nextStatus === "AVAILABLE" ? "متاح للعمل" : "مشغول حاليًا"}.`)
    } catch (err) {
      publishMessage("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateWorkerFormField = (field, value) => {
    setWorkerForm((current) => ({ ...current, [field]: value }))
  }

  const handleWorkerProfileSave = async (event) => {
    event.preventDefault()
    if (!workerProfile?.id) return

    setLoading(true)

    try {
      const updated = await updateWorkerProfile(workerProfile.id, {
        name: workerForm.name,
        job: workerForm.job,
        salary: Number(workerForm.salary || 0),
        phoneNumber: workerForm.phoneNumber,
        address: workerForm.address,
        nationalIdNumber: workerForm.nationalIdNumber
      })

      setWorkerProfile(updated)
      publishMessage("success", "تم تحديث معلومات العامل بنجاح.")
      await refreshAll()
    } catch (err) {
      publishMessage("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkerFileUpload = async (kind) => {
    if (!workerProfile?.id) return

    setLoading(true)

    try {
      if (kind === "image") {
        if (!workerImageFile) throw new Error("اختر صورة أولًا.")
        const updated = await uploadWorkerImage(workerProfile.id, workerImageFile)
        setWorkerProfile(updated)
        setWorkerImageFile(null)
        publishMessage("success", "تم رفع صورة الملف المهني.")
      } else {
        if (!identityFrontFile && !identityBackFile) throw new Error("اختر صور البطاقة أولًا.")
        
        const combinedFile = await combineIdentityFiles(identityFrontFile, identityBackFile)
        if (!combinedFile) throw new Error("تعذر معالجة صور البطاقة.")
        
        const updated = await uploadIdentityDocument(workerProfile.id, combinedFile)
        setWorkerProfile(updated)
        setIdentityFrontFile(null)
        setIdentityBackFile(null)
        publishMessage("success", "تم رفع وثيقة الهوية بنجاح (مدمجة من الوجهين).")
      }
      await refreshAll()
    } catch (err) {
      publishMessage("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRateWorker = async (bookingId) => {
    const payload = ratingForm[bookingId]

    if (!payload?.stars) {
      publishMessage("error", "اختر عدد النجوم قبل إرسال التقييم.")
      return
    }

    try {
      await createRating(bookingId, {
        stars: payload.stars,
        comment: payload.comment || ""
      })
      publishMessage("success", "تم إرسال تقييم العامل بنجاح.")
      setRatingForm((current) => {
        const next = { ...current }
        delete next[bookingId]
        return next
      })
      await refreshAll()
    } catch (err) {
      publishMessage("error", err.message)
    }
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      publishMessage("success", "تم تحديث كلمة المرور بنجاح.")
    } catch (err) {
      publishMessage("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingAction = async (bookingId, action) => {
    setLoading(true)

    try {
      await updateBookingStatus(bookingId, action)
      publishMessage("success", "تم تحديث حالة الحجز بنجاح.")
      await refreshAll()
    } catch (err) {
      publishMessage("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("هل أنت متأكد من حذف الحساب نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.")
    if (!confirmed) return

    setLoading(true)

    try {
      await deleteAccount()
      onLogout?.()
    } catch (err) {
      publishMessage("error", err.message)
      setLoading(false)
    }
  }

  const updateRatingField = (bookingId, field, value) => {
    setRatingForm((current) => ({
      ...current,
      [bookingId]: {
        stars: current[bookingId]?.stars || 0,
        comment: current[bookingId]?.comment || "",
        [field]: value
      }
    }))
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 lg:px-10">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-black tracking-tight text-surface-900">الملف الشخصي</h1>
        <p className="text-base font-bold text-surface-500">
          حدّث بياناتك، راقب الطلبات، وأدِر صلاحياتك حسب دورك الحالي في النظام.
        </p>
      </div>

      {msg.text && (
        <div className={`mb-8 flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-bold ${
          msg.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}>
          <CheckCircle2 size={18} />
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="saas-card border-surface-200 bg-white p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <User size={20} />
            </div>
            <h2 className="text-xl font-black text-surface-900">معلومات الحساب</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">اسم المستخدم</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="saas-input h-12 border-surface-200 pr-4"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">رقم الهاتف</label>
              <div className="relative">
                <Phone size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className="saas-input h-12 border-surface-200 pr-10 text-left"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-saas btn-primary h-12 w-full text-sm">
              <Save size={16} />
              {loading ? "جاري الحفظ..." : "حفظ معلومات الحساب"}
            </button>
          </form>
        </div>

        <div className="saas-card border-surface-200 bg-white p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <KeyRound size={20} />
            </div>
            <h2 className="text-xl font-black text-surface-900">كلمة المرور</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">كلمة المرور الحالية</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="saas-input h-12 border-surface-200 pr-4"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="saas-input h-12 border-surface-200 pr-4"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-saas btn-primary h-12 w-full text-sm">
              <Save size={16} />
              {loading ? "جاري التحديث..." : "تغيير كلمة المرور"}
            </button>
          </form>
        </div>
      </div>

      {isWorker && workerProfile && (
        <section className="mt-8">
          <div className="saas-card border-surface-200 bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Wrench size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-surface-900">ملف العامل</h2>
                <p className="text-sm font-bold text-surface-400">بعد التسجيل كعامل يمكنك تعديل المعلومات والصورة الشخصية فقط.</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
                <p className="mb-1 text-xs font-black uppercase tracking-widest text-surface-400">حالة التوثيق</p>
                <p className="text-sm font-black text-surface-900">
                  {workerProfile.verificationStatus === "VERIFIED"
                    ? "موثق"
                    : workerProfile.verificationStatus === "REJECTED"
                      ? "مرفوض"
                      : "قيد المراجعة"}
                </p>
              </div>
              <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
                <p className="mb-1 text-xs font-black uppercase tracking-widest text-surface-400">ملاحظات الإدارة</p>
                <p className="text-sm font-bold leading-relaxed text-surface-600">
                  {workerProfile.verificationNotes || "لا توجد ملاحظات حالياً."}
                </p>
              </div>
            </div>

            <form onSubmit={handleWorkerProfileSave} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">الاسم</label>
                  <input value={workerForm.name} onChange={(event) => updateWorkerFormField("name", event.target.value)} className="saas-input h-12 border-surface-200 pr-4" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">المهنة</label>
                  <input value={workerForm.job} onChange={(event) => updateWorkerFormField("job", event.target.value)} className="saas-input h-12 border-surface-200 pr-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">السعر</label>
                  <input value={workerForm.salary} onChange={(event) => updateWorkerFormField("salary", event.target.value)} className="saas-input h-12 border-surface-200 pr-4" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">رقم الهاتف المهني</label>
                  <input value={workerForm.phoneNumber} onChange={(event) => updateWorkerFormField("phoneNumber", event.target.value)} className="saas-input h-12 border-surface-200 pr-4" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">العنوان</label>
                <input value={workerForm.address} onChange={(event) => updateWorkerFormField("address", event.target.value)} className="saas-input h-12 border-surface-200 pr-4" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">رقم الهوية الوطنية</label>
                <input
                  value={workerForm.nationalIdNumber}
                  readOnly
                  className="saas-input h-12 border-surface-200 pr-4 bg-surface-50 text-surface-500"
                />
                <p className="mt-2 text-[10px] font-bold text-surface-400">رقم الهوية ووثيقة التحقق يعتمدان عند فتح حساب العامل فقط.</p>
              </div>

              <button type="submit" disabled={loading} className="btn-saas btn-primary h-12 w-full text-sm">
                <Save size={16} />
                {loading ? "جاري حفظ ملف العامل..." : "حفظ معلومات العامل"}
              </button>
            </form>

            <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-surface-200 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-black text-surface-900">
                    <Upload size={18} className="text-primary" />
                    الصورة الشخصية
                  </div>
                </div>
                <p className="mb-4 text-xs font-bold text-surface-400">يمكنك تغيير الصورة الشخصية بعد التسجيل، دون إعادة رفع بطاقة الهوية.</p>
                <div className="mb-4 flex items-center gap-4 rounded-2xl border border-surface-200 bg-surface-50 p-4">
                  {workerProfile.imageUrl && !workerProfileImageFailed ? (
                    <img
                      src={resolveAssetUrl(workerProfile.imageUrl)}
                      alt="الصورة الحالية"
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-primary-soft"
                      onError={() => setWorkerProfileImageFailed(true)}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-surface-300 bg-white text-xs font-black text-surface-400">
                      لا صورة
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <label className="inline-flex cursor-pointer items-center rounded-xl bg-primary px-4 py-2 text-sm font-black text-white transition-all hover:bg-primary-hover">
                      اختر صورة جديدة
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setWorkerImageFile(event.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 truncate text-xs font-bold text-surface-500">
                      {workerImageFile ? workerImageFile.name : "لم يتم اختيار ملف جديد بعد."}
                    </p>
                    {workerProfile.imageUrl && workerProfileImageFailed && (
                      <p className="mt-1 text-xs font-bold text-amber-600">تعذر تحميل الصورة الحالية، لكن يمكنك رفع صورة جديدة الآن.</p>
                    )}
                  </div>
                </div>
                <FilePreview file={workerImageFile} label="الصورة المختارة" onClear={() => setWorkerImageFile(null)} />
                <button
                  type="button"
                  onClick={() => handleWorkerFileUpload("image")}
                  disabled={loading || !workerImageFile}
                  className="btn-saas btn-primary mt-4 h-11 w-full text-sm"
                >
                  {loading ? "جاري الرفع..." : "تحديث الصورة الشخصية"}
                </button>
              </div>

              <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-black text-surface-900">
                  <FileBadge2 size={18} className="text-amber-500" />
                  وثيقة الهوية
                </div>
                <p className="text-sm font-bold leading-relaxed text-surface-500">
                  توثيق الهوية يتم مرة واحدة فقط عند التسجيل كعامل. بعد فتح الحساب لا يمكن رفع البطاقة من هذه الصفحة، ويمكن تعديل المعلومات والصورة الشخصية فقط.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isWorker && (
        <section className="mt-8">
          <div className="saas-card border-surface-200 bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Wrench size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-surface-900">حجوزاتي وتقييم العمال</h2>
                <p className="text-sm font-bold text-surface-400">يمكنك تقييم العامل فقط بعد اكتمال الحجز.</p>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">
              إذا قررت أن تصبح عاملًا، يجب أن يقبل المدير طلبك أولًا قبل أن يظهر ملفك في المنصة.
            </div>

            <button
              type="button"
              onClick={() => onBecomeWorker?.()}
              className="btn-saas btn-primary mb-6 h-12 text-sm"
            >
              طلب التحول إلى عامل
            </button>

            <div className="space-y-4">
              {bookings.length ? bookings.map((booking) => {
                const bookingStatus = String(booking.status || "").toUpperCase()
                const isCompleted = bookingStatus === "COMPLETED"
                const ratingValues = ratingForm[booking.id] || { stars: 0, comment: "" }

                return (
                  <div key={booking.id} className="rounded-2xl border border-surface-200 p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-surface-900">{booking.workerName || "عامل"}</h3>
                        <p className="text-sm font-bold text-surface-500">{booking.workerJob || "خدمة عامة"} - {booking.address}</p>
                      </div>
                      <span className="rounded-full bg-surface-50 px-3 py-1 text-xs font-black text-surface-500">
                        {STATUS_LABELS[bookingStatus] || bookingStatus}
                      </span>
                    </div>

                    {isCompleted && (
                      <div className="rounded-2xl bg-surface-50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-black text-surface-700">
                          <Star size={16} className="text-amber-500" />
                          قيّم العامل
                        </div>

                        <div className="mb-3 flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => updateRatingField(booking.id, "stars", value)}
                              className={`rounded-xl px-3 py-2 text-sm font-black transition-all ${
                                ratingValues.stars >= value
                                  ? "bg-amber-500 text-white"
                                  : "bg-white text-surface-400 border border-surface-200"
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={ratingValues.comment}
                          onChange={(e) => updateRatingField(booking.id, "comment", e.target.value)}
                          rows={3}
                          placeholder="اكتب ملاحظتك حول جودة العمل..."
                          className="saas-input min-h-[96px] border-surface-200 p-4"
                        />

                        <button
                          type="button"
                          onClick={() => handleRateWorker(booking.id)}
                          className="btn-saas btn-primary mt-3 h-11 text-sm"
                        >
                          <Star size={16} />
                          إرسال التقييم
                        </button>
                      </div>
                    )}

                    {bookingStatus === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => handleBookingAction(booking.id, "cancel")}
                        className="btn-saas btn-secondary mt-3 h-10 border-surface-200 text-xs"
                      >
                        إلغاء الحجز
                      </button>
                    )}
                  </div>
                )
              }) : (
                <div className="rounded-2xl border border-dashed border-surface-200 bg-surface-50 p-10 text-center text-sm font-bold text-surface-400">
                  لا توجد حجوزات حتى الآن.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {isWorker && (
        <section className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div className="saas-card border-surface-200 bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Wrench size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-surface-900">طلبات العملاء</h2>
                <p className="text-sm font-bold text-surface-400">اقبل أو ارفض أو أكمل الطلبات من هنا.</p>
              </div>
            </div>

            <div className="space-y-4">
              {requests.length ? requests.map((request) => {
                const bookingStatus = String(request.status || "").toUpperCase()
                return (
                  <div key={request.id} className="rounded-2xl border border-surface-200 p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-surface-900">{request.userName}</h3>
                        <p className="text-sm font-bold text-surface-500">{request.description || "طلب خدمة"} - {request.address}</p>
                      </div>
                      <span className="rounded-full bg-surface-50 px-3 py-1 text-xs font-black text-surface-500">
                        {STATUS_LABELS[bookingStatus] || bookingStatus}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {bookingStatus === "PENDING" && (
                        <>
                          <button type="button" onClick={() => handleBookingAction(request.id, "accept")} className="btn-saas btn-primary h-10 text-xs">
                            قبول
                          </button>
                          <button type="button" onClick={() => handleBookingAction(request.id, "reject")} className="btn-saas btn-secondary h-10 border-surface-200 text-xs">
                            رفض
                          </button>
                        </>
                      )}

                      {bookingStatus === "ACCEPTED" && (
                        <button type="button" onClick={() => handleBookingAction(request.id, "complete")} className="btn-saas btn-primary h-10 text-xs">
                          إنهاء العمل
                        </button>
                      )}
                    </div>
                  </div>
                )
              }) : (
                <div className="rounded-2xl border border-dashed border-surface-200 bg-surface-50 p-10 text-center text-sm font-bold text-surface-400">
                  لا توجد طلبات عمل حالياً.
                </div>
              )}
            </div>
          </div>

          <div className="saas-card border-surface-200 bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Star size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-surface-900">التقييمات والإحصائيات</h2>
                <p className="text-sm font-bold text-surface-400">ملخص تقييمات العملاء لأعمالك السابقة.</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface-50 p-5 text-center">
                <div className="text-3xl font-black text-surface-900">{requests.length}</div>
                <div className="text-xs font-black uppercase tracking-widest text-surface-400">طلبات العمل</div>
              </div>
              <div className="rounded-2xl bg-surface-50 p-5 text-center">
                <div className="text-3xl font-black text-surface-900">{ratings.length}</div>
                <div className="text-xs font-black uppercase tracking-widest text-surface-400">عدد التقييمات</div>
              </div>
            </div>

            <div className="space-y-4">
              {ratings.length ? ratings.map((rating) => (
                <div key={rating.id} className="rounded-2xl border border-surface-200 p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black text-surface-900">{rating.userName || "عميل"}</h3>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600">
                      {rating.stars}/5
                    </span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-surface-500">
                    {rating.comment || "لا توجد ملاحظة نصية مع هذا التقييم."}
                  </p>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-surface-200 bg-surface-50 p-10 text-center text-sm font-bold text-surface-400">
                  ستظهر هنا تقييمات العملاء عندما تكتمل الحجوزات.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="saas-card border-rose-100 bg-rose-50/30 p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-surface-900">منطقة حساسة</h2>
                <p className="text-sm font-bold text-surface-500">حذف الحساب سيزيل الوصول إلى بياناتك نهائياً.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-rose-200 px-6 text-sm font-black text-rose-600 transition-all hover:bg-rose-600 hover:text-white"
            >
              <Trash2 size={16} />
              حذف الحساب
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

