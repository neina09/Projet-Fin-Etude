import React, { useEffect, useState } from "react"
import { Briefcase, MapPin, Send, Sparkles, X } from "lucide-react"
import LeafletMapPicker from "./LeafletMapPicker"

const EMPTY_FORM = { title: "", description: "", address: "", profession: "" }

export default function ProblemForm({
  onAdd,
  submitting = false,
  initialData = null,
  onCancel = null
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [profession, setProfession] = useState("")
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setDescription(initialData.description || "")
      setAddress(initialData.address || "")
      setProfession(initialData.profession || "")
      setLatitude(initialData.latitude ?? null)
      setLongitude(initialData.longitude ?? null)
      return
    }

    setTitle(EMPTY_FORM.title)
    setDescription(EMPTY_FORM.description)
    setAddress(EMPTY_FORM.address)
    setProfession(EMPTY_FORM.profession)
    setLatitude(null)
    setLongitude(null)
  }, [initialData])

  const handleLocationSelect = (location) => {
    setLatitude(location.lat)
    setLongitude(location.lng)
    setAddress(location.address)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!title.trim() || !description.trim() || !address.trim() || !profession.trim()) {
      return
    }

    onAdd({
      id: initialData?.id || Date.now(),
      title,
      description,
      address,
      profession,
      latitude,
      longitude,
      author: "أنت",
      time: "الآن",
      status: "PENDING_REVIEW",
      comments: []
    })

    if (!initialData) {
      setTitle("")
      setDescription("")
      setAddress("")
      setProfession("")
      setLatitude(null)
      setLongitude(null)
    }
  }

  const isFormValid = title.trim() && description.trim() && address.trim() && profession.trim()
  const isEditing = Boolean(initialData)

  return (
    <div className="rounded-2xl bg-white p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/10 bg-primary-soft text-primary shadow-sm">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-surface-900">
              {isEditing ? "تعديل المهمة" : "ما هي المهمة التي تريد نشرها؟"}
            </h2>
            <p className="text-sm font-medium text-surface-400">
              {isEditing
                ? "عدّل بيانات المهمة ثم احفظ التغييرات، وستعود للمراجعة الإدارية إذا لزم الأمر."
                : "بعد الإرسال ستبقى المهمة قيد مراجعة المدير أولًا، ولن تظهر في المنصة حتى تتم الموافقة عليها."}
            </p>
          </div>
        </div>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-200 px-4 py-2 text-sm font-bold text-surface-500 hover:bg-surface-50"
          >
            <X size={16} />
            إلغاء
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-surface-400">عنوان المهمة</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="مثال: إصلاح تسرب مياه في المطبخ"
              className="saas-input h-12 border-surface-200 pr-4 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-surface-400">الموقع الذي نُشرت منه المهمة</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={locating ? "جاري تحديد الموقع..." : "الموقع المحدد أو اكتب هنا..."}
                  className={`saas-input h-12 border-surface-200 pr-11 ${locating ? "animate-pulse bg-surface-50" : "bg-white"}`}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 md:col-span-2">
            <label className="block text-xs font-black uppercase tracking-widest text-surface-400">حدد موقع انطلاق المهمة على الخريطة</label>
                <LeafletMapPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={latitude && longitude ? { lat: latitude, lng: longitude } : null}
                />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-black uppercase tracking-widest text-surface-400">المهنة المطلوبة</label>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
              <select
                value={profession}
                onChange={(event) => setProfession(event.target.value)}
                className="saas-input h-12 border-surface-200 pr-11 focus:bg-white"
              >
                <option value="">اختر المهنة</option>
                <option value="PLUMBER">سباك</option>
                <option value="ELECTRICIAN">كهربائي</option>
                <option value="CARPENTER">نجار</option>
                <option value="CLEANER">منظف</option>
                <option value="PAINTER">دهان</option>
                <option value="MECHANIC">ميكانيكي</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-widest text-surface-400">تفاصيل الطلب</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="صف المشكلة أو المهمة بدقة حتى تصلك عروض مناسبة..."
            rows="4"
            className="saas-input resize-none border-surface-200 px-4 py-4 focus:bg-white"
          />
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          لن تظهر هذه المهمة للعمال أو بقية المستخدمين حتى يقبلها المدير.
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-saas btn-secondary h-12 border-surface-200 px-8 text-sm font-bold"
            >
              إلغاء
            </button>
          )}

          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className="btn-saas btn-primary flex h-12 items-center gap-3 px-10 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:grayscale disabled:opacity-50"
          >
            <Send size={18} className="translate-x-1 rotate-180" />
            {submitting ? "جاري الحفظ..." : isEditing ? "حفظ التعديلات" : "إرسال المهمة للمراجعة"}
          </button>
        </div>
      </form>
    </div>
  )
}
