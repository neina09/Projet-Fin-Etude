import React, { useState } from "react"
import { ArrowRight, MapPin, ShieldCheck, Star, User } from "lucide-react"
import { resolveAssetUrl } from "../api"

const getAvailabilityLabel = (worker, available) => {
  if (worker.availability === "BUSY" || available === false) return "مشغول"
  return "متاح"
}

const getAvailabilityBadgeClass = (worker, available) => {
  if (worker.availability === "BUSY" || available === false) {
    return "bg-amber-500/95 text-white"
  }

  return "bg-emerald-500/95 text-white"
}

export default function WorkerCard({ worker, onViewDetails }) {
  const name = worker.name || "محترف معتمد"
  const resolvedImageUrl = resolveAssetUrl(worker.imageUrl)
  const [failedImageUrl, setFailedImageUrl] = useState("")
  const imageUrl = failedImageUrl === resolvedImageUrl ? "" : resolvedImageUrl
  const available = worker.availability === "AVAILABLE" || worker.available === true
  const rating = Number(worker.averageRating || worker.rating || 0)
  const specialty = worker.job || worker.specialty || "خدمات مهنية"
  const location = worker.address || worker.location || ""
  const isVerified = worker.verified || worker.verificationStatus === "VERIFIED"

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join(" ")

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
      {isVerified && (
        <div className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-blue-600 text-white shadow-xl shadow-blue-500/40 backdrop-blur-md">
          <ShieldCheck size={20} className="fill-current" />
        </div>
      )}

      <div className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-black shadow-lg backdrop-blur-md ${getAvailabilityBadgeClass(worker, available)}`}>
        {getAvailabilityLabel(worker, available)}
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            onError={() => setFailedImageUrl(resolvedImageUrl)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50/30">
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] border border-blue-100 bg-white text-2xl font-black text-[#1d4ed8] shadow-sm">
              {initials || <User size={40} />}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-xl">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-[12px] font-black text-slate-900">{rating > 0 ? rating.toFixed(1) : "0.0"}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center p-8 text-center">
        <h3 className="mb-1 line-clamp-1 text-2xl font-black tracking-tight text-slate-950 transition-colors group-hover:text-[#1d4ed8]">{name}</h3>

        <div className="mb-5 flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <MapPin size={14} className="text-[#1d4ed8] opacity-70" />
          <span>{location.split(",")[0] || "غير محدد"}</span>
        </div>

        <div className="mb-8 grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100/50 bg-slate-50 p-3 transition-colors group-hover:border-blue-100 group-hover:bg-white">
            <span className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">المهنة</span>
            <span className="text-xs font-black text-slate-900">{specialty}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100/50 bg-slate-50 p-3 transition-colors group-hover:border-blue-100 group-hover:bg-white">
            <span className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">الحالة</span>
            <span className="text-xs font-black text-slate-900">{getAvailabilityLabel(worker, available)}</span>
          </div>
        </div>

        <div className="mt-auto w-full">
          <button
            onClick={() => onViewDetails?.(worker)}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-100 bg-white text-xs font-black text-slate-900 shadow-sm transition-all duration-300 hover:border-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white hover:shadow-blue-500/20 active:scale-95"
          >
            عرض الملف الشخصي
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  )
}
