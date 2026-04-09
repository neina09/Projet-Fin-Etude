import React, { useState } from "react"

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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-lg">👤</div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{problem.author || "مستخدم"}</p>
            <p className="text-xs text-slate-500">{time}</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${status === "COMPLETED" || status === "مكتمل" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
          {status === "COMPLETED" ? "مكتمل" : status === "OPEN" ? "مفتوح" : status}
        </span>
      </div>

      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-3">{body}</p>
      <div className="text-xs font-bold text-slate-500 mb-3">📍 {location}</div>

      <button onClick={() => setOpen(!open)} className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
        💬 {comments.length} تعليق
      </button>

      {open && (
        <div className="mt-4 border-t border-slate-200 pt-3">
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="bg-slate-50 p-3 rounded-lg text-sm">
                <b className="text-slate-800">{c.author}</b>
                <p className="text-slate-600">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب تعليقك..."
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
            />
            <button onClick={addComment} className="bg-blue-600 px-3 py-2 rounded-lg text-xs text-white hover:bg-blue-700">
              إرسال
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProblemCard