import React from "react"
import { KeyRound, Save } from "lucide-react"

const inputClass = "input"

export default function SecuritySettings({ currentPassword, setCurrentPassword, newPassword, setNewPassword, onSubmit, loading }) {
  return (
    <div className="card-lg" dir="rtl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <KeyRound size={20} />
        </div>
        <h2 className="text-xl font-black text-slate-900">كلمة المرور</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="field">
          <label className="t-label">كلمة المرور الحالية</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </div>

        <div className="field">
          <label className="t-label">كلمة المرور الجديدة</label>
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
          className="btn btn-primary btn-lg w-full"
        >
          <Save size={18} />
          {loading ? "جارٍ التحديث..." : "تغيير كلمة المرور"}
        </button>
      </form>
    </div>
  )
}
