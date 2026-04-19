import React, { useState } from "react"
import { X, Calendar, Clock, MapPin, FileText, CheckCircle2, Star, User, ShieldCheck, Briefcase, Zap, Info, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function WorkerRequestModal({ worker, onClose, onSubmit }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    serviceType: "صيانة وسباكة",
    date: "",
    time: "",
    address: "",
    description: "",
    duration: 2
  })

  const pricePerHour = worker.salary || worker.price || 150
  const totalPrice = formData.duration * pricePerHour

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      workerId: worker.id,
      ...formData,
      status: "PENDING",
      price: totalPrice
    })
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 lg:p-10 bg-slate-900/60 backdrop-blur-xl transition-all duration-500 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-6xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col xl:flex-row-reverse min-h-[85vh] border border-white"
        dir="rtl"
      >
        {/* Right Sidebar: Booking Summary (Screenshot 2 Style) */}
        <aside className="xl:w-[380px] bg-slate-50 p-10 border-r border-slate-100 flex flex-col shrink-0">
           <button onClick={onClose} className="xl:hidden absolute top-6 left-6 h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400">
              <X size={24} />
           </button>

           <div className="mb-10">
              <h3 className="text-xl font-black text-slate-900 mb-8">ملخص الحجز</h3>
              <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center gap-5 group transition-all hover:border-blue-500/20">
                 <div className="h-16 w-16 rounded-2xl bg-blue-50 overflow-hidden shrink-0">
                    <img src={worker.imageUrl || `https://ui-avatars.com/api/?name=${worker.name}&background=1d4ed8&color=fff&bold=true`} className="h-full w-full object-cover" alt="Worker" />
                 </div>
                 <div>
                    <h4 className="text-[15px] font-black text-slate-900 mb-1">{worker.name}</h4>
                    <div className="flex items-center gap-2">
                       <Star size={12} className="fill-amber-400 text-amber-400" />
                       <span className="text-[11px] font-bold text-slate-500">{worker.averageRating || "4.9"} (120 تقييم)</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6 flex-1">
              <div className="space-y-4">
                 <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>الخدمة:</span>
                    <span className="text-slate-900">{formData.serviceType}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>الموعد:</span>
                    <span className="text-slate-900">{formData.date || "لم يحدد"} - {formData.time || "--:--"}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>مدة العمل المتوقعة:</span>
                    <span className="text-slate-900">{formData.duration} ساعة</span>
                 </div>
              </div>
              
              <div className="h-px bg-slate-100" />

              <div className="space-y-3">
                 <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>سعر الخدمة:</span>
                    <span className="text-slate-900">{pricePerHour} ريال</span>
                 </div>
                 <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>رسوم المنصة:</span>
                    <span className="text-slate-900">15 ريال</span>
                 </div>
                 <div className="pt-4 flex justify-between items-end border-t border-dashed border-slate-200">
                    <span className="text-lg font-black text-slate-900">الإجمالي:</span>
                    <span className="text-3xl font-black text-[#1d4ed8] tabular-nums">{totalPrice + 15} ريال</span>
                 </div>
              </div>
           </div>

           <div className="mt-10 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
              <Info size={18} className="text-amber-600 mt-1 shrink-0" />
              <p className="text-[11px] font-bold text-amber-900 leading-relaxed">
                 نسعى لتوفير خدمة آمنة، سيتم تحويل المبلغ للمحترف فقط بعد تأكيدك لإستلام الخدمة بنجاح.
              </p>
           </div>
        </aside>

        {/* Main Form Content (Screenshot 2 Style) */}
        <main className="flex-1 p-10 lg:p-20 overflow-y-auto sidebar-scroll">
           <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h2 className="text-4xl font-black text-slate-950 mb-4">احجز موعدك الآن</h2>
                    <p className="text-sm font-bold text-slate-500">أكمل تفاصيل الطلب للحصول على أفضل خدمة من محترفنا الموثوق.</p>
                 </div>
                 <button onClick={onClose} className="hidden xl:flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 transition-all">
                    <X size={28} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                 {/* Step 1: Service Type */}
                 <section className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-[#1d4ed8]">
                          <Briefcase size={20} />
                       </div>
                       <h3 className="text-lg font-black text-slate-900">نوع الخدمة المطلوبة</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       {[
                          { id: "صيانة وسباكة", icon: Zap },
                          { id: "نجارة ودهانات", icon: Briefcase },
                          { id: "خدمات عامة", icon: Info }
                       ].map(service => (
                          <button
                             key={service.id}
                             type="button"
                             onClick={() => setFormData({...formData, serviceType: service.id})}
                             className={`h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border transition-all ${
                                formData.serviceType === service.id
                                ? "bg-blue-50 border-[#1d4ed8] text-[#1d4ed8] shadow-sm"
                                : "bg-white border-slate-100 text-slate-400 hover:border-blue-200"
                             }`}
                          >
                             <service.icon size={22} />
                             <span className="text-xs font-black">{service.id}</span>
                          </button>
                       ))}
                    </div>
                 </section>

                 {/* Step 2: Date & Time */}
                 <section className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <Calendar size={20} />
                       </div>
                       <h3 className="text-lg font-black text-slate-900">اختر الموعد المناسب</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">تاريخ العمل</label>
                          <input
                             type="date"
                             value={formData.date}
                             onChange={(e) => setFormData({...formData, date: e.target.value})}
                             className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-sm font-bold focus:border-[#1d4ed8] focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                             required
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">الوقت المفضل</label>
                          <div className="grid grid-cols-3 gap-2">
                             {["09:00 ص", "12:00 م", "04:00 م", "07:00 م", "09:00 م", "11:00 م"].map(t => (
                                <button
                                   key={t}
                                   type="button"
                                   onClick={() => setFormData({...formData, time: t})}
                                   className={`h-12 rounded-xl text-[10px] font-black transition-all ${
                                      formData.time === t
                                      ? "bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/20"
                                      : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
                                   }`}
                                >
                                   {t}
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </section>

                 {/* Step 3: Location */}
                 <section className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <MapPin size={20} />
                       </div>
                       <h3 className="text-lg font-black text-slate-900">موقع العمل</h3>
                    </div>
                    <div className="space-y-6">
                       <div className="relative group">
                          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1d4ed8]" size={18} />
                          <input
                             type="text"
                             placeholder="ابحث عن موقعك أو أدخل العنوان يدوياً"
                             value={formData.address}
                             onChange={(e) => setFormData({...formData, address: e.target.value})}
                             className="w-full h-16 bg-white border border-slate-100 rounded-[1.5rem] pr-16 pl-6 text-sm font-black focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none shadow-sm"
                             required
                          />
                       </div>
                       <div className="h-64 bg-slate-100 rounded-[2.5rem] border border-slate-200 overflow-hidden relative shadow-inner">
                          <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2066" className="w-full h-full object-cover opacity-50 contrast-125" alt="Map Placeholder" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="relative">
                                <MapPin size={48} className="text-[#1d4ed8] animate-bounce" />
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/10 rounded-full blur-sm" />
                             </div>
                          </div>
                          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white text-[10px] font-black text-slate-900 shadow-xl">الرياض، حي العليا</div>
                       </div>
                    </div>
                 </section>

                 {/* Step 4: Description */}
                 <section className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <FileText size={20} />
                       </div>
                       <h3 className="text-lg font-black text-slate-900">وصف المهمة</h3>
                    </div>
                    <textarea
                       placeholder="يرجى كتابة بعض التفاصيل حول المشكلة أو العمل المطلوب القيام به..."
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                       className="w-full min-h-[180px] bg-slate-50 border border-slate-100 rounded-[2rem] p-10 text-sm font-medium focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none leading-relaxed"
                    />
                 </section>

                 <div className="pt-10 flex gap-6">
                    <button
                       type="submit"
                       className="flex-1 h-20 bg-[#1d4ed8] text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
                    >
                       تأكيد الحجز والعرض
                    </button>
                    <button
                       type="button"
                       onClick={onClose}
                       className="h-20 px-10 border border-slate-100 bg-white text-slate-400 rounded-[2rem] font-black text-sm hover:bg-slate-50 transition-all"
                    >
                       إلغاء
                    </button>
                 </div>
              </form>
           </div>
        </main>
      </motion.div>
    </div>
  )
}
