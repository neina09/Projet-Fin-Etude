import React, { useState } from "react"
import ProblemForm from "./ProblemForm"
import ProblemCard from "./ProblemCard"
import { LayoutGrid, ClipboardList, Info } from "lucide-react"
import { getOpenTasks, getMyTasks, createTask } from "../api"

export default function ProblemBoard({ currentUser }) {
  const [problems, setProblems] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("open")

  const fetchTasks = () => {
    setLoading(true)
    getOpenTasks()
      .then(data => {
        console.log("Tasks fetched:", data)
        setProblems(data.content || data || []) // Fallback in case it's a direct list
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch tasks:", err)
        setLoading(false)
      })
  }

  const fetchMyTasks = () => {
    getMyTasks()
      .then(data => setMyTasks(data.content || data || []))
      .catch(() => setMyTasks([]))
  }

  React.useEffect(() => {
    fetchTasks()
    fetchMyTasks()
  }, [])

  const addProblem = async (newProblem) => {
    try {
      // Map frontend fields back to backend DTO
      const taskData = {
        title: newProblem.title,
        description: newProblem.body,
        address: newProblem.location
      }
      const savedTask = await createTask(taskData)
      setProblems([savedTask, ...problems])
      setMyTasks([savedTask, ...myTasks])
    } catch (err) {
      alert("فشل نشر المهمة: " + err.message)
    }
  }

  const previousTasks = myTasks.filter((t) => {
    const st = String(t.status || "").toUpperCase()
    return st === "COMPLETED" || st === "CLOSED" || st === "CANCELLED"
  })

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">إدارة المهام والتعليقات</h1>
          <p className="text-base text-slate-500 font-bold opacity-80">أنشئ مهمة جديدة، تابع الطلبات المفتوحة، وراجع مهامك السابقة</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-[1.2rem] border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-100">
              <ClipboardList size={18} />
              المهام المفتوحة
           </div>
           <div className="text-slate-400 font-black text-sm px-4">
              {problems.length} مهمة
           </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] mb-10 flex items-start gap-4">
         <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <Info size={20} />
         </div>
         <div>
            <h4 className="text-blue-900 font-black text-sm mb-1">نصيحة للمستخدمين</h4>
            <p className="text-blue-700/70 font-bold text-xs leading-relaxed">كن دقيقاً في وصف مشكلتك وحدد موقعك بدقة ليتمكن العمال من الوصول إليك وتقديم عروضهم بسرعة.</p>
         </div>
      </div>

      <ProblemForm onAdd={addProblem} />

      <div className="space-y-2 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button onClick={() => setTab("open")} className={`px-4 py-2 rounded-full text-xs font-black ${tab === "open" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
            المهام المفتوحة
          </button>
          <button onClick={() => setTab("previous")} className={`px-4 py-2 rounded-full text-xs font-black ${tab === "previous" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
            المهام السابقة
          </button>
        </div>

        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <LayoutGrid size={14} />
          {tab === "open" ? "أحدث المهام المنشورة" : "سجل المهام السابقة"}
        </h3>

        {loading && <div className="text-sm font-bold text-slate-400">جاري تحميل المهام...</div>}

        {!loading && tab === "open" && problems.map((p) => (
          <ProblemCard key={p.id} problem={p} currentUser={currentUser} />
        ))}

        {!loading && tab === "previous" && previousTasks.map((p) => (
          <ProblemCard key={p.id} problem={p} currentUser={currentUser} />
        ))}

        {!loading && tab === "previous" && previousTasks.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 font-bold">
            لا توجد مهام سابقة حتى الآن
          </div>
        )}
      </div>
    </div>
  )
}
