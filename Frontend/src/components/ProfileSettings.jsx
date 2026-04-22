import React, { useCallback, useEffect, useState } from "react"
import { CheckCircle2, ShieldCheck, Trash2 } from "lucide-react"
import {
  changePassword,
  deleteAccount,
  getMyWorkerProfile,
  updateProfile,
  updateWorkerAvailability,
  uploadUserImage,
  uploadWorkerImage
} from "../api"

import AccountSettings from "./profile/AccountSettings"
import SecuritySettings from "./profile/SecuritySettings"

export default function ProfileSettings({ user, onUpdate, onRefresh, onLogout, onBecomeWorker }) {
  const [username, setUsername] = useState(user?.username || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [workerProfile, setWorkerProfile] = useState(null)
  const [workerProfileLoading, setWorkerProfileLoading] = useState(false)
  const [userImageFile, setUserImageFile] = useState(null)
  const [userImageFailed, setUserImageFailed] = useState(false)

  const isWorker = user?.role === "WORKER"

  const publishMessage = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg({ type: "", text: "" }), 5000)
  }

  const loadProfileData = useCallback(async () => {
    if (isWorker) setWorkerProfileLoading(true)

    try {
      const workerProfileResult = await getMyWorkerProfile()
      if (workerProfileResult) {
        setWorkerProfile(workerProfileResult)
      }
    } catch (err) {
      console.error("Failed to load worker profile", err)
    } finally {
      if (isWorker) setWorkerProfileLoading(false)
    }
  }, [isWorker])

  const refreshAll = async () => {
    await loadProfileData()
    await onRefresh?.()
  }

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

  const handleUpdateProfile = async (event) => {
    event.preventDefault()
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
      publishMessage("error", "اختر صورة أولًا.")
      return
    }

    setLoading(true)
    try {
      const updated = await uploadUserImage(userImageFile)
      onUpdate?.(updated)

      if (isWorker && workerProfile?.id) {
        try {
          await uploadWorkerImage(workerProfile.id, userImageFile)
        } catch (error) {
          console.error("Failed to sync worker image", error)
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

  const handleAvailabilityChange = async (nextAvailability) => {
    if (!workerProfile?.id || availabilityLoading) return

    setAvailabilityLoading(true)
    try {
      const updatedWorker = await updateWorkerAvailability(workerProfile.id, nextAvailability)
      setWorkerProfile(updatedWorker)
      publishMessage("success", `تم تحديث حالة العامل إلى ${nextAvailability === "AVAILABLE" ? "متاح" : "مشغول"}.`)
      await onRefresh?.()
    } catch (err) {
      publishMessage("error", err.message)
    } finally {
      setAvailabilityLoading(false)
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
    <div className="page-shell mx-auto max-w-[1200px]" dir="rtl">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-6 badge badge-amber gap-2 px-4 py-1.5">
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
            ? "حدّث صورتك وبياناتك واطلع على طلبات العملاء وتقييماتك، وتحكم بحالتك بنفسك من هذه الصفحة."
            : "حدّث بياناتك وراقب حجوزاتك بنفس أسلوب صفحات المنصة."}
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

      {!isWorker && user?.role !== "ADMIN" && (
        <div className="mt-10 card-lg">
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
              className="btn btn-primary btn-lg shrink-0"
            >
              بدء طلب الانضمام
            </button>
          </div>
        </div>
      )}

      {isWorker && (
        <section className="mt-10">
          <div className="card-lg">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">حالة العامل</h2>
                  <p className="t-label italic">العامل وحده يتحكم في حالته من هنا.</p>
                </div>
              </div>

              <span className={`badge ${workerProfile?.availability === "AVAILABLE" ? "badge-green" : "badge-amber"}`}>
                {workerProfile?.availability === "AVAILABLE" ? "متاح" : "مشغول"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleAvailabilityChange("AVAILABLE")}
                disabled={availabilityLoading || workerProfile?.availability === "AVAILABLE"}
                className={`btn btn-lg ${workerProfile?.availability === "AVAILABLE" ? "bg-emerald-600 text-white hover:bg-emerald-600" : "btn-secondary"}`}
              >
                {availabilityLoading && workerProfile?.availability !== "AVAILABLE" ? "جارٍ التحديث..." : "متاح الآن"}
              </button>

              <button
                type="button"
                onClick={() => handleAvailabilityChange("BUSY")}
                disabled={availabilityLoading || workerProfile?.availability === "BUSY"}
                className={`btn btn-lg ${workerProfile?.availability === "BUSY" ? "bg-amber-500 text-white hover:bg-amber-500" : "btn-secondary"}`}
              >
                {availabilityLoading && workerProfile?.availability !== "BUSY" ? "جارٍ التحديث..." : "مشغول الآن"}
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="mt-12 flex justify-center">
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 text-sm font-black text-red-500 transition-colors hover:text-red-700"
        >
          <Trash2 size={16} />
          حذف الحساب نهائيًا
        </button>
      </div>
    </div>
  )
}
