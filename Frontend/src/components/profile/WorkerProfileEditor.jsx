import React from "react"
import { ArrowLeft, User, Briefcase, Camera, ShieldCheck, Upload, CheckCircle2, AlertCircle, Lock } from "lucide-react"

const SPECIALTIES = ["سباك", "كهربائي", "دهان", "تنظيف", "نجار", "حداد", "بناء"]

export default function WorkerProfileEditor({
  workerProfile,
  workerForm,
  setWorkerFormField,
  onSave,
  onAvailabilityChange,
  workerImageFile,
  setWorkerImageFile,
  identityFrontFile,
  setIdentityFrontFile,
  identityBackFile,
  setIdentityBackFile,
  workerProfileImageFailed,
  setWorkerProfileImageFailed,
  loading
}) {
  if (!workerProfile) return null

  const isVerified = workerProfile.verificationStatus === "VERIFIED"
  const isAvailable = workerProfile.availability === "AVAILABLE"

  const setAvailabilityToggle = (event) => {
    const checked = event.target.checked
    onAvailabilityChange(checked ? "AVAILABLE" : "BUSY")
  }

  return (
    <div className="mt-10 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 px-5 py-10 sm:px-8 sm:py-12 lg:px-10 font-sans" dir="rtl">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-black text-amber-700">
            <ShieldCheck size={16} />
            ملفك المهني على المنصة
          </div>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            حدّث بياناتك و<span className="text-[#1d4ed8]">حافظ على ثقة العملاء</span>
          </h1>
          <p className="max-w-2xl text-sm font-bold leading-relaxed text-slate-500 md:text-base">
            نفس تجربة انضمام العامل: بطاقات واضحة، ثم حفظ واحد يحدّث معلوماتك والمرفقات التي اخترتها.
          </p>
        </div>

        <div className="mb-8 rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900">حالة التوثيق وملف العامل</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">الحالة الحالية</p>
              <div className="flex items-center gap-2">
                {isVerified ? (
                  <>
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="text-sm font-black text-emerald-600">موثق ومعتمد</span>
                  </>
                ) : workerProfile.verificationStatus === "REJECTED" ? (
                  <>
                    <AlertCircle size={18} className="text-red-500" />
                    <span className="text-sm font-black text-red-600">مرفوض</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} className="text-amber-500" />
                    <span className="text-sm font-black text-amber-600">قيد المراجعة</span>
                  </>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">ملاحظات الإدارة</p>
              <p className="text-sm font-bold leading-relaxed text-slate-600">
                {workerProfile.verificationNotes || "لا توجد ملاحظات للإدارة حالياً."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={onSave} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1d4ed8]">
                    <User size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">المعلومات الشخصية</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500">الاسم الكامل</label>
                    <input
                      value={workerForm.name}
                      onChange={(e) => setWorkerFormField("name", e.target.value)}
                      placeholder="أدخل اسمك كما هو في الهوية"
                      className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={workerForm.phoneNumber}
                        onChange={(e) => setWorkerFormField("phoneNumber", e.target.value)}
                        placeholder="05xxxxxxxxx"
                        dir="ltr"
                        className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-left text-sm font-bold outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">رقم الهوية الوطنية</label>
                      <input
                        value={workerForm.nationalIdNumber}
                        readOnly
                        dir="ltr"
                        className="h-14 w-full cursor-not-allowed rounded-2xl border border-slate-100 bg-slate-100/50 px-5 text-left text-sm font-bold text-slate-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500">العنوان بالتفصيل</label>
                    <input
                      value={workerForm.address}
                      onChange={(e) => setWorkerFormField("address", e.target.value)}
                      placeholder="المدينة، الحي، الشارع"
                      className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1d4ed8]">
                    <User size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">الصورة الشخصية</h2>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <label className="group relative flex cursor-pointer flex-col items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setWorkerImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <div className="mb-4 flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-all group-hover:border-[#1d4ed8] group-hover:text-[#1d4ed8]">
                      {workerImageFile ? (
                        <img src={URL.createObjectURL(workerImageFile)} alt="Profile" className="h-full w-full object-cover" />
                      ) : workerProfile.imageUrl && !workerProfileImageFailed ? (
                        <img
                          src={workerProfile.imageUrl}
                          alt="Current profile"
                          className="h-full w-full object-cover"
                          onError={() => setWorkerProfileImageFailed(true)}
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 transition-colors group-hover:bg-blue-100">
                            <Camera size={24} className="text-slate-500 group-hover:text-[#1d4ed8]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="mb-1 text-sm font-black text-slate-900">رفع الصورة الشخصية</span>
                    <span className="text-[10px] font-bold uppercase text-slate-400">JPG, PNG UP TO 5MB</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1d4ed8]">
                    <Briefcase size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">المعلومات المهنية</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">التخصص المهني</label>
                      <select
                        value={workerForm.job}
                        onChange={(e) => setWorkerFormField("job", e.target.value)}
                        className="h-14 w-full cursor-pointer appearance-none rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold text-slate-700 outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">اختر المهنة</option>
                        {SPECIALTIES.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">سنوات الخبرة</label>
                      <input
                        type="number"
                        min="0"
                        value={workerForm.yearsOfExperience}
                        onChange={(e) => setWorkerFormField("yearsOfExperience", e.target.value)}
                        placeholder="0"
                        className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-center text-sm font-bold outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">حالة التوفر</span>
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 text-[#1d4ed8]">
                          <CheckCircle2 size={12} />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">هل يمكنك استقبال طلبات الآن؟</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#1d4ed8]">متاح الآن</span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={isAvailable}
                          onChange={setAvailabilityToggle}
                          disabled={loading || !isVerified}
                          className="sr-only peer"
                        />
                        <div className="h-7 w-12 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-focus:outline-none peer-checked:bg-[#1d4ed8] peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:pointer-events-none peer-disabled:opacity-50" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500">نبذة عن خبرتك</label>
                    <textarea
                      value={workerForm.bio}
                      onChange={(e) => setWorkerFormField("bio", e.target.value)}
                      placeholder="تحدث عن أهم المشاريع والمهارات التي تتقنها..."
                      className="min-h-[140px] w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm font-bold leading-relaxed outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1d4ed8]">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">الهوية الوطنية</h2>
                </div>

                <p className="mb-6 text-xs font-bold leading-relaxed text-slate-500">
                  لتحديث الهوية اختر الوجهين ثم احفظ في الأسفل؛ يُدمَجان تلقائياً كما في طلب الانضمام.
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="group relative block h-32 w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#1d4ed8] hover:bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdentityFrontFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {identityFrontFile ? (
                        <img src={URL.createObjectURL(identityFrontFile)} alt="Front ID" className="h-full w-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-[#1d4ed8]">
                          <Upload size={20} />
                          <span className="text-[11px] font-black">الوجه الأمامي</span>
                        </div>
                      )}
                    </label>
                  </div>
                  <div>
                    <label className="group relative block h-32 w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#1d4ed8] hover:bg-white">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdentityBackFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {identityBackFile ? (
                        <img src={URL.createObjectURL(identityBackFile)} alt="Back ID" className="h-full w-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-[#1d4ed8]">
                          <Upload size={20} />
                          <span className="text-[11px] font-black">الوجه الخلفي</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {workerProfile.identityDocumentUrl && !identityFrontFile && !identityBackFile && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-black text-emerald-600">
                    <CheckCircle2 size={16} />
                    مستند الهوية مرفوع مسبقاً
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/50 px-6 py-3">
              <Lock size={14} className="text-[#1d4ed8]" />
              <span className="text-xs font-bold text-slate-500">جميع البيانات محمية وتستخدم فقط للتحقق من الهوية</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex h-16 w-[300px] items-center justify-center gap-3 overflow-hidden rounded-full bg-[#1d4ed8] text-lg font-black text-white shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95 disabled:pointer-events-none disabled:opacity-60 md:w-[400px]"
            >
              {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-2" />
            </button>
            <p className="text-[10px] font-bold text-slate-400">
              يتم حفظ الحقول النصية دفعة واحدة؛ الصورة والهوية تُرفعان فقط إذا اخترت ملفات جديدة.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
