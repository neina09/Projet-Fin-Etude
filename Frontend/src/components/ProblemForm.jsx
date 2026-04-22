import React, { useMemo, useState } from "react"
import { Briefcase, ChevronDown, MapPin, Send, Sparkles, X, Info, Zap, ShieldCheck, Map } from "lucide-react"
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
  onAdd, submitting = false, initialData = null, onCancel = null
}) {
  const initialFormState = useMemo(() => buildFormState(initialData), [initialData])
  const [form, setForm] = useState(initialFormState)
  const [isMapOpen, setIsMapOpen] = useState(false)

  const updateField = (f, v) => setForm(c => ({ ...c, [f]: v }))
  const handleLocationSelect = (loc) => setForm(c => ({ ...c, latitude: loc.lat, longitude: loc.lng, address: loc.address }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || !form.address.trim() || !form.profession.trim()) return
    onAdd({ ...form })
    if (!initialData) { setForm(buildFormState(null)); setIsMapOpen(false); }
  }

  const isFormValid = form.title.trim() && form.description.trim() && form.address.trim() && form.profession.trim()
  const isEditing = Boolean(initialData)
  const hasSelectedLocation = form.latitude !== null && form.longitude !== null

  return (
    <div className="card-lg" dir="rtl">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                 <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {isEditing ? "تعديل الطلب" : "نشر مهمة جديدة"}
              </h2>
           </div>
           <p className="mt-2 text-xs font-bold text-slate-400 max-w-xl leading-relaxed uppercase tracking-wider italic">
             {isEditing ? "قم بتحديث بيانات المهمة وسنقوم بمراجعتها." : "املأ التفاصيل بدقة وسنقوم بمراجعتها ونشرها فوراً."}
           </p>
        </div>
        {isEditing && onCancel && (
          <button onClick={onCancel} className="h-10 px-6 rounded-xl border border-slate-100 text-[11px] font-black text-slate-400 hover:text-slate-900 transition-all"><X size={16} /> إلغاء</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
           <div className="space-y-2">
              <label className="t-label flex items-center gap-2"><Zap size={10} /> عنوان الطلب</label>
              <input value={form.title} onChange={e => updateField("title", e.target.value)} placeholder="مثال: تصليح صنبور مياه" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 text-sm font-black text-slate-900 focus:bg-white focus:border-blue-400 outline-none transition-all" required />
           </div>

           <div className="space-y-2">
              <label className="t-label flex items-center gap-2"><Briefcase size={10} /> التخصص المطلوب</label>
              <div className="relative">
                 <select value={form.profession} onChange={e => updateField("profession", e.target.value)} className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 text-sm font-black text-slate-900 focus:bg-white focus:border-blue-400 outline-none appearance-none cursor-pointer" required>
                    <option value="">اختر التخصص...</option>
                    <option value="سباك">سباك</option><option value="كهربائي">كهربائي</option><option value="نجار">نجار</option><option value="منظف">منظف</option><option value="دهان">دهان</option><option value="ميكانيكي">ميكانيكي</option>
                 </select>
                 <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              </div>
           </div>

           <div className="md:col-span-2 space-y-2">
              <label className="t-label flex items-center gap-2"><MapPin size={10} /> العنوان بالتفصيل</label>
              <input value={form.address} onChange={e => updateField("address", e.target.value)} placeholder="رقم الشارع، الحي، أو وصف دقيق..." className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 text-sm font-black text-slate-900 focus:bg-white focus:border-blue-400 outline-none transition-all" required />
           </div>

           <div className="md:col-span-2">
              <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Map size={18} /></div>
                    <div><p className="text-xs font-black text-slate-900">{hasSelectedLocation ? "تم تحديد الموقع" : "تحديد الموقع الجغرافي"}</p><p className="text-[10px] font-bold text-slate-400">سجل إحداثياتك لضمان سرعة الوصول</p></div>
                 </div>
                 <button type="button" onClick={() => setIsMapOpen(!isMapOpen)} className="h-10 px-5 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:text-blue-600 transition-all flex items-center gap-2">
                    {isMapOpen ? "إغلاق" : "فتح الخريطة"} <ChevronDown size={14} className={isMapOpen ? "rotate-180" : ""} />
                 </button>
              </div>
              {isMapOpen && <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 shadow-sm"><LeafletMapPicker onLocationSelect={handleLocationSelect} initialLocation={hasSelectedLocation ? { lat: form.latitude, lng: form.longitude } : null} height="240px" /></div>}
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Info size={10} /> وصف المشكلة</label>
           <textarea value={form.description} onChange={e => updateField("description", e.target.value)} placeholder="اشرح ما تحتاجه بالتحديد، الأدوات، والمشكلة..." className="w-full min-h-[160px] bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-400 outline-none resize-none leading-relaxed shadow-inner" required />
        </div>

        <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
           <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"><ShieldCheck size={20} /></div>
           <p className="text-[11px] font-black text-emerald-900/60 leading-relaxed uppercase"><strong>سياسة الخصوصية والأمان:</strong> طلبك يخضع للمراجعة الإدارية. نضمن سرية بيانات التواصل حتى يتم اختيارك لمحترف معين حفاظاً على خصوصيتك.</p>
        </div>

        <div className="flex justify-end">
           <button type="submit" disabled={!isFormValid || submitting} className="h-14 w-full sm:w-auto sm:px-12 bg-slate-900 text-white rounded-xl font-black text-sm shadow-xl hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center gap-3">
              <Send size={18} className="rotate-180" />
              {submitting ? "جاري الإرسال.." : isEditing ? "حفظ التعديلات" : "إرسال المهمة للمراجعة الآن"}
           </button>
        </div>
      </form>
    </div>
  )
}
