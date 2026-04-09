import React, { useState } from "react"
import { User, Lock, Trash2, Mail, Save, Key } from "lucide-react"
import { updateProfile, changePassword, deleteAccount } from "../api"

export default function ProfileSettings({ user, onUpdate }) {
  const [username, setUsername] = useState(user?.username || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await updateProfile(username)
      onUpdate(updated)
      setMsg({ type: "success", text: "تم تحديث الملف الشخصي بنجاح" })
    } catch (err) {
      setMsg({ type: "error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await changePassword(currentPassword, newPassword)
      setMsg({ type: "success", text: "تم تغيير كلمة المرور بنجاح" })
      setCurrentPassword("")
      setNewPassword("")
    } catch (err) {
      setMsg({ type: "error", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">إعدادات الحساب</h1>
        <p className="text-lg text-slate-500 font-bold opacity-80">أدر معلوماتك الشخصية وأمان حسابك</p>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold border ${
          msg.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
        }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${msg.type === "success" ? "bg-emerald-100" : "bg-rose-100"}`}>
             {msg.type === "success" ? "✓" : "!"}
          </div>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Update */}
        <div className="premium-card p-8">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                <User size={20} />
             </div>
             <h3 className="text-xl font-black text-slate-800">المعلومات الشخصية</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
             <div className="group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">اسم المستخدم</label>
                <div className="relative">
                   <User className="absolute start- top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input 
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl ps- pe- text-slate-800 font-bold outline-none focus:border-blue-500 transition-all text-start"
                   />
                </div>
             </div>

             <div className="group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">البريد الإلكتروني (غير قابل للتعديل)</label>
                <div className="relative">
                   <Mail className="absolute start- top-1/2 -translate-y-1/2 text-slate-200" size={18} />
                   <input 
                     value={user?.email || ""}
                     disabled
                     className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl ps- pe- text-slate-400 font-bold cursor-not-allowed text-start"
                   />
                </div>
             </div>

             <button 
               type="submit"
               disabled={loading}
               className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:translate-y-0"
             >
               <Save size={18} />
               {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
             </button>
          </form>
        </div>

        {/* Password Update */}
        <div className="premium-card p-8">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-inner">
                <Lock size={20} />
             </div>
             <h3 className="text-xl font-black text-slate-800">تغيير كلمة المرور</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
             <div className="group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">كلمة المرور الحالية</label>
                <div className="relative">
                   <Key className="absolute start- top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input 
                     type="password"
                     value={currentPassword}
                     onChange={(e) => setCurrentPassword(e.target.value)}
                     className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl ps- pe- text-slate-800 font-bold outline-none focus:border-blue-500 transition-all text-start"
                   />
                </div>
             </div>

             <div className="group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 me-">كلمة المرور الجديدة</label>
                <div className="relative">
                   <Lock className="absolute start- top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input 
                     type="password"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl ps- pe- text-slate-800 font-bold outline-none focus:border-blue-500 transition-all text-start"
                   />
                </div>
             </div>

             <button 
               type="submit"
               disabled={loading}
               className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:translate-y-0"
             >
               <Lock size={18} />
               {loading ? "جاري التغيير..." : "تحديث كلمة المرور"}
             </button>
          </form>
        </div>
      </div>

      <div className="premium-card p-8 mt-8 border-rose-100 bg-rose-50/20">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Trash2 size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">منطقة الخطر</h3>
                  <p className="text-sm text-slate-500 font-bold opacity-80">سيؤدي حذف الحساب إلى مسح كافة بياناتك نهائياً.</p>
               </div>
            </div>
            <button 
              onClick={() => { if(window.confirm("هل أنت متأكد من حذف حسابك نهائياً؟")) deleteAccount() }}
              className="h-14 px-8 border-2 border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl font-black transition-all"
            >
               حذف الحساب نهائياً
            </button>
         </div>
      </div>
    </div>
  )
}
