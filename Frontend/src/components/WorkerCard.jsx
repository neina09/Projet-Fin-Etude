import React, { useState } from "react"
import { ArrowRight, Star, User } from "lucide-react"
import { resolveAssetUrl } from "../api"

const getAvailabilityLabel = (worker, available) =>
  worker.availability === "BUSY" || available === false ? "مشغول" : "متاح"

const getAvailabilityBadgeClass = (worker, available) =>
  worker.availability === "BUSY" || available === false ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"

export default function WorkerCard({ worker, onViewDetails }) {
  const name = worker.name || "محترف معتمد"
  const resolvedImageUrl = resolveAssetUrl(worker.imageUrl)
  const [failedImageUrl, setFailedImageUrl] = useState("")
  const imageUrl = failedImageUrl === resolvedImageUrl ? "" : resolvedImageUrl
  const available = worker.availability === "AVAILABLE" || worker.available === true
  const rating = Number(worker.averageRating ?? worker.rating ?? 0)
  const specialty = worker.job || worker.specialty || "خدمات مهنية"

  return (
    <article className="card group overflow-hidden !rounded-[1.75rem] !p-4 sm:!p-5" dir="rtl">
      <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={() => setFailedImageUrl(resolvedImageUrl)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50">
            <User size={48} className="text-slate-200" />
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-xl border border-slate-100 bg-white px-3 py-1.5 shadow-lg">
          <span className="text-xs font-black text-slate-900">{rating.toFixed(1)}</span>
          <Star size={14} className="fill-amber-400 text-amber-400" />
        </div>

        <div className={`absolute right-3 top-3 rounded-lg px-2 py-1 text-[9px] font-black shadow-sm ${getAvailabilityBadgeClass(worker, available)}`}>
          {getAvailabilityLabel(worker, available)}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-right">
          <h3 className="text-lg font-black text-slate-900 transition-colors group-hover:text-primary">{name}</h3>
          <p className="mt-1 text-sm font-bold text-blue-500/80">{specialty}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100/50 bg-slate-50/80 p-3 text-center">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">المهنة</p>
            <p className="truncate text-[11px] font-black text-slate-800">{specialty}</p>
          </div>
          <div className="rounded-2xl border border-slate-100/50 bg-slate-50/80 p-3 text-center">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">السعر</p>
            <p className="text-[11px] font-black text-slate-800">{worker.salary || 0} M</p>
          </div>
        </div>

        <button onClick={() => onViewDetails?.(worker)} className="btn btn-primary btn-md w-full gap-2 text-xs">
          <ArrowRight size={16} className="rotate-180" />
          عرض التفاصيل وطلب الخدمة
        </button>
      </div>
    </article>
  )
}
