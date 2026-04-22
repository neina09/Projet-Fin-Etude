import React from "react"
import { Phone, Save, User, Camera } from "lucide-react"
import FilePreview from "../FilePreview"
import { resolveAssetUrl } from "../../api"

const inputClass = "input"

export default function AccountSettings({
  username,
  setUsername,
  phone,
  setPhone,
  userImageUrl,
  userImageFile,
  setUserImageFile,
  userImageFailed,
  setUserImageFailed,
  onImageUpload,
  onSubmit,
  loading
}) {
  return (
    <div className="space-y-8" dir="rtl">
      <div className="card-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1d4ed8]">
            <User size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-900">الصورة الشخصية</h2>
        </div>

        <p className="mb-6 text-center text-xs font-bold leading-relaxed text-slate-500">
          نفس أسلوب «انضم كعامل»: صورة دائرية واضحة للظهور في المنصة.
        </p>

        <div className="flex flex-col items-center justify-center">
          <label className="group relative flex cursor-pointer flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUserImageFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="mb-4 flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-all group-hover:border-[#1d4ed8] group-hover:text-[#1d4ed8]">
              {userImageFile ? (
                <img src={URL.createObjectURL(userImageFile)} alt="" className="h-full w-full object-cover" />
              ) : userImageUrl && !userImageFailed ? (
                <img
                  src={resolveAssetUrl(userImageUrl)}
                  alt="الصورة الحالية"
                  className="h-full w-full object-cover"
                  onError={() => setUserImageFailed(true)}
                />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 transition-colors group-hover:bg-blue-100">
                    <Camera size={24} className="text-slate-500 group-hover:text-[#1d4ed8]" />
                  </div>
                </div>
              )}
            </div>
            <span className="mb-1 text-sm font-black text-slate-900">اختيار صورة من الجهاز</span>
            <span className="t-label">JPG, PNG حتى 5MB</span>
          </label>
        </div>

        <FilePreview file={userImageFile} label="معاينة قبل الرفع" onClear={() => setUserImageFile(null)} />

        <button
          type="button"
          onClick={onImageUpload}
          disabled={loading || !userImageFile}
          className="btn btn-primary btn-lg mt-6 w-full"
        >
          {loading ? "جارٍ رفع الصورة..." : "تحديث الصورة الشخصية"}
        </button>
      </div>

      <div className="card-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1d4ed8]">
            <User size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-900">معلومات الحساب</h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="field">
            <label className="t-label">اسم المستخدم</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={15} className={inputClass} />
          </div>

          <div className="field">
            <label className="t-label">رقم الهاتف</label>
            <div className="relative">
              <Phone size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                placeholder="05xxxxxxxxx"
                className={`${inputClass} pr-11 text-left`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-secondary btn-lg w-full"
          >
            <Save size={18} />
            {loading ? "جارٍ الحفظ..." : "حفظ معلومات الحساب"}
          </button>
        </form>
      </div>
    </div>
  )
}
