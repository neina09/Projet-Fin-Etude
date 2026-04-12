import React, { useState } from "react"
import ProblemForm from "./ProblemForm"
import ProblemCard from "./ProblemCard"
import { LayoutGrid, ClipboardList, Info, Star } from "lucide-react"
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
        setProblems(data.content || data || [])
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
    <div className="max-w-5xl mx-auto py-12 px-6">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-surface-900 tracking-tight">سوق المهام النشطة</h1>
            <p className="text-lg font-medium text-surface-500">تواصل مع المحترفين، تتبع مهامك، وراجع سجل إنجازاتك.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-surface-200 shadow-sm">
             <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm">
                <ClipboardList size={16} />
                الطلبات النشطة
             </div>
             <div className="text-surface-900 font-bold text-sm px-3">
                {problems.length} <span className="text-surface-400 font-medium">مهمة</span>
             </div>
          </div>
        </div>
      </header>

      {/* Modern Notice Banner */}
      <div className="relative overflow-hidden bg-indigo-50 border border-indigo-100 p-8 rounded-[2rem] mb-12 group transition-all">
         {/* Decorative Background Icon */}
         <Star className="absolute -left-4 -top-4 text-indigo-100 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" size={120} />
         
         <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
               <Info size={24} />
            </div>
            <div className="text-center md:text-right">
               <h4 className="text-indigo-900 font-bold text-lg mb-1.5">كيف تحصل على أفضل النتائج؟</h4>
               <p className="text-indigo-700/80 font-medium text-sm leading-relaxed max-w-2xl">
                  وصفك الدقيق للمشكلة وصور واضحة تساعد المحترفين في تحديد التكلفة بدقة وبسرعة. تأكد دائماً من تحديد موقعك الحالي بدقة لضمان سرعة الوصول.
               </p>
            </div>
         </div>
      </div>

      <section className="mb-16">
        <div className="saas-card p-1 border-surface-200 bg-surface-50 mb-8">
           <ProblemForm onAdd={addProblem} />
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-surface-200">
           <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: "open", lbl: "المهام العامة المنشورة" },
                { id: "previous", lbl: "سجلي الشخصي" }
              ].map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setTab(t.id)} 
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    tab === t.id 
                    ? "bg-white text-primary border border-surface-200 shadow-sm translate-y-[-1px]" 
                    : "text-surface-400 hover:text-surface-900 hover:bg-surface-50"
                  }`}
                >
                  {t.lbl}
                </button>
              ))}
           </div>
           
           <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-widest">
              <LayoutGrid size={14} className="opacity-50" />
              عرض الشبكة
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-surface-400 animate-pulse">
               <div className="w-12 h-12 rounded-full border-4 border-t-primary border-surface-200 animate-spin mb-4" />
               <p className="text-sm font-bold">جاري جلب أحدث المهام...</p>
            </div>
          ) : (
            <>
              {tab === "open" && problems.length > 0 ? (
                problems.map((p) => (
                  <ProblemCard key={p.id} problem={p} currentUser={currentUser} />
                ))
              ) : tab === "open" ? (
                <div className="saas-card p-16 text-center border-dashed border-surface-200 bg-surface-50/50">
                  <div className="text-5xl mb-6 grayscale opacity-20">📫</div>
                  <h3 className="text-xl font-bold text-surface-900 mb-2">لا توجد مهام نشطة</h3>
                  <p className="text-sm font-medium text-surface-400">كن أول من ينشر مهمة اليوم!</p>
                </div>
              ) : null}

              {tab === "previous" && previousTasks.length > 0 ? (
                previousTasks.map((p) => (
                  <ProblemCard key={p.id} problem={p} currentUser={currentUser} />
                ))
              ) : tab === "previous" ? (
                <div className="saas-card p-16 text-center border-dashed border-surface-200 bg-surface-50/50">
                  <div className="text-5xl mb-6 grayscale opacity-20">📜</div>
                  <h3 className="text-xl font-bold text-surface-900 mb-2">السجل فارغ</h3>
                  <p className="text-sm font-medium text-surface-400">ستظهر مهامك المكتملة أو الملغاة هنا.</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
