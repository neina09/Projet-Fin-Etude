import { useEffect, useMemo } from "react"
import { X } from "lucide-react"
import { previewUrl } from "../utils/imageFiles"

export default function FilePreview({ file, label, onClear }) {
  const src = useMemo(() => previewUrl(file), [file])

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src)
    }
  }, [src])

  if (!file) return null

  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-black text-slate-700">{label}</span>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100"
        >
          <X size={12} />
          إزالة
        </button>
      </div>
      <img src={src} alt={label} className="h-40 w-full rounded-2xl border border-slate-100 object-cover" />
      <p className="mt-2 truncate text-xs font-bold text-slate-500">{file.name}</p>
    </div>
  )
}
