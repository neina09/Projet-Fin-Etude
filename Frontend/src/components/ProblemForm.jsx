import React, { useMemo, useState } from "react"
import { Briefcase, ChevronDown, MapPin, Send, Sparkles, X, Info, Clock, Zap, ShieldCheck, Map } from "lucide-react"
import LeafletMapPicker from "./LeafletMapPicker"
import { motion, AnimatePresence } from "framer-motion"

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
      title: form.title,
      description: form.description,
      address: form.address,
      profession: form.profession,
      latitude: form.latitude,
      longitude: form.longitude
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
    <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
      {/* Background Decorative Blur */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-3">
           <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#1d4ed8] shadow-lg shadow-blue-500/20 text-white">
                 <Sparkles size={24} className="animate-pulse" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                {isEditing ? "تعديل تفاصيل المهمة" : "ابدأ رحلة عملك الجديدة"}
              </h2>
           </div>
           <p className="text-base font-bold text-slate-500 max-w-2xl leading-relaxed">
             {isEditing
               ? "قم بتحديث بيانات المهمة وسنقوم بمراجعتها فوراً لضمان الجودة."
               : "املأ التفاصيل أدناه بدقة، وسنقوم بمراجعة الطلب ونشره للمحترفين المعتمدين فور اعتماده."}
           </p>
        </div>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-14 px-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
          >
            <X size={20} /> إلغاء التعديل
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
           {/* Task Title */}
           <div className="space-y-4">
              <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#1d4ed8]">
                 <Zap size={14} /> عنوان المهمة
              </label>
              <div className="relative group/input">
                 <input
                   value={form.title}
                   onChange={(event) => updateField("title", event.target.value)}
                   placeholder="مثال: إصلاح تسرب مياه في المطبخ"
                   className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 text-sm font-black text-slate-900 focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                   required
                 />
              </div>
           </div>

           {/* Task Profession */}
           <div className="space-y-4">
              <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#1d4ed8]">
                 <Briefcase size={14} /> التصنيف المهني
              </label>
              <div className="relative">
                 <select
                   value={form.profession}
                   onChange={(event) => updateField("profession", event.target.value)}
                   className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 text-sm font-black text-slate-900 focus:bg-white focus:border-blue-500/30 transition-all outline-none appearance-none cursor-pointer"
                   required
                 >
                   <option value="">اختر المهنة المناسبة...</option>
                   <option value="سباك">سباك محترف</option>
                   <option value="كهربائي">كهربائي منازل</option>
                   <option value="نجار">نجار متخصص</option>
                   <option value="منظف">خدمات تنظيف</option>
                   <option value="دهان">دهان وديكور</option>
                   <option value="ميكانيكي">ميكانيكي سيارات</option>
                 </select>
                 <ChevronDown size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
           </div>

           {/* Location Address */}
           <div className="space-y-4 md:col-span-2">
              <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#1d4ed8]">
                 <MapPin size={14} /> عنوان التنفيذ
              </label>
              <div className="relative group/input">
                 <input
                   type="text"
                   value={form.address}
                   onChange={(event) => updateField("address", event.target.value)}
                   placeholder="أدخل الحي أو الشارع أو الموقع التقريبي..."
                   className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 text-sm font-black text-slate-900 focus:bg-white focus:border-blue-500/30 transition-all outline-none shadow-sm"
                   required
                 />
              </div>
           </div>

           {/* Integrated Map View (Screenshot 2 Style) */}
           <div className="md:col-span-2 space-y-6">
              <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 shadow-inner group-hover:bg-white transition-colors">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#1d4ed8] shadow-sm">
                          <Map size={24} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900">تحديد الموقع الجغرافي</p>
                          <p className="text-xs font-bold text-slate-400 leading-relaxed">
                             {hasSelectedLocation ? "تم تحديد نقطة الانطلاق" : "يرجى تحديد موقع المهمة لتمكين العمال القريبين من رؤية طلبك."}
                          </p>
                       </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMapOpen((current) => !current)}
                      className="h-12 px-6 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-600 hover:border-blue-500 hover:text-[#1d4ed8] transition-all flex items-center gap-3 shadow-sm"
                    >
                      {isMapOpen ? "إغلاق الخريطة" : hasSelectedLocation ? "عرض الموقع الحالي" : "فتح الخريطة الذكية"}
                      <ChevronDown size={16} className={`transition-transform duration-500 ${isMapOpen ? "rotate-180" : ""}`} />
                    </button>
                 </div>

                 {isMapOpen && (
                   <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl">
                     <LeafletMapPicker
                       onLocationSelect={handleLocationSelect}
                       initialLocation={hasSelectedLocation ? { lat: form.latitude, lng: form.longitude } : null}
                     />
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Task Description */}
        <div className="space-y-4">
           <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#1d4ed8]">
              <Info size={14} /> تفاصيل المهمة والاحتياجات
           </label>
           <textarea
             value={form.description}
             onChange={(event) => updateField("description", event.target.value)}
             placeholder="صف المشكلة أو المهمة بدقة حتى تصلك عروض مناسبة، يمكنك ذكر الأدوات المطلوبة أو أي تفاصيل فنية أخرى..."
             className="w-full min-h-[220px] bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 text-lg font-medium text-slate-900 focus:bg-white focus:border-blue-500/30 transition-all outline-none resize-none leading-relaxed shadow-inner"
             required
           />
        </div>

        {/* Informational Guidelines */}
        <div className="flex items-start gap-4 p-8 rounded-[2rem] bg-amber-50 border border-amber-100/50">
           <ShieldCheck size={24} className="text-amber-600 shrink-0 mt-1" />
           <p className="text-sm font-bold text-amber-900 leading-relaxed">
              <strong>سياسة الخصوصية والأمان:</strong> طلبك يخضع للمراجعة الإدارية قبل النشر العام. نضمن لك حذف بيانات التواصل الشخصية وتظهر فقط عند اختيارك لمحترف معين حفاظاً على خصوصيتك.
           </p>
        </div>

        <div className="flex justify-end pt-8">
           <button
             type="submit"
             disabled={!isFormValid || submitting}
             className="h-20 w-full sm:w-auto sm:px-16 bg-[#1d4ed8] text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:grayscale disabled:opacity-50 flex items-center justify-center gap-4"
           >
             <Send size={24} className="transform -rotate-45" />
             {submitting ? "جاري الإرسال للتأمين..." : isEditing ? "تأكيد التعديلات" : "إرسال المهمة للمراجعة الآن"}
           </button>
        </div>
      </form>
    </div>
  )
}
