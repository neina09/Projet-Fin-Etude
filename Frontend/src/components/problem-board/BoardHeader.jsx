import React from "react"
import { ClipboardList, Sparkles } from "lucide-react"

export default function BoardHeader({ isWorker, count }) {
  return (
    <header className="mb-14">
      <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Global Mission Control</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            {isWorker ? "استكشاف المهام" : "لوحة إدارة المهام"}
          </h1>
          <p className="max-w-2xl text-lg font-bold text-slate-500 leading-relaxed">
            {isWorker
              ? "تصفح الفرص المتاحة في محيطك الجغرافي وقدم عروضك المهنية لأصحاب العمل الموثوقين."
              : "تتبع حالة مهامك، استقبل عروض المحترفين، وقم بإدارة عمليات التنفيذ بكل سهولة وشفافية."}
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-2 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[11px] font-black text-black uppercase tracking-widest shadow-gold">
            <ClipboardList size={18} />
            {isWorker ? "فرص نشطة" : "طلبات قيد المتابعة"}
          </div>
          <div className="px-5 text-sm font-black text-white tabular-nums">
            {count} <span className="mr-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tasks</span>
          </div>
        </div>
      </div>
    </header>
  )
}
