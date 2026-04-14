import React from "react"
import { MapPin, ShieldCheck, Star, User, Wrench } from "lucide-react"

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={14}
          className={index <= Math.round(rating) ? "fill-current text-yellow-500" : "text-surface-200"}
        />
      ))}
    </div>
  )
}

export default function WorkerCard({ worker, onHire, onViewDetails, canHire = true }) {
  const name = worker.name || "عامل"
  const available = worker.availability === "AVAILABLE" || worker.available === true
  const rating = Number(worker.averageRating || worker.rating || 0)
  const price = worker.salary || worker.price || 0
  const specialty = worker.job || worker.specialty || "خدمة عامة"
  const location = worker.address || worker.location || ""
  const isVerified = worker.verified || worker.verificationStatus === "VERIFIED"
  const initials = name.split(" ").slice(0, 2).map((part) => part[0]).join(" ")

  return (
    <article className="saas-card group flex h-full flex-col overflow-hidden border-surface-200 bg-white transition-all duration-300 hover:border-primary/20">
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-slate-100 via-white to-primary-soft">
        {worker.imageUrl ? (
          <img src={worker.imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-lg font-black text-surface-900 shadow-lg ring-1 ring-surface-200">
              {initials || "ع"}
            </div>
          </div>
        )}

        <div className="absolute right-3 top-3 z-10">
          <span className={`rounded-full border px-3 py-1 text-[10px] font-black shadow-sm ${
            available
              ? "border-emerald-600 bg-emerald-500 text-white"
              : "border-surface-900 bg-surface-800 text-white"
          }`}>
            {available ? "متاح للعمل" : "غير متاح"}
          </span>
        </div>

        {isVerified && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-lg border border-surface-100 bg-white/95 px-3 py-1 shadow-sm backdrop-blur-sm">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-surface-900">موثق</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold leading-none text-surface-900">{name}</h3>
            <div className="flex items-center gap-1.5">
              <Stars rating={rating} />
              <span className="text-[11px] font-bold text-surface-400">{rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="text-left">
            <div className="text-xl font-black leading-none text-surface-900">{price}</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-surface-400">MRU/ساعة</div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/5 bg-primary-soft px-3 py-1 text-[11px] font-bold text-primary">
            <Wrench size={12} />
            {specialty}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-surface-100 bg-surface-50 px-3 py-1 text-[11px] font-bold text-surface-500">
            <MapPin size={12} className="text-surface-300" />
            {location || "غير محدد"}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-surface-100 pt-5">
          <button
            onClick={() => onHire?.(worker)}
            disabled={!available || !canHire}
            className={`btn-saas h-11 flex-1 text-xs font-bold transition-all duration-300 ${
              available && canHire
                ? "btn-primary shadow-sm hover:shadow-md active:scale-95"
                : "cursor-not-allowed border-surface-200 bg-surface-100 text-surface-400"
            }`}
          >
            <Wrench size={16} />
            {canHire ? (available ? "اطلب هذا العامل" : "غير متوفر") : "للعرض فقط"}
          </button>
          <button
            type="button"
            onClick={() => onViewDetails?.(worker)}
            className="btn-saas btn-secondary h-11 w-11 border-surface-200 text-surface-500 hover:text-primary active:scale-95"
            aria-label="عرض التفاصيل"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}
