import React, { useState } from "react"
import { Send, MapPin, Type, AlignLeft } from "lucide-react"

export default function ProblemForm({ onAdd }) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [location, setLocation] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim() || !location.trim()) return

    onAdd({
      id: Date.now(),
      title,
      body,
      location,
      author: "أنت",
      time: "الآن",
      status: "مفتوح",
      comments: []
    })

    setTitle("")
    setBody("")
    setLocation("")
  }

  return (
    <div className="premium-card p-8 mb-8 bg-white/80 border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
           <Type size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">نشر مهمة جديدة</h2>
          <p className="text-sm text-slate-500 font-bold">اشرح ما تحتاجه وسيقوم المحترفون بمساعدتك</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="group">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">عنوان المهمة</label>
          <div className="relative">
             <input
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="مثال: تصليح صنبور مياه مكسور"
               className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 text-slate-800 font-bold placeholder:text-slate-300 outline-none focus:border-blue-500 focus:bg-white transition-all"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">الموقع</label>
            <div className="relative">
              <MapPin className="absolute start- top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="المدينة، الحي..."
                className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl ps- pe- text-slate-800 font-bold placeholder:text-slate-300 outline-none focus:border-blue-500 focus:bg-white transition-all text-start"
              />
            </div>
          </div>
          
          <div className="flex flex-col justify-end">
             <button
               type="submit"
               className="h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
               disabled={!title || !body || !location}
             >
               <Send size={20} className="rotate-180" />
               نشر المهمة الآن
             </button>
          </div>
        </div>

        <div className="group">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">تفاصيل المهمة</label>
          <div className="relative">
             <textarea
               value={body}
               onChange={(e) => setBody(e.target.value)}
               placeholder="اشرح المشكلة بالتفصيل..."
               rows="4"
               className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-slate-800 font-bold placeholder:text-slate-300 outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
             ></textarea>
          </div>
        </div>
      </form>
    </div>
  )
}
