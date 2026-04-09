import React, { useState } from "react"
import { Calendar, Clock, MessageSquare, Send, X, MapPin } from "lucide-react"

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
    // onSubmit handles the API call and closing
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-4">
              <img src={worker.img} alt={worker.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white" />
              <div>
                 <h3 className="text-xl font-black text-slate-800 tracking-tight">طلب خدمة من {worker.name}</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{worker.specialty}</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm">
              <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">التاريخ المفضل</label>
                 <div className="relative">
                    <Calendar className="absolute start- top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl ps- pe- text-slate-800 font-bold outline-none focus:border-blue-500 transition-all text-start"
                    />
                 </div>
              </div>
              <div className="group">
                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">الوقت</label>
                 <div className="relative">
                    <Clock className="absolute start- top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl ps- pe- text-slate-800 font-bold outline-none focus:border-blue-500 transition-all text-start"
                    />
                 </div>
              </div>
           </div>

            <div className="group">
               <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">عنوان المهمة / الموقع</label>
               <div className="relative">
                  <MapPin className="absolute start- top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: تفرغ زينة، عمارة النجاح"
                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl ps- pe- text-slate-800 font-bold outline-none focus:border-blue-500 transition-all text-end"
                  />
               </div>
            </div>

            <div className="group">
               <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">وصف المشكلة</label>
               <div className="relative">
                  <MessageSquare className="absolute start- top-5 text-slate-300" size={18} />
                  <textarea 
                    required
                    rows="4"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="اشرح ما تحتاجه بالتحديد..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl ps- pe- py-4 text-slate-800 font-bold outline-none focus:border-blue-500 transition-all resize-none"
                  ></textarea>
               </div>
            </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:translate-y-0"
           >
              {loading ? "جاري الإرسال..." : (
                <>
                  <Send size={20} className="rotate-180" />
                  إرسال الطلب الآن
                </>
              )}
           </button>
           <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">سيتم إخطارك فور قبول المحترف لطلبك</p>
        </form>
      </div>
    </div>
  )
}
