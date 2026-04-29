import React, { useState } from "react"
import { ArrowLeft, CheckCircle2, Lock, User, Briefcase, Camera, ShieldCheck, Upload } from "lucide-react"
import { createWorkerProfile, getMyWorkerProfile, uploadIdentityDocument, uploadWorkerImage } from "../api"
import { combineIdentityFiles } from "../utils/imageFiles"
import { storeSessionToken } from "../utils/auth"
import { isValidMauritanianPhone, normalizePhoneNumber, validateImageFile } from "../utils/security"

const SPECIALTIES = ["سباك", "كهربائي", "دهان", "تنظيف", "نجار", "حداد", "بناء"]

export default function BecomeWorker({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    job: "",
    salary: "",
    yearsOfExperience: "",
    phoneNumber: "",
    address: "",
    nationalIdNumber: "",
    bio: "",
    isAvailable: true
  })
  const [workerImageFile, setWorkerImageFile] = useState(null)
  const [identityFrontFile, setIdentityFrontFile] = useState(null)
  const [identityBackFile, setIdentityBackFile] = useState(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const setField = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : (name === "phoneNumber" ? normalizePhoneNumber(value) : value)
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.nationalIdNumber.length !== 10 || !/^\d{10}$/.test(form.nationalIdNumber)) {
      setError("رقم الهوية الوطنية الموريتانية يجب أن يتكون من 10 أرقام بالضبط.")
      return
    }

    if (!isValidMauritanianPhone(form.phoneNumber)) {
      setError("يرجى إدخال رقم هاتف موريتاني صحيح.")
      return
    }

    const parsedSalary = Number(form.salary)
    if (!Number.isFinite(parsedSalary) || parsedSalary <= 0) {
      setError("يرجى إدخال سعر خدمة صحيح أكبر من صفر.")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (!workerImageFile) {
        throw new Error("يجب إضافة الصورة الشخصية قبل إرسال طلب التوثيق.")
      }

      if (!identityFrontFile || !identityBackFile) {
        throw new Error("يجب إضافة صورة البطاقة من الأمام والخلف قبل إرسال الطلب.")
      }

      validateImageFile(workerImageFile, "الصورة الشخصية")
      validateImageFile(identityFrontFile, "الوجه الأمامي للهوية")
      validateImageFile(identityBackFile, "الوجه الخلفي للهوية")

      const response = await createWorkerProfile({
        ...form,
        salary: Math.round(parsedSalary)
      })

      if (response?.token) {
        storeSessionToken(response.token)
      }

      let workerId = response?.id || response?.workerId || response?.worker?.id
      if (!workerId) {
        const workerProfile = await getMyWorkerProfile()
        workerId = workerProfile?.id
      }

      if (!workerId) {
        throw new Error("تم إنشاء الحساب لكن تعذر تحديد معرف العامل لرفع الملفات.")
      }

      await uploadWorkerImage(workerId, workerImageFile)

      const identityFile = await combineIdentityFiles(identityFrontFile, identityBackFile)
      if (identityFile) {
        await uploadIdentityDocument(workerId, identityFile)
      }

      setDone(true)
      onSuccess?.(response)
    } catch (err) {
      setError(err.message || "تعذر إرسال طلب الانضمام حاليا.")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="relative flex min-h-[80vh] items-center justify-center bg-slate-50 p-6">
        <div className="relative z-10 w-full max-w-lg rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-xl">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#1d4ed8]/10 text-[#1d4ed8]">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900">تم استلام طلبك بنجاح</h2>
          <p className="mb-10 text-sm font-medium leading-relaxed text-slate-500">
            أُرسل طلبك للمراجعة. سيتم تنبيهك فور موافقة الإدارة على طلب انضمامك.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="h-14 w-full rounded-2xl bg-[#1d4ed8] text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-20 pb-24 font-sans" dir="rtl">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-black text-amber-700">
            <ShieldCheck size={16} />
            مجتمع النخبة المهنية
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            حول مهارتك إلى <span className="text-[#1d4ed8]">مسيرة مهنية</span> ناجحة
          </h1>
          <p className="max-w-2xl text-sm font-bold leading-relaxed text-slate-500 md:text-base">
            انضم إلى أكبر منصة للمحترفين في المنطقة. نحن نربط أفضل العمال المهرة بالعملاء الذين يقدرون الجودة والإتقان.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-bold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
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
                      name="name"
                      required
                      value={form.name}
                      onChange={setField}
                      maxLength={15}
                      placeholder="أدخل اسمك كما هو في الهوية"
                      className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">رقم الهاتف</label>
                      <input
                        name="phoneNumber"
                        type="tel"
                        required
                        value={form.phoneNumber}
                        onChange={setField}
                        placeholder="05xxxxxxxx"
                        dir="ltr"
                        className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-left text-sm font-bold outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">رقم الهوية الوطنية</label>
                      <input
                        name="nationalIdNumber"
                        required
                        value={form.nationalIdNumber}
                        onChange={setField}
                        maxLength={10}
                        placeholder="10xxxxxxxx"
                        dir="ltr"
                        className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-left text-sm font-bold outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500">العنوان بالتفصيل</label>
                    <input
                      name="address"
                      required
                      value={form.address}
                      onChange={setField}
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
                    <input type="file" accept="image/*" onChange={(e) => setWorkerImageFile(e.target.files?.[0] || null)} className="hidden" />
                    <div className="mb-4 flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-all group-hover:border-[#1d4ed8] group-hover:text-[#1d4ed8]">
                      {workerImageFile ? (
                        <img src={URL.createObjectURL(workerImageFile)} alt="Profile" className="h-full w-full object-cover" />
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
                        name="job"
                        required
                        value={form.job}
                        onChange={setField}
                        className="h-14 w-full appearance-none rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold text-slate-700 outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">اختر المهنة</option>
                        {SPECIALTIES.map((specialty) => (
                          <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">سنوات الخبرة</label>
                      <input
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        value={form.yearsOfExperience}
                        onChange={setField}
                        placeholder="0"
                        className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-center text-sm font-bold outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500">السعر التقديري (MRU/ساعة)</label>
                    <input
                      name="salary"
                      type="number"
                      min="1"
                      required
                      value={form.salary}
                      onChange={setField}
                      placeholder="500"
                      className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 text-center text-sm font-bold outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500">نبذة عن خبرتك</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={setField}
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="group relative block h-32 w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#1d4ed8] hover:bg-white">
                      <input type="file" accept="image/*" onChange={(e) => setIdentityFrontFile(e.target.files?.[0] || null)} className="hidden" />
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
                      <input type="file" accept="image/*" onChange={(e) => setIdentityBackFile(e.target.files?.[0] || null)} className="hidden" />
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
              {loading ? "جاري الإرسال..." : "إرسال طلب الانضمام"}
              <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-2" />
            </button>
            <p className="text-[10px] font-bold text-slate-400">
              بالضغط على ارسال، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بمنصة العمال.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
