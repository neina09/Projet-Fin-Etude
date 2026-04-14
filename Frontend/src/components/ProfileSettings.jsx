import React, { useCallback, useEffect, useState } from "react"
import { CheckCircle2, FileBadge2, KeyRound, Phone, Save, ShieldAlert, Star, Trash2, Upload, User, Wrench } from "lucide-react"
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
  uploadIdentityDocument,
  uploadWorkerImage
} from "../api"

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
    nationalIdNumber: "",
    imageUrl: ""
  })
  const [workerImageFile, setWorkerImageFile] = useState(null)
  const [workerDocumentFile, setWorkerDocumentFile] = useState(null)
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
      nationalIdNumber: workerProfile.nationalIdNumber || "",
      imageUrl: workerProfile.imageUrl || ""
    })
  }, [workerProfile])

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
      publishMessage("success", "تم تحديث الملف الشخصي بنجاح.")
    } catch (err) {
      publishMessage("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      publishMessage("success", "تم تغيير كلمة المرور بنجاح.")
    } catch (err) {
      publishMessage("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("هل أنت متأكد من حذف الحساب نهائياً؟")
    if (!confirmed) return

    try {
      await deleteAccount()
      onLogout?.()
    } catch (err) {
      publishMessage("error", err.message)
    }
  }

  const handleBookingAction = async (bookingId, action) => {
    try {
      await updateBookingStatus(bookingId, action)
      publishMessage("success", "تم تحديث حالة الطلب.")
      await refreshAll()
    } catch (err) {
      publishMessage("error", err.message)
    }
  }

  const handleToggleAvailability = async () => {
    if (!workerProfile) return
    if (!workerProfile.verified) {
      publishMessage("error", "يجب أن يكون حسابك موثقاً من الإدارة لتغيير حالتك.")
      return
    }

    const nextStatus = workerProfile.availability === "AVAILABLE" ? "BUSY" : "AVAILABLE"
    setLoading(true)

    try {
      const updated = await updateWorkerAvailability(workerProfile.id, nextStatus)
      setWorkerProfile(updated)
      publishMessage("success", `أنت الآن ${nextStatus === "AVAILABLE" ? "متاح للعمل" : "مشغول حالياً"}.`)
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
        nationalIdNumber: workerForm.nationalIdNumber,
        imageUrl: workerForm.imageUrl
      })

      setWorkerProfile(updated)
      publishMessage("success", "تم تحديث الملف المهني وإرساله وفق قواعد الخلفية الحالية.")
      await refreshAll()
    } catch (err) {
      publishMessage("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkerFileUpload = async (kind) => {
    if (!workerProfile?.id) return

    const file = kind === "image" ? workerImageFile : workerDocumentFile
    if (!file) {
      publishMessage("error", kind === "image" ? "اختر صورة أولاً." : "اختر ملف الهوية أولاً.")
      return
    }

    setLoading(true)

    try {
      const updated = kind === "image"
        ? await uploadWorkerImage(workerProfile.id, file)
        : await uploadIdentityDocument(workerProfile.id, file)

      setWorkerProfile(updated)
      if (kind === "image") {
        setWorkerImageFile(null)
      } else {
        setWorkerDocumentFile(null)
      }
      publishMessage("success", kind === "image" ? "تم رفع صورة الملف المهني." : "تم رفع وثيقة الهوية بنجاح.")
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
          حدّث بياناتك، راقب الطلبات، وادِر صلاحياتك حسب دورك الحالي في النظام.
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

            <button
              type="submit"
              disabled={loading}
              className="btn-saas btn-primary h-12 w-full text-sm"
            >
              <Save size={16} />
              {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>

            {isWorker && workerProfile && (
              <div className="mt-8 border-t border-surface-100 pt-8">
                <div className="mb-4 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm font-bold text-surface-700">
                  حالة التوثيق: {workerProfile.verificationStatus || "PENDING"}
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-surface-900">حالة التوفر المهني</h3>
                    <p className="text-[10px] font-bold text-surface-400">
                      حدد ما إذا كنت متاحاً لاستقبال طلبات جديدة الآن.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleAvailability}
                    disabled={loading || !workerProfile.verified}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      workerProfile.availability === "AVAILABLE" ? "bg-primary" : "bg-surface-200"
                    } ${!workerProfile.verified ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        workerProfile.availability === "AVAILABLE" ? "-translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <div className={`rounded-xl p-3 text-center text-xs font-black transition-all ${
                  workerProfile.availability === "AVAILABLE"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-surface-50 text-surface-500 border border-surface-100"
                }`}>
                  {workerProfile.availability === "AVAILABLE" ? "✅ متاح للعمل الآن" : "⏳ مشغول أو غير متاح حالياً"}
                </div>
                {!workerProfile.verified && (
                  <p className="mt-2 text-[10px] font-bold text-amber-600">
                    * لا يمكنك تغيير حالتك حتى يتم توثيق حسابك من قبل الإدارة.
                  </p>
                )}
              </div>
            )}
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

            <button
              type="submit"
              disabled={loading}
              className="btn-saas btn-secondary h-12 w-full border-surface-200 text-sm"
            >
              <KeyRound size={16} />
              {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </button>
          </form>
        </div>
      </div>

      {isWorker && workerProfile && (
        <section className="mt-8">
          <div className="saas-card border-surface-200 bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <FileBadge2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-surface-900">الملف المهني</h2>
                <p className="text-sm font-bold text-surface-400">
                  هذه الحقول مرتبطة مباشرة مع `WorkerRequestDto` في الخلفية.
                </p>
              </div>
            </div>

            <form onSubmit={handleWorkerProfileSave} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">الاسم المهني</label>
                  <input
                    value={workerForm.name}
                    onChange={(event) => updateWorkerFormField("name", event.target.value)}
                    className="saas-input h-12 border-surface-200 pr-4"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">المهنة</label>
                  <input
                    value={workerForm.job}
                    onChange={(event) => updateWorkerFormField("job", event.target.value)}
                    className="saas-input h-12 border-surface-200 pr-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">الهاتف المهني</label>
                  <input
                    value={workerForm.phoneNumber}
                    onChange={(event) => updateWorkerFormField("phoneNumber", event.target.value)}
                    dir="ltr"
                    className="saas-input h-12 border-surface-200 pr-4 text-left"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">الأجر</label>
                  <input
                    type="number"
                    min="0"
                    value={workerForm.salary}
                    onChange={(event) => updateWorkerFormField("salary", event.target.value)}
                    className="saas-input h-12 border-surface-200 pr-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">العنوان</label>
                  <input
                    value={workerForm.address}
                    onChange={(event) => updateWorkerFormField("address", event.target.value)}
                    className="saas-input h-12 border-surface-200 pr-4"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">رابط الصورة</label>
                  <input
                    value={workerForm.imageUrl}
                    onChange={(event) => updateWorkerFormField("imageUrl", event.target.value)}
                    className="saas-input h-12 border-surface-200 pr-4"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-surface-400">رقم الهوية الوطنية</label>
                <input
                  value={workerForm.nationalIdNumber}
                  onChange={(event) => updateWorkerFormField("nationalIdNumber", event.target.value)}
                  placeholder="مطلوب عند تحديث الملف المهني"
                  className="saas-input h-12 border-surface-200 pr-4"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-saas btn-primary h-12 w-full text-sm">
                <Save size={16} />
                {loading ? "جاري حفظ الملف المهني..." : "حفظ الملف المهني"}
              </button>
            </form>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-surface-200 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-surface-900">
                  <Upload size={16} />
                  رفع صورة العامل
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setWorkerImageFile(event.target.files?.[0] || null)}
                  className="mb-3 block w-full text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleWorkerFileUpload("image")}
                  disabled={loading || !workerImageFile}
                  className="btn-saas btn-secondary h-11 w-full border-surface-200 text-sm"
                >
                  رفع الصورة
                </button>
              </div>

              <div className="rounded-2xl border border-surface-200 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-surface-900">
                  <FileBadge2 size={16} />
                  رفع وثيقة الهوية
                </div>
                <input
                  type="file"
                  onChange={(event) => setWorkerDocumentFile(event.target.files?.[0] || null)}
                  className="mb-3 block w-full text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleWorkerFileUpload("document")}
                  disabled={loading || !workerDocumentFile}
                  className="btn-saas btn-secondary h-11 w-full border-surface-200 text-sm"
                >
                  رفع الوثيقة
                </button>
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
