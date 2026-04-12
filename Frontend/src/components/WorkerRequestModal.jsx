import React, { useState } from "react"
import { Calendar, Clock, MessageSquare, Send, X, MapPin, ShieldCheck } from "lucide-react"

export default function WorkerRequestModal({ worker, onClose, onSubmit }) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [desc, setDesc] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Combine date and time for backend
    const bookingDate = `${date}T${time}:00`;

    const bookingData = { 
      workerId: worker.id, 
      description: desc, 
      address: address, 
      bookingDate: bookingDate,
      price: worker.salary || worker.price || 0
    }
    
    onSubmit(bookingData)
  }

  const workerImg = worker.imageUrl || worker.img;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-surface-900/60 backdrop-blur-sm animate-in fade-in duration-300" dir="rtl">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-surface-200 animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
           <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={workerImg} 
                  alt={worker.name} 
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white" 
                  onError={e => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || 'W')}&background=F4F7FD&color=7000FF&bold=true`
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                   <ShieldCheck size={12} className="text-primary" />
                </div>
              </div>
              <div>
                 <h3 className="text-xl font-black text-surface-900 tracking-tight leading-none mb-1.5">حجز موعد مع {worker.name}</h3>
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">فئة {worker.specialty || "محترف"}</p>
              </div>
           </div>
           <button 
             onClick={onClose} 
             className="w-9 h-9 rounded-xl bg-white border border-surface-200 text-surface-400 hover:text-surface-900 hover:bg-surface-50 transition-all flex items-center justify-center shadow-sm active:scale-90"
           >
              <X size={18} />
           </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] block">تاريخ الحجز</label>
                 <div className="relative">
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" size={16} />
                    <input 
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="saas-input h-12 pr-11 text-[13px] font-bold border-surface-200 focus:bg-white transition-all text-right"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] block">الوقت المفضل</label>
                 <div className="relative">
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" size={16} />
                    <input 
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="saas-input h-12 pr-11 text-[13px] font-bold border-surface-200 focus:bg-white transition-all text-right"
                    />
                 </div>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] block">العنوان أو الحي المختار</label>
               <div className="relative">
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" size={16} />
                  <input 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: تفرغ زينة، عمارة النجاح"
                    className="saas-input h-12 pr-11 text-[13px] font-bold border-surface-200 focus:bg-white transition-all"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] block">وصف التفاصيل / المشكلة</label>
               <div className="relative">
                  <textarea 
                    required
                    rows="3"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="يرجى كتابة تفاصيل المهمة بوضوح..."
                    className="saas-input py-4 px-4 text-[13px] font-bold border-surface-200 focus:bg-white transition-all resize-none min-h-[100px]"
                  ></textarea>
                  <MessageSquare size={14} className="absolute left-4 bottom-4 text-surface-200" />
               </div>
            </div>

            <div className="pt-2">
               <button 
                 type="submit"
                 disabled={loading}
                 className="btn-saas btn-primary w-full h-14 text-sm font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
               >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري المعالجة...
                    </div>
                  ) : (
                    <>
                      <span>إرسال طلب الحجز للعمال</span>
                      <Send size={18} className="translate-x-1 rotate-180" />
                    </>
                  )}
               </button>
               <p className="mt-4 text-center text-[10px] font-bold text-surface-400 uppercase tracking-widest opacity-80 decoration-primary/20 decoration-dashed">
                  لن يتم خصم أي مبالغ حتى انتهاء المهمة بنجاح
               </p>
            </div>
        </form>
      </div>
    </div>
  )
}
