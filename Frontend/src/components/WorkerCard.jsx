import React, { useState } from "react"
import { ArrowRight, Star, User, MapPin } from "lucide-react"
import { resolveAssetUrl } from "../api"
import { useLanguage } from "../i18n/LanguageContext"

const getAvailabilityConfig = (worker, available) =>
  worker.availability === "BUSY" || available === false
    ? { bg: "bg-amber-500", text: "text-white" }
    : { bg: "bg-emerald-500", text: "text-white" }

export default function WorkerCard({ worker, onViewDetails }) {
  const { dir, isArabic, t } = useLanguage()
  const name             = worker.name || t("workerCard.defaultName")
  const resolvedImageUrl = resolveAssetUrl(worker.imageUrl)
  const [failedImageUrl, setFailedImageUrl] = useState("")
  const imageUrl         = failedImageUrl === resolvedImageUrl ? "" : resolvedImageUrl
  const available        = worker.availability === "AVAILABLE" || worker.available === true
  const rating           = Number(worker.averageRating ?? worker.rating ?? 0)
  const specialty        = worker.job || worker.specialty || t("workerCard.defaultSpecialty")
  const availabilityLabel =
    worker.availability === "BUSY" || available === false
      ? t("workerCard.busy")
      : t("workerCard.available")
  const { bg, text } = getAvailabilityConfig(worker, available)

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
      dir={dir}
    >
      {/* ── Image ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setFailedImageUrl(resolvedImageUrl)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <User size={44} className="text-slate-200" />
          </div>
        )}

        {/* Availability badge */}
        <span className={`absolute top-3 ${isArabic ? "right-3" : "left-3"} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${bg} ${text}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          {availabilityLabel}
        </span>

        {/* Rating badge */}
        <div className={`absolute bottom-3 ${isArabic ? "left-3" : "right-3"} flex items-center gap-1 rounded-xl border border-white/60 bg-white/90 px-2.5 py-1 shadow-md backdrop-blur-sm`}>
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-[12px] font-extrabold text-slate-800">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name & specialty */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <h3 className="text-[15px] font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">
            {name}
          </h3>
          <p className="mt-0.5 text-[12px] font-semibold text-blue-500">{specialty}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center">
            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              {t("workerCard.profession")}
            </p>
            <p className="truncate text-[11px] font-bold text-slate-700">{specialty}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center">
            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              {t("workerCard.price")}
            </p>
            <p className="text-[11px] font-bold text-slate-700">
              {worker.salary || 0}
              <span className="mr-0.5 text-[9px] text-slate-400">MRU</span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onViewDetails?.(worker)}
          className="mt-auto flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <ArrowRight size={14} className={isArabic ? "rotate-180" : ""} />
          {t("workerCard.requestService")}
        </button>
      </div>
    </article>
  )
}