import React, { useState } from "react"
import { ArrowLeft, CheckCircle2, Lock, User, Briefcase, Camera, ShieldCheck, Upload, HelpCircle, Share2, Info } from "lucide-react"
import { createWorkerProfile, getMyWorkerProfile, uploadIdentityDocument, uploadWorkerImage } from "../api"
import { combineIdentityFiles } from "../utils/imageFiles"
import { storeSessionToken } from "../utils/auth"
import NotificationList from "./NotificationList" // if needed, else ignore

const SPECIALTIES = ["سباك", "كهربائي", "دهان", "تنظيف", "نجار", "حداد", "بناء"]
const SPEC_ICON = { "سباك": "🔧", "كهربائي": "⚡", "دهان": "🎨", "تنظيف": "🧹", "نجار": "🪚", "حداد": "⚒️", "بناء": "🧱" }

export default function BecomeWorker({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    job: "",
    yearsOfExperience: "",
    phoneNumber: "",
    address: "",
    nationalIdNumber: "",
    bio: "",
    isAvailable: true,
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
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.nationalIdNumber.length !== 10 || !/^\d{10}$/.test(form.nationalIdNumber)) {
      setError("رقم الهوية الوطنية الموريتانية يجب أن يتكون من 10 أرقام بالضبط.");
      return;
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

      // Ensure backward compatibility with existing API expectations
      const response = await createWorkerProfile({
        ...form,
        salary: 100 // default dummy salary, since UI removed it
      })

      if (response?.token) {
        storeSessionToken(response.token)
      }

      let workerId = response?.id || response?.workerId || response?.worker?.id
      if (!workerId) {
        // Fallback to fetching profile
        const workerProfile = await getMyWorkerProfile()
        workerId = workerProfile?.id
      }

      if (!workerId) {
        throw new Error("تم إنشاء الحساب لكن لم أستطع معرفة معرف العامل لرفع الملفات.")
      }

      if (workerImageFile) {
        await uploadWorkerImage(workerId, workerImageFile)
      }

      const identityFile = await combineIdentityFiles(identityFrontFile, identityBackFile)
      if (identityFile) {
        await uploadIdentityDocument(workerId, identityFile)
      }

      setDone(true)
      onSuccess?.(response)
    } catch (err) {
      setError(err.message || "تعذر إرسال طلب الانضمام حالياً.")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="relative flex min-h-[80vh] items-center justify-center p-6 bg-slate-50">
        <div className="relative z-10 w-full max-w-lg rounded-[2.5rem] bg-white p-12 text-center shadow-xl border border-slate-100">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#1d4ed8]/10 text-[#1d4ed8]">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900">تم استلام طلبك بنجاح</h2>
          <p className="mb-10 text-sm font-medium leading-relaxed text-slate-500">
            أُرسل طلبك للمراجعة. سيتم تنبيهك فور موافقة الإدارة على طلب انضمامك.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="h-14 w-full rounded-2xl bg-[#1d4ed8] text-sm font-black text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-20 pb-24 font-sans" dir="rtl">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-black mb-6">
            <ShieldCheck size={16} />
            مجمع النخبة المهنية
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            حول مهارتك إلى <span className="text-[#1d4ed8]">مسيرة مهنية</span> ناجحة
          </h1>
          <p className="max-w-2xl text-slate-500 text-sm md:text-base font-bold leading-relaxed">
            انضم إلى أكبر منصة للمحترفين في المنطقة. نحن نربط أفضل العمال المهرة بالعملاء الذين يقدرون الجودة والإتقان.
          </p>
        </div>

        {/* Global Error message */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-bold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Right Column (First in RTL) */}
            <div className="space-y-8">
              
              {/* Personal Info Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1d4ed8]">
                    <User size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">المعلومات الشخصية</h2>
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500">الاسم الكامل</label>
                      <input
                        name="name"
                        required
                        value={form.name}
                        onChange={setField}
                        maxLength={15}
                        placeholder="أدخل اسمك كما هو في الهوية"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:bg-white focus:border-[#1d4ed8] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">رقم الهاتف</label>
                      <input
                        name="phoneNumber"
                        type="tel"
                        required
                        value={form.phoneNumber}
                        onChange={setField}
                        placeholder="05xxxxxxxxx"
                        dir="ltr"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold text-left focus:bg-white focus:border-[#1d4ed8] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      />
                    </div>
                    {/* ID Number */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">رقم الهوية الوطنية</label>
                      <input
                        name="nationalIdNumber"
                        required
                        value={form.nationalIdNumber}
                        onChange={setField}
                        maxLength={10}
                        placeholder="10xxxxxxx"
                        dir="ltr"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold text-left focus:bg-white focus:border-[#1d4ed8] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500">العنوان بالتفصيل</label>
                    <input
                      name="address"
                      required
                      value={form.address}
                      onChange={setField}
                      placeholder="المدينة، الحي، الشارع"
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:bg-white focus:border-[#1d4ed8] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Picture Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1d4ed8]">
                    <User size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">الصورة الشخصية</h2>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <label className="relative cursor-pointer group flex flex-col items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setWorkerImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:border-[#1d4ed8] group-hover:text-[#1d4ed8] transition-all overflow-hidden mb-4">
                      {workerImageFile ? (
                        <img src={URL.createObjectURL(workerImageFile)} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-slate-200 w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                            <Camera size={24} className="text-slate-500 group-hover:text-[#1d4ed8]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-black text-slate-900 mb-1">رفع الصورة الشخصية</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">JPG, PNG UP TO 5MB</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Left Column (Second in RTL) */}
            <div className="space-y-8">
              
              {/* Professional Info Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1d4ed8]">
                    <Briefcase size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">المعلومات المهنية</h2>
                </div>

                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Specialty */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">التخصص المهني</label>
                      <select
                        name="job"
                        required
                        value={form.job}
                        onChange={setField}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-700 focus:bg-white focus:border-[#1d4ed8] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none"
                      >
                        <option value="">اختر المهنة</option>
                        {SPECIALTIES.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    {/* Years of Experience */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500">سنوات الخبرة</label>
                      <input
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        value={form.yearsOfExperience}
                        onChange={setField}
                        placeholder="0"
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold text-center focus:bg-white focus:border-[#1d4ed8] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">حالة التوفر</span>
                        <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-[#1d4ed8]">
                          <CheckCircle2 size={12} />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">هل يمكنك استقبال طلبات الآن؟</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#1d4ed8]">متاح الآن</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isAvailable"
                          checked={form.isAvailable}
                          onChange={setField}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#1d4ed8]"></div>
                      </label>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500">نبذة عن خبرتك</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={setField}
                      placeholder="تحدث عن أهم المشاريع والمهارات التي تتقنها..."
                      className="w-full min-h-[140px] bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold resize-none focus:bg-white focus:border-[#1d4ed8] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none leading-relaxed"
                    />
                  </div>

                </div>
              </div>

              {/* National ID Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1d4ed8]">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">الهوية الوطنية</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Front ID */}
                  <div>
                    <label className="cursor-pointer block h-32 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-[#1d4ed8] hover:bg-white transition-all overflow-hidden relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdentityFrontFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {identityFrontFile ? (
                        <img src={URL.createObjectURL(identityFrontFile)} alt="Front ID" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-[#1d4ed8]">
                          <Upload size={20} />
                          <span className="text-[11px] font-black">الوجه الأمامي</span>
                        </div>
                      )}
                    </label>
                  </div>
                  {/* Back ID */}
                  <div>
                    <label className="cursor-pointer block h-32 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-[#1d4ed8] hover:bg-white transition-all overflow-hidden relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdentityBackFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      {identityBackFile ? (
                        <img src={URL.createObjectURL(identityBackFile)} alt="Back ID" className="w-full h-full object-cover" />
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

          {/* Submit Area */}
          <div className="flex flex-col items-center mt-12 gap-6">
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-100/50 rounded-full border border-slate-200">
              <Lock size={14} className="text-[#1d4ed8]" />
              <span className="text-xs font-bold text-slate-500">جميع البيانات محمية وتستخدم فقط للتحقق من الهوية</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex h-16 w-[300px] md:w-[400px] items-center justify-center gap-3 overflow-hidden rounded-full bg-[#1d4ed8] text-lg font-black text-white shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
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
