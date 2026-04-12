import React, { useState } from "react"
import { Send, MapPin, Type, AlignLeft, Sparkles } from "lucide-react"

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

  const isFormValid = title.trim() && body.trim() && location.trim()

  return (
    <div className="bg-white p-8 rounded-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center text-primary shadow-sm border border-primary/10">
           <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-surface-900 tracking-tight">ما هي المهمة التي تحتاجها؟</h2>
          <p className="text-sm text-surface-400 font-medium">اشرح طلبك باختصار وسيقوم المحترفون بتقديم عروضهم.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-surface-400 uppercase tracking-widest block">عنوان المهمة</label>
            <div className="relative">
               <input
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="مثال: تصليح تسريب مياه في المطبخ"
                 className="saas-input h-12 pr-4 border-surface-200 focus:bg-white"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-surface-400 uppercase tracking-widest block">الموقع أو الحي</label>
            <div className="relative">
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" size={16} />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="تفرغ زينة، عرفات..."
                className="saas-input h-12 pr-11 border-surface-200 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-surface-400 uppercase tracking-widest block">تفاصيل الطلب</label>
          <div className="relative">
             <textarea
               value={body}
               onChange={(e) => setBody(e.target.value)}
               placeholder="صف المشكلة بدقة حتى يصلك العرض المناسب..."
               rows="4"
               className="saas-input py-4 pr-4 border-surface-200 focus:bg-white resize-none"
             ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-2">
           <button
             type="submit"
             disabled={!isFormValid}
             className="btn-saas btn-primary h-12 px-10 text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-3 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
           >
             <Send size={18} className="translate-x-1 rotate-180" />
             نشر المهمة الآن
           </button>
        </div>
      </form>
    </div>
  )
}
