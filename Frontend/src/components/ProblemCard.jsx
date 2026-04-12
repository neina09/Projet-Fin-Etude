import React, { useState } from "react"
import { MessageSquare, MapPin, Calendar, User, Send } from "lucide-react"

function ProblemCard({ problem = {} }) {
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState(problem?.comments || [])
  const [text, setText] = useState("")
  const status = problem.status || "OPEN"
  const title = problem.title || "بدون عنوان"
  const body = problem.body || problem.description || ""
  const location = problem.location || problem.address || "الموقع غير محدد"
  const time = problem.time || (problem.createdAt ? new Date(problem.createdAt).toLocaleDateString("ar-EG") : "الآن")

  const addComment = () => {
    if (!text.trim()) return
    setComments([
      ...comments,
      { id: Date.now(), author: "أنت", text }
    ])
    setText("")
  }

  const isCompleted = status === "COMPLETED" || status === "مكتمل"

  return (
    <article className="saas-card p-6 bg-white border-surface-200 hover:border-primary/20 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-50 text-surface-400 border border-surface-100">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-surface-900">{problem.author || "مستخدم"}</p>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-tight">
               <Calendar size={12} className="opacity-50" />
               {time}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${
            isCompleted 
            ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
            : "bg-primary-soft border-primary/10 text-primary"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isCompleted ? "bg-emerald-500" : "bg-primary animate-pulse"}`} />
            {isCompleted ? "مكتمل" : status === "OPEN" ? "مفتوح للنقاش" : status}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-black text-surface-900 tracking-tight leading-snug">{title}</h3>
        <p className="text-sm font-medium text-surface-500 leading-relaxed max-w-2xl">{body}</p>
      </div>

      <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-surface-100">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-surface-400">
          <MapPin size={14} className="text-primary opacity-60" />
          {location}
        </div>
        
        <button 
          onClick={() => setOpen(!open)} 
          className={`inline-flex items-center gap-2 text-xs font-bold transition-colors ${
            open ? "text-primary" : "text-surface-400 hover:text-primary"
          }`}
        >
          <MessageSquare size={14} className="opacity-60" />
          {comments.length} تعليق
        </button>
      </div>

      {open && (
        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="bg-surface-50 p-4 rounded-xl border border-surface-100 flex flex-col gap-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{c.author}</span>
                <p className="text-sm font-medium text-surface-600 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="أضف تعليقاً أو استفساراً..."
                className="saas-input h-10 text-sm pr-4 bg-surface-50/50"
              />
            </div>
            <button 
              onClick={addComment} 
              className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all active:scale-90 shadow-sm shadow-primary/20"
            >
              <Send size={16} className="-mr-1 rotate-180" />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default ProblemCard