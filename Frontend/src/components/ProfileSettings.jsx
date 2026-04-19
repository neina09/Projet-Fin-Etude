import React, { useCallback, useEffect, useState } from "react"
import { CheckCircle2, ShieldCheck, Star, Trash2 } from "lucide-react"
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
  uploadUserImage,
  uploadWorkerImage
} from "../api"

import AccountSettings from "./profile/AccountSettings"
import SecuritySettings from "./profile/SecuritySettings"
import BookingHistory from "./profile/BookingHistory"
import WorkerRequestsList from "./profile/WorkerRequestsList"

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
  const [workerProfileLoading, setWorkerProfileLoading] = useState(false)
  const [userImageFile, setUserImageFile] = useState(null)
  const [userImageFailed, setUserImageFailed] = useState(false)
  const isWorker = user?.role === "WORKER"

  const loadProfileData = useCallback(async () => {
    if (isWorker) setWorkerProfileLoading(true)

    const [bookingsResult, requestsResult, workerProfileResult] = await Promise.allSettled([
      getMyBookings(),
      isWorker ? getMyBookingRequests() : Promise.resolve([]),
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

    if (isWorker) setWorkerProfileLoading(false)
  }, [isWorker])

  useEffect(() => {
    setUsername(user?.username || "")
    setPhone(user?.phone || "")
  }, [user])

  useEffect(() => {
    setUserImageFailed(false)
  }, [user?.imageUrl])

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
    } finally {
      setLoading(false)
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

  const handleUserImageUpload = async () => {
    if (!userImageFile) {
      publishMessage("error", "اختر صورة أولاً.")
      return
    }
    setLoading(true)
    try {
      const updated = await uploadUserImage(userImageFile)
      onUpdate?.(updated)

      if (isWorker && workerProfile?.id) {
        try {
          await uploadWorkerImage(workerProfile.id, userImageFile)
        } catch (e) {
          console.error("Failed to sync worker image", e)
        }
      }

      setUserImageFile(null)
      publishMessage("success", "تم تحديث الصورة الشخصية بنجاح.")
      await refreshAll()
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

  const handleDeleteAccount = async () => {
    if (!window.confirm("هل أنت متأكد من حذف الحساب نهائيًا؟")) return
    setLoading(true)
    try {
      await deleteAccount()
      onLogout?.()
    } catch (err) {
      publishMessage("error", err.message)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-2 font-sans sm:px-6 lg:px-8" dir="rtl">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-black text-amber-800">
          <ShieldCheck size={16} />
          {isWorker ? "هويتك على المنصة" : "ملفك الشخصي"}
        </div>
        <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          {isWorker ? (
            <>
              تعديل <span className="text-[#1d4ed8]">الهوية</span> والحساب
            </>
          ) : (
            <>
              لوحة <span className="text-[#1d4ed8]">الملف الشخصي</span>
            </>
          )}
        </h1>
        <p className="max-w-2xl text-sm font-bold leading-relaxed text-slate-500 md:text-base">
          {isWorker
            ? "حدّث صورتك واسم المستخدم ورقم الهاتف وكلمة المرور بنفس ألوان وتنسيق باقي المنصة، واطلع على طلبات العملاء وتقييماتك."
            : "حدّث بياناتك وراقب حجوزاتك بنفس أسلوب صفحات المنصة (أزرق، بطاقات مستديرة، خلفية فاتحة)."}
        </p>
      </div>

      {msg.text && (
        <div className={`mb-8 flex items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-center text-sm font-bold ${
          msg.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
        }`}>
          <CheckCircle2 size={18} />
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <AccountSettings
          username={username}
          setUsername={setUsername}
          phone={phone}
          setPhone={setPhone}
          userImageUrl={user?.imageUrl}
          userImageFile={userImageFile}
          setUserImageFile={setUserImageFile}
          userImageFailed={userImageFailed}
          setUserImageFailed={setUserImageFailed}
          onImageUpload={handleUserImageUpload}
          onSubmit={handleUpdateProfile}
          loading={loading}
        />
        <SecuritySettings
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          onSubmit={handleChangePassword}
          loading={loading}
        />
      </div>

      {!isWorker && !workerProfileLoading && user?.role !== "ADMIN" && (
        <div className="mt-10 rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-right">
              <h2 className="text-2xl font-black text-slate-900">انضم كعامل</h2>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-500">
                استقبل الطلبات واملأ الاسم والصورة والهوية كما في نموذج الانضمام الموحّد.
              </p>
            </div>
            <button
              type="button"
              onClick={onBecomeWorker}
              className="h-14 shrink-0 rounded-2xl bg-[#1d4ed8] px-10 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.99] md:px-12"
            >
              بدء طلب الانضمام
            </button>
          </div>
        </div>
      )}

      {!isWorker && user?.role !== "ADMIN" && (
        <BookingHistory
          bookings={bookings}
          ratingForm={ratingForm}
          updateRatingField={(id, f, v) => setRatingForm(curr => ({ ...curr, [id]: { ...curr[id], [f]: v } }))}
          handleRateWorker={handleRateWorker}
          handleBookingAction={handleBookingAction}
          onBecomeWorker={onBecomeWorker}
        />
      )}

      {isWorker && (
        <section className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-2">
          <WorkerRequestsList
            requests={requests}
            handleBookingAction={handleBookingAction}
          />
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Star size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900">تقييماتي</h2>
            </div>
            {workerProfileLoading ? (
              <p className="py-10 text-center text-sm font-bold text-slate-400">جاري تحميل التقييمات...</p>
            ) : (
              <div className="space-y-4">
                {ratings.length ? ratings.map(r => (
                  <div key={r.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">{r.userName || "عميل"}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(v => (
                          <Star key={v} size={12} className={v <= r.stars ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-bold leading-relaxed text-slate-600">{r.comment}</p>
                  </div>
                )) : <p className="py-10 text-center text-sm font-bold text-slate-400">لا توجد تقييمات بعد.</p>}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="mt-12 flex justify-center">
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 text-sm font-black text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={16} />
          حذف الحساب نهائياً
        </button>
      </div>
    </div>
  )
}
