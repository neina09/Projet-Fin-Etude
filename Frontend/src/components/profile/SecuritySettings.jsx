import React from "react"
import { KeyRound, Save } from "lucide-react"

const inputClass =
  "w-full h-14 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-[#1d4ed8] focus:bg-white focus:ring-4 focus:ring-blue-500/10"

export default function SecuritySettings({ currentPassword, setCurrentPassword, newPassword, setNewPassword, onSubmit, loading }) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm" dir="rtl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <KeyRound size={20} />
        </div>
        <h2 className="text-xl font-black text-slate-900">كلمة المرور</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-500">كلمة المرور الحالية</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-500">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            maxLength={8}
            className={inputClass}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1d4ed8] text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "جاري التحديث..." : "تغيير كلمة المرور"}
        </button>
      </form>
    </div>
  )
}
