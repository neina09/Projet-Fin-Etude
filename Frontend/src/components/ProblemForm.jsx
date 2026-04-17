import React, { useMemo, useState } from "react"
import { Briefcase, ChevronDown, MapPin, Send, Sparkles, X } from "lucide-react"
import LeafletMapPicker from "./LeafletMapPicker"

const buildFormState = (initialData) => ({
  title: initialData?.title || "",
  description: initialData?.description || "",
  address: initialData?.address || "",
  profession: initialData?.profession || "",
  latitude: initialData?.latitude ?? null,
  longitude: initialData?.longitude ?? null
})

export default function ProblemForm({
  onAdd,
  submitting = false,
  initialData = null,
  onCancel = null
}) {
  const initialFormState = useMemo(() => buildFormState(initialData), [initialData])
  const [form, setForm] = useState(initialFormState)
  const [isMapOpen, setIsMapOpen] = useState(false)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleLocationSelect = (location) => {
    setForm((current) => ({
      ...current,
      latitude: location.lat,
      longitude: location.lng,
      address: location.address
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.description.trim() || !form.address.trim() || !form.profession.trim()) {
      return
    }

    onAdd({
      id: initialData?.id || Date.now(),
      title: form.title,
      description: form.description,
      address: form.address,
      profession: form.profession,
      latitude: form.latitude,
      longitude: form.longitude,
      author: "أنت",
      time: "الآن",
      status: "PENDING_REVIEW",
      comments: []
    })

    if (!initialData) {
      setForm(buildFormState(null))
      setIsMapOpen(false)
    }
  }

  const isFormValid = form.title.trim() && form.description.trim() && form.address.trim() && form.profession.trim()
  const isEditing = Boolean(initialData)
  const hasSelectedLocation = form.latitude !== null && form.longitude !== null

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
                : "بعد الإرسال ستبقى المهمة قيد مراجعة المدير أولاً، ولن تظهر في المنصة حتى تتم الموافقة عليها."}
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
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
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
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  placeholder="الموقع المحدد أو اكتب هنا..."
                  className="saas-input h-12 border-surface-200 bg-white pr-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-surface-400">حدد موقع انطلاق المهمة على الخريطة</label>
                  <p className="mt-1 text-sm font-medium text-surface-500">
                    {hasSelectedLocation
                      ? "الموقع محدد بالفعل، ويمكنك فتح الخريطة لمراجعته أو تعديله."
                      : "افتح الخريطة أولاً لمشاهدة الموقع أو لتحديده قبل نشر المهمة."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMapOpen((current) => !current)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-200 bg-white px-4 py-2 text-sm font-bold text-surface-600 transition hover:bg-surface-100"
                >
                  {isMapOpen ? "إغلاق الخريطة" : hasSelectedLocation ? "عرض الخريطة" : "فتح الخريطة"}
                  <ChevronDown size={16} className={`transition-transform ${isMapOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {hasSelectedLocation && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                  تم حفظ الموقع المحدد، والخريطة أصبحت قابلة للفتح والإغلاق.
                </div>
              )}

              {isMapOpen && (
                <div className="mt-4">
                  <LeafletMapPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={hasSelectedLocation ? { lat: form.latitude, lng: form.longitude } : null}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-black uppercase tracking-widest text-surface-400">المهنة المطلوبة</label>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
              <select
                value={form.profession}
                onChange={(event) => updateField("profession", event.target.value)}
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
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
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
