import React from "react"
import { AlertTriangle } from "lucide-react"

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel
}) {
  if (!open) return null

  const confirmClass =
    tone === "danger"
      ? "bg-rose-600 text-white hover:bg-rose-700"
      : "bg-primary text-white hover:bg-primary-hover"

  return (
    <div className="fixed inset-0 z-160 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-4xl border border-surface-200 bg-white p-6 shadow-2xl" dir="rtl">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-surface-900">{title}</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-surface-500">{description}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-saas btn-secondary h-11 border-surface-200 px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`btn-saas h-11 px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60 ${confirmClass}`}
          >
            {loading ? "جارٍ الحذف..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
