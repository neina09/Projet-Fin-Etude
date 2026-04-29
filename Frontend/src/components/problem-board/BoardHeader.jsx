import React from "react"
import { ClipboardList, Sparkles } from "lucide-react"
import { useLanguage } from "../../i18n/LanguageContext"

export default function BoardHeader({ isWorker, count }) {
  const { dir, isArabic, t } = useLanguage()

  return (
    <header className="mb-14" dir={dir}>
      <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
        <div className={`space-y-4 ${isArabic ? "text-right" : "text-left"}`}>
          <div className={`flex items-center gap-2 text-primary ${isArabic ? "flex-row" : "flex-row-reverse justify-end"}`}>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Global Mission Control</span>
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            {isWorker ? t("boardHeader.workerTitle") : t("boardHeader.clientTitle")}
          </h1>
          <p className="max-w-2xl text-lg font-bold text-slate-500 leading-relaxed">
            {isWorker ? t("boardHeader.workerDescription") : t("boardHeader.clientDescription")}
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-2 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[11px] font-black text-black uppercase tracking-widest shadow-gold">
            <ClipboardList size={18} />
            {isWorker ? t("boardHeader.activeOpportunities") : t("boardHeader.requestsInProgress")}
          </div>
          <div className="px-5 text-sm font-black text-white tabular-nums">
            {count} <span className="mx-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("boardHeader.tasksLabel")}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
